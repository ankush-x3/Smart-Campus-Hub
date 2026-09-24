import { ArrowDownIcon, ArrowUpIcon, MinusIcon } from 'lucide-react';
import clsx from 'clsx';

const StatCard = ({ title, value, icon: Icon, trend, trendValue, color = 'indigo' }) => {
  const colors = {
    indigo: 'bg-indigo-50 text-indigo-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    purple: 'bg-purple-50 text-purple-600',
    amber: 'bg-amber-50 text-amber-600',
    rose: 'bg-rose-50 text-rose-600',
    blue: 'bg-blue-50 text-blue-600',
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="text-2xl font-semibold text-slate-900">{value}</p>
        </div>
        <div className={clsx('p-3 rounded-lg', colors[color])}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center text-sm">
          {trend === 'up' && <ArrowUpIcon className="w-4 h-4 text-emerald-500 mr-1" />}
          {trend === 'down' && <ArrowDownIcon className="w-4 h-4 text-rose-500 mr-1" />}
          {trend === 'neutral' && <MinusIcon className="w-4 h-4 text-slate-400 mr-1" />}
          <span
            className={clsx(
              'font-medium mr-2',
              trend === 'up' && 'text-emerald-600',
              trend === 'down' && 'text-rose-600',
              trend === 'neutral' && 'text-slate-600'
            )}
          >
            {trendValue}
          </span>
          <span className="text-slate-500">vs last month</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
