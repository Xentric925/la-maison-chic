import { seedUsers } from './users';
import bcrypt from 'bcryptjs';

import { writePrisma } from '../prisma';
import { seedProducts } from './products';

const main = async () => {
  await seedUsers();
  await seedProducts();
  await writePrisma.user.create({
    data: {
      username: 'Xentric925',
      password: bcrypt.hashSync('Xen@92501', 10),
      email: 'davidbayaa2001@gmail.com',
      role: 'ADMIN',
      details: {
        create: {
          firstName: 'Daoud',
          lastName: 'El Bayah',
        },
      },
    },
  });
  console.log('Database seeded successfully!');

  process.exit();
};

main();
