// components/layout/Sidebar.tsx
'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Users, 
  BarChart3, 
  Sparkles, 
  Settings,
  Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

const routes = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Sales', path: '/sales', icon: ShoppingCart },
  { name: 'Inventory', path: '/inventory', icon: Package },
  { name: 'Customers', path: '/customers', icon: Users },
  { name: 'Reports', path: '/reports', icon: BarChart3 },
  { name: 'AI Insights', path: '/ai-insights', icon: Sparkles },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const t = useTranslations('common');
  const dashboardT = useTranslations('dashboard.sidebar');

  return (
    <aside className="hidden md:flex flex-col w-64 h-full border-r border-border bg-card/50">
      <div className="h-16 flex items-center px-6 border-b border-border">
        <Link href="/dashboard" className="flex items-center gap-2 text-xl font-bold text-foreground hover:text-primary transition-colors">
          <Activity className="h-6 w-6 text-primary" />
          SalesPulse
        </Link>
      </div>

      <nav aria-label="Main navigation" className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
        {routes.map((route) => {
          const isActive = pathname === route.path || pathname.startsWith(route.path);
          const Icon = route.icon;

          return (
            <Link
              key={route.path}
              href={route.path}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              {t(`nav.${route.name.replace(' ', '').toLowerCase()}`)}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 m-3 mt-auto bg-background border border-border rounded-lg">
        <p className="text-xs text-muted-foreground font-medium mb-1">{dashboardT('freePlan')}</p>
        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary w-[12%]" />
        </div>
        <p className="text-[10px] text-muted-foreground mt-2">{dashboardT('salesThisMonth', { count: 12 })}</p>
      </div>
    </aside>
  );
}
