import { Response } from 'express';
//import redis from './redis';

export const handle500Response = (
  res: Response,
  error: unknown,
  message: string,
  source: string,
  reqBodyJson?: string,
) => {
  const errorMessage =
    error instanceof Error && error?.message ? error.message : message;
  // TODO: log to a service
  console.log(
    `Error in ${source}: ${errorMessage} - Request Body: ${reqBodyJson}`,
  );
  res.status(500).json({ message: errorMessage });
};

/* // Clear org hierarchy cache
export const clearCache = async () => {
  const cacheKey = 'org-hierarchy';
  await redis.del(cacheKey); // Delete the cached org hierarchy data
};
 */
