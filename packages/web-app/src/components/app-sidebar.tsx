'use client';

import * as React from 'react';
import {
  BookOpen,
  Calendar,
  ChartLine,
  Command,
  /* Frame, */
  Gamepad,
  GitCompare,
  Group,
  HardDrive,
  Hash,
  LayoutDashboard,
  ListStart,
  ListStartIcon,
  LucideVideotape,
  /* Map, */
  Paperclip,
  PersonStanding,
  PieChart,
  ServerCog,
  Settings,
  Settings2,
} from 'lucide-react';
import Image from 'next/image';
import Avatar from '@/assets/icons/avatar.svg';
import { NavMain } from '@/components/nav-main';
/* import { NavProjects } from '@/components/nav-projects'; */
import { NavUser } from '@/components/nav-user';
import { TeamSwitcher } from '@/components/team-switcher';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';
import useStore from '@/lib/store';
import useSWR from 'swr';
import { fetcher } from '@/lib/utils';
import { API_URL, urlDictionary } from '@/lib/constants';

export function AppSidebar({
  isLoading,
  ...props
}: {
  isLoading: boolean;
  props: React.ComponentProps<typeof Sidebar>;
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [teams, setTeams] = React.useState<any[]>([]);
  const { user, selectedPage } = useStore();
  const { data: teamData } = useSWR(
    user ? `${API_URL}/users/${user?.id}/teams` : null,
    fetcher,
    /* {
      dedupingInterval: 60000 * 60, // Cache data for 30 minutes
      revalidateOnFocus: false, // Disable revalidation on focus
      revalidateOnReconnect: false, // Disable revalidation on reconnect
    }, */
  );
  React.useEffect(() => {
    if (teamData) {
      //console.log('teamData:', teamData);
      setTeams(() => {
        return [
          {
            id: -1,
            name: 'Personal',
            logo: () => (
              <Image
                src={user?.profileImage || Avatar.src}
                alt='Profile Picture'
                className='rounded-full w-8 h-8'
                width={8}
                height={8}
              />
            ), // Use a component function here
            description: 'Your personal workspace',
          },
          ...teamData.data.map(
            (team: { id: string; name: string; description: string }) => ({
              id: team.id,
              name: team.name,
              logo: Hash, // Pass a component reference
              description: team.description,
            }),
          ),
        ];
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamData]);

  const data = React.useMemo(() => {
    return {
      user: {
        name: user ? user?.firstName + ' ' + user?.lastName : 'John Doe',
        email: user ? user?.email : 'example@gmail.com',
        avatar: user && user.profileImage ? user?.profileImage : null,
      },
      navMain: [
        {
          title: 'Dashboard',
          url: '/',
          icon: Command,
          isActive: urlDictionary[selectedPage].parentUrl === '/',
          items: [
            ...(user?.role == 'ADMIN'
              ? [
                  {
                    title: 'Admin',
                    icon: Gamepad,
                    url: '/admin',
                  },
                ]
              : [
                  {
                    title: 'General',
                    icon: LayoutDashboard,
                    url: '/',
                  },
                ]),
            {
              title: 'Calendar',
              icon: Calendar,
              url: '/calendar',
            },
            {
              title: 'Reports',
              icon: PieChart,
              url: '/reports',
            },
          ],
        },
        {
          title: 'Resources',
          url: '/performance',
          icon: Paperclip,
          isActive: urlDictionary[selectedPage].parentUrl === '/performance',
          items: [
            {
              title: 'Performance Review',
              icon: ChartLine,
              url: '/performance',
            },
            {
              title: 'Drive',
              icon: HardDrive,
              url: '/drive',
            },
            {
              title: 'Talent Growth',
              icon: PersonStanding,
              url: '/talent',
            },
          ],
        },
        {
          title: 'Documentation',
          url: '/docs',
          icon: BookOpen,
          isActive: urlDictionary[selectedPage].parentUrl === '/docs',
          items: [
            {
              title: 'Introduction',
              icon: ListStart,
              url: '/intro',
            },
            {
              title: 'Get Started',
              icon: ListStartIcon,
              url: '/get-started',
            },
            {
              title: 'Tutorials',
              icon: LucideVideotape,
              url: '/tutorial',
            },
            {
              title: 'Changelog',
              icon: GitCompare,
              url: '#',
            },
          ],
        },
        {
          title: 'Settings',
          url: '/settings',
          icon: Settings2,
          isActive: urlDictionary[selectedPage].parentUrl === '/settings',
          items: [
            {
              title: 'General',
              icon: Settings,
              url: '/settings',
            },
            {
              title: 'Team',
              icon: Group,
              url: '/team/settings',
            },
            ...(user?.role == 'ADMIN'
              ? [
                  {
                    title: 'Company Settings',
                    icon: ServerCog,
                    url: '/company/settings',
                  },
                ]
              : []),
          ],
        },
      ],
      /* projects: [
      {
        name: 'Design Engineering',
        url: '#',
        icon: Frame,
      },
      {
        name: 'Sales & Marketing',
        url: '#',
        icon: PieChart,
      },
      {
        name: 'Travel',
        url: '#',
        icon: Map,
      },
      ], */
    };
  }, [selectedPage, user]);

  return (
    <Sidebar className='bg-w' collapsible='icon' {...props}>
      {teams && (
        <SidebarHeader>
          <TeamSwitcher teams={teams} />
        </SidebarHeader>
      )}
      <SidebarContent>
        <NavMain items={data.navMain} isLoading={isLoading} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} isLoading={isLoading} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
