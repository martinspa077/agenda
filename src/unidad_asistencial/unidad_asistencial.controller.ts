import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { UnidadAsistencialService } from './unidad_asistencial.service';

@ApiTags('UnidadAsistencial')
@Controller('unidad-asistencial')
export class UnidadAsistencialController {
    constructor(private readonly unidadService: UnidadAsistencialService) { }

    @Get()
    @ApiOperation({ summary: 'Listar todas las unidades' })
    async findAll() {
        return this.unidadService.findAll();
    }

    @Post()
    @ApiOperation({ summary: 'Crear unidad' })
    async create(@Body() body: { nombre: string; departamentoId: number; activo?: boolean }) {
        return this.unidadService.create(body);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Actualizar unidad' })
    async update(@Param('id') id: string, @Body() body: { nombre: string; departamentoId: number; activo?: boolean }) {
        return this.unidadService.update(Number(id), body);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Eliminar unidad' })
    async remove(@Param('id') id: string) {
        return this.unidadService.remove(Number(id));
    }
}
