import { writePrisma } from '../prisma';

const calendarStatuses = [
  {
    userId: 1,
    fromDate: new Date('2024-01-01T09:00:00Z'),
    toDate: new Date('2024-01-01T11:30:00Z'),
    isFullDay: false,
    statusId: 1, // Out Of Office
  },
  {
    userId: 2,
    fromDate: new Date('2024-02-01T00:00:00Z'),
    toDate: new Date('2024-02-04T23:59:59Z'),
    isFullDay: true,
    statusId: 2, // Remote 🏡👨‍💻
  },
  {
    userId: 3,
    fromDate: new Date('2024-03-01T00:00:00Z'),
    toDate: new Date('2024-03-01T23:59:59Z'),
    isFullDay: true,
    statusId: 3, // Sick 🥴
  },
  {
    userId: 4,
    fromDate: new Date('2024-04-01T00:00:00Z'),
    toDate: new Date('2024-04-07T23:59:59Z'),
    isFullDay: true,
    statusId: 4, // Vacation 🏖️
  },
  {
    userId: 5,
    fromDate: new Date('2024-05-01T00:00:00Z'),
    toDate: new Date('2024-05-02T23:59:59Z'),
    isFullDay: true,
    statusId: 5, // Bereavement
  },
  {
    userId: 1,
    fromDate: new Date('2024-06-01T00:00:00Z'),
    toDate: new Date('2024-06-12T23:59:59Z'),
    isFullDay: true,
    statusId: 6, // Marriage Leave 💍
  },
  {
    userId: 2,
    fromDate: new Date('2024-07-01T00:00:00Z'),
    toDate: new Date('2024-07-02T23:59:59Z'),
    isFullDay: true,
    statusId: 7, // Professional Development 📙
  },
  {
    userId: 3,
    fromDate: new Date('2024-08-01T00:00:00Z'),
    toDate: new Date('2024-08-22T23:59:59Z'),
    isFullDay: true,
    statusId: 8, // Parental Leave 👶
  },
  {
    userId: 4,
    fromDate: new Date('2024-09-01T00:00:00Z'),
    toDate: new Date('2024-09-02T23:59:59Z'),
    isFullDay: true,
    statusId: 9, // PTO Perks 🎁
  },
];

export const seedCalendarStatuses = async () => {
  await writePrisma.$transaction(async (prisma) => {
    await Promise.all(
      calendarStatuses.map((calendarStatus) =>
        prisma.calendarStatus.create({
          data: {
            ...calendarStatus,
          },
        }),
      ),
    );
  });
};
