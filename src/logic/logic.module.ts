import { Module } from '@nestjs/common';
import { QuotaService } from './quota.service';
import { SyncService } from './sync.service';

@Module({
    providers: [QuotaService, SyncService],
    exports: [QuotaService, SyncService],
})
export class LogicModule { }
