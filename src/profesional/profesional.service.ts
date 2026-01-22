import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProfesionalService {
    constructor(private prisma: PrismaService) { }

    async findAll(unidadId?: number) {
        if (unidadId) {
            const vinculos = await this.prisma.vinculo.findMany({
                where: {
                    unidadId: unidadId,
                },
                include: {
                    profesional: true
                }
            });
            // Return unique professionals
            const professionals = vinculos.map(v => v.profesional);
            // Deduplicate by ID just in case multiple active links exist (though unlikely for same unit/prof)
            const uniqueProfs = Array.from(new Map(professionals.map(p => [p.id, p])).values());
            return uniqueProfs;
        } else {
            return this.prisma.profesional.findMany({
                orderBy: {
                    apellido: 'asc'
                }
            });
        }
    }

    async getProfesionalDetalle(numeroDocumento: string, unidadId: number) {
        // Find ALL vinculos matching this professional and unit
        const vinculos = await this.prisma.vinculo.findMany({
            where: {
                unidadId: unidadId,
                profesional: {
                    numeroDocumento: numeroDocumento,
                },
            },
            include: {
                profesional: true,
                especialidad: true,
                agendasMes: {
                    include: {
                        agendas: true
                    }
                }
            },
        });

        if (!vinculos || vinculos.length === 0) {
            throw new NotFoundException(`Profesional con documento ${numeroDocumento} no encontrado en la unidad ${unidadId}`);
        }

        const first = vinculos[0];

        // Collect all active agendas flattened for easy display
        // We handle the 'any' typing by explicit casting if needed or letting inference work if types were perfect.
        // For simplicity in this fix, we assume the shape is correct from Prisma.
        const agendasMes = vinculos.flatMap((v: any) => v.agendasMes || []);

        // Flat map agendas and inject 'estadoMes'
        const flattenedAgendas = agendasMes.flatMap((am: any) =>
            am.agendas?.map((a: any) => ({ ...a, estadoMes: am.estado })) || []
        );



        // Enrich specialties with vinculoId
        const enrichedSpecialties = vinculos.map((v: any) => ({
            id: v.especialidad.id,
            nombre: v.especialidad.nombre,
            vinculoId: v.id
        }));

        return {
            id: first.profesional.id,
            nombre: first.profesional.nombre,
            apellido: first.profesional.apellido,
            numeroDocumento: first.profesional.numeroDocumento,
            unidadId: first.unidadId,
            especialidades: enrichedSpecialties,
            horarios: {}, // Removed from DB, returning empty
            licencias: [], // Removed from DB, returning empty
            agendas: flattenedAgendas,
        };
    }

    async addEspecialidad(profesionalId: number, unidadId: number, especialidadId: number) {
        const existing = await this.prisma.vinculo.findUnique({
            where: {
                profesionalId_unidadId_especialidadId: {
                    profesionalId,
                    unidadId,
                    especialidadId
                }
            }
        });

        if (existing) {
            throw new BadRequestException("El profesional ya tiene esta especialidad en la unidad.");
        }

        return this.prisma.vinculo.create({
            data: {
                profesionalId,
                unidadId,
                especialidadId
            }
        });
    }

    async removeEspecialidadVinculo(vinculoId: number) {
        return this.prisma.vinculo.delete({
            where: { id: vinculoId }
        });
    }
}
