'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { clearCookie } from '@/lib/cookieUtils';
import { useAuth } from '../contexts/AuthContext';
import { API_URL } from '@/lib/constants';
import axios from 'axios';
import useStore from '@/lib/store';
import Link from 'next/link';
import LogoutButton from '@/components/shared/LogoutButton';

const Home = () => {
  const router = useRouter();
  const { clearUser } = useStore();
  const { setIsLoggedIn } = useAuth();

  const logout = async () => {
    const response = await axios.post(
      `${API_URL}/logout`,
      {},
      {
        withCredentials: true,
      },
    );

    if (response.status === 200) {
      clearCookie('email');
      clearCookie('loggedIn');
      setIsLoggedIn(false);
      clearUser();
      router.push('/login');
    } else {
      // TODO: Handle error, inform the user
      console.error('Failed to logout');
    }
  };

  return (
    <div className='p-8'>
      <b>Ideas</b>
      <p>
        - Users component with a link to{' '}
        <Link href={'/users'} className='text-orange-600'>
          Users
        </Link>{' '}
        page
      </p>
      <p>- Todos component with a link to Todos page</p>
      <p>- Shortcuts component, like add a status, edit profile...</p>
      <p>- Company Latest news</p>
      <p>- Upcoming events</p>
      <p>- Employee Statuses for today and next few days</p>
      <p>- My statuses for the whole year</p>
      <p>- Locations, Teams, Groups, Departments with links to those pages</p>
      <div className='mt-5 text-orange-600'>
        <LogoutButton logout={logout} />
      </div>
    </div>
  );
};

export default Home;
