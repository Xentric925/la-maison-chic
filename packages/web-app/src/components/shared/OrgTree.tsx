'use client';
import { useEffect, useState } from 'react';
import Tree from './Tree';
import TreeNode from './TreeNode';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/Card'; // Import Card component
import { Avatar, AvatarFallback, AvatarImage } from '../ui/Avatar';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '../ui/hover-card';
import { Mail } from 'lucide-react';
import Link from 'next/link';

type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  profile: {
    profileImage: string | null;
    title: string;
  };
  directReports: User[];
};

const OrgTree = ({
  tree,
  loggedInId,
  setSelectedIndex,
}: {
  tree: User | null;
  loggedInId: number;
  setSelectedIndex: (id: number) => void;
}) => {
  const [selectedId, setSelectedId] = useState<number>(-1);

  useEffect(() => {
    if (tree && tree.directReports[0]) {
      setSelectedId(tree.directReports[0].id);
    }
  }, [tree]);

  if (!tree) {
    return <div>Loading...</div>;
  }

  // Function to handle displaying initials when no profile image exists
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName.split(' ')[lastName.split(' ').length - 1][0]}`.toUpperCase();
  };

  return (
    <Tree
      label={
        <HoverCard>
          <HoverCardTrigger>
            <Card
              className={`${/* 'bg-green-50 border-green-500' */ ''} border rounded-md max-w-44 m-auto cursor-default`}
            >
              <CardHeader className='flex flex-col items-center'>
                <div className='w-20 h-20 bg-gray-200 rounded-xl flex items-center justify-center'>
                  <Avatar className='w-20 h-20 rounded-xl border-2 border-stone-400'>
                    {tree.profile && tree.profile.profileImage && (
                      <AvatarImage src={tree.profile.profileImage} />
                    )}
                    <AvatarFallback className='text-2xl rounded-xl'>
                      {getInitials(tree.firstName, tree.lastName)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <CardTitle className='mt-2 text-lg font-semibold'>
                  {tree.firstName} {tree.lastName}
                </CardTitle>
                <CardDescription className='text-sm text-gray-500'>
                  {tree.profile?.title || 'No title available'}
                </CardDescription>
              </CardHeader>
            </Card>
          </HoverCardTrigger>
          <HoverCardContent className='w-fit'>
            <div className='flex justify-between space-x-4'>
              <Link href={`/users/${tree.id}`}>
                <Avatar className='w-20 h-20 rounded-xl border-2 border-stone-400'>
                  {tree.profile && tree.profile.profileImage && (
                    <AvatarImage src={tree.profile.profileImage} />
                  )}
                  <AvatarFallback className='text-2xl rounded-xl'>
                    {getInitials(tree.firstName, tree.lastName)}
                  </AvatarFallback>
                </Avatar>
              </Link>
              <div className='flex flex-col items-center justify-center'>
                <h3 className='text-sm font-semibold'>
                  {tree.firstName} {tree.lastName}
                </h3>
                <div className='flex items-center pt-2'>
                  <Mail className='mr-2 h-4 w-4 opacity-70' />{' '}
                  <span className='text-xs text-muted-foreground'>
                    {tree.email}
                  </span>
                </div>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      }
    >
      {tree.directReports &&
        tree.directReports.map((user, index) => {
          // Determine the profile image (or use initials if missing)
          const profileImage = user.profile?.profileImage;
          const initials = getInitials(user.firstName, user.lastName);

          return (
            <TreeNode
              key={user.id}
              label={
                <HoverCard>
                  <HoverCardTrigger>
                    <Card
                      className={`${
                        user.id === selectedId
                          ? 'bg-blue-100 border-blue-200'
                          : user.id === loggedInId
                            ? 'bg-red-100 border-red-200'
                            : 'bg-white'
                      } border rounded-md cursor-pointer`}
                    >
                      <CardHeader className='flex flex-col items-center'>
                        <div className='w-20 h-20 bg-gray-200 rounded-xl flex items-center justify-center'>
                          <Avatar className='w-20 h-20 rounded-xl border-2 border-stone-400'>
                            {user.profile && profileImage && (
                              <AvatarImage src={profileImage} />
                            )}
                            <AvatarFallback className='text-2xl rounded-xl'>
                              {initials}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        <CardTitle className='mt-2 text-lg font-semibold'>
                          {user.firstName} {user.lastName}
                        </CardTitle>
                        <CardDescription className='text-sm text-gray-500'>
                          {user.profile?.title || 'No title available'}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  </HoverCardTrigger>
                  <HoverCardContent className='w-fit'>
                    <div className='flex justify-between space-x-4'>
                      <Link href={`/users/${user.id}`}>
                        <Avatar className='w-20 h-20 rounded-xl border-2 border-stone-400'>
                          {user.profile && user.profile.profileImage && (
                            <AvatarImage src={user.profile.profileImage} />
                          )}
                          <AvatarFallback className='text-2xl rounded-xl'>
                            {getInitials(user.firstName, user.lastName)}
                          </AvatarFallback>
                        </Avatar>
                      </Link>
                      <div className='flex flex-col items-center justify-center'>
                        <h3 className='text-sm font-semibold'>
                          {user.firstName} {user.lastName}
                        </h3>
                        <div className='flex items-center pt-2'>
                          <Mail className='mr-2 h-4 w-4 opacity-70' />{' '}
                          <span className='text-xs text-muted-foreground'>
                            {user.email}
                          </span>
                        </div>
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              }
              onClick={() => {
                setSelectedId(user.id);
                setSelectedIndex(index);
              }}
            />
          );
        })}
    </Tree>
  );
};

export default OrgTree;
