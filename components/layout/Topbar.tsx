// components/layout/Topbar.tsx
'use client'

import { Menu, LogOut, User as UserIcon } from 'lucide-react';
import { signOut } from 'next-auth/react';

export default function Topbar({ user }: { user: any }) {
  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-zinc-800 bg-zinc-900/50">
      
      {/* Mobile Menu Button (we can hook this to a shadcn Sheet later) */}
      <button className="md:hidden text-zinc-400 hover:text-zinc-100 transition-colors">
        <Menu className="h-6 w-6" />
      </button>

      {/* Spacer to push user info to the right on desktop */}
      <div className="hidden md:block flex-1" />

      {/* User Actions */}
      <div className="flex items-center gap-4">
        <div className="hidden sm:flex flex-col items-end mr-2">
          <span className="text-sm font-medium text-zinc-200">{user?.name || 'User'}</span>
          <span className="text-xs text-zinc-500 capitalize">{user?.role || 'Admin'}</span>
        </div>
        
        <div className="h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700">
          <UserIcon className="h-4 w-4 text-zinc-400" />
        </div>

        <button 
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="ml-2 text-zinc-500 hover:text-rose-400 transition-colors p-2 rounded-md hover:bg-rose-500/10"
          title="Sign out"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}