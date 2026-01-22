import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HealthService {
    constructor(private prisma: PrismaService) { }

    async getDepartmentsWithUnits() {
        return this.prisma.departamento.findMany({
            include: {
                unidades: true,
            },
            orderBy: {
                nombre: 'asc',
            },
        });
    }
}
