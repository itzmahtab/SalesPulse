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
import { cn } from '@/lib/utils'; // standard shadcn utility

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

  return (
    <aside className="hidden md:flex flex-col w-64 h-full border-r border-zinc-800 bg-zinc-900/50">
      <div className="h-16 flex items-center px-6 border-b border-zinc-800">
        <Link href="/dashboard" className="flex items-center gap-2 text-xl font-bold text-zinc-100 hover:text-indigo-400 transition-colors">
          <Activity className="h-6 w-6 text-indigo-500" />
          SalesPulse
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
        {routes.map((route) => {
          const isActive = pathname === route.path || pathname.startsWith(route.path);
          const Icon = route.icon;

          return (
            <Link
              key={route.path}
              href={route.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                isActive 
                  ? "bg-indigo-500/10 text-indigo-400" 
                  : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-100"
              )}
            >
              <Icon className="h-5 w-5" />
              {route.name}
            </Link>
          );
        })}
      </nav>

      {/* Placeholder for Agency Upsell / Plan Limits later */}
      <div className="p-4 m-3 mt-auto bg-zinc-950 border border-zinc-800 rounded-lg">
        <p className="text-xs text-zinc-400 font-medium mb-1">Free Plan</p>
        <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
          <div className="h-full bg-indigo-500 w-[12%]" />
        </div>
        <p className="text-[10px] text-zinc-500 mt-2">12 / 100 Sales this month</p>
      </div>
    </aside>
  );
}