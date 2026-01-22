import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FeriadoService {
    constructor(private prisma: PrismaService) { }

    async findAll() {
        return this.prisma.feriado.findMany({
            orderBy: { fecha: 'asc' }
        });
    }

    async create(data: { fecha: string | Date; descripcion: string; activo?: boolean }) {
        const { fecha, descripcion, activo } = data;
        return this.prisma.feriado.create({
            data: {
                fecha: new Date(fecha),
                descripcion,
                activo
            }
        });
    }

    async update(id: number, data: { fecha: string | Date; descripcion: string; activo?: boolean }) {
        const { fecha, descripcion, activo } = data;
        return this.prisma.feriado.update({
            where: { id },
            data: {
                fecha: new Date(fecha),
                descripcion,
                activo
            }
        });
    }

    async remove(id: number) {
        return this.prisma.feriado.delete({
            where: { id }
        });
    }
}
