import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface AgendaSummaryDTO {
    profesional: {
        id: number;
        nombre: string;
        apellido: string;
        numeroDocumento: string;
    };
    especialidad: {
        id: number;
        nombre: string;
    };
    vinculoId: number;
    meses: {
        [key: string]: boolean; // "2023-10": true (active)
    };
}

@Injectable()
export class AgendaService {
    constructor(private prisma: PrismaService) { }

    async getAgendaSummary(unidadId?: number): Promise<AgendaSummaryDTO[]> {
        // Get start of current month
        const now = new Date();
        const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        // Calculate limit (start of month + 4 months)
        const limitDate = new Date(startOfCurrentMonth);
        limitDate.setMonth(limitDate.getMonth() + 4);

        // Fetch Vinculos with relevant AgendaMes
        const vinculos = await this.prisma.vinculo.findMany({
            where: unidadId ? { unidadId } : undefined,
            include: {
                profesional: true,
                especialidad: true,
                agendasMes: {
                    where: {
                        mes: {
                            gte: startOfCurrentMonth,
                            lt: limitDate
                        },
                        estado: 'Activa' // Only care about active ones? Or show status? User said "diciendo si hay una agendames activa"
                    }
                }
            }
        });

        // Transform results
        return vinculos.map((v: typeof vinculos[number]) => {
            const mesesMap: { [key: string]: boolean } = {};

            v.agendasMes.forEach((am: { mes: Date; estado: string }) => {
                // Format date as YYYY-MM
                const yyyy = am.mes.getFullYear();
                const mm = String(am.mes.getMonth() + 1).padStart(2, '0');
                const key = `${yyyy}-${mm}`;

                // If it exists in the list (filtered by 'Activa' in query ideally, or check status here to be sure)
                if (am.estado === 'Activa') {
                    mesesMap[key] = true;
                }
            });

            return {
                profesional: {
                    id: v.profesional.id,
                    nombre: v.profesional.nombre,
                    apellido: v.profesional.apellido,
                    numeroDocumento: v.profesional.numeroDocumento
                },
                especialidad: {
                    id: v.especialidad.id,
                    nombre: v.especialidad.nombre
                },
                vinculoId: v.id,
                meses: mesesMap
            };
        });
    }

    async getAgendaDetail(vinculoId: number, monthStr: string) {
        // ... (existing code)
        // monthStr is "YYYY-MM"
        const [year, month] = monthStr.split('-').map(Number);
        const startOfMonth = new Date(year, month - 1, 1);
        const endOfMonth = new Date(year, month, 1);

        const agendaMes = await this.prisma.agendaMes.findFirst({
            where: {
                vinculoId: vinculoId,
                mes: {
                    gte: startOfMonth,
                    lt: endOfMonth
                }
            },
            include: {
                vinculo: {
                    include: {
                        profesional: {
                            include: {
                                licencias: {
                                    where: {
                                        AND: [
                                            { fechaInicio: { lte: endOfMonth } },
                                            { fechaFin: { gte: startOfMonth } }
                                        ]
                                    }
                                }
                            }
                        },
                        especialidad: true
                    }
                },
                agendas: {
                    orderBy: {
                        fecha: 'asc'
                    }
                }
            }
        });

        if (!agendaMes) {
            // Create if it doesn't exist
            const newAgendaMes = await this.prisma.agendaMes.create({
                data: {
                    vinculoId: vinculoId,
                    mes: startOfMonth,
                    estado: 'Activa'
                },
                include: {
                    vinculo: {
                        include: {
                            profesional: {
                                include: {
                                    licencias: {
                                        where: {
                                            AND: [
                                                { fechaInicio: { lte: endOfMonth } },
                                                { fechaFin: { gte: startOfMonth } }
                                            ]
                                        }
                                    }
                                }
                            },
                            especialidad: true
                        }
                    },
                    agendas: {
                        orderBy: {
                            fecha: 'asc'
                        }
                    }
                }
            });
            return newAgendaMes;
        }

        // Calculate stats or format if needed here, or return raw structure
        return agendaMes;
    }

