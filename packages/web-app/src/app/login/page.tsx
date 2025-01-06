'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/button';
import { API_URL } from '@/lib/constants';
import axios from 'axios';
import Link from 'next/link';
import { GENERIC_ERROR_MESSAGE, getErrorMessage } from '@/lib/utils';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError(null);
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });

      if (response.status === 200) {
        setMessage(response.data.message);
        setError(null);
      } else {
        setError(GENERIC_ERROR_MESSAGE);
      }
    } catch (error) {
      setError(getErrorMessage(error));
    }
  };

  // adapted from: https://ui.shadcn.com/examples/authentication
  return (
    <>
      <div className='container relative h-[300px] md:h-[600px] flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 px-0'>
        <div className='relative h-full flex-col bg-muted p-10 text-white dark:border-r flex'>
          <div className='absolute inset-0 bg-zinc-900' />
          <div className='relative z-20 flex items-center text-lg font-medium'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
              className='mr-2 h-6 w-6'
            >
              <path d='M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3' />
            </svg>
            La Maison Chic
          </div>
          <div className='relative z-20 mt-auto'>
            <blockquote className='space-y-2'>
              <p className='text-lg'>
                your first choice for quality antique furniture and home
                accessories
              </p>
              <footer className='text-sm'>Steve Jobs, CEO</footer>
            </blockquote>
          </div>
        </div>
        <div className='p-8'>
          <div className='mx-auto flex w-full flex-col justify-center space-y-6 w-[350px]'>
            <div className='flex flex-col space-y-2 text-center'>
              <h1 className='text-2xl font-semibold tracking-tight'>Sign In</h1>
            </div>
            <form onSubmit={handleLogin} className='flex flex-col space-y-4'>
              <div className='flex flex-col'>
                <label htmlFor='email' className='text-sm'>
                  Email
                </label>
                <Input
                  id='email'
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className='p-2 rounded-md'
                  required
                />
                <label htmlFor='password' className='text-sm'>
                  Password
                </label>
                <Input
                  id='password'
                  type='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className='p-2 rounded-md'
                  required
                />
              </div>
              <Button type='submit' disabled={!email || !password}>
                Submit
              </Button>
            </form>
            <p className='px-8 text-center text-sm text-muted-foreground'>
              By clicking continue, you agree to our{' '}
              <Link
                href='/terms'
                className='underline underline-offset-4 hover:text-primary'
              >
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link
                href='/privacy'
                className='underline underline-offset-4 hover:text-primary'
              >
                Privacy Policy
              </Link>
              .
            </p>
            {message && <p className='mt-4'>{message}</p>}
            {error && <p className='mt-4 text-red-600'>{error}</p>}
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
