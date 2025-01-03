'use client';

import useSWR from 'swr';
import Link from 'next/link';
import { API_URL } from '@/lib/constants';
import { fetcher } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import PaginationComponent from '@/components/shared/Pagination';
import { Edit, PlusCircle } from 'lucide-react';
import useStore from '@/lib/store';

type Team = {
  id: number;
  name: string;
  description: string;
};

const TeamsPage = () => {
  const currentPage = 1; // Default to page 1; adjust as needed
  const { user } = useStore();

  const {
    data: teams,
    error,
    isLoading,
  } = useSWR(`${API_URL}/teams?page=${currentPage - 1}&limit=10`, fetcher, {
    dedupingInterval: 60000 * 10,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  if (isLoading)
    return (
      <div className='grid gap-4 grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3'>
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
        <p>Error fetching teams. Please try again later.</p>
      </div>
    );

  return (
    <>
      {user?.role === 'ADMIN' && (
        <div className='flex flex-row gap-2 fixed top-5 right-6 z-50'>
          <Link href='/teams/create' className='flex items-center'>
            <PlusCircle color='blue' />
          </Link>
        </div>
      )}
      <div className='flex flex-col h-full items-center justify-between'>
        {teams?.data?.length > 0 ? (
          <div className='grid gap-4 grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3'>
            {teams.data.map((team: Team) => (
              <div
                key={team.id}
                className='relative bg-white border rounded-lg p-4 hover:shadow-lg'
              >
                {user?.role === 'ADMIN' && (
                  <Link
                    href={`/teams/${team.id}/manage`}
                    className='absolute top-2 right-2'
                  >
                    <Edit className='w-6 h-6 text-blue-500 truncate' />
                  </Link>
                )}
                <h2 className='text-lg font-semibold truncate'>{team.name}</h2>
                <p className='text-sm text-gray-600 text-wrap'>
                  {team.description}
                </p>
                <Link
                  href={`/teams/${team.id}`}
                  className='text-blue-500 text-sm underline mt-2 block'
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className='text-center text-gray-600'>
            <p>No teams found</p>
          </div>
        )}
        <PaginationComponent
          page={currentPage}
          totalPages={teams?.next ? currentPage + 1 : currentPage}
          baseUrl={`/teams`}
        />
      </div>
    </>
  );
};

export default TeamsPage;
