import React, { useMemo } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';

type UserProps = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  profile: {
    title: string;
    profileImage: string;
  };
};

const UserCard: React.FC<UserProps> = ({
  firstName,
  lastName,
  email,
  profile,
}) => {
  const fullName = useMemo(
    () => (firstName + ' ' + lastName).split(' '),
    [firstName, lastName],
  );
  const initials = useMemo(
    () => (fullName[0][0] + fullName[fullName.length - 1][0]).toUpperCase(),
    [fullName],
  );
  return (
    <div className='inline-flex items-center space-x-4'>
      <Avatar>
        {profile && profile.profileImage && (
          <AvatarImage src={profile.profileImage} />
        )}
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <div className='flex flex-col'>
        <strong>{firstName + ' ' + lastName}</strong>
        <span className='text-gray-500 text-sm'>{email}</span>
      </div>
    </div>
  );
};

export default UserCard;
