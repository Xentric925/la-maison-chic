import { writePrisma } from '../prisma';

export const seedWorkSettings = async () => {
  await writePrisma.workSetting.create({
    data: {
      timeZone: 'Asia/Beirut',
      remoteWorkAllowed: true,
      hybridWorkAllowed: true,
      flexibleHours: true,
      workingSchedule: {
        m: {
          start: '09:00',
          end: '18:00',
          breaks: [{ start: '12:00', end: '13:00', description: 'Lunch' }],
        },
        tu: {
          start: '09:00',
          end: '18:00',
          breaks: [{ start: '12:00', end: '13:00', description: 'Lunch' }],
        },
        w: {
          start: '09:00',
          end: '18:00',
          breaks: [{ start: '12:00', end: '13:00', description: 'Lunch' }],
        },
        th: {
          start: '09:00',
          end: '18:00',
          breaks: [{ start: '12:00', end: '13:00', description: 'Lunch' }],
        },
        f: {
          start: '09:00',
          end: '18:00',
          breaks: [{ start: '12:00', end: '13:00', description: 'Lunch' }],
        },
      },
    },
  });

  await writePrisma.workSetting.create({
    data: {
      timeZone: 'America/New_York',
      remoteWorkAllowed: true,
      hybridWorkAllowed: false,
      inOfficeAvailable: false,
      flexibleHours: true,
      workingSchedule: {
        m: {
          start: '09:00',
          end: '18:00',
          breaks: [{ start: '12:00', end: '13:00', description: 'Lunch' }],
        },
        tu: {
          start: '09:00',
          end: '18:00',
          breaks: [{ start: '12:00', end: '13:00', description: 'Lunch' }],
        },
        w: {
          start: '09:00',
          end: '18:00',
          breaks: [{ start: '12:00', end: '13:00', description: 'Lunch' }],
        },
        th: {
          start: '09:00',
          end: '18:00',
          breaks: [{ start: '12:00', end: '13:00', description: 'Lunch' }],
        },
        f: {
          start: '09:00',
          end: '18:00',
          breaks: [{ start: '12:00', end: '13:00', description: 'Lunch' }],
        },
      },
    },
  });

  await writePrisma.workSetting.create({
    data: {
      timeZone: 'Europe/Warsaw',
      remoteWorkAllowed: true,
      hybridWorkAllowed: false,
      inOfficeAvailable: false,
      flexibleHours: true,
      workingSchedule: {
        m: {
          start: '09:00',
          end: '18:00',
          breaks: [{ start: '12:00', end: '13:00', description: 'Lunch' }],
        },
        tu: {
          start: '09:00',
          end: '18:00',
          breaks: [{ start: '12:00', end: '13:00', description: 'Lunch' }],
        },
        w: {
          start: '09:00',
          end: '18:00',
          breaks: [{ start: '12:00', end: '13:00', description: 'Lunch' }],
        },
        th: {
          start: '09:00',
          end: '18:00',
          breaks: [{ start: '12:00', end: '13:00', description: 'Lunch' }],
        },
        f: {
          start: '09:00',
          end: '18:00',
          breaks: [{ start: '12:00', end: '13:00', description: 'Lunch' }],
        },
      },
    },
  });

  await writePrisma.workSetting.create({
    data: {
      timeZone: 'Asia/Beirut',
      remoteWorkAllowed: false,
      hybridWorkAllowed: true,
      inOfficeAvailable: true,
      flexibleHours: true,
      workingSchedule: {
        tu: {
          start: '11:00',
          end: '18:00',
          breaks: [{ start: '12:00', end: '13:00', description: 'Lunch' }],
        },
        th: {
          start: '11:00',
          end: '18:00',
          breaks: [{ start: '12:00', end: '13:00', description: 'Lunch' }],
        },
        sa: {
          start: '11:00',
          end: '18:00',
          breaks: [{ start: '12:00', end: '13:00', description: 'Lunch' }],
        },
        su: {
          start: '11:00',
          end: '18:00',
          breaks: [{ start: '12:00', end: '13:00', description: 'Lunch' }],
        },
      },
    },
  });
};
