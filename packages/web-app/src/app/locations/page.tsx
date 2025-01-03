'use client';

import useSWR from 'swr';
import Link from 'next/link';

import { API_URL } from '@/lib/constants';
import { fetcher } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import PaginationComponent from '@/components/shared/Pagination';
import useStore from '@/lib/store';
import { Edit, PlusCircle } from 'lucide-react';

type Location = {
  id: number;
  name: string;
  country: string;
  city: string;
  address: string;
};

const LocationsPage = () => {
  const currentPage = 1; // Default to page 1; adjust as needed

  const {
    data: locations,
    error,
    isLoading,
  } = useSWR(`${API_URL}/locations?page=${currentPage - 1}&limit=10`, fetcher, {
    dedupingInterval: 60000 * 10,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  const { user } = useStore();

  if (isLoading)
    return (
      <div className='grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        {Array.from({ length: 10 }).map((_, index) => (
          <Skeleton
            key={index}
            className='w-full h-32 rounded-lg bg-gray-200'
          />
        ))}
      </div>
    );

  if (error)
    return (
      <div className='text-center text-red-500'>
        <p>Error fetching locations. Please try again later.</p>
      </div>
    );

  return (
    <>
      {user?.role === 'ADMIN' && (
        <div className='flex flec-row gap-1 fixed top-5 right-6 z-50'>
          <Link href='/locations/create' className='flex items-center'>
            <PlusCircle color='blue' />
          </Link>
        </div>
      )}
      <div className='flex flex-col h-full items-center justify-between'>
        {locations?.data?.length > 0 ? (
          <div className='grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
            {locations.data.map((location: Location) => (
              <div
                key={location.id}
                className='relative bg-white border rounded-lg p-4 hover:shadow-lg'
              >
                {user?.role === 'ADMIN' && (
                  <Link
                    href={`/locations/${location.id}/manage`}
                    className='absolute top-2 right-2'
                  >
                    <Edit className='w-6 h-6 text-blue-500 truncate' />
                  </Link>
                )}
                <h2 className='text-lg font-semibold truncate'>
                  {location.name}
                </h2>
                <p className='text-sm text-gray-600'>
                  {location.city}, {location.country}
                </p>
                <p className='text-sm text-gray-500 truncate'>
                  {location.address}
                </p>
                <Link
                  href={`/locations/${location.id}`}
                  className='text-blue-500 text-sm underline mt-2 block'
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className='text-center text-gray-600'>
            <p>No locations found</p>
          </div>
        )}
        <PaginationComponent
          page={currentPage}
          totalPages={locations?.next ? currentPage + 1 : currentPage}
          baseUrl={`/locations`}
        />
      </div>
    </>
  );
};

export default LocationsPage;
