import { writePrisma } from '../prisma';

const daysOff = [
  {
    name: "New Year's Day",
    fromDate: '2024-01-01T00:00:00Z',
    toDate: '2024-01-01T23:59:59Z',
  },
  {
    name: 'Saint Maroun Day',
    fromDate: '2024-02-09T00:00:00Z',
    toDate: '2024-02-09T23:59:59Z',
  },
  {
    name: 'Good Friday',
    fromDate: '2024-03-29T00:00:00Z',
    toDate: '2024-03-29T23:59:59Z',
  },
  {
    name: 'Easter Monday',
    fromDate: '2024-04-01T00:00:00Z',
    toDate: '2024-04-01T23:59:59Z',
  },
  {
    name: 'Eid El Fitr',
    fromDate: '2024-04-10T00:00:00Z',
    toDate: '2024-04-10T23:59:59Z',
  },
  {
    name: 'Memorial Day',
    fromDate: '2024-05-27T00:00:00Z',
    toDate: '2024-05-27T23:59:59Z',
  },
];

export const seedDaysOff = async () => {
  await writePrisma.$transaction(async (prisma) => {
    await Promise.all(
      daysOff.map(async (dayOff) => {
        await prisma.dayOff.create({
          data: {
            ...dayOff,
          },
        });
      }),
    );
  });
};
