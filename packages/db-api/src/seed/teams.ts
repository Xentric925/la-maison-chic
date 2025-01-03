import { writePrisma } from '../prisma';

export const seedTeams = async () => {
  await writePrisma.team.create({
    data: {
      companyId: 1,
      name: 'Aboard',
      description:
        "The Aboard team is responsible for the development of Aboard's products.",
      locationId: null,
    },
  });

  await writePrisma.team.create({
    data: {
      companyId: 1,
      name: 'Sawa',
      description:
        "The Sawa team is responsible for the development of Sawa's products.",
      locationId: null,
    },
  });

  await writePrisma.team.create({
    data: {
      companyId: 1,
      name: 'Probable Futures',
      description:
        "The Sawa team is responsible for the development of PF's products.",
      locationId: 2,
    },
  });

  await writePrisma.team.create({
    data: {
      companyId: 1,
      name: 'Reflexions',
      description:
        "The Sawa team is responsible for the development of Reflexions' products.",
      locationId: 2,
    },
  });
};
