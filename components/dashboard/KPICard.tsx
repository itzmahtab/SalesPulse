// components/dashboard/KPICard.tsx
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KPICardProps {
  title: string;
  value: string | number;
  trend?: string;
  trendDirection?: 'up' | 'down' | 'neutral';
  icon: LucideIcon;
}

export function KPICard({ title, value, trend, trendDirection = 'neutral', icon: Icon }: KPICardProps) {
  return (
    <div className="p-6 rounded-xl bg-zinc-900/40 border border-zinc-800 backdrop-blur-sm shadow-sm flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-zinc-400">{title}</h3>
        <div className="h-10 w-10 rounded-lg bg-zinc-800/50 flex items-center justify-center border border-zinc-700/50">
          <Icon className="h-5 w-5 text-indigo-400" />
        </div>
      </div>
      
      <div>
        <div className="text-2xl font-bold text-zinc-100">{value}</div>
        
        {trend && (
          <div className="flex items-center mt-1">
            <span 
              className={cn(
                "text-xs font-medium px-2 py-0.5 rounded-full",
                trendDirection === 'up' ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : 
                trendDirection === 'down' ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" : 
                "bg-zinc-500/10 text-zinc-400 border border-zinc-500/20"
              )}
            >
              {trend}
            </span>
            <span className="text-xs text-zinc-500 ml-2">vs last month</span>
          </div>
        )}
      </div>
    </div>
  );
}