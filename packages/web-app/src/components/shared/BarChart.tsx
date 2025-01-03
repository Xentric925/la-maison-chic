'use client';

import * as React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, Tooltip, Legend } from 'recharts';
import useSWR from 'swr';
import { API_URL } from '@/lib/constants';
import { fetcher } from '@/lib/utils';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card';
import { ChartConfig, ChartContainer } from '@/components/ui/Chart';
import { subMonths } from 'date-fns'; // Import date-fns for date manipulation
import { Skeleton } from '../ui/skeleton';
import Spinner from '../ui/Spinner';
import { DatePicker } from '@/components/ui/DatePicker'; // Import DatePicker

// Define the type for a single user history record
interface UserHistory {
  userId: number;
  action: string;
  createdAt: string;
  updateDescription: string;
}

// Define the type for the data passed to the chart (aggregated)
interface ChartData {
  date: string;
  logins: number;
}

const chartConfig = {
  logins: {
    label: 'Logins',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

const BarChartComponent = ({ className }: { className?: string }) => {
  // Set the default date range (3 months ago to today)
  const [startDate, setStartDate] = React.useState<string>(
    subMonths(new Date(), 3).toISOString().split('T')[0], // Default 3 months ago
  );
  const [endDate, setEndDate] = React.useState<string>(
    new Date().toISOString().split('T')[0],
  ); // Default today
  const [activeChart, _setActiveChart] =
    React.useState<keyof typeof chartConfig>('logins');

  // Fetch login history data from the API based on selected date range
  const {
    data: userHistoryData,
    isLoading,
    error,
  } = useSWR<UserHistory[]>(
    `${API_URL}/logs/user-history?action=LOGIN&startDate=${startDate}&endDate=${endDate}`,
    fetcher,
    {
      dedupingInterval: 60000 * 10, // Cache data for 10 minutes
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );

  // Aggregate the data by date (e.g., count logins per day)
  const aggregatedData: ChartData[] = React.useMemo(() => {
    const result: { [key: string]: number } = {};

    userHistoryData?.forEach((history) => {
      const date = new Date(history.createdAt).toLocaleDateString();
      result[date] = (result[date] || 0) + 1; // Count the number of logins for each date
    });

    return Object.keys(result).map((date) => ({
      date,
      logins: result[date],
    }));
  }, [userHistoryData]);

  if (error) return <div>Failed to load data</div>;

  return (
    <Card className={className}>
      <CardHeader className='flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row'>
        <div className='flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6'>
          <CardTitle>Login History</CardTitle>
          <CardDescription className='text-wrap'>
            Showing the number of logins over time
          </CardDescription>
        </div>
        <div className='flex flex-col p-3 gap-3'>
          <div>
            <label className='block text-sm font-medium'>Start Date</label>
            <DatePicker
              value={startDate}
              onChange={setStartDate} // Pass directly to setStartDate
            />
          </div>
          <div>
            <label className='block text-sm font-medium'>End Date</label>
            <DatePicker
              value={endDate}
              onChange={setEndDate} // Pass directly to setEndDate
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className='px-2 sm:p-6'>
        {!isLoading ? (
          <ChartContainer
            config={chartConfig}
            className='aspect-auto h-[250px] w-full'
          >
            <BarChart data={aggregatedData} margin={{ left: 12, right: 12 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey='date'
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <Tooltip />
              <Legend />
              <Bar dataKey={activeChart} fill={chartConfig.logins.color} />
            </BarChart>
          </ChartContainer>
        ) : (
          <Skeleton className='bg-white'>
            <Spinner />
          </Skeleton>
        )}
      </CardContent>
    </Card>
  );
};

export default BarChartComponent;
