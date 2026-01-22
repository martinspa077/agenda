import { Module } from '@nestjs/common';
import { FeriadoController } from './feriado.controller';
import { FeriadoService } from './feriado.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
    controllers: [FeriadoController],
    providers: [FeriadoService, PrismaService],
})
export class FeriadoModule { }
