import { Controller, Get, Post, Put, Delete, Query, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AgendaService } from './agenda.service';

@ApiTags('Agenda')
@Controller('agenda')
export class AgendaController {
    constructor(private readonly agendaService: AgendaService) { }

    @Get('resumen')
    @ApiOperation({ summary: 'Obtener resumen de agendas por profesional/mes (Matriz)' })
    async getResumen(@Query('unidadId') unidadId?: string) {
        const id = unidadId ? parseInt(unidadId) : undefined;
        return this.agendaService.getAgendaSummary(id);
    }

    @Get('detalle')
    @ApiOperation({ summary: 'Obtener detalle de agendas por vinculo y mes' })
    async getDetalle(
        @Query('vinculoId') vinculoId: string,
        @Query('mes') mes: string
    ) {
        return this.agendaService.getAgendaDetail(Number(vinculoId), mes);
    }
    @Post()
    @ApiOperation({ summary: 'Crear nueva agenda' })
    async create(@Body() body: {
        agendaMesId: number;
        fecha: string; // ISO string 2026-01-22
        horaInicio: string;
        horaFin: string;
        minConsulta: number;
        modo: 'Presencial' | 'Telefonico';
    }) {
        return this.agendaService.createAgenda({
            ...body,
            fecha: new Date(body.fecha)
        });
    }

    @Put(':id')
    @ApiOperation({ summary: 'Actualizar agenda' })
    async update(
        @Param('id') id: string,
        @Body() body: {
            horaInicio: string;
            horaFin: string;
            minConsulta: number;
            modo: 'Presencial' | 'Telefonico';
        }
    ) {
        return this.agendaService.updateAgenda(Number(id), body);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Eliminar agenda' })
    async delete(@Param('id') id: string) {
        return this.agendaService.deleteAgenda(Number(id));
    }
    @Get('search')
    @ApiOperation({ summary: 'Buscar agendas con filtros' })
    async search(
        @Query('unidadId') unidadId?: string,
        @Query('fechaDesde') fechaDesde?: string,
        @Query('fechaHasta') fechaHasta?: string,
        @Query('profesionalId') profesionalId?: string,
        @Query('especialidadId') especialidadId?: string,
    ) {
        return this.agendaService.searchAgendas({
            unidadId: unidadId ? parseInt(unidadId) : undefined,
            fechaDesde: fechaDesde ? new Date(fechaDesde) : undefined,
            fechaHasta: fechaHasta ? new Date(fechaHasta) : undefined,
            profesionalId: profesionalId ? parseInt(profesionalId) : undefined,
            especialidadId: especialidadId ? parseInt(especialidadId) : undefined,
        });
    }
}
