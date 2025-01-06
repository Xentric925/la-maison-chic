import { UserRole } from '@prisma/client';
import { writePrisma } from '../prisma';
import bcrypt from 'bcryptjs';

const users = [
  {
    username: 'Hassan',
    password: bcrypt.hashSync('1234', 10),
    role: 'USER',
    email: 'hassandahabi@gmail.com',
    details: {
      firstName: 'Hassan',
      lastName: 'Dahabi',
    },
  },
  {
    username: 'Elissa',
    password: bcrypt.hashSync('1234', 10),
    role: 'USER',
    email: 'elissahaddad@example.com',
    details: {
      firstName: 'Elissa',
      lastName: 'Haddad',
      phone: '1234567890',
      address: '1234 Elm St',
    },
  },
];
export const seedUsers = async () => {
  await writePrisma.$transaction(async (prisma) => {
    await Promise.all(
      users.map((user) =>
        prisma.user.create({
          data: {
            username: user.username,
            role: user.role as UserRole,
            password: user.password,
            email: user.email,
            details: {
              create: user.details,
            },
          },
        }),
      ),
    );
  });
};
