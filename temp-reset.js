const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function resetAndCheck() {
  const hash = await bcrypt.hash('password123', 10);
  await prisma.user.update({
    where: { email: 'testsqlite@example.com' },
    data: { password: hash }
  });
  console.log('Password updated successfully');
  process.exit(0);
}
resetAndCheck();
