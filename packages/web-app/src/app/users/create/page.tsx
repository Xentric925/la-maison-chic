'use client';

import React, { useState } from 'react';
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
import { API_URL } from '@/lib/constants';
import axios from 'axios';

const CreateUser = () => {
  const router = useRouter();
  const { toast } = useToast();

  const [form, setForm] = useState({
    email: '',
    firstName: '',
    lastName: '',
    role: 'EMPLOYEE', // Default role
    locationId: '',
    reportsToId: '',
    workSettingId: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (value: string) => {
    setForm((prev) => ({ ...prev, role: value }));
  };

  const handleSubmit = async () => {
    try {
      await axios.post(
        `${API_URL}/users`,
        {
          email: form.email,
          firstName: form.firstName,
          lastName: form.lastName,
          role: form.role,
          locationId: parseInt(form.locationId, 10),
          reportsToId: form.reportsToId ? parseInt(form.reportsToId, 10) : null,
          workSettingId: form.workSettingId
            ? parseInt(form.workSettingId, 10)
            : null,
        },
        { withCredentials: true },
      );
      toast({
        variant: 'default',
        title: 'User created successfully',
        description: 'The new user has been created.',
        action: <Button onClick={() => router.push('/users')}>Back</Button>,
      });
      router.push('/users'); // Redirect to the users list
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error creating user',
        description: 'There was a problem with your request.',
      });
      console.error('Failed to create user:', error);
    }
  };

  return (
    <div className='space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle>
            <span className='text-3xl font-bold'>Create User</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className='space-y-4' onSubmit={(e) => e.preventDefault()}>
            <div>
              <label htmlFor='email' className='text-sm font-medium'>
                Email
              </label>
              <Input
                id='email'
                name='email'
                value={form.email}
                onChange={handleChange}
                placeholder='Enter email'
              />
            </div>
            <div>
              <label htmlFor='firstName' className='text-sm font-medium'>
                First Name
              </label>
              <Input
                id='firstName'
                name='firstName'
                value={form.firstName}
                onChange={handleChange}
                placeholder='Enter first name'
              />
            </div>
            <div>
              <label htmlFor='lastName' className='text-sm font-medium'>
                Last Name
              </label>
              <Input
                id='lastName'
                name='lastName'
                value={form.lastName}
                onChange={handleChange}
                placeholder='Enter last name'
              />
            </div>
            <div>
              <label htmlFor='locationId' className='text-sm font-medium'>
                Location ID
              </label>
              <Input
                id='locationId'
                name='locationId'
                value={form.locationId}
                onChange={handleChange}
                placeholder='Enter location ID'
              />
            </div>
            <div>
              <label htmlFor='reportsToId' className='text-sm font-medium'>
                Reports To (Manager ID)
              </label>
              <Input
                id='reportsToId'
                name='reportsToId'
                value={form.reportsToId}
                onChange={handleChange}
                placeholder='Enter manager ID (optional)'
              />
            </div>
            <div>
              <label htmlFor='workSettingId' className='text-sm font-medium'>
                Work Setting ID
              </label>
              <Input
                id='workSettingId'
                name='workSettingId'
                value={form.workSettingId}
                onChange={handleChange}
                placeholder='Enter work setting ID (optional)'
              />
            </div>
            <div>
              <label htmlFor='role' className='text-sm font-medium'>
                Role
              </label>
              <Select value={form.role} onValueChange={handleRoleChange}>
                <SelectTrigger id='role'>
                  <SelectValue placeholder='Select role' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='ADMIN'>Admin</SelectItem>
                  <SelectItem value='MANAGER'>Manager</SelectItem>
                  <SelectItem value='EMPLOYEE'>Employee</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  className='bg-blue-500 text-white'
                  disabled={
                    !form.email ||
                    !form.firstName ||
                    !form.lastName ||
                    !form.locationId
                  }
                >
                  Create
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirm Creation</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to create this user?
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

export default CreateUser;
