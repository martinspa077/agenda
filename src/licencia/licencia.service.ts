import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LicenciaService {
    constructor(private prisma: PrismaService) { }

    async findAll() {
        return this.prisma.licencia.findMany({
            include: {
                profesional: true,
            },
            orderBy: { fechaInicio: 'desc' },
        });
    }

    async create(data: {
        profesionalId: number;
        fechaInicio: string | Date;
        fechaFin: string | Date;
        tipo: string;
        motivo?: string;
    }) {
        return this.prisma.licencia.create({
            data: {
                profesionalId: data.profesionalId,
                fechaInicio: new Date(data.fechaInicio),
                fechaFin: new Date(data.fechaFin),
                tipo: data.tipo,
                motivo: data.motivo,
            },
        });
    }

    async update(id: number, data: {
        fechaInicio?: string | Date;
        fechaFin?: string | Date;
        tipo?: string;
        motivo?: string;
        activo?: boolean;
    }) {
        const updateData: any = { ...data };
        if (data.fechaInicio) updateData.fechaInicio = new Date(data.fechaInicio);
        if (data.fechaFin) updateData.fechaFin = new Date(data.fechaFin);

        return this.prisma.licencia.update({
            where: { id },
            data: updateData,
        });
    }

    async remove(id: number) {
        return this.prisma.licencia.delete({
            where: { id },
        });
    }
}
