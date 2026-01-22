import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { LicenciaService } from './licencia.service';

@ApiTags('Licencia')
@Controller('licencia')
export class LicenciaController {
    constructor(private readonly licenciaService: LicenciaService) { }

    @Get()
    @ApiOperation({ summary: 'Listar todas las licencias' })
    async findAll() {
        return this.licenciaService.findAll();
    }

    @Post()
    @ApiOperation({ summary: 'Crear licencia' })
    async create(@Body() body: any) {
        return this.licenciaService.create(body);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Actualizar licencia' })
    async update(@Param('id') id: string, @Body() body: any) {
        return this.licenciaService.update(Number(id), body);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Eliminar licencia' })
    async remove(@Param('id') id: string) {
        return this.licenciaService.remove(Number(id));
    }
}
