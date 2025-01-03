'use client';

import React from 'react';
import useStore from '@/lib/store';
import ContactItem from '@/components/shared/ContactItem';

const UserProfile = () => {
  const { user } = useStore();

  return (
    <div className='space-y-24'>
      <div className='flex flex-col border bg-blue-500 text-white p-10'>
        <div className='ml-40'>
          <h1 className='text-2xl'>{`${user?.firstName} ${user?.lastName}`}</h1>
        </div>
      </div>
      <div className='p-4 flex space-x-4'>
        <div className='bg-white w-1/3 rounded-lg p-4 space-y-3 shadow-2xl'>
          <h3 className='font-bold text-xl'>Contact</h3>
          <ContactItem
            imgSrc='mail'
            label='Email'
            value={user?.email}
            classes='invert'
          />
        </div>
        <div></div>
      </div>
    </div>
  );
};

export default UserProfile;
