'use client';

import useSWR from 'swr';
import Link from 'next/link';
import { API_URL } from '@/lib/constants';
import { fetcher } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Edit } from 'lucide-react';
import useStore from '@/lib/store';
import UserCard from '@/components/shared/UserCard';

type TeamMember = {
  userId: number;
  user: {
    firstName: string;
    lastName: string;
    email: string;
    profile?: {
      profilePicture?: string;
      title?: string;
    };
  };
};

type Team = {
  id: number;
  name: string;
  description: string;
  teamUsers: TeamMember[];
};

const TeamDetailsPage = ({ params: { id } }: { params: { id: string } }) => {
  const { user } = useStore();

  const {
    data: team,
    error,
    isLoading,
  } = useSWR<Team>(`${API_URL}/teams/${id}`, fetcher, {
    dedupingInterval: 60000 * 10,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  //console.log(team);

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
        <p>Error fetching team details. Please try again later.</p>
      </div>
    );

  if (!team)
    return (
      <div className='text-center text-gray-600'>
        <p>Team not found</p>
      </div>
    );

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between bg-white border rounded-lg p-4'>
        <div>
          <h1 className='text-2xl font-bold'>{team.name}</h1>
          <p className='text-sm text-gray-600 text-wrap'>{team.description}</p>
        </div>
        {user?.role === 'ADMIN' && (
          <Link href={`/teams/${team.id}/manage`} className='flex items-center'>
            <Edit className='w-6 h-6 text-blue-500' />
            <span className='text-blue-500 ml-2'>Edit Team</span>
          </Link>
        )}
      </div>
      <div className='bg-white border rounded-lg p-4'>
        <h2 className='text-xl font-semibold mb-4'>Team Members</h2>
        {team.teamUsers.length > 0 ? (
          <div className='grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4'>
            {team.teamUsers.map((member) => (
              <Link
                href={`/users/${member.userId}`}
                key={member.userId}
                className='hover:shadow-lg p-4 rounded-lg'
              >
                <UserCard
                  id={member.userId}
                  firstName={member.user.firstName}
                  lastName={member.user.lastName}
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
          <p className='text-gray-600'>No members found in this team.</p>
        )}
      </div>
    </div>
  );
};

export default TeamDetailsPage;
