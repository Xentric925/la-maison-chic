'use client';

import React, { useState } from 'react';
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
import { API_URL } from '@/lib/constants';
import axios from 'axios';

const CreateLocation = () => {
  const router = useRouter();
  const { toast } = useToast();

  const [form, setForm] = useState({
    name: '',
    country: '',
    city: '',
    address: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      await axios.post(`${API_URL}/locations`, form, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });
      toast({
        variant: 'default',
        title: 'Location created successfully',
        description: 'The new location has been created.',
        action: <Button onClick={() => router.push('/locations')}>Back</Button>,
      });
      router.push('/locations'); // Redirect to the locations list
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error creating location',
        description: 'There was a problem with your request.',
      });
      console.error('Failed to create location:', error);
    }
  };

  return (
    <div className='space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle>
            <span className='text-3xl font-bold'>Create Location</span>
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
                    !form.name || !form.country || !form.city || !form.address
                  }
                >
                  Create
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirm Creation</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to create this location?
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

export default CreateLocation;
