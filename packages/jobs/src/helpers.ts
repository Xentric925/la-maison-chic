import prisma from './prisma';
import { JobStatus } from '@prisma/client';

export const markJobAsRunning = async (id: number): Promise<boolean> => {
  try {
    await prisma.job.update({
      where: { id },
      data: {
        status: JobStatus.RUNNING,
      },
    });
    console.log(`Job ${id} marked as running.`);
    return true;
  } catch (error) {
    throw new Error(`Error updating job ${id}: ${(error as Error).message}`);
  }
};

export const markJobAsCompleted = async (id: number): Promise<boolean> => {
  try {
    await prisma.job.update({
      where: { id },
      data: {
        status: JobStatus.COMPLETED,
        completedAt: new Date(),
      },
    });
    console.log(`Job ${id} marked as completed.`);
    return true;
  } catch (error) {
    throw new Error(`Error updating job ${id}: ${(error as Error).message}`);
  }
};

export const markJobAsFailed = async (
  id: number,
  previousFailureCount: number,
  error: Error,
): Promise<boolean> => {
  try {
    await prisma.job.update({
      where: { id },
      data: {
        status: JobStatus.FAILED,
        errorMessage: error?.message || 'Unknown error',
        failureCount: previousFailureCount + 1,
      },
    });
    console.log(`Job ${id} marked as failed.`);
    return true;
  } catch (error) {
    throw new Error(`Error updating job ${id}: ${(error as Error).message}`);
  }
};

export const markJobAsRetry = async (
  id: number,
  previousFailureCount: number,
  error: Error,
): Promise<boolean> => {
  // TODO: this value could be in the db or env var
  if (previousFailureCount === 1) {
    return await markJobAsFailed(id, previousFailureCount, error);
  }
  try {
    await prisma.job.update({
      where: { id },
      data: {
        status: JobStatus.RETRY,
        errorMessage: error?.message || 'Unknown error',
        failureCount: previousFailureCount + 1,
      },
    });
    console.log(`Job ${id} marked as retry.`);
    return true;
  } catch (error) {
    throw new Error(`Error updating job ${id}: ${(error as Error).message}`);
  }
};
