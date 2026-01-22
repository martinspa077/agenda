import { Injectable } from '@nestjs/common';

@Injectable()
export class FhirService {
    transformToAppointment(consulta: any): any {
        // Simple HL7 FHIR Transformation logic for Appointment resource
        return {
            resourceType: 'Appointment',
            id: consulta.id.toString(),
            status: this.mapStatus(consulta.estado),
            description: consulta.tipo,
            start: consulta.fechaHora,
            participant: [
                {
                    actor: {
                        reference: `Practitioner/${consulta.profesionalId}`,
                        display: `Profesional ID ${consulta.profesionalId}`
                    },
                    status: 'accepted'
                },
                {
                    actor: {
                        reference: `Patient/${consulta.pacienteId}`,
                        display: `Patient ID ${consulta.pacienteId}`
                    },
                    status: 'accepted'
                }
            ]
        };
    }

    transformToSlot(agenda: any): any {
        return {
            resourceType: 'Slot',
            id: agenda.id.toString(),
            status: agenda.active ? 'free' : 'busy',
            start: new Date().toISOString(), // Mock
            end: new Date().toISOString(),   // Mock
            schedule: {
                reference: `Schedule/${agenda.id}`
            }
        };
    }

    private mapStatus(internalStatus: string): string {
        switch (internalStatus) {
            case 'Asistida': return 'fulfilled';
            case 'Inasistencia': return 'noshow';
            case 'Cancelada': return 'cancelled';
            case 'Sin dato': return 'proposed';
            default: return 'proposed';
        }
    }
}
