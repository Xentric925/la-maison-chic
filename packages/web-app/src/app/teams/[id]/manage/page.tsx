'use client';

import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import { fetcher } from '@/lib/utils';
import { API_URL } from '@/lib/constants';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { MinusCircle } from 'lucide-react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/Dialog';
import { Textarea } from '@/components/ui/TextArea';
import UserCard from '@/components/shared/UserCard';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import ScrollArea from '@/components/ui/scroll-area';
import Spinner from '@/components/ui/Spinner';
import axios from 'axios';

const ManageTeam = ({ params: { id } }: { params: { id: string } }) => {
  const {
    data: team,
    error: teamError,
    isLoading: teamLoading,
    mutate,
  } = useSWR(`${API_URL}/teams/${id}`, fetcher, {
    dedupingInterval: 60000 * 60,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  const {
    data: locations,
    isLoading: locationsLoading,
    error: locationsError,
  } = useSWR(`${API_URL}/locations`, fetcher);

  const router = useRouter();
  const { toast } = useToast();

  const [form, setForm] = useState({
    name: '',
    description: '',
    locationId: '#',
  });

  const [newMember, setNewMember] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  type TeamMember = {
    userId: number;
    user: {
      firstName: string;
      lastName: string;
      email: string;
      profile?: {
        profilePicture?: string;
        title?: string;
      };
    };
  };

  useEffect(() => {
    if (team) {
      setForm({
        name: team?.name || '',
        description: team?.description || '',
        locationId: team?.location?.id?.toString() || '#',
      });
    }
  }, [team]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLocationChange = (value: string) => {
    setForm((prev) => ({ ...prev, locationId: value }));
  };

  const handleAddMember = async () => {
    if (!newMember) return;
    try {
      await axios.post(
        `${API_URL}/teams/${id}/members`,
        { memberId: newMember.id },
        { withCredentials: true },
      );
      mutate(); // Re-fetch team data
      setNewMember(null);
      setSearchQuery('');
      toast({
        variant: 'default',
        title: 'Member Added',
        description: `User ${newMember.name} has been successfully added to the team.`,
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error Adding Member',
        description: 'Failed to add member to the team.',
      });
      console.error('Error while adding a member', error);
    }
  };

  const handleRemoveMember = async (userId: number) => {
    try {
      await axios.delete(`${API_URL}/teams/${id}/members/${userId}`, {
        withCredentials: true,
      });
      mutate(); // Re-fetch team data
      toast({
        variant: 'default',
        title: 'Member Removed',
        description: 'The member has been successfully removed from the team.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error Removing Member',
        description: 'Failed to remove member from the team.',
      });
      console.error('Error while removing a member', error);
    }
  };

  const handleSubmit = async () => {
    try {
      await axios.put(
        `${API_URL}/teams/${id}`,
        {
          name: form.name,
          description: form.description,
          locationId: form.locationId ? parseInt(form.locationId, 10) : null,
        },
        { withCredentials: true },
      );
      mutate();
      toast({
        variant: 'default',
        title: 'Team updated successfully',
        description: 'The team details have been updated.',
        action: <Button onClick={() => router.push('/teams')}>Back</Button>,
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error updating team',
        description: 'There was a problem with your request.',
      });
      console.error('Failed to update team:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_URL}/teams/${id}`, {
        withCredentials: true,
      });
      router.push('/teams');
    } catch (error) {
      console.error('Failed to delete team:', error);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    fetchUsers();
  };
  const {
    data: users,
    error: usersError,
    isLoading: usersLoading,
    mutate: fetchUsers,
  } = useSWR(
    searchQuery != '' ? `${API_URL}/users?search=${searchQuery}` : null,
    fetcher,
    {
      dedupingInterval: 60000 * 60,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );

  const isLoading = teamLoading || locationsLoading || usersLoading;
  if (teamError || locationsError || usersError)
    return <div>Error loading data</div>;

  return (
    <div className='space-y-6'>
      {/* Team Details and Location */}
      <Card>
        <CardHeader>
          <CardTitle>
            <span className='text-3xl font-bold'>Manage Team</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className='space-y-4' onSubmit={(e) => e.preventDefault()}>
            <div>
              <label htmlFor='name' className='text-sm font-medium'>
                Name
              </label>
              <Input
                id='name'
                name='name'
                value={form.name}
                onChange={handleChange}
                placeholder='Enter team name'
              />
            </div>
            <div>
              <label htmlFor='description' className='text-sm font-medium'>
                Description
              </label>
              <Textarea
                id='description'
                name='description'
                value={form.description}
                onChange={handleChange}
                placeholder='Enter team description'
              />
            </div>
            <div>
              <label htmlFor='location' className='text-sm font-medium'>
                Location
              </label>
              <Select
                value={form.locationId}
                onValueChange={handleLocationChange}
              >
                <SelectTrigger id='location'>
                  <SelectValue placeholder='Select a location (optional)' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='#'>No Location</SelectItem>
                  {!isLoading &&
                    locations?.data.map(
                      (location: {
                        id: number;
                        name: string;
                        city: string;
                        country: string;
                      }) => (
                        <SelectItem
                          key={location.id}
                          value={location.id.toString()}
                        >
                          {location.name} ({location.city}, {location.country})
                        </SelectItem>
                      ),
                    )}
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={handleSubmit}
              disabled={
                !form.name ||
                !form.description ||
                (form.name === team?.name &&
                  form.description === team?.description &&
                  form.locationId === (team?.location?.id?.toString() || '#'))
              }
            >
              Update
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Manage Team Members */}
      <Card>
        <CardHeader>
          <CardTitle>Manage Team Members</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4'>
            {team &&
              team?.teamUsers.map((member: TeamMember) => (
                <div key={member.userId} className='relative'>
                  <MinusCircle
                    onClick={() => handleRemoveMember(member.userId)}
                    className='absolute top-2 right-2 w-6 h-6 text-red-500 cursor-pointer'
                  />
                  <UserCard
                    id={member.userId}
                    firstName={member.user.firstName}
                    lastName={member.user.lastName}
                    email={member.user.email}
                    profile={{
                      title: member.user.profile?.title || '',
                      profileImage: member.user.profile?.profilePicture || '',
                    }}
                  />
                </div>
              ))}
            <div className='relative flex flex-row gap-4'>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant='outline'>Search a User</Button>
                </PopoverTrigger>
                <PopoverContent>
                  <Input
                    placeholder='Search user...'
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                  <ScrollArea>
                    <div className='mt-2 max-h-48 h-48 w-min'>
                      {!usersLoading ? (
                        users?.data.map(
                          (user: {
                            id: number;
                            firstName: string;
                            lastName: string;
                            email: string;
                          }) => (
                            <div
                              key={user.id}
                              className={`cursor-pointer p-2 hover:bg-gray-100 w-full rounded-md ${user.id === newMember?.id && 'bg-gray-200'}`}
                              onClick={() =>
                                setNewMember({
                                  id: user.id,
                                  name: user.firstName,
                                })
                              }
                            >
                              {user.firstName} {user.lastName} ({user.email})
                            </div>
                          ),
                        )
                      ) : (
                        <div className='w-full h-full items-center justify-center'>
                          <Spinner />
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </PopoverContent>
              </Popover>
              {newMember && (
                <div className='mt-2 text-sm text-gray-600'>
                  Selected: {newMember.name}
                </div>
              )}
              <Button onClick={handleAddMember} disabled={!newMember}>
                Add Member
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete Block */}
      <Card>
        <CardHeader>
          <CardTitle>Danger Zone</CardTitle>
        </CardHeader>
        <CardContent>
          <Dialog>
            <DialogTrigger asChild>
              <Button className='bg-red-500 text-white'>Delete Team</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this team? This action cannot
                  be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button
                    onClick={handleDelete}
                    className='bg-red-500 text-white'
                  >
                    Confirm
                  </Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button variant='outline'>Cancel</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManageTeam;
