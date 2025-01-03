import prisma from './prisma';
import cron from 'node-cron';
import { runPendingJobs, runRetryJobs } from './jobs';

// Run every 10 seconds
cron.schedule('*/10 * * * * *', async () => {
  console.log('Running a task every 10 seconds');
  await runPendingJobs();
});

// Cron job that runs every 1 minute
cron.schedule('*/1 * * * *', async () => {
  console.log('Running retry jobs...');
  await runRetryJobs();
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
});
