import React from 'react';
import Image from 'next/image';
import profileIcon from '../../assets/icons/profile.svg';
import { useIsMobile } from '@/hooks/use-mobile';

type UserProfileProps = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  profile: {
    title: string;
    profileImage: string;
  };
};

const UserProfile: React.FC<UserProfileProps> = ({
  firstName,
  lastName,
  email,
  profile,
}) => {
  const isMobile = useIsMobile();
  return (
    <div className='inline-flex flex-col items-center justify-center p-2 hover:shadow-lg rounded-xl space-y-3 min-w-[170px] md:w-48'>
      <Image
        src={profile?.profileImage || profileIcon.src}
        alt='profile'
        width={isMobile ? 14 : 20}
        height={isMobile ? 14 : 20}
        className='rounded-full xl:min-w-44 min-w-36 xl:min-h-44 min-h-36 p-6 opacity-50'
        priority
      />
      <div className='flex flex-col max-w-36 xl:max-w-full'>
        <strong className='truncate'>{`${firstName} ${lastName}`}</strong>
        <span className='text-gray-500 text-sm truncate'>
          {profile?.title || 'No Title'}
        </span>
        <span className='text-gray-500 text-sm truncate'>{email}</span>
      </div>
    </div>
  );
};

export default UserProfile;
