import { Injectable } from '@nestjs/common';

@Injectable()
export class SyncService {
    async syncInterconsulta(hceaRequest: any): Promise<void> {
        // Mock HCEA synchronization logic
        console.log('Syncing Interconsulta from HCEA:', hceaRequest);
        // 1. Validate patient existence
        // 2. Map to local DemandaEnEspera or Consulta
        // 3. Save to DB
    }
}
