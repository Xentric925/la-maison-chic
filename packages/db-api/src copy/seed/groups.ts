import { writePrisma } from '../prisma';

export const seedGroups = async () => {
  await writePrisma.group.create({
    data: {
      companyId: 1,
      name: 'Book Club',
      description: 'Book Club group.',
      locationId: null,
    },
  });

  await writePrisma.group.create({
    data: {
      companyId: 1,
      name: 'Couch Potato',
      description: 'Couch Potato group.',
      locationId: null,
    },
  });

  await writePrisma.group.create({
    data: {
      companyId: 1,
      name: 'LOTR',
      description: 'LOTR Fans.',
      locationId: 2,
    },
  });
};
