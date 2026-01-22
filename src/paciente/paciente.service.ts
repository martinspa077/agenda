import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PacienteService {
    constructor(private prisma: PrismaService) { }

    async search(query: string) {
        if (!query) return [];

        return this.prisma.paciente.findMany({
            where: {
                OR: [
                    { nombre: { contains: query, mode: 'insensitive' } },
                    { apellido: { contains: query, mode: 'insensitive' } },
                    { nroDocumento: { contains: query } }
                ]
            },
            take: 10
        });
    }
}
