'use client';

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { useMemo } from 'react';
import { Skeleton } from './ui/skeleton';
import { clearCookie } from '@/lib/cookieUtils';
import axios from 'axios';
import { API_URL } from '@/lib/constants';
import useStore from '@/lib/store';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export function NavUser({
  user,
  isLoading,
}: {
  user: {
    name: string;
    email: string;
    avatar: string | null;
  };
  isLoading: boolean;
}) {
  const { isMobile } = useSidebar();
  const fullName = useMemo(() => user.name.split(' '), [user]);
  const initials = useMemo(
    () => (fullName[0][0] + fullName[fullName.length - 1][0]).toUpperCase(),
    [fullName],
  );
  const { clearUser } = useStore();
  const router = useRouter();
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
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
            >
              {!isLoading ? (
                <Avatar className='h-8 w-8 rounded-lg'>
                  {user.avatar && (
                    <AvatarImage src={user.avatar} alt={user.name} />
                  )}
                  <AvatarFallback className='rounded-lg'>
                    {initials}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <Skeleton className='h-8 w-8 rounded-lg' />
              )}
              <div className='grid flex-1 text-left text-sm leading-tight'>
                {!isLoading ? (
                  <>
                    <span className='truncate font-semibold'>{user.name}</span>
                    <span className='truncate text-xs'>{user.email}</span>
                  </>
                ) : (
                  <>
                    <Skeleton className='h-[16px] w-[120px]' />
                    <div className='h-[2px]' />
                    <Skeleton className='h-[14px] w-[150px]' />
                  </>
                )}
              </div>
              <ChevronsUpDown className='ml-auto size-4' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
            side={isMobile ? 'bottom' : 'right'}
            align='end'
            sideOffset={4}
          >
            <DropdownMenuLabel className='p-0 font-normal'>
              <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
                <Avatar className='h-8 w-8 rounded-lg'>
                  {user.avatar && (
                    <AvatarImage src={user.avatar} alt={user.name} />
                  )}
                  <AvatarFallback className='rounded-lg'>
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-semibold'>{user.name}</span>
                  <span className='truncate text-xs'>{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Sparkles />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheck />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
