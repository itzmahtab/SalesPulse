// components/layout/Topbar.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, LogOut, User as UserIcon, LayoutDashboard, ShoppingCart, Package, Users, BarChart3, Sparkles, Settings } from 'lucide-react'
import { signOut } from 'next-auth/react'
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

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

  return (
    <header className="h-16 flex items-center justify-between px-4 sm:px-6 border-b border-zinc-800 bg-zinc-900/50">
      
      {/* Mobile Menu Button with Sheet */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button className="md:hidden text-zinc-400 hover:text-zinc-100 transition-colors p-2">
            <Menu className="h-6 w-6" />
          </button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 bg-zinc-900 border-zinc-800 p-0">
          <SheetHeader className="h-16 flex items-center px-6 border-b border-zinc-800">
            <SheetTitle className="text-zinc-100 flex items-center gap-2 text-lg font-bold">
              <span className="text-indigo-500">SalesPulse</span>
            </SheetTitle>
          </SheetHeader>
          
          {/* Mobile Navigation Links */}
          <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
            {routes.map((route) => {
              const isActive = pathname === route.path || pathname.startsWith(route.path)
              const Icon = route.icon

              return (
                <Link
                  key={route.path}
                  href={route.path}
                  onClick={() => setOpen(false)}
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
              )
            })}

            {/* Mobile Logout Button */}
            <button 
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-zinc-400 hover:bg-rose-500/10 hover:text-rose-400 transition-colors w-full mt-4"
            >
              <LogOut className="h-5 w-5" />
              Sign Out
            </button>
          </nav>
        </SheetContent>
      </Sheet>

      {/* Spacer to push user info to the right on desktop */}
      <div className="hidden md:block flex-1" />

      {/* User Actions - Responsive */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* User Name & Role - Hidden on small screens */}
        <div className="hidden lg:flex flex-col items-end mr-2">
          <span className="text-sm font-medium text-zinc-200">{user?.name || 'User'}</span>
          <span className="text-xs text-zinc-500 capitalize">{user?.role || 'Admin'}</span>
        </div>
        
        {/* User Name only on medium screens */}
        <div className="hidden sm:flex lg:hidden flex-col items-end mr-2">
          <span className="text-sm font-medium text-zinc-200">{user?.name || 'User'}</span>
        </div>
        
        {/* Profile Icon - Link to Settings */}
        <Link href="/settings" className="h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700 hover:border-indigo-500 transition-colors">
          <UserIcon className="h-4 w-4 text-zinc-400" />
        </Link>

        {/* Logout Button - Hidden on extra small, icon only on small */}
        <button 
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="text-zinc-500 hover:text-rose-400 transition-colors p-2 rounded-md hover:bg-rose-500/10"
          title="Sign out"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </header>
  )
}