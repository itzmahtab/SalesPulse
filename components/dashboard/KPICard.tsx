// components/dashboard/KPICard.tsx
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KPICardProps {
  title: string;
  value: string | number;
  trend?: string;
  trendDirection?: 'up' | 'down' | 'neutral';
  icon: LucideIcon;
  trendLabel?: string;
}

export function KPICard({ title, value, trend, trendDirection = 'neutral', icon: Icon, trendLabel = 'vs last month' }: KPICardProps) {
  return (
    <div className="p-6 rounded-xl bg-card border border-border backdrop-blur-sm shadow-sm flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center border border-border">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </div>
      
      <div>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        
        {trend && (
          <div className="flex items-center mt-1">
            <span 
              className={cn(
                "text-xs font-medium px-2 py-0.5 rounded-full",
                trendDirection === 'up' ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : 
                trendDirection === 'down' ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" : 
                "bg-muted text-muted-foreground border border-border"
              )}
            >
              {trend}
            </span>
            <span className="text-xs text-muted-foreground ml-2">{trendLabel}</span>
          </div>
        )}
      </div>
    </div>
  );
}
