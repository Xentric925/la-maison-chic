'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { setCookie } from '@/lib/cookieUtils';
import { API_URL } from '@/lib/constants';
import { useAuth } from '@/contexts/AuthContext';
import useStore from '@/lib/store';
import { fetcher, validateTokenResponse } from '@/lib/utils';
import { ToastAction } from '@/components/ui/toast';
import { useToast } from '@/hooks/use-toast';
import { Card, CardTitle } from '@/components/ui/Card';
import Spinner from '@/components/ui/Spinner';
import { CircleCheck, CircleSlash } from 'lucide-react';
import useSWR from 'swr';

type PageProps = {
  params: {
    id: string;
  };
};

const Page = ({ params }: PageProps) => {
  const router = useRouter();
  const { setIsLoggedIn } = useAuth();
  const { setUser } = useStore();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);

  const {
    data,
    isValidating,
    error: swrError,
  } = useSWR(`${API_URL}/validate-token`, () =>
    validateTokenResponse(params.id),
  );

  useEffect(() => {
    if (!isValidating && !swrError && data?.status === 200) {
      setCookie('loggedIn', '1');
      setIsLoggedIn(true);

      (async () => {
        const {
          data: id,
          firstName,
          lastName,
          email,
          role,
          profile,
        } = await fetcher(`${API_URL}/users/me`);

        setUser({
          id,
          firstName,
          lastName,
          email,
          role,
          profileImage: profile?.profileImage || null,
          title: profile?.title || null,
        });

        setTimeout(() => router.push('/'), 2000);
      })();
    } else if (!isValidating && (swrError || data?.status !== 200)) {
      setError('An unexpected error occurred.');
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your request.',
        action: (
          <ToastAction
            altText='Try again'
            onClick={() => router.push('/login')}
          >
            Try again
          </ToastAction>
        ),
      });
      setTimeout(() => router.push('/login'), 1000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isValidating, data, swrError]);

  const getStatusStyles = () => {
    if (isValidating) return 'border-blue-500 text-blue-500';
    if (error) return 'border-red-500 text-red-500';
    return 'border-green-500 text-green-500';
  };

  return (
    <div className='flex justify-center items-center h-screen'>
      <Card
        className={`w-[90%] max-w-md h-[50vh] flex flex-col items-center justify-center p-6 border-4 ${getStatusStyles()}`}
        aria-live='polite'
      >
        <CardTitle
          className={`flex flex-col items-center gap-4 text-lg font-semibold ${getStatusStyles()}`}
        >
          {isValidating ? (
            <>
              <Spinner className='w-[48px] h-[48px]' />
              <span>Validating Your Request</span>
            </>
          ) : error ? (
            <>
              <CircleSlash className='w-[48px] h-[48px]' />
              <span>{error}</span>
            </>
          ) : (
            <>
              <CircleCheck className='w-[48px] h-[48px]' />
              <span>Login Successful</span>
            </>
          )}
        </CardTitle>
      </Card>
    </div>
  );
};

export default Page;
