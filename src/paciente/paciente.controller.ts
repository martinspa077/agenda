import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PacienteService } from './paciente.service';

@ApiTags('Paciente')
@Controller('paciente')
export class PacienteController {
    constructor(private readonly pacienteService: PacienteService) { }

    @Get('search')
    @ApiOperation({ summary: 'Buscar pacientes por nombre o documento' })
    async search(@Query('query') query: string) {
        return this.pacienteService.search(query);
    }
}
