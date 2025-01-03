'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

import UserProfile from '@/components/shared/UserProfile';
import { API_URL } from '@/lib/constants';
import useSWR from 'swr';
import { fetcher } from '@/lib/utils';
import PaginationComponent from '@/components/shared/Pagination';
import { useSearchParams } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { useSidebar } from '@/components/ui/sidebar';
import useStore from '@/lib/store';
import { Edit, PlusCircle } from 'lucide-react';
import { Input } from '@/components/ui/Input';

type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  profile: {
    title: string;
    profileImage: string;
  };
};

const Page = () => {
  const searchParams = useSearchParams();
  const page = searchParams.get('page') || '1';
  const currentPage = parseInt(page as string, 10);
  const { open: isSidebarOpen } = useSidebar();
  const { user: currentUser } = useStore();

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [lastSuccessfulSearch, setLastSuccessfulSearch] = useState('');
  const [noResults, setNoResults] = useState(false);

  // Debounce the search term to reduce API calls
  useEffect(() => {
    const handler = setTimeout(() => {
      if (noResults && debouncedSearch.startsWith(lastSuccessfulSearch)) {
        // Skip fetch when no results and user is typing further from last failed search
        return;
      }
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, lastSuccessfulSearch, noResults]);

  const {
    data: users,
    error,
    isLoading,
  } = useSWR(
    debouncedSearch || !noResults
      ? `${API_URL}/users?page=${currentPage - 1}&limit=10&search=${debouncedSearch}`
      : null,
    fetcher,
    {
      dedupingInterval: 60000 * 10,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      onSuccess: (data) => {
        if (data.data.length === 0) {
          setNoResults(true);
        } else {
          setNoResults(false);
          setLastSuccessfulSearch(search);
        }
      },
    },
  );

  const getGridCols = () => {
    if (isSidebarOpen) {
      return 'grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5';
    }
    return 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6';
  };

  if (error)
    return (
      <div className='p-4 flex flex-col items-center justify-center text-center'>
        <h1 className='text-xl font-semibold text-red-500'>Error</h1>
        <p className='text-gray-600'>
          Failed to fetch users. Please try again later.
        </p>
      </div>
    );

  const totalPages = users?.next ? currentPage + 1 : currentPage;

  return (
    <>
      <div className='flex flec-row gap-1 fixed top-3 right-6 z-50'>
        {currentUser?.role === 'ADMIN' && (
          <Link href='/users/create' className='flex items-center'>
            <PlusCircle color='blue' />
          </Link>
        )}
        <Input
          type='search'
          placeholder='Search users'
          className='w-40 xl:w-60'
          value={search}
          onChange={(e) => {
            const newSearch = e.target.value;
            if (newSearch.length < search.length) {
              // User deleted characters, allow fetching again
              setNoResults(false);
            }
            setSearch(newSearch);
          }}
        />
      </div>
      {isLoading ? (
        <div className='flex flex-col h-full items-center justify-between'>
          <div className={`grid gap-4 ${getGridCols()} justify-center`}>
            {Array.from({ length: 10 }).map((_, index) => (
              <Skeleton
                key={index}
                className='w-[192px] h-[236px] rounded-lg bg-slate-50 border border-stone-200'
              />
            ))}
          </div>
        </div>
      ) : (
        <div className='flex flex-col h-full items-center justify-between'>
          <div className={`grid gap-4 ${getGridCols()} justify-center`}>
            {users?.data?.length > 0 ? (
              users.data.map((user: User) => (
                <div key={user.id} className='relative'>
                  {currentUser?.role === 'ADMIN' && (
                    <Link
                      href={`/users/${user.id}/manage`}
                      className='absolute top-2 right-2'
                    >
                      <Edit className='w-6 h-6 text-blue-500' />
                    </Link>
                  )}

                  <Link
                    href={`/users/${user.id}`}
                    className='flex flex-col justify-center items-center'
                  >
                    <UserProfile {...user} />
                  </Link>
                </div>
              ))
            ) : (
              <div className='col-span-full p-4 flex flex-col items-center justify-center text-center'>
                <h1 className='text-xl font-semibold text-red-500'>
                  No Users Found
                </h1>
                <p className='text-gray-600'>
                  No users found with the search term &apos;{search}&apos;
                </p>
              </div>
            )}
          </div>
          <PaginationComponent
            page={currentPage}
            totalPages={totalPages}
            baseUrl={`/users?search=${debouncedSearch}`}
            noQuestionMark
          />
        </div>
      )}
    </>
  );
};

export default Page;
