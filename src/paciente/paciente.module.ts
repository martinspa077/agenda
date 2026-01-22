import { Module } from '@nestjs/common';
import { PacienteController } from './paciente.controller';
import { PacienteService } from './paciente.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [PacienteController],
    providers: [PacienteService],
    exports: [PacienteService]
})
export class PacienteModule { }
