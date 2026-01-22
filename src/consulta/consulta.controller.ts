import { Controller, Get, Put, Param, Body, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ConsultaService } from './consulta.service';

@ApiTags('Consulta')
@Controller('consulta')
export class ConsultaController {
    constructor(private readonly consultaService: ConsultaService) { }

    @Get('agenda/:agendaId')
    @ApiOperation({ summary: 'Obtener consultas por agenda' })
    async getByAgenda(@Param('agendaId', ParseIntPipe) agendaId: number) {
        return this.consultaService.getConsultasByAgenda(agendaId);
    }

    @Put(':id/assign')
    @ApiOperation({ summary: 'Asignar paciente a consulta' })
    async assign(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: { pacienteId: number }
    ) {
        return this.consultaService.assignPaciente(id, body.pacienteId);
    }

    @Put(':id/cancel')
    @ApiOperation({ summary: 'Cancelar consulta (liberar cupo)' })
    async cancel(@Param('id', ParseIntPipe) id: number) {
        return this.consultaService.cancelConsulta(id);
    }
}
