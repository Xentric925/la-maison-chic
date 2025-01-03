'use client';

import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import { Card, CardTitle } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/skeleton';
import { API_URL } from '@/lib/constants';
import { fetcher } from '@/lib/utils';

interface CountCardProps {
  title: string;
  link: string;
  className?: string;
}

const CountCard: React.FC<CountCardProps> = ({ title, link, className }) => {
  const { data, isLoading, error } = useSWR(
    `${API_URL}/${link}/count`,
    fetcher,
    {
      dedupingInterval: 60000 * 60, // Cache data for 60 minutes
      revalidateOnFocus: false, // Disable revalidation on focus
      revalidateOnReconnect: false, // Disable revalidation on reconnect
    },
  );

  const [displayedCount, setDisplayedCount] = useState<number>(0);
  const targetCount = data?.count || 0;

  // Animation for the count
  useEffect(() => {
    //console.log(data);
    if (!isLoading && targetCount) {
      let current = 0;
      const increment = Math.ceil(targetCount / 50); // Adjust speed by dividing total steps

      const interval = setInterval(() => {
        current += increment;
        if (current >= targetCount) {
          setDisplayedCount(targetCount);
          clearInterval(interval);
        } else {
          setDisplayedCount(current);
        }
      }, 20); // 20ms interval for smoother animation

      return () => clearInterval(interval); // Cleanup on unmount
    }
  }, [isLoading, targetCount]);

  return (
    <Card
      className={`p-4 flex flex-col items-center justify-center bg-white shadow-md rounded-lg ${className}`}
    >
      <CardTitle className='text-lg font-medium text-gray-700'>
        {title}
      </CardTitle>
      {isLoading ? (
        <Skeleton className='w-[50px] h-[50px] rounded-full mb-4' />
      ) : (
        <div className='text-3xl font-bold text-gray-700'>{displayedCount}</div>
      )}
      {error && (
        <p className='text-sm text-red-500 mt-2'>Failed to load count</p>
      )}
    </Card>
  );
};

export default CountCard;
