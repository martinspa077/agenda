import { Module } from '@nestjs/common';
import { UnidadAsistencialController } from './unidad_asistencial.controller';
import { UnidadAsistencialService } from './unidad_asistencial.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [UnidadAsistencialController],
    providers: [UnidadAsistencialService],
})
export class UnidadAsistencialModule { }
