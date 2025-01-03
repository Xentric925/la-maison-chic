'use client';

import CountCard from '@/components/shared/CountCards';
import DashboardCard from '@/components/shared/DashboardCard';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import BarChart from '@/components/shared/BarChart';
import {
  Building,
  Calculator,
  Calendar,
  ChartPie,
  CreditCard,
  Group,
  MapPin,
  Network,
  ServerCog,
  ToggleLeft,
  User,
  Users,
} from 'lucide-react';
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

const page = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const isMobile = useIsMobile();
  return (
    <div
      className={`${isMobile ? 'p-0' : 'p-4'} flex flex-col gap-1 whitespace-nowrap`}
    >
      {/* Horizontal Scrollable Area */}
      <ScrollArea
        className={`${isMobile ? 'min-h-[16vh]' : 'min-h-[20vh]'} whitespace-nowrap rounded-md overflow-y-hidden`}
      >
        <div
          className={`${isMobile ? 'min-h-[16vh]' : 'min-h-[20vh]'} flex w-max space-x-4 pb-4 w-[1vw]`}
        >
          <DashboardCard icon={User} title='Users' href='/users' />
          <DashboardCard
            icon={Building}
            title='Departments'
            href='/departments'
          />
          <DashboardCard icon={MapPin} title='Locations' href='/locations' />
          <DashboardCard icon={Group} title='Teams' href='/teams' />
          <DashboardCard icon={Users} title='Groups' href='/groups' />
          <DashboardCard icon={Calendar} title='Events' href='/events' />
          <DashboardCard icon={ChartPie} title='Reports' href='/reports' />
          <DashboardCard icon={CreditCard} title='Payroll' href='/payroll' />
          <DashboardCard
            icon={Calculator}
            title='Transactions'
            href='/transactions'
          />
        </div>
        <ScrollBar orientation='horizontal' />
      </ScrollArea>
      <div className='flex flex-col gap-6'>
        {/* Count Cards Grid */}
        <div
          className={`${isMobile ? 'px-3 grid-cols-2 grid-flow-row' : 'px-7 grid-cols-3'} grid gap-4`}
        >
          <CountCard
            title='Users'
            link='users'
            className={`${isMobile ? 'col-span-2' : ''}`}
          />
          <CountCard title='Departments' link='departments' />
          <CountCard title='Teams' link='teams' />
        </div>
        <div
          className={`${isMobile ? 'px-6 grid-cols-1 grid-flow-row' : 'px-10 grid-cols-2'} grid gap-4`}
        >
          <CountCard title='Groups' link='groups' />
          <CountCard title='Upcoming Events' link='dayoffs' />
        </div>
        <div
          className={`relative grid ${isMobile ? 'grid-cols-4' : 'grid-cols-3'} grid-flow-row gap-4`}
        >
          <BarChart
            className={`${isMobile ? 'col-span-4' : 'col-span-3'} xl:col-span-2 row-span-3`}
          />
          <DashboardCard
            icon={ServerCog}
            title='Company Settings'
            href='/company/settings'
            className={isMobile ? 'col-span-2' : ''}
          />
          <DashboardCard
            icon={Network}
            title='Hierarchy'
            href='/tree'
            className={isMobile ? 'col-span-2' : ''}
          />
          <DashboardCard
            icon={ToggleLeft}
            title='Features'
            href='/features'
            className={isMobile ? 'col-span-4 m-x-5' : ''}
          />
        </div>
        {/* Ideas Section */}
        {/* <b>Ideas</b>
        <p>- Manage employees</p>
        <p>- Manage locations, departments, teams, groups</p>
        <p>- Company settings</p>
        <p>- Holidays, logo, statuses..</p> */}
      </div>
    </div>
  );
};

export default page;
