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

const ManageDepartment = ({ params: { id } }: { params: { id: string } }) => {
  const {
    data: department,
    error: departmentError,
    isLoading: departmentLoading,
    mutate,
  } = useSWR(`${API_URL}/departments/${id}`, fetcher, {
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

  useEffect(() => {
    if (department) {
      setForm({
        name: department?.name || '',
        description: department?.description || '',
        locationId: department?.location?.id?.toString() || '#',
      });
      //console.log(department);
    }
  }, [department]);

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
      await axios.put(
        `${API_URL}/departments/${id}`,
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
      mutate();
      toast({
        variant: 'default',
        title: 'Department updated successfully',
        description: 'The department details have been updated.',
        action: (
          <Button onClick={() => router.push('/departments')}>Back</Button>
        ),
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error updating department',
        description: 'There was a problem with your request.',
      });
      console.error('Failed to update department:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_URL}/departments/${id}`, {
        withCredentials: true,
      });
      router.push('/departments');
    } catch (error) {
      console.error('Failed to delete department:', error);
    }
  };

  if (departmentLoading || locationsLoading) return <div>Loading...</div>;
  if (departmentError || locationsError) return <div>Error loading data</div>;

  return (
    <div className='space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle>
            <span className='text-3xl font-bold'>Manage Department</span>
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
                placeholder='Enter department name'
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
                placeholder='Enter department description'
                className='w-full border px-3 py-2 rounded-md'
              />
            </div>
            <div>
              <label htmlFor='location' className='text-sm font-medium'>
                Location
              </label>
              {locationsLoading ? (
                <p>Loading locations...</p>
              ) : locationsError ? (
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
                  disabled={
                    !form.name ||
                    !form.description ||
                    (form.name === department?.name &&
                      form.description === department?.description &&
                      form.locationId ===
                        (department?.location?.id?.toString() || '#'))
                  }
                >
                  Update
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirm Update</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to update this department?
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
              <Button className='bg-red-500 text-white'>
                Delete Department
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this department? This action
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

export default ManageDepartment;
