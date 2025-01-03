'use client';

import * as React from 'react';
import { subDays, subMonths, subYears, format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface DatePickerProps {
  value: string;
  onChange: (date: string) => void;
  className?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  className,
}) => {
  // Convert the string value to Date object when setting the state
  const [date, setDate] = React.useState<Date>(new Date(value));
  // Handle updating the state when a date is selected from the calendar or preset
  const handleDateChange = (selectedDate: Date) => {
    setDate(selectedDate);
    onChange(selectedDate.toISOString().split('T')[0]); // Convert to 'YYYY-MM-DD' string format
  };
  React.useEffect(() => {
    if (date) {
      // Invoke the default onSelect of the Calendar component
      const calendarElement = document.querySelector('.react-calendar');
      if (calendarElement) {
        const event = new Event('select');
        calendarElement.dispatchEvent(event);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle preset selection
  const handlePresetChange = (preset: string) => {
    let selectedDate: Date;
    switch (preset) {
      case 'today':
        selectedDate = new Date();
        break;
      case 'yesterday':
        selectedDate = subDays(new Date(), 1);
        break;
      case 'week':
        selectedDate = subDays(new Date(), 7);
        break;
      case 'month':
        selectedDate = subMonths(new Date(), 1);
        break;
      case 'three-months':
        selectedDate = subMonths(new Date(), 3);
        break;
      case 'year':
        selectedDate = subYears(new Date(), 1);
        break;
      default:
        selectedDate = new Date();
    }
    setDate(selectedDate);
    onChange(selectedDate.toISOString().split('T')[0]);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-auto justify-start text-left font-normal',
            !date && 'text-muted-foreground',
            className,
          )}
        >
          <CalendarIcon />
          {date ? format(date, 'PPP') : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align='start'
        className='flex w-auto flex-col space-y-2 p-2'
      >
        <Select onValueChange={handlePresetChange}>
          <SelectTrigger>
            <SelectValue placeholder='Select' />
          </SelectTrigger>
          <SelectContent position='popper'>
            <SelectItem value='today'>Today</SelectItem>
            <SelectItem value='yesterday'>Yesterday</SelectItem>
            <SelectItem value='week'>A Week Ago</SelectItem>
            <SelectItem value='month'>A Month Ago</SelectItem>
            <SelectItem value='three-months'>3 Months Ago</SelectItem>
            <SelectItem value='year'>A Year Ago</SelectItem>
          </SelectContent>
        </Select>
        <div className='rounded-md border'>
          <Calendar
            className='.react-calendar'
            mode='single'
            selected={date}
            defaultMonth={date}
            onSelect={(selectedDate) =>
              selectedDate && handleDateChange(selectedDate)
            }
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};
