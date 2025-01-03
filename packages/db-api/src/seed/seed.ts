import { COMPANY_ID } from '../constants';
import { readPrisma, writePrisma } from '../prisma';
import { seedCalendarStatuses } from './calendarStatuses';
import { seedDaysOff } from './daysOff';
import { seedDepartments } from './departments';
import { seedGroups } from './groups';
import { seedLocations } from './locations';
import { seedProfiles } from './profiles';
import { seedStatuses } from './statuses';
import { seedTeams } from './teams';
import { seedUsers } from './users';
import { seedWorkSettings } from './workSettings';

const main = async () => {
  const company = await readPrisma.company.findMany({
    where: {
      id: COMPANY_ID,
    },
  });
  if (company.length !== 0) {
    console.log('Database is not empty, please reset your database to seed!');
    return;
  }

  await writePrisma.company.create({
    data: {
      name: 'MyHRCompany',
    },
  });

  await seedWorkSettings();
  await seedLocations();
  await seedDepartments();
  await seedTeams();
  await seedGroups();
  await seedStatuses();
  await seedUsers();
  await seedProfiles();
  await seedDaysOff();
  await seedCalendarStatuses();

  console.log('Database seeded successfully!');

  process.exit();
};

main();
