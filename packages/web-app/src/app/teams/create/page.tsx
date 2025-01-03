'use client';

import React, { useState } from 'react';
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
import axios from 'axios';

const CreateTeam = () => {
  const router = useRouter();
  const { toast } = useToast();

  const [form, setForm] = useState({
    name: '',
    description: '',
    locationId: '#',
  });

  const {
    data: locations,
    isLoading: loadingLocations,
    error: errorLocations,
  } = useSWR(`${API_URL}/locations`, fetcher, {
    dedupingInterval: 60000 * 60,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLocationChange = (value: string) => {
    setForm((prev) => ({ ...prev, locationId: value }));
  };

  const handleSubmit = async () => {
    try {
      await axios.post(
        `${API_URL}/teams`,
        {
          name: form.name,
          description: form.description,
          locationId: form.locationId ? parseInt(form.locationId, 10) : null,
        },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        },
      );
      toast({
        variant: 'default',
        title: 'Team created successfully',
        description: 'The new team has been created.',
        action: <Button onClick={() => router.push('/teams')}>Back</Button>,
      });
      router.push('/teams');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error creating team',
        description: 'There was a problem with your request.',
      });
      console.error('Failed to create team:', error);
    }
  };

  return (
    <div className='space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle>
            <span className='text-3xl font-bold'>Create Team</span>
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
                className='w-full border px-3 py-2 rounded-md'
              />
            </div>
            <div>
              <label htmlFor='location' className='text-sm font-medium'>
                Location
              </label>
              {loadingLocations ? (
                <p>Loading locations...</p>
              ) : errorLocations ? (
                <p>Error fetching locations</p>
              ) : (
                <Select
                  value={form.locationId}
                  onValueChange={handleLocationChange}
                >
                  <SelectTrigger id='location'>
                    <SelectValue placeholder='Select a location (optional)' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='#'>No Location</SelectItem>
                    {locations?.data.map(
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
              )}
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  className='bg-blue-500 text-white'
                  disabled={!form.name || !form.description}
                >
                  Create
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirm Creation</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to create this team?
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
    </div>
  );
};

export default CreateTeam;
