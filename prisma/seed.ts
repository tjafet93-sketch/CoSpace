import { PrismaClient, SpaceType } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // 1. Crear el usuario Administrador por defecto
  const hashedPassword = await bcrypt.hash('Admin123*', 10);

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@cospace.com' },
    update: {},
    create: {
      name: 'Administrador CoSpace',
      email: 'admin@cospace.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log({ adminUser });

  // 2. Crear espacios de coworking de ejemplo
  await prisma.space.createMany({
    skipDuplicates: true,
    data: [
      {
        name: 'Escritorio Open Space 1',
        description: 'Escritorio individual en zona abierta, incluye conexión de alta velocidad y café ilimitado.',
        type: SpaceType.DESK,
        capacity: 1,
        pricePerHour: 15.0,
        imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c',
      },
      {
        name: 'Sala de Reuniones Ejecutiva',
        description: 'Sala privada equipada con pantalla 4K, pizarra y capacidad para 8 personas.',
        type: SpaceType.MEETING_ROOM,
        capacity: 8,
        pricePerHour: 45.0,
        imageUrl: 'https://images.unsplash.com/photo-1517502884422-41eaead166d4',
      },
      {
        name: 'Cabina Privada Silenciosa',
        description: 'Espacio ideal para llamadas y videollamadas con aislamiento acústico.',
        type: SpaceType.CABIN,
        capacity: 1,
        pricePerHour: 25.0,
        imageUrl: 'https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2',
      },
    ],
  });

  console.log('Seed ejecutado correctamente con administrador y espacios de ejemplo.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
