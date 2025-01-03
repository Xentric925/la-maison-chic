import { writePrisma } from '../prisma';

export const seedLocations = async () => {
  await writePrisma.location.create({
    data: {
      companyId: 1,
      name: 'Lebanon',
      country: 'LB',
      city: 'Beirut',
      address: 'BDD - Bchara El Khoury, first floor',
      workSettingId: 1,
    },
  });

  await writePrisma.location.create({
    data: {
      companyId: 1,
      name: 'New York',
      country: 'US',
      city: 'New York',
      address: '5th Street - Building 100, first floor',
      workSettingId: 2,
    },
  });

  await writePrisma.location.create({
    data: {
      companyId: 1,
      name: 'Warsaw',
      country: 'Poland',
      city: 'Warsaw',
      address: 'Piotr 100, first floor',
      workSettingId: 3,
    },
  });
};
