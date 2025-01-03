import { writePrisma, adminPrisma } from '../prisma';
import { subDays } from 'date-fns';
import { UserActionType } from '@prisma/client';

// Helper function to get a random date within the last year
const getRandomDate = () => {
  const randomDaysAgo = Math.floor(Math.random() * 365); // Between 0 and 365 days ago
  return subDays(new Date(), randomDaysAgo);
};

// Helper function to generate random login entries for users
export const seedUserHistory = async () => {
  const users = await writePrisma.user.findMany({
    where: { deletedAt: null },
    select: { id: true },
  });

  const actions = [UserActionType.LOGIN]; // Add more action types as needed (e.g., LOGOUT, etc.)

  // Generate 400 login entries with random dates
  const loginEntries = [];

  for (let i = 0; i < 400; i++) {
    const randomUser = users[Math.floor(Math.random() * users.length)]; // Pick a random user
    const loginDate = getRandomDate(); // Get a random date within the last year
    const action = actions[Math.floor(Math.random() * actions.length)]; // Random action (we're only using LOGIN here)

    loginEntries.push({
      userId: randomUser.id,
      action,
      createdAt: loginDate,
      updateDescription: 'Login Successful', // You can add more descriptions based on action
    });
  }

  // Insert login entries into the userHistory table
  try {
    await adminPrisma.userHistory.createMany({
      data: loginEntries,
    });
    console.log(
      `${loginEntries.length} user login histories inserted successfully`,
    );
  } catch (error) {
    console.error('Error inserting user login histories:', error);
  }
};
