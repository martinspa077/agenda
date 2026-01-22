import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { DepartamentoService } from './departamento.service';

@ApiTags('Departamento')
@Controller('departamento')
export class DepartamentoController {
    constructor(private readonly departamentoService: DepartamentoService) { }

    @Get()
    @ApiOperation({ summary: 'Listar todos los departamentos' })
    async findAll() {
        return this.departamentoService.findAll();
    }

    @Post()
    @ApiOperation({ summary: 'Crear departamento' })
    async create(@Body() body: { nombre: string }) {
        return this.departamentoService.create(body);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Actualizar departamento' })
    async update(@Param('id') id: string, @Body() body: { nombre: string }) {
        return this.departamentoService.update(Number(id), body);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Eliminar departamento' })
    async remove(@Param('id') id: string) {
        return this.departamentoService.remove(Number(id));
    }
}
