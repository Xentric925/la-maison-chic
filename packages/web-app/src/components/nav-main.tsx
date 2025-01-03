'use client';

import { ChevronRight, type LucideIcon } from 'lucide-react';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import useStore from '@/lib/store';
import Link from 'next/link';
import { Skeleton } from './ui/skeleton';

export function NavMain({
  items,
  isLoading,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      icon: LucideIcon;
      url: string;
    }[];
  }[];
  isLoading: boolean;
}) {
  const { selectedPage, setSelectedPage } = useStore();
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Eternals HR</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) =>
          !isLoading ? (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={item.isActive}
              className='group/collapsible'
            >
              <SidebarMenuItem className='transition ease-in-out'>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={item.title}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    <ChevronRight className='ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items &&
                      item.items?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild>
                            <div>
                              {subItem.icon && (
                                <subItem.icon
                                  color={
                                    selectedPage === subItem.url
                                      ? '#4586bf'
                                      : 'black'
                                  }
                                />
                              )}
                              <Link
                                href={subItem.url}
                                onClick={() => setSelectedPage(item.url)}
                              >
                                <span
                                  className={
                                    selectedPage === subItem.url
                                      ? 'text-blue-500'
                                      : 'text-black' + ' hover:text-orange-600'
                                  }
                                >
                                  {subItem.title}
                                </span>
                              </Link>
                            </div>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ) : (
            <div
              className='h-[40px] w-[240px] p-[8px] flex flex-row gap-[8px]'
              key={item.title}
            >
              <Skeleton className='h-[24px] w-[24px]' />
              <Skeleton className='h-[24px] w-[190px]' />
            </div>
          ),
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}
