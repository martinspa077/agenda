import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkData() {
    console.log('Checking database data...\n');

    const departamentos = await prisma.departamento.count();
    const unidades = await prisma.unidadAsistencial.count();
    const profesionales = await prisma.profesional.count();
    const especialidades = await prisma.especialidad.count();
    const vinculos = await prisma.vinculo.count();
    const pacientes = await prisma.paciente.count();
    const feriados = await prisma.feriado.count();
    const licencias = await prisma.licencia.count();
    const agendasMes = await prisma.agendaMes.count();
    const agendas = await prisma.agenda.count();
    const consultas = await prisma.consulta.count();

    console.log('📊 Database Record Counts:');
    console.log('==========================');
    console.log(`Departamentos:        ${departamentos}`);
    console.log(`Unidades Asistenciales: ${unidades}`);
    console.log(`Profesionales:        ${profesionales}`);
    console.log(`Especialidades:       ${especialidades}`);
    console.log(`Vínculos:             ${vinculos}`);
    console.log(`Pacientes:            ${pacientes}`);
    console.log(`Feriados:             ${feriados}`);
    console.log(`Licencias:            ${licencias}`);
    console.log(`Agendas Mes:          ${agendasMes}`);
    console.log(`Agendas:              ${agendas}`);
    console.log(`Consultas:            ${consultas}`);
    console.log('==========================\n');

    await prisma.$disconnect();
}

checkData()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    });
