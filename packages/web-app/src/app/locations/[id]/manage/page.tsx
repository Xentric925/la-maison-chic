'use client';

import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import { fetcher } from '@/lib/utils';
import { API_URL } from '@/lib/constants';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
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
import { ToastAction } from '@radix-ui/react-toast';
import axios from 'axios';

const ManageLocation = ({ params: { id } }: { params: { id: string } }) => {
  const {
    data: location,
    error,
    isLoading,
    mutate,
  } = useSWR(`${API_URL}/locations/${id}`, fetcher, {
    dedupingInterval: 60000 * 60,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  const router = useRouter();
  const { toast } = useToast();

  const [form, setForm] = useState({
    name: '',
    country: '',
    city: '',
    address: '',
  });

  useEffect(() => {
    if (location) {
      setForm({
        name: location?.name || '',
        country: location?.country || '',
        city: location?.city || '',
        address: location?.address || '',
      });
    }
  }, [location]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      await axios.put(`${API_URL}/locations/${id}`, form, {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' },
      });
      mutate();
      toast({
        variant: 'default',
        title: 'Location updated successfully',
        description: 'The location details have been updated.',
        action: <Button onClick={() => router.push('/locations')}>Back</Button>,
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error updating location',
        description: 'There was a problem with your request.',
      });
      console.error('Failed to update location:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_URL}/locations/${id}`, {
        withCredentials: true,
      });
      toast({
        variant: 'default',
        title: 'Location deleted successfully',
        description: 'You will be redirected to Locations page',
      });
      router.push('/locations');
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
      console.error('Failed to delete location:', error);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching location details</div>;

  return (
    <div className='space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle>
            <span className='text-3xl font-bold'>Manage Location</span>
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
                placeholder='Enter location name'
              />
            </div>
            <div>
              <label htmlFor='country' className='text-sm font-medium'>
                Country
              </label>
              <Input
                id='country'
                name='country'
                value={form.country}
                onChange={handleChange}
                placeholder='Enter country'
              />
            </div>
            <div>
              <label htmlFor='city' className='text-sm font-medium'>
                City
              </label>
              <Input
                id='city'
                name='city'
                value={form.city}
                onChange={handleChange}
                placeholder='Enter city'
              />
            </div>
            <div>
              <label htmlFor='address' className='text-sm font-medium'>
                Address
              </label>
              <Input
                id='address'
                name='address'
                value={form.address}
                onChange={handleChange}
                placeholder='Enter address'
              />
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  className='bg-blue-500 text-white'
                  disabled={
                    !form.name ||
                    !form.country ||
                    !form.city ||
                    !form.address ||
                    (form.name === location?.name &&
                      form.country === location?.country &&
                      form.city === location?.city &&
                      form.address === location?.address)
                  }
                >
                  Update
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirm Update</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to update this location?
                  </DialogDescription>
                </DialogHeader>
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
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Danger Zone</CardTitle>
        </CardHeader>
        <CardContent>
          <Dialog>
            <DialogTrigger asChild>
              <Button className='bg-red-500 text-white'>Delete Location</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this location? This action
                  cannot be undone.
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

export default ManageLocation;
