// app/(auth)/register/page.tsx
'use client'

import { registerUser } from "@/app/actions/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    const formData = new FormData(e.currentTarget);
    const res = await registerUser(formData);
    
    if (res?.error) {
      setError(res.error);
      toast.error(res.error);
      setLoading(false);
    } else if (res?.success) {
      toast.success("Workspace created successfully!");
      router.push("/login?registered=true"); 
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-zinc-100 p-4">
      <div className="w-full max-w-md p-8 border border-zinc-800 rounded-xl bg-zinc-900/50 shadow-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Create your Workspace</h1>
          <p className="text-sm text-zinc-400">Set up your business and admin account.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && (
            <div className="p-3 text-sm text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-md">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Business Name</label>
              <input name="businessName" required className="w-full p-2.5 rounded-md bg-zinc-950 border border-zinc-800 text-zinc-100 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Your Name</label>
              <input name="userName" required className="w-full p-2.5 rounded-md bg-zinc-950 border border-zinc-800 text-zinc-100 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all" />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Email Address</label>
              <input name="email" type="email" required className="w-full p-2.5 rounded-md bg-zinc-950 border border-zinc-800 text-zinc-100 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all" />
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-zinc-400 mb-1">Password</label>
              <input 
                name="password" 
                type={showPassword ? "text" : "password"} 
                required 
                className="w-full p-2.5 pr-10 rounded-md bg-zinc-950 border border-zinc-800 text-zinc-100 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all" 
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-8 text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full flex justify-center items-center bg-indigo-600 text-white p-2.5 rounded-md hover:bg-indigo-500 mt-4 font-medium transition-colors disabled:opacity-50"
          >
            {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Setting up...</> : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-400">
          Already have an account? <Link href="/login" className="text-indigo-400 hover:text-indigo-300">Log in</Link>
        </p>
      </div>
    </div>
  );
}