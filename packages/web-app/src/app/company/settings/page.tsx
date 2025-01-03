'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useSWR from 'swr';
import { API_URL } from '@/lib/constants';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/button';
import { fetcher } from '@/lib/utils';

const ManageCompany = () => {
  const { toast } = useToast();

  type CompanySettings = {
    id: number;
    logoUrl: string;
    company: {
      id: number;
      name: string;
    };
  };

  const { data, error, isLoading, mutate } = useSWR<CompanySettings[]>(
    `${API_URL}/company/settings`,
    fetcher,
    {
      dedupingInterval: 60000 * 60,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );
  const companySettings = data ? data[0] : null;
  //console.log(companySettings);
  const [form, setForm] = useState({
    name: '',
    logoUrl: '',
  });

  useEffect(() => {
    if (companySettings) {
      setForm((prev) => ({
        ...prev,
        name: companySettings?.company?.name || '',
        logoUrl: companySettings?.logoUrl || '',
      }));
    }
  }, [companySettings]);

  //console.log(form);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      await axios.put(
        `${API_URL}/company/settings`,
        {
          name: form.name,
          logoUrl: form.logoUrl,
        },
        { withCredentials: true },
      );
      mutate(); // Revalidate data
      toast({
        variant: 'default',
        title: 'Company updated successfully',
        description: 'The company name and logo have been updated.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error updating company',
        description: 'There was a problem with your request.',
      });
      console.error('Error updating company:', error);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;

  return (
    <div className='space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle>
            <span className='text-3xl font-bold'>Manage Company</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className='space-y-4' onSubmit={(e) => e.preventDefault()}>
            <div>
              <label htmlFor='name' className='text-sm font-medium'>
                Company Name
              </label>
              <Input
                id='name'
                name='name'
                value={form.name}
                onChange={handleChange}
                placeholder='Enter company name'
              />
            </div>
            <div>
              <label htmlFor='logoUrl' className='text-sm font-medium'>
                Company Logo URL
              </label>
              <Input
                id='logoUrl'
                name='logoUrl'
                value={form.logoUrl}
                onChange={handleChange}
                placeholder='Enter logo URL'
              />
            </div>
            <Button
              onClick={handleSubmit}
              disabled={
                (!form.name && !form.logoUrl) ||
                (form.name === companySettings?.company.name &&
                  form.logoUrl === companySettings?.logoUrl)
              }
              className='bg-blue-500 text-white'
            >
              Update
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManageCompany;
