import { writePrisma, adminPrisma } from '../prisma';

const profiles = [
  {
    userId: 1,
    title: 'Head of Engineering',
    dateOfBirth: '2000-08-29T10:15:30.000Z',
    employedAt: '2022-08-29T10:15:30.000Z',
    profileImage: null,
    additionalInfo: `{
      bio: "I love to play the guitar and I'm a huge fan of the Beatles.",
      social: {
        linkedin: 'https://www.linkedin.com/in/john-lennon',
        twitter: 'https://twitter.com/johnlennon',
      },
    }`,
  },
];

const privateProfiles = [
  {
    userId: 1,
    salary: 2300,
    address: 'Amchit, building 100, 2nd floor',
    phoneNumber: '+961 70 123 456',
    secondaryPhoneNumber: '+961 70 654 321',
    secondaryEmail: 'alexiakl@gmail.com',
    emergencyContactName: 'John Doe',
    emergencyContactNumber: '+961 70 987 654',
  },
];

export const seedProfiles = async () => {
  await Promise.all(
    profiles.map(
      async (profile) =>
        await writePrisma.profile.create({
          data: {
            ...profile,
          },
        }),
    ),
  );

  await Promise.all(
    privateProfiles.map(
      async (profile) =>
        await adminPrisma.privateProfile.create({
          data: {
            ...profile,
          },
        }),
    ),
  );
};
