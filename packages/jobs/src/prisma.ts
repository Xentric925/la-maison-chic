import { PrismaClient } from '@prisma/client';

const { POSTGRES_DB, DB_HOST, DB_PORT, JOBS_USER, JOBS_PASSWORD } = process.env;

const DATABASE_URL_JOBS = `postgresql://${JOBS_USER}:${JOBS_PASSWORD}@${DB_HOST}:${DB_PORT}/${POSTGRES_DB}?schema=jobs`;

const prisma = new PrismaClient({
  datasources: { db: { url: DATABASE_URL_JOBS } },
});

export default prisma;
