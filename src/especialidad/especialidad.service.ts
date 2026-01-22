import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EspecialidadService {
    constructor(private prisma: PrismaService) { }

    async findAll() {
        return this.prisma.especialidad.findMany({
            orderBy: { nombre: 'asc' },
        });
    }

    async create(data: { nombre: string }) {
        return this.prisma.especialidad.create({ data });
    }

    async update(id: number, data: { nombre: string }) {
        return this.prisma.especialidad.update({
            where: { id },
            data
        });
    }

    async remove(id: number) {
        return this.prisma.especialidad.delete({
            where: { id }
        });
    }
}
