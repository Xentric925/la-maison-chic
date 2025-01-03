import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

const Spinner = ({ className }: { className?: string }) => {
  return (
    <div className='h-full w-full flex justify-center items-center'>
      <Loader2
        className={cn(
          'my-28 h-16 w-16 text-primary/60 animate-spin',
          className,
        )}
      />
    </div>
  );
};

export default Spinner;
