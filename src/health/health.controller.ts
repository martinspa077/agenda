import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HealthService } from './health.service';

@ApiTags('Health Resources')
@Controller('health')
export class HealthController {
    constructor(private readonly healthService: HealthService) { }

    @Get('departamentos-unidades')
    @ApiOperation({ summary: 'Get all departments with their healthcare units' })
    @ApiResponse({ status: 200, description: 'List of departments with units.' })
    async getDepartmentsWithUnits() {
        return this.healthService.getDepartmentsWithUnits();
    }
}
