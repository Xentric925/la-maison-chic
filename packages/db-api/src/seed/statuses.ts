import { writePrisma } from '../prisma';

export const seedStatuses = async () => {
  await writePrisma.status.create({
    data: {
      name: 'Out Of Office',
      description:
        'Use this status when you are out of the office for less than 2h 30m, e.g. fixing your car, doctor visit, etc.',
    },
  });

  await writePrisma.status.create({
    data: {
      name: 'Remote 🏡👨‍💻',
      description:
        'Use this status when you are working from an unusual location / not at home.',
    },
  });

  await writePrisma.status.create({
    data: {
      name: 'Sick 🥴',
    },
  });

  await writePrisma.status.create({
    data: {
      name: 'Vacation 🏖️',
    },
  });

  await writePrisma.status.create({
    data: {
      name: 'Bereavement',
      description: 'All employees are entitled to 3 bereavement days per year.',
    },
  });

  await writePrisma.status.create({
    data: {
      name: 'Marriage Leave 💍',
      description: 'All employees are entitled to 5 marriage leaves per year.',
    },
  });

  await writePrisma.status.create({
    data: {
      name: 'Professional Development 📙',
      description:
        'All employees are entitled to 2 professional development days per year.',
    },
  });

  await writePrisma.status.create({
    data: {
      name: 'Parental Leave 👶',
      description:
        'Primary care givers are entitled to 3 months parental leave / Secondary care givers are entitled to 20 days parental leave.',
    },
  });

  await writePrisma.status.create({
    data: {
      name: 'PTO Perks 🎁',
    },
  });
};
