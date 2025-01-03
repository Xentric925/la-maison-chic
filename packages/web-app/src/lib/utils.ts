import axios from 'axios';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { API_URL } from '@/lib/constants';

export const GENERIC_ERROR_MESSAGE =
  'An error occurred. Please try again later.';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const fetcher = async (url: string) => {
  const response = await axios.get(url, {
    withCredentials: true,
  });
  return response.data;
};

export const getErrorMessage = (error: unknown) => {
  let errorMessage = undefined;

  if (axios.isAxiosError(error)) {
    errorMessage = error?.response?.data?.message;
  }

  errorMessage = errorMessage || GENERIC_ERROR_MESSAGE;
  return errorMessage;
};

export const validateTokenResponse = async (loginToken: string) => {
  const response = await axios.post(
    `${API_URL}/validate-token`,
    {
      loginToken: loginToken,
    },
    {
      withCredentials: true,
    },
  );
  return {
    status: response.status,
  };
};
