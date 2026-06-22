import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@vapt.com.br' },
    update: {},
    create: {
      name: 'Administrador',
      email: 'admin@vapt.com.br',
      passwordHash: hashedPassword,
      phone: '11999999999',
      role: Role.ADMIN,
    },
  });

  const professional = await prisma.user.upsert({
    where: { email: 'profissional@vapt.com.br' },
    update: {},
    create: {
      name: 'Profissional',
      email: 'profissional@vapt.com.br',
      passwordHash: hashedPassword,
      phone: '11988888888',
      role: Role.PROFESSIONAL,
    },
  });

  console.log('Seed concluído:', { admin: admin.id, professional: professional.id });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
