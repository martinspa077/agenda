import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { InteroperabilityModule } from './interoperability/interoperability.module';
import { LogicModule } from './logic/logic.module';
import { HealthModule } from './health/health.module';
import { ProfesionalModule } from './profesional/profesional.module';
import { EspecialidadModule } from './especialidad/especialidad.module';

import { DepartamentoModule } from './departamento/departamento.module';
import { UnidadAsistencialModule } from './unidad_asistencial/unidad_asistencial.module';
import { AgendaModule } from './agenda/agenda.module';
import { FeriadoModule } from './feriado/feriado.module';
import { LicenciaModule } from './licencia/licencia.module';
import { ConsultaModule } from './consulta/consulta.module';
import { PacienteModule } from './paciente/paciente.module';

@Module({
  imports: [
    PrismaModule,
    InteroperabilityModule,
    LogicModule,
    HealthModule,
    ProfesionalModule,
    EspecialidadModule,
    AgendaModule,
    DepartamentoModule,
    UnidadAsistencialModule,
    FeriadoModule,
    LicenciaModule,
    ConsultaModule,
    PacienteModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
