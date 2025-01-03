import { JsonValue, JsonObject } from '@prisma/client/runtime/library';
import prisma from './prisma';
import { sendLoginEmail } from './sendgrid';
import { Job, JobType, JobStatus } from '@prisma/client';
import { markJobAsFailed, markJobAsRetry, markJobAsRunning } from './helpers';

export const runPendingJobs = async () => {
  try {
    const pendingJobs = await prisma.job.findMany({
      where: { status: JobStatus.PENDING },
      orderBy: { priority: 'desc' },
      take: 50,
    });

    await Promise.all(
      pendingJobs.map(async (job: Job) => {
        try {
          await executeJob(job);
        } catch (error) {
          await markJobAsRetry(job.id, job.failureCount, error as Error);
        }
      }),
    );
  } catch (error) {
    // TODO log error to a monitoring service
    console.error('Error running jobs:', error);
  }
};

export const runRetryJobs = async () => {
  try {
    const pendingJobs = await prisma.job.findMany({
      where: { status: JobStatus.RETRY },
      orderBy: { priority: 'desc' },
      take: 50,
    });

    await Promise.all(
      pendingJobs.map(async (job: Job) => {
        try {
          await executeJob(job);
        } catch (error) {
          await markJobAsFailed(job.id, job.failureCount, error as Error);
        }
      }),
    );
  } catch (error) {
    // TODO log error to a monitoring service
    console.error('Error running jobs:', error);
  }
};

interface SendLoginEmailPayload extends JsonObject {
  toEmail: string;
  token: string;
}

const isValidPayload = (
  payload: JsonValue,
): payload is SendLoginEmailPayload => {
  return (
    payload !== null &&
    typeof payload === 'object' &&
    'toEmail' in payload &&
    'token' in payload &&
    typeof payload.toEmail === 'string' &&
    typeof payload.token === 'string'
  );
};

const executeJob = async (job: Job) => {
  switch (job.type) {
    case JobType.EMAIL:
      if (isValidPayload(job.payload)) {
        // TODO: add rate limiting to prevent abuse
        await markJobAsRunning(job.id);
        const { toEmail, token } = job.payload;
        try {
          await sendLoginEmail(toEmail, token, job.id);
        } catch (error) {
          console.error('Failed to send login email with job id: ', job.id);
          await markJobAsRetry(job.id, job.failureCount, error as Error);
        }
      } else {
        await markJobAsFailed(
          job.id,
          job.failureCount,
          new Error('Invalid payload'),
        );
      }
      break;

    default:
      break;
  }
};
