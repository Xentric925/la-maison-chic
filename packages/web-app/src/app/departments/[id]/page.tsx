'use client';

import React from 'react';
import useSWR from 'swr';
import { API_URL } from '@/lib/constants';
import { fetcher } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

type DepartmentDetailsProps = {
  params: {
    id: string;
  };
};

const DepartmentDetails = ({ params }: DepartmentDetailsProps) => {
  const {
    data: department,
    error,
    isLoading,
  } = useSWR(`${API_URL}/departments/${params.id}`, fetcher, {
    dedupingInterval: 60000 * 60, // Cache data for 60 minutes
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  const isMobile = useIsMobile();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching department details</div>;

  return (
    <div className={isMobile ? 'space-y-4' : 'space-y-12'}>
      <div className='flex flex-col border bg-indigo-500 text-white p-10'>
        <div className={isMobile ? 'ml-2' : 'ml-30'}>
          <h1 className='text-2xl'>{department?.name}</h1>
        </div>
      </div>
      <div
        className={`p-4 ${isMobile ? 'flex flex-col gap-4' : ''} flex ${isMobile ? '' : 'space-x-4'}`}
      >
        <div
          className={`bg-white ${isMobile ? 'w-full' : 'w-1/2'} rounded-lg p-4 space-y-3 shadow-2xl`}
        >
          <h3 className='font-bold text-xl'>Description</h3>
          <p className='text-wrap'>{department?.description}</p>
        </div>
        <div
          className={`bg-white ${isMobile ? 'w-full' : 'w-1/2'} rounded-lg p-4 shadow-2xl gap-2 flex flex-col`}
        >
          <h3 className='font-bold text-xl'>Additional Information</h3>
          <p>
            <strong>Created At:</strong>{' '}
            {new Date(department?.createdAt).toLocaleDateString()}
          </p>
          <p>
            <strong>Location</strong>{' '}
            {department?.location?.name || 'Not assigned'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DepartmentDetails;
