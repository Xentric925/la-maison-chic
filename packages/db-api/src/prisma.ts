import { PrismaClient } from '@prisma/client';

const {
  POSTGRES_DB,
  DB_HOST,
  DB_PORT,
  READ_USER,
  READ_PASSWORD,
  WRITE_USER,
  WRITE_PASSWORD,
  ADMIN_USER,
  ADMIN_PASSWORD,
} = process.env;

const DATABASE_URL_READ = `postgresql://${READ_USER}:${READ_PASSWORD}@${DB_HOST}:${DB_PORT}/${POSTGRES_DB}?schema=public`;
const DATABASE_URL_WRITE = `postgresql://${WRITE_USER}:${WRITE_PASSWORD}@${DB_HOST}:${DB_PORT}/${POSTGRES_DB}?schema=public`;
const DATABASE_URL_ADMIN = `postgresql://${ADMIN_USER}:${ADMIN_PASSWORD}@${DB_HOST}:${DB_PORT}/${POSTGRES_DB}?schema=private`;

export const readPrisma = new PrismaClient({
  datasources: { db: { url: DATABASE_URL_READ } },
});

export const writePrisma = new PrismaClient({
  datasources: { db: { url: DATABASE_URL_WRITE } },
});

export const adminPrisma = new PrismaClient({
  datasources: { db: { url: DATABASE_URL_ADMIN } },
});
