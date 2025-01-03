'use client';
import React, { useEffect, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import useSWR from 'swr';

import { useAuth } from '@/contexts/AuthContext';
import useStore from '@/lib/store';
import { fetcher } from '@/lib/utils';
import { clearCookie } from '@/lib/cookieUtils';
import { API_URL, urlDictionary } from '@/lib/constants';
import { AppSidebar } from '@/components/app-sidebar';
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';

import { ReactNode } from 'react';
import { Skeleton } from '../ui/skeleton';
import Spinner from '../ui/Spinner';
import { TriangleAlert } from 'lucide-react';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';
//import { TicketX, TriangleAlert } from 'lucide-react';

const SidebarNavigation = ({ children }: { children: ReactNode }) => {
  const { isLoggedIn } = useAuth();
  const { user, setUser, clearUser } = useStore();
  const router = useRouter();

  const {
    data: me,
    error,
    isLoading: isFetchLoading,
  } = useSWR(isLoggedIn ? `${API_URL}/users/me` : null, fetcher, {
    dedupingInterval: 60000 * 60, // Cache data for 60 minutes
    revalidateOnFocus: false, // Disable revalidation on focus
    revalidateOnReconnect: false, // Disable revalidation on reconnect
  });

  const isLoading = useMemo(() => {
    return isFetchLoading || !user;
  }, [isFetchLoading, user]);
  const pathname = usePathname();
  const { setIsLoggedIn } = useAuth();
  const { selectedPage, setSelectedPage } = useStore();

  useEffect(() => {
    if (me && user?.id !== me.id) {
      setUser({
        id: me.id,
        firstName: me.firstName,
        lastName: me.lastName,
        email: me.email,
        role: me.role,
        profileImage: me.profile?.profileImage || null,
        title: me.profile?.title || null,
      });
    }
  }, [me, setUser, user?.id]);

  useEffect(() => {
    if (pathname !== selectedPage) {
      // Check if pathname matches the '/users/[id]' pattern

      const userIdMatch = pathname.match(/^\/users\/[^/]+(\/manage)?$/);
      const locationIdMatch = pathname.match(/^\/locations\/[^/]+(\/manage)?$/);
      const departmentIdMatch = pathname.match(
        /^\/departments\/[^/]+(\/manage)?$/,
      );
      const teamsIdMatch = pathname.match(/^\/teams\/[^/]+(\/manage)?$/);
      const groupsIdMatch = pathname.match(/^\/groups\/[^/]+(\/manage)?$/);
      if (userIdMatch) {
        setSelectedPage('/users/id');
      } else {
        if (locationIdMatch) {
          setSelectedPage('/locations/id');
        } else {
          if (departmentIdMatch) {
            setSelectedPage('/departments/id');
          } else {
            if (teamsIdMatch) {
              setSelectedPage('/teams/id');
            } else {
              if (groupsIdMatch) {
                setSelectedPage('/groups/id');
              } else {
                setSelectedPage(pathname);
              }
            }
          }
        }
      }
    }
  }, [pathname, selectedPage, setSelectedPage]);

  if (isLoggedIn && error) {
    if (error.status === 401) {
      clearCookie('email');
      clearCookie('loggedIn');
      setIsLoggedIn(false);
      clearUser();
      console.log(error);
      router.push('/login');
    }
    return (
      <div className='justify-center align-center flex flex-col gap-10'>
        <TriangleAlert color='red' />
        <p>Something Went Wrong</p>
      </div>
    );
  }
  if (pathname.startsWith('/login')) {
    return <div className='pt-8'>{children}</div>;
  }

  return (
    <SidebarProvider>
      {/* Sidebar */}
      <AppSidebar isLoading={isLoading} props={{}} />

      {/* Content Area */}
      <SidebarInset className='flex-1 flex flex-col overflow-hidden'>
        {/* Header */}
        <header className='flex h-16 items-center px-4 border-b bg-white shadow'>
          <SidebarTrigger className='-ml-1' />
          <Separator orientation='vertical' className='mx-4 h-4' />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className='hidden md:block'>
                {!isLoading ? (
                  <BreadcrumbLink
                    href={
                      urlDictionary[selectedPage]
                        ? urlDictionary[selectedPage].parentUrl
                        : '/'
                    }
                  >
                    {urlDictionary[selectedPage]
                      ? urlDictionary[selectedPage].parentTitle
                      : 'Dashboard'}
                  </BreadcrumbLink>
                ) : (
                  <Skeleton className='h-[20px] w-[112px]' />
                )}
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {!isLoading ? (
                  <BreadcrumbPage>
                    {urlDictionary[selectedPage]
                      ? urlDictionary[selectedPage].title
                      : 'General'}
                  </BreadcrumbPage>
                ) : (
                  <Skeleton className='h-[20px] w-[40px]' />
                )}
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        {/* Main Content */}
        <main className='flex-1 px-4 py-2'>
          <div className='h-full w-full bg-muted rounded-lg p-1'>
            <ScrollArea
              className='w-full h-full'
              isNested={true}
              childClass='p-3'
            >
              <div
                className={`flex flex-col gap-1 whitespace-nowrap h-[84vh] w-full`}
              >
                {!isLoading ? children : <Spinner />}
              </div>
              <ScrollBar orientation='vertical' />
            </ScrollArea>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};
export default SidebarNavigation;