    async createAgenda(data: {
        agendaMesId: number;
        fecha: Date;
        horaInicio: string; // "08:00"
        horaFin: string;    // "12:00"
        minConsulta: number;
        modo: 'Presencial' | 'Telefonico';
    }) {
        const [startH, startM] = data.horaInicio.split(':').map(Number);
        const [endH, endM] = data.horaFin.split(':').map(Number);

        const startTotalMins = startH * 60 + startM;
        const endTotalMins = endH * 60 + endM;
        const diffMins = endTotalMins - startTotalMins;

        if (diffMins <= 0) throw new Error("La hora de fin debe ser mayor a la de inicio");

        const totalNros = Math.floor(diffMins / data.minConsulta);
        const nroPresenciales = data.modo === 'Presencial' ? totalNros : 0;
        const nroTelefonicos = data.modo === 'Telefonico' ? totalNros : 0;
        const horario = `${data.horaInicio} - ${data.horaFin}`;

        const newAgenda = await this.prisma.agenda.create({
            data: {
                agendaMesId: data.agendaMesId,
                fecha: data.fecha,
                horario,
                minConsulta: data.minConsulta,
                modo: data.modo,
                totalNros,
                nroPresenciales,
                nroTelefonicos
            }
        });

        // --- Generate Consultations ---
        // Need to fetch professionalId
        const agendaMes = await this.prisma.agendaMes.findUnique({
            where: { id: data.agendaMesId },
            include: { vinculo: true }
        });

        if (!agendaMes) throw new Error("AgendaMes not found");
        const profesionalId = agendaMes.vinculo.profesionalId;

        const consultationsData = [];
        const baseDate = new Date(data.fecha);

        // Convert start time to a Date object key for the first slot
        // data.fecha is likely YYYY-MM-DDT00:00:00.000Z
        // We set hours/minutes from horaInicio
        const [h, m] = data.horaInicio.split(':').map(Number);
        baseDate.setHours(h, m, 0, 0);

        for (let i = 0; i < totalNros; i++) {
            const slotDate = new Date(baseDate.getTime() + i * data.minConsulta * 60000);

            consultationsData.push({
                agendaId: newAgenda.id,
                profesionalId: profesionalId,
                fechaHora: slotDate,
                estado: 'Libre',
                tipo: 'Consulta',
                pacienteId: null // Explicitly null
            });
        }

        await this.prisma.consulta.createMany({
            data: consultationsData
        });

        return newAgenda;
    }
    async updateAgenda(id: number, data: {
        horaInicio: string;
        horaFin: string;
        minConsulta: number;
        modo: 'Presencial' | 'Telefonico';
    }) {
        const [startH, startM] = data.horaInicio.split(':').map(Number);
        const [endH, endM] = data.horaFin.split(':').map(Number);

        const startTotalMins = startH * 60 + startM;
        const endTotalMins = endH * 60 + endM;
        const diffMins = endTotalMins - startTotalMins;

        if (diffMins <= 0) throw new Error("La hora de fin debe ser mayor a la de inicio");

        const totalNros = Math.floor(diffMins / data.minConsulta);
        const nroPresenciales = data.modo === 'Presencial' ? totalNros : 0;
        const nroTelefonicos = data.modo === 'Telefonico' ? totalNros : 0;
        const horario = `${data.horaInicio} - ${data.horaFin}`;

        return this.prisma.agenda.update({
            where: { id },
            data: {
                horario,
                minConsulta: data.minConsulta,
                modo: data.modo,
                totalNros,
                nroPresenciales,
                nroTelefonicos
            }
        });
    }

    async deleteAgenda(id: number) {
        return this.prisma.agenda.delete({
            where: { id }
        });
    }

    async searchAgendas(filters: {
        unidadId?: number;
        fechaDesde?: Date;
        fechaHasta?: Date;
        profesionalId?: number;
        especialidadId?: number;
    }) {
        const { unidadId, fechaDesde, fechaHasta, profesionalId, especialidadId } = filters;

        // Build where clause
        const where: any = {};

        if (fechaDesde || fechaHasta) {
            where.fecha = {};
            if (fechaDesde) {
                where.fecha.gte = fechaDesde;
            }
            if (fechaHasta) {
                // Set to end of day if it's the same day or just use lte
                const endOfDay = new Date(fechaHasta);
                endOfDay.setHours(23, 59, 59, 999);
                where.fecha.lte = endOfDay;
            }
        }

        // Relations filters via AgendaMes -> Vinculo
        const vinculoFilter: any = {};
        if (unidadId) vinculoFilter.unidadId = unidadId;
        if (profesionalId) vinculoFilter.profesionalId = profesionalId;
        if (especialidadId) vinculoFilter.especialidadId = especialidadId;

        if (Object.keys(vinculoFilter).length > 0) {
            where.agendaMes = {
                vinculo: vinculoFilter
            };
        }

        return this.prisma.agenda.findMany({
            where,
            include: {
                agendaMes: {
                    include: {
                        vinculo: {
                            include: {
                                profesional: true,
                                especialidad: true,
                                unidad: true
                            }
                        }
                    }
                },
                _count: {
                    select: {
                        consultas: {
                            where: { estado: 'Libre' }
                        }
                    }
                }
            },
            orderBy: {
                fecha: 'asc'
            }
        });
    }
}
