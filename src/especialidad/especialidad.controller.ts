import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { EspecialidadService } from './especialidad.service';

@ApiTags('Especialidad')
@Controller('especialidad')
export class EspecialidadController {
    constructor(private readonly especialidadService: EspecialidadService) { }

    @Get()
    @ApiOperation({ summary: 'Listar todas las especialidades' })
    async findAll() {
        return this.especialidadService.findAll();
    }

    @Post()
    @ApiOperation({ summary: 'Crear especialidad' })
    async create(@Body() body: { nombre: string }) {
        return this.especialidadService.create(body);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Actualizar especialidad' })
    async update(@Param('id') id: string, @Body() body: { nombre: string }) {
        return this.especialidadService.update(Number(id), body);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Eliminar especialidad' })
    async remove(@Param('id') id: string) {
        return this.especialidadService.remove(Number(id));
    }
}
