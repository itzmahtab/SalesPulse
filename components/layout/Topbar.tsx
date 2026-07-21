// components/layout/Topbar.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, LogOut, User as UserIcon, LayoutDashboard, ShoppingCart, Package, Users, BarChart3, Sparkles, Settings } from 'lucide-react'
import { signOut } from 'next-auth/react'
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'
import LanguageToggle from './LanguageToggle'
import ModeToggle from '@/components/ModeToggle'

interface UserData {
  name?: string | null
  role?: string
}

const routes = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Sales', path: '/sales', icon: ShoppingCart },
  { name: 'Inventory', path: '/inventory', icon: Package },
  { name: 'Customers', path: '/customers', icon: Users },
  { name: 'Reports', path: '/reports', icon: BarChart3 },
  { name: 'AI Insights', path: '/ai-insights', icon: Sparkles },
  { name: 'Settings', path: '/settings', icon: Settings },
]

export default function Topbar({ user }: { user: UserData | null | undefined }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const t = useTranslations('common')
  const dashboardT = useTranslations('dashboard.topbar')

  return (
    <header className="h-16 flex items-center justify-between px-4 sm:px-6 border-b border-border bg-card/50">
      
      {/* Mobile Menu Button with Sheet */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button aria-label="Open navigation menu" className="md:hidden text-muted-foreground hover:text-foreground transition-colors p-2">
            <Menu className="h-6 w-6" />
          </button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 bg-card border-border p-0">
          <SheetHeader className="h-16 flex items-center px-6 border-b border-border">
            <SheetTitle className="text-foreground flex items-center gap-2 text-lg font-bold">
              <span className="text-primary">SalesPulse</span>
            </SheetTitle>
          </SheetHeader>
          
          {/* Mobile Navigation Links */}
          <nav aria-label="Mobile navigation" className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
            {routes.map((route) => {
              const isActive = pathname === route.path || pathname.startsWith(route.path)
              const Icon = route.icon

              return (
                <Link
                  key={route.path}
                  href={route.path}
                  onClick={() => setOpen(false)}
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
              )
            })}

            {/* Mobile Logout Button */}
            <button 
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors w-full mt-4"
            >
              <LogOut className="h-5 w-5" />
              {t('actions.signOut')}
            </button>
          </nav>
        </SheetContent>
      </Sheet>

      {/* Spacer to push user info to the right on desktop */}
      <div className="hidden md:block flex-1" />

      {/* User Actions - Responsive */}
      <div className="flex items-center gap-2 sm:gap-4">
        <ModeToggle />
        <LanguageToggle />

        {/* User Name & Role */}
        <div className="hidden sm:flex flex-col items-end mr-2">
          <span className="text-sm font-medium text-foreground">{user?.name || 'User'}</span>
          <span className="text-xs text-muted-foreground capitalize">{user?.role || dashboardT('userRole')}</span>
        </div>
        
        {/* Profile Icon - Link to Settings */}
        <Link href="/settings" aria-label="Settings" className="h-8 w-8 rounded-full bg-muted flex items-center justify-center border border-border hover:border-primary transition-colors">
          <UserIcon className="h-4 w-4 text-muted-foreground" />
        </Link>

        {/* Logout Button */}
        <button 
          onClick={() => signOut({ callbackUrl: '/login' })}
          aria-label={t('actions.signOut')}
          className="text-muted-foreground hover:text-destructive transition-colors p-2 rounded-md hover:bg-destructive/10"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </header>
  )
}
