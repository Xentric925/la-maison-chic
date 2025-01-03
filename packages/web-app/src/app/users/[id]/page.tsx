'use client';
import React from 'react';
import Image from 'next/image';

import SocialProfile from '@/components/shared/SocialProfile';
import ContactItem from '@/components/shared/ContactItem';
import { API_URL } from '@/lib/constants';
import useSWR from 'swr';
import { fetcher } from '@/lib/utils';
import profile from '../../../assets/icons/profile.svg';
import { useIsMobile } from '@/hooks/use-mobile';

type UserDetailsProps = {
  params: {
    id: string;
  };
};

const UserDetails = ({ params }: UserDetailsProps) => {
  const {
    data: user,
    error,
    isLoading,
  } = useSWR(`${API_URL}/users/${params.id}`, fetcher, {
    dedupingInterval: 60000 * 60, // Cache data for 60 minutes
    revalidateOnFocus: false, // Disable revalidation on focus
    revalidateOnReconnect: false, // Disable revalidation on reconnect
  });
  const isMobile = useIsMobile();
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching user</div>;
  //console.log(user?.profile);
  // Safely parse additionalInfo
  let additionalInfo = {
    social: {
      linkedin: '#',
    },
    bio: 'Hello I am using Eternals HR app',
  };
  try {
    additionalInfo = user?.profile?.additionalInfo
      ? JSON.parse(user.profile.additionalInfo)
      : {
          social: {
            linkedin: '#',
          },
          bio: 'Hello I am using Eternals HR app',
        };
  } catch (err) {
    console.error('Failed to parse additionalInfo:', err);
    additionalInfo = {
      social: {
        linkedin: '#',
      },
      bio: 'Hello I am using Eternals HR app',
    }; // Fallback to an empty object
  }
  return (
    <div className={isMobile ? 'space-y-4' : 'space-y-12'}>
      <div className='flex flex-col border bg-blue-500 text-white p-10'>
        <div className={isMobile ? 'ml-2' : 'ml-30'}>
          <h1 className='text-2xl'>{`${user?.firstName} ${user?.lastName}`}</h1>
          <h3>{user?.profile?.title}</h3>
        </div>
        <div
          className={`flex ${isMobile ? 'flex-col' : 'flex-row'} items-center absolute ${isMobile ? 'top-[1rem]' : 'top-[2.5rem]'} right-4`}
        >
          {!isMobile && (
            <SocialProfile linkedIn={additionalInfo?.social?.linkedin} />
          )}
          <Image
            src={profile.src}
            alt='profile'
            width={200}
            height={200}
            className='rounded-xl w-20 p-4'
          />
          {isMobile && (
            <SocialProfile linkedIn={additionalInfo?.social?.linkedin} />
          )}
        </div>
      </div>
      <div
        className={`p-4 ${isMobile ? 'flex flex-col gap-4' : ''} flex ${isMobile ? '' : 'space-x-4'}`}
      >
        <div
          className={`bg-white ${isMobile ? 'w-full' : 'w-1/2'} rounded-lg p-4 space-y-3 shadow-2xl`}
        >
          <h3 className='font-bold text-xl'>About</h3>
          <p className='text-wrap'>{additionalInfo?.bio}</p>
        </div>
        <div
          className={`bg-white ${isMobile ? 'w-full' : 'w-1/2'} rounded-lg p-4 shadow-2xl gap-2 flex flex-col`}
        >
          <h3 className='font-bold text-xl'>Contact</h3>
          <ContactItem
            imgSrc='mail'
            label='Email'
            value={user?.email}
            classes='invert'
          />
          <ContactItem
            imgSrc='phone'
            label='Mobile'
            value={user?.profile?.phoneNumber}
            classes='invert'
          />
          <ContactItem
            imgSrc='slack'
            label='Slack'
            value={`@${user?.firstName} ${user?.lastName}`}
          />
        </div>
        <div></div>
      </div>
    </div>
  );
};

export default UserDetails;
