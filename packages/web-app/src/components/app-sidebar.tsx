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
import { NavMain } from '@/components/nav-main';
/* import { NavProjects } from '@/components/nav-projects'; */
import { NavUser } from '@/components/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  /* SidebarHeader, */
  SidebarRail,
} from '@/components/ui/sidebar';
import useStore from '@/lib/store';
import { urlDictionary } from '@/lib/constants';

export function AppSidebar({
  isLoading,
  ...props
}: {
  isLoading: boolean;
  props: React.ComponentProps<typeof Sidebar>;
}) {
  const { user, selectedPage } = useStore();

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
      {/* {teams && (
        <SidebarHeader>
          <TeamSwitcher teams={teams} />
        </SidebarHeader>
      )} */}
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
