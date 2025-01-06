'use client';

import useSWR from 'swr';
import Link from 'next/link';
import { API_URL } from '@/lib/constants';
import { fetcher } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Edit } from 'lucide-react';
import useStore from '@/lib/store';
import UserCard from '@/components/shared/UserCard';

type GroupMember = {
  userId: number;
  user: {
    username: string;
    email: string;
    profile?: {
      profilePicture?: string;
      title?: string;
    };
    details: {
      firstName: string;
      lastName: string;
    };
  };
};

type Group = {
  id: number;
  name: string;
  description: string;
  groupUsers: GroupMember[];
};

const GroupDetailsPage = ({ params: { id } }: { params: { id: string } }) => {
  const { user } = useStore();

  const {
    data: group,
    error,
    isLoading,
  } = useSWR<Group>(`${API_URL}/groups/${id}`, fetcher, {
    dedupingInterval: 60000 * 10,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  //console.log(group);

  if (isLoading)
    return (
      <div className='grid gap-4'>
        <Skeleton className='w-full h-24 rounded-lg bg-gray-200' />
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton
            key={index}
            className='w-full h-16 rounded-lg bg-gray-200'
          />
        ))}
      </div>
    );

  if (error)
    return (
      <div className='text-center text-red-500'>
        <p>Error fetching group details. Please try again later.</p>
      </div>
    );

  if (!group)
    return (
      <div className='text-center text-gray-600'>
        <p>Group not found</p>
      </div>
    );

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between bg-white border rounded-lg p-4'>
        <div>
          <h1 className='text-2xl font-bold'>{group.name}</h1>
          <p className='text-sm text-gray-600 text-wrap'>{group.description}</p>
        </div>
        {user?.role === 'ADMIN' && (
          <Link
            href={`/groups/${group.id}/manage`}
            className='flex items-center'
          >
            <Edit className='w-6 h-6 text-blue-500' />
            <span className='text-blue-500 ml-2'>Edit Group</span>
          </Link>
        )}
      </div>
      <div className='bg-white border rounded-lg p-4'>
        <h2 className='text-xl font-semibold mb-4'>Group Members</h2>
        {group.groupUsers.length > 0 ? (
          <div className='grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4'>
            {group.groupUsers.map((member) => (
              <Link
                href={`/users/${member.userId}`}
                key={member.userId}
                className='hover:shadow-lg p-4 rounded-lg'
              >
                <UserCard
                  id={member.userId}
                  firstName={member.user.details.firstName}
                  lastName={member.user.details.lastName}
                  email={member.user.email}
                  profile={{
                    title: member.user.profile?.title || '',
                    profileImage: member.user.profile?.profilePicture || '',
                  }}
                />
              </Link>
            ))}
          </div>
        ) : (
          <p className='text-gray-600'>No members found in this group.</p>
        )}
      </div>
    </div>
  );
};

export default GroupDetailsPage;
