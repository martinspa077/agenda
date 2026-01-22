import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class QuotaService {
    constructor(private prisma: PrismaService) { }

    async validateQuota(especialidad: string, subEspecialidad: string): Promise<boolean> {
        // Check if there are differentiated quotas
        const quotaRule = await this.prisma.cuposDiferenciados.findFirst({
            where: {
                especialidad,
                subEspecialidad
            }
        });

        if (quotaRule) {
            // Logic: count current appointments for this sub-specialty
            // This is a simplified check
            // const currentCount = await this.prisma.consulta.count(...)
            // if (currentCount >= quotaRule.cupoMaximo) return false;
            return true; // Mock: return true for now
        }

        return true; // No restriction
    }

    async prioritizeWaitlist(): Promise<void> {
        // Logic to promote DemandaEnEspera to active slots
        // 1. Get high priority waitlist items
        // 2. Check for available slots
        // 3. Create Consulta and notify
        console.log('Running prioritization logic...');
    }
}
