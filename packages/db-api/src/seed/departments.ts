import { writePrisma } from '../prisma';

export const seedDepartments = async () => {
  await writePrisma.department.create({
    data: {
      companyId: 1,
      name: 'Engineering',
      description:
        "The Engineering department is responsible for the development of the company's products.",
      locationId: null,
    },
  });

  await writePrisma.department.create({
    data: {
      companyId: 1,
      name: 'Marketing',
      description:
        "The Marketing department is responsible for promoting the company's products and services.",
      locationId: null,
    },
  });

  await writePrisma.department.create({
    data: {
      companyId: 1,
      name: 'Sales',
      description:
        "The Sales department is responsible for selling the company's products and services.",
      locationId: 2,
    },
  });
};
