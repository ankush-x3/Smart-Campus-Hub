import { Loader2 } from 'lucide-react';
import clsx from 'clsx';

const LoadingSpinner = ({ size = 'md', color = 'indigo', className }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const colors = {
    indigo: 'text-indigo-600',
    white: 'text-white',
    slate: 'text-slate-600',
  };

  return (
    <div className={clsx('flex justify-center items-center', className)}>
      <Loader2 className={clsx('animate-spin', sizes[size], colors[color])} />
    </div>
  );
};

export default LoadingSpinner;
