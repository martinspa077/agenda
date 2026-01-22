import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const departamentos = [
    'Artigas',
    'Canelones',
    'Cerro Largo',
    'Colonia',
    'Durazno',
    'Flores',
    'Florida',
    'Lavalleja',
    'Maldonado',
    'Montevideo',
    'Paysandú',
    'Río Negro',
    'Rivera',
    'Rocha',
    'Salto',
    'San José',
    'Soriano',
    'Tacuarembó',
    'Treinta y Tres',
];

async function main() {
    console.log('Start seeding ...');

    for (const nombre of departamentos) {
        // Find or create department to avoid duplicates or errors on re-run
        let depto = await prisma.departamento.findFirst({ where: { nombre } });

        if (!depto) {
            depto = await prisma.departamento.create({
                data: { nombre },
            });
            console.log(`Created department: ${depto.nombre}`);
        } else {
            console.log(`Department already exists: ${depto.nombre}`);
        }

        // --- SEED SPECIALTIES ---
        const especialidades = ['Cardiología', 'Traumatología', 'Pediatría', 'Medicina General', 'Ginecología'];
        for (const espNombre of especialidades) {
            await prisma.especialidad.upsert({
                where: { nombre: espNombre },
                update: {},
                create: { nombre: espNombre },
            });
        }
        // ------------------------

        // Create sample units for this department
        const unitsToCreate = [
            `Hospital de ${nombre}`,
            `Policlínica Central ${nombre}`,
        ];

        for (const unitName of unitsToCreate) {
            const existingUnit = await prisma.unidadAsistencial.findFirst({
                where: {
                    nombre: unitName,
                    departamentoId: depto.id
                }
            });

            if (!existingUnit) {
                await prisma.unidadAsistencial.create({
                    data: {
                        nombre: unitName,
                        departamentoId: depto.id,
                    }
                });
                console.log(`  Created unit: ${unitName}`);
            } else {
                console.log(`  Unit already exists: ${unitName}`);
            }

            // Create Professionals for this Unit (only if unseeded/check by name for simplicity, or just create)
            // To prevent duplicates on re-run, check existence.
            const unit = await prisma.unidadAsistencial.findFirst({ where: { nombre: unitName, departamentoId: depto.id } });

            if (unit) {
                const professionsToCreate = [
                    { name: 'Juan', surname: `Cardiólogo ${nombre}`, specialty: 'Cardiología' },
                    { name: 'Maria', surname: `Pediatra ${nombre}`, specialty: 'Pediatría' },
                    { name: 'Carlos', surname: `General ${nombre}`, specialty: 'Medicina General' }
                ];

                for (const prof of professionsToCreate) {
                    // 1. Find or create the Professional (Person)
                    let professional = await prisma.profesional.findFirst({
                        where: {
                            nombre: prof.name,
                            apellido: prof.surname
                        }
                    });

                    if (!professional) {
                        const docNum = Math.floor(Math.random() * 9000000) + 1000000;
                        professional = await prisma.profesional.create({
                            data: {
                                nombre: prof.name,
                                apellido: prof.surname,
                                numeroDocumento: docNum.toString(),
                            }
                        });
                    }

                    // 2. Create the Vinculo (Link to Unit with Specialty)
                    const specialty = await prisma.especialidad.findFirst({ where: { nombre: prof.specialty } });

                    if (specialty) {
                        const existingVinculo = await prisma.vinculo.findUnique({
                            where: {
                                profesionalId_unidadId_especialidadId: {
                                    profesionalId: professional.id,
                                    unidadId: unit.id,
                                    especialidadId: specialty.id
                                }
                            }
                        });

                        if (!existingVinculo) {
                            const vinculo = await prisma.vinculo.create({
                                data: {
                                    profesionalId: professional.id,
                                    unidadId: unit.id,
                                    especialidadId: specialty.id
                                }
                            });

                            // Create AgendaMes (current month)
                            const today = new Date();
                            const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

                            const agendaMes = await prisma.agendaMes.create({
                                data: {
                                    mes: firstDayOfMonth,
                                    vinculoId: vinculo.id,
                                    estado: 'Activa'
                                }
                            });

                            // Create 2 sample Agendas (Days) for this month
                            const daysToAdd = [1, 3]; // e.g. +1 day, +3 days from now
                            for (const d of daysToAdd) {
                                const agendaDate = new Date(today);
                                agendaDate.setDate(today.getDate() + d);

                                await prisma.agenda.create({
                                    data: {
                                        agendaMesId: agendaMes.id,
                                        fecha: agendaDate,
                                        horario: "08:00 - 12:00",
                                        totalNros: 12,
                                        nroPresenciales: 10,
                                        nroTelefonicos: 2,
                                        modo: "Presencial",
                                        minConsulta: 15
                                    }
                                });
                            }
                            console.log(`    Linked Professional: ${prof.name} ${prof.surname} to ${unitName} as ${prof.specialty} with Agendas`);
                        }
                    }
                }
            }
        }
    }

    // --- SEED PATIENTS ---
    const pacientes = [
        { nombre: 'Ana', apellido: 'García', tipoDocumento: 'CI', nroDocumento: '12345678', sexo: 'F', fechaNacimiento: new Date('1985-04-12') },
        { nombre: 'Pedro', apellido: 'Rodríguez', tipoDocumento: 'CI', nroDocumento: '87654321', sexo: 'M', fechaNacimiento: new Date('1990-09-25') },
        { nombre: 'Lucía', apellido: 'Martínez', tipoDocumento: 'CI', nroDocumento: '11223344', sexo: 'F', fechaNacimiento: new Date('1978-11-05') },
        { nombre: 'Jorge', apellido: 'López', tipoDocumento: 'CI', nroDocumento: '44332211', sexo: 'M', fechaNacimiento: new Date('2000-01-30') },
        { nombre: 'Sofía', apellido: 'Pérez', tipoDocumento: 'CI', nroDocumento: '55667788', sexo: 'F', fechaNacimiento: new Date('1995-06-15') },
    ];

    console.log('Seeding patients...');
    for (const p of pacientes) {
        await prisma.paciente.upsert({
            where: { nroDocumento: p.nroDocumento },
            update: {},
            create: p,
        });
    }
    // --- SEED HOLIDAYS (FERIADOS) ---
    console.log('Seeding holidays...');
    const currentYear = new Date().getFullYear();
    const feriados = [
        { fecha: new Date(`${currentYear}-01-01`), descripcion: 'Año Nuevo' },
        { fecha: new Date(`${currentYear}-05-01`), descripcion: 'Día de los Trabajadores' },
        { fecha: new Date(`${currentYear}-07-18`), descripcion: 'Jura de la Constitución' },
        { fecha: new Date(`${currentYear}-08-25`), descripcion: 'Declaratoria de la Independencia' },
        { fecha: new Date(`${currentYear}-12-25`), descripcion: 'Navidad' },
        // Add a test holiday for "tomorrow" to verify UI blocking
        { fecha: new Date(new Date().setDate(new Date().getDate() + 1)), descripcion: 'Feriado de Prueba' }
    ];

    for (const feriado of feriados) {
        await prisma.feriado.upsert({
            where: { id: 0 }, // Feriado doesn't have a unique key other than ID, so we might duplicate if we rely on simple creates.
            // Better strategy for seed: check by date/desc or just clean table (careful). 
            // For now, let's use findFirst to check existence.
            update: {},
            create: feriado
        }).catch(async () => {
            // Fallback if upsert fails on ID 0 or logic (upsert needs unique where).
            // Since we don't have unique constraint on date/desc, let's just use findFirst+create pattern
            return null;
        });

        // Correct approach for non-unique-constrained models in seed:
        const existingFeriado = await prisma.feriado.findFirst({
            where: {
                fecha: feriado.fecha,
                descripcion: feriado.descripcion
            }
        });

        if (!existingFeriado) {
            await prisma.feriado.create({ data: feriado });
            console.log(`  Created holiday: ${feriado.descripcion} on ${feriado.fecha.toISOString().split('T')[0]}`);
        }
    }


    // --- SEED LICENSES (LICENCIAS) ---
    console.log('Seeding licenses...');
    // Find a professional to give a license to (e.g., the first one created)
    const professionalForLicense = await prisma.profesional.findFirst();

    if (professionalForLicense) {
        // Create a license for 5 days starting in 2 weeks
        const startDate = new Date();
        startDate.setDate(startDate.getDate() + 14);
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 4);

        const existingLicense = await prisma.licencia.findFirst({
            where: {
                profesionalId: professionalForLicense.id,
                fechaInicio: startDate
            }
        });

        if (!existingLicense) {
            await prisma.licencia.create({
                data: {
                    profesionalId: professionalForLicense.id,
                    fechaInicio: startDate,
                    fechaFin: endDate,
                    tipo: 'Licencia Médica',
                    motivo: 'Gripe',
                    activo: true
                }
            });
            console.log(`  Created license for ${professionalForLicense.nombre} ${professionalForLicense.apellido} from ${startDate.toISOString().split('T')[0]} to ${endDate.toISOString().split('T')[0]}`);
        } else {
            console.log(`  License already exists for ${professionalForLicense.nombre} ${professionalForLicense.apellido}`);
        }
    }

    console.log('Patients seeded.');


    console.log('Seeding finished.');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
