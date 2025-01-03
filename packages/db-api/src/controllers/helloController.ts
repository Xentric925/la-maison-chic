import { Request, Response } from 'express';

export const hello = async (_req: Request, res: Response) => {
  const response = {
    message: 'Hello from the DB API',
  };
  res.json(response);
};
