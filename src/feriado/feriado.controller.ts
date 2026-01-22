import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { FeriadoService } from './feriado.service';

@ApiTags('Feriado')
@Controller('feriado')
export class FeriadoController {
    constructor(private readonly feriadoService: FeriadoService) { }

    @Get()
    @ApiOperation({ summary: 'Listar todos los feriados' })
    async findAll() {
        return this.feriadoService.findAll();
    }

    @Post()
    @ApiOperation({ summary: 'Crear feriado' })
    async create(@Body() body: { fecha: string; descripcion: string; activo?: boolean }) {
        return this.feriadoService.create(body);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Actualizar feriado' })
    async update(@Param('id') id: string, @Body() body: { fecha: string; descripcion: string; activo?: boolean }) {
        return this.feriadoService.update(Number(id), body);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Eliminar feriado' })
    async remove(@Param('id') id: string) {
        return this.feriadoService.remove(Number(id));
    }
}
