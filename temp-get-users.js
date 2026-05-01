const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.user.findMany().then(users => {
  users.forEach(u => console.log(`Email: ${u.email}`));
  process.exit(0);
});
