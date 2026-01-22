import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UnidadAsistencialService {
    constructor(private prisma: PrismaService) { }

    async findAll() {
        return this.prisma.unidadAsistencial.findMany({
            include: { departamento: true },
            orderBy: { nombre: 'asc' }
        });
    }

    async create(data: { nombre: string; departamentoId: number; activo?: boolean }) {
        const { nombre, departamentoId, activo } = data;
        return this.prisma.unidadAsistencial.create({
            data: {
                nombre,
                departamentoId: Number(departamentoId),
                activo
            }
        });
    }

    async update(id: number, data: { nombre: string; departamentoId: number; activo?: boolean }) {
        const { nombre, departamentoId, activo } = data;
        return this.prisma.unidadAsistencial.update({
            where: { id },
            data: {
                nombre,
                departamentoId: Number(departamentoId),
                activo
            }
        });
    }

    async remove(id: number) {
        return this.prisma.unidadAsistencial.delete({
            where: { id }
        });
    }
}
