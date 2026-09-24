import clsx from 'clsx';

const Badge = ({ children, color = 'slate', variant = 'soft', className }) => {
  const baseStyles = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
  
  const variants = {
    soft: {
      slate: 'bg-slate-100 text-slate-800',
      indigo: 'bg-indigo-100 text-indigo-800',
      emerald: 'bg-emerald-100 text-emerald-800',
      amber: 'bg-amber-100 text-amber-800',
      rose: 'bg-rose-100 text-rose-800',
      purple: 'bg-purple-100 text-purple-800',
      blue: 'bg-blue-100 text-blue-800',
    },
    solid: {
      slate: 'bg-slate-600 text-white',
      indigo: 'bg-indigo-600 text-white',
      emerald: 'bg-emerald-600 text-white',
      amber: 'bg-amber-500 text-white',
      rose: 'bg-rose-600 text-white',
      purple: 'bg-purple-600 text-white',
      blue: 'bg-blue-600 text-white',
    },
    outline: {
      slate: 'border border-slate-300 text-slate-700',
      indigo: 'border border-indigo-300 text-indigo-700',
      emerald: 'border border-emerald-300 text-emerald-700',
      amber: 'border border-amber-300 text-amber-700',
      rose: 'border border-rose-300 text-rose-700',
      purple: 'border border-purple-300 text-purple-700',
      blue: 'border border-blue-300 text-blue-700',
    }
  };

  return (
    <span className={clsx(baseStyles, variants[variant][color], className)}>
      {children}
    </span>
  );
};

export default Badge;
