'use client';
import React from 'react';
import Link from 'next/link'; // For client-side routing
import { Card } from '@/components/ui/Card';
import { LucideIcon } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface DashboardCardProps {
  icon: LucideIcon;
  title: string;
  href: string;
  className?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  icon: Icon,
  title,
  href,
  className,
}) => {
  const isMobile = useIsMobile();
  return (
    <Link href={href} className={className ? className : ''}>
      <Card
        className={`cursor-pointer ${isMobile ? 'min-w-[32vw]' : 'min-w-[16vw]'} min-h-[12vh] p-4 group h-full flex flex-col items-center justify-center gap-1 bg-slate-500/65 shadow-md rounded-lg hover:shadow-lg transition-shadow duration-300`}
      >
        <div className='flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 group-hover:scale-110 transform transition-transform duration-300'>
          <Icon className='text-gray-500 w-8 h-8 group-hover:text-gray-700 transition-colors duration-300' />
        </div>
        <h3 className='text-gray-700 text-lg font-medium group-hover:text-gray-900 transition-colors duration-300 text-wrap text-center'>
          {title}
        </h3>
      </Card>
    </Link>
  );
};

export default DashboardCard;
