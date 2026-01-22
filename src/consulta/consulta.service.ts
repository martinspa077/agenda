import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ConsultaService {
    constructor(private prisma: PrismaService) { }

    async getConsultasByAgenda(agendaId: number) {
        return this.prisma.consulta.findMany({
            where: { agendaId },
            include: {
                paciente: true
            },
            orderBy: {
                fechaHora: 'asc'
            }
        });
    }

    async assignPaciente(id: number, pacienteId: number) {
        const consulta = await this.prisma.consulta.findUnique({ where: { id } });
        if (!consulta) throw new NotFoundException('Consulta no encontrada');

        if (consulta.estado !== 'Libre') {
            throw new Error('La consulta no está libre');
        }

        return this.prisma.consulta.update({
            where: { id },
            data: {
                estado: 'Ocupada',
                pacienteId: pacienteId
            },
            include: { paciente: true }
        });
    }

    async cancelConsulta(id: number) {
        const consulta = await this.prisma.consulta.findUnique({ where: { id } });
        if (!consulta) throw new NotFoundException('Consulta no encontrada');

        return this.prisma.consulta.update({
            where: { id },
            data: {
                estado: 'Libre',
                pacienteId: null
            }
        });
    }
}
