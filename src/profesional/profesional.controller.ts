import { Controller, Get, Query, ParseIntPipe, Post, Delete, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiBody } from '@nestjs/swagger';
import { ProfesionalService } from './profesional.service';

@ApiTags('Profesional')
@Controller('profesional')
export class ProfesionalController {
    constructor(private readonly profesionalService: ProfesionalService) { }

    @Get()
    @ApiOperation({ summary: 'Listar todos los profesionales (opcionalmente filtrados por unidad)' })
    @ApiQuery({ name: 'unidadId', type: Number, required: false })
    async findAll(@Query('unidadId') unidadId?: string) {
        // unidadId comes as string from Query
        const uid = unidadId ? parseInt(unidadId) : undefined;
        return this.profesionalService.findAll(uid);
    }

    @Get('detalle')
    @ApiOperation({ summary: 'Obtener detalle de profesional por documento y unidad (Agregado)' })
    @ApiQuery({ name: 'documento', type: String, required: true })
    @ApiQuery({ name: 'unidadId', type: Number, required: true })
    async getDetalle(
        @Query('documento') documento: string,
        @Query('unidadId', ParseIntPipe) unidadId: number,
    ) {
        return this.profesionalService.getProfesionalDetalle(documento, unidadId);
    }

    @Post('especialidad/add')
    @ApiOperation({ summary: 'Agregar especialidad (Crear Vínculo)' })
    @ApiBody({ schema: { type: 'object', properties: { profesionalId: { type: 'number' }, unidadId: { type: 'number' }, especialidadId: { type: 'number' } } } })
    async addEspecialidad(
        @Body('profesionalId', ParseIntPipe) profesionalId: number,
        @Body('unidadId', ParseIntPipe) unidadId: number,
        @Body('especialidadId', ParseIntPipe) especialidadId: number,
    ) {
        return this.profesionalService.addEspecialidad(profesionalId, unidadId, especialidadId);
    }

    @Delete('vinculo/:vinculoId')
    @ApiOperation({ summary: 'Remover especialidad (Eliminar Vínculo específico)' })
    async removeEspecialidad(
        @Param('vinculoId', ParseIntPipe) vinculoId: number,
    ) {
        return this.profesionalService.removeEspecialidadVinculo(vinculoId);
    }
}
