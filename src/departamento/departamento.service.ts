import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DepartamentoService {
    constructor(private prisma: PrismaService) { }

    async findAll() {
        return this.prisma.departamento.findMany({
            orderBy: { nombre: 'asc' }
        });
    }

    async create(data: { nombre: string }) {
        return this.prisma.departamento.create({ data });
    }

    async update(id: number, data: { nombre: string }) {
        return this.prisma.departamento.update({
            where: { id },
            data
        });
    }

    async remove(id: number) {
        return this.prisma.departamento.delete({
            where: { id }
        });
    }
}
