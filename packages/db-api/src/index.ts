import express from 'express';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import cors from 'cors';

import { writePrisma, readPrisma, adminPrisma } from './prisma';

import helloRouter from './routes/helloRoutes';

if (!process.env.DB_API_PORT) {
  process.env.DB_API_PORT = '5000';
}

export const app = express();
app.use(express.json());
app.use(cookieParser());

// TODO: Replace origin with environment variable
const corsOptions = {
  origin: `http://localhost:3000`,
  credentials: true,
};
app.use(cors(corsOptions));

const requiredEnvVars = ['JWT_SECRET'];

requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    throw new Error(`${envVar} is not defined in the environment variables.`);
  }
});

const swaggerDocument = YAML.load('./openapi.yaml');
app.use(`/api/v1/docs`, swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const routers = [helloRouter];

routers.forEach((router) => {
  app.use(`/api/v1`, router);
});

export const server = app.listen(process.env.DB_API_PORT, () => {
  console.log(`[server]: Server is running`);
});

process.on('SIGINT', async () => {
  await writePrisma.$disconnect();
  await readPrisma.$disconnect();
  await adminPrisma.$disconnect();
  server.close(() => {
    console.log('Process terminated');
    process.exit(0);
  });
});

process.on('SIGTERM', async () => {
  await writePrisma.$disconnect();
  await readPrisma.$disconnect();
  await adminPrisma.$disconnect();
  server.close(() => {
    console.log('Process terminated');
    process.exit(0);
  });
});
