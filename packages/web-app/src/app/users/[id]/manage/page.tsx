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
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ToastAction } from '@radix-ui/react-toast';
import UserCard from '@/components/shared/UserCard';
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
import axios from 'axios';

const ManageUser = ({ params: { id } }: { params: { id: string } }) => {
  const {
    data: user,
    error,
    isLoading,
    mutate,
  } = useSWR(`${API_URL}/users/${id}`, fetcher, {
    dedupingInterval: 60000 * 60,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  const router = useRouter();
  const { toast } = useToast();

  const [form, setForm] = useState({
    title: '',
    salary: '',
    actionType: 'Promotion',
  });

  useEffect(() => {
    if (user) {
      setForm({
        title: user?.profile?.title || '',
        salary: user?.privateProfile?.salary?.toString() || '',
        actionType: 'Promotion',
      });
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleActionTypeChange = (value: string) => {
    setForm((prev) => ({ ...prev, actionType: value }));
  };

  const handleSubmit = async () => {
    try {
      await axios.patch(
        `${API_URL}/users/${id}/details`,
        {
          title: form.title,
          salary: parseFloat(form.salary),
          actionType: form.actionType, // Optional for creating userHistory entry
        },
        {
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' },
        },
      );
      mutate();
      toast({
        variant: 'default',
        title: 'User details updated successfully',
        description: `The user details have been updated with a ${form.actionType}.`,
        action: <Button onClick={() => router.push('/users')}>Back</Button>,
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your request.',
        action: (
          <ToastAction altText='Reload' onClick={() => router.refresh()}>
            Try again
          </ToastAction>
        ),
      });
      console.error('Failed to update user details:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_URL}/users/${id}`, {
        withCredentials: true,
      });
      router.push('/users');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your request.',
        action: (
          <ToastAction altText='Reload' onClick={() => router.refresh()}>
            Try again
          </ToastAction>
        ),
      });
      console.error('Failed to delete user:', error);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching user details</div>;

  const isProfileMissing = !user?.profile || !user?.privateProfile;

  return (
    <div className='space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle>
            <span className='text-3xl font-bold'>Manage User:</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <UserCard {...user} />
          {isProfileMissing ? (
            <div className='text-red-500'>
              This user hasn&apos;t created their profile yet.
            </div>
          ) : (
            <form className='space-y-4' onSubmit={(e) => e.preventDefault()}>
              <div>
                <label htmlFor='title' className='text-sm font-medium'>
                  Title
                </label>
                <Input
                  id='title'
                  name='title'
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Enter user's title"
                  disabled={isProfileMissing}
                />
              </div>
              <div>
                <label htmlFor='salary' className='text-sm font-medium'>
                  Salary
                </label>
                <Input
                  id='salary'
                  name='salary'
                  type='number'
                  value={form.salary}
                  onChange={handleChange}
                  placeholder="Enter user's salary"
                  step={100}
                  min={600}
                  max={20000}
                  disabled={isProfileMissing}
                />
              </div>
              <div>
                <label htmlFor='actionType' className='text-sm font-medium'>
                  Action Type
                </label>
                <Select
                  value={form.actionType}
                  onValueChange={handleActionTypeChange}
                  disabled={isProfileMissing}
                >
                  <SelectTrigger id='actionType'>
                    <SelectValue placeholder='Select action type' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='Promotion'>Promotion</SelectItem>
                    <SelectItem value='Demotion'>Demotion</SelectItem>
                    <SelectItem value='Raise'>Raise</SelectItem>
                    <SelectItem value='Cut'>Cut</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    className='bg-blue-500 text-white'
                    disabled={
                      isProfileMissing ||
                      !form.title ||
                      !form.salary ||
                      (form.title === user.profile?.title &&
                        form.salary === user.privateProfile?.salary.toString())
                    }
                  >
                    Update
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Confirm Update</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to update the user details with the
                      following changes?
                    </DialogDescription>
                  </DialogHeader>
                  <p>
                    Title: <strong>{form.title}</strong>
                  </p>
                  <p>
                    Salary: <strong>{form.salary}</strong>
                  </p>
                  <p>
                    Action Type: <strong>{form.actionType}</strong>
                  </p>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button
                        type='button'
                        onClick={handleSubmit}
                        className='bg-green-500 text-white'
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
            </form>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Danger Zone</CardTitle>
        </CardHeader>
        <CardContent>
          <Dialog>
            <DialogTrigger asChild>
              <Button className='bg-red-500 text-white'>Delete User</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this user? This action cannot
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

export default ManageUser;
