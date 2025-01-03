'use client';

import React, { useEffect, useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';
import Spinner from '@/components/ui/Spinner';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/button';
import { API_URL } from '@/lib/constants';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import useSWR from 'swr';

const HolidaysPage = () => {
  const [holidays, setHolidays] = useState([]);
  const [form, setForm] = useState({ name: '', fromDate: '', toDate: '' });

  const { toast } = useToast();
  const { data, error, isLoading, mutate } = useSWR(
    `${API_URL}/dayoffs`,
    async () => {
      const response = await axios.get(`${API_URL}/dayoffs`, {
        withCredentials: true,
      });
      return response.data;
    },
  );

  useEffect(() => {
    if (data) {
      setHolidays(data);
    }
  }, [data]);

  interface FormState {
    name: string;
    fromDate: string;
    toDate: string;
  }

  interface Holiday {
    name: string;
    fromDate: string;
    toDate: string;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setForm((prev: FormState) => ({ ...prev, [name]: value }));
  };

  const handleCreateHoliday = async () => {
    if (!form.name || !form.fromDate || !form.toDate) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please fill all required fields.',
      });
      return;
    }

    const formattedFromDate = `${form.fromDate}T00:00:00Z`;
    const formattedToDate = `${form.toDate}T23:59:59Z`;

    try {
      await axios.post(
        `${API_URL}/dayoffs`,
        {
          name: form.name,
          fromDate: formattedFromDate,
          toDate: formattedToDate,
        },
        { withCredentials: true },
      );

      toast({
        variant: 'default',
        title: 'Holiday Created',
        description: 'Holiday has been successfully created.',
      });

      setForm({ name: '', fromDate: '', toDate: '' }); // Reset form
      mutate(); // Refresh holidays
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to create the holiday. Please try again.',
      });
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-full'>
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className='text-center text-red-500'>Error fetching holidays</div>
    );
  }

  const holidayDates = holidays.flatMap((holiday: Holiday) => {
    const fromDate = new Date(holiday.fromDate);
    const toDate = new Date(holiday.toDate);
    const dates = [];
    for (
      let date = new Date(fromDate);
      date <= toDate;
      date.setDate(date.getDate() + 1)
    ) {
      dates.push({ date: new Date(date), name: holiday.name });
    }
    return dates;
  });

  const isHoliday = (date: Date) => {
    return holidayDates.find((holiday) => {
      const sameDate = holiday.date.toDateString() === date.toDateString();
      return sameDate;
    });
  };

  return (
    <div className='p-6 bg-gray-50 min-h-screen'>
      <div className='max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6'>
        <h1 className='text-3xl font-bold text-center mb-6'>Holidays</h1>
        <div className='border rounded-lg p-4 flex flex-col md:flex-row justify-center items-center gap-6'>
          <Calendar
            modifiers={{
              holiday: holidayDates.map((holiday) => holiday.date),
            }}
            modifiersClassNames={{
              holiday:
                'bg-red-300 text-white border border-red-500 rounded-full',
            }}
            components={{
              DayContent: ({ date }) => {
                const holiday = isHoliday(date);
                return (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className='w-full h-full flex items-center justify-center'>
                        {date.getDate()}
                      </button>
                    </TooltipTrigger>
                    {holiday && <TooltipContent>{holiday.name}</TooltipContent>}
                  </Tooltip>
                );
              },
            }}
          />
          <div className='w-full max-w-md'>
            <h2 className='text-lg font-bold mb-4'>Create a Holiday</h2>
            <div className='space-y-4'>
              <Input
                name='name'
                value={form.name}
                onChange={handleInputChange}
                placeholder='Holiday Name'
              />
              <Input
                type='date'
                name='fromDate'
                value={form.fromDate}
                onChange={handleInputChange}
                placeholder='From Date'
              />
              <Input
                type='date'
                name='toDate'
                value={form.toDate}
                onChange={handleInputChange}
                placeholder='To Date'
              />
              <Button onClick={handleCreateHoliday} className='w-full'>
                Add Holiday
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HolidaysPage;
