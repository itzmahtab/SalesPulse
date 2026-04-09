// app/(auth)/login/page.tsx
'use client'

import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import Link from "next/link";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Show a success message if they just came from the registration page
  const isRegistered = searchParams.get("registered") === "true";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Invalid email or password.");
      toast.error("Invalid email or password.");
      setLoading(false);
    } else {
      // Success! Push them to the dashboard shell.
      toast.success("Logged in successfully!");
      router.push("/dashboard");
    }
  }

  return (
    <div className="w-full max-w-md p-8 border border-zinc-800 rounded-xl bg-zinc-900/50 shadow-2xl">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
        <p className="text-sm text-zinc-400">Sign in to your SalesPulse dashboard.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {isRegistered && !error && (
          <div className="p-3 text-sm text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-md">
            Account created successfully! Please log in.
          </div>
        )}

        {error && (
          <div className="p-3 text-sm text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-md">
            {error}
          </div>
        )}
        
        <div className="space-y-4">
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
          {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in...</> : "Log In"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-zinc-400">
        Don&apos;t have an account? <Link href="/register" className="text-indigo-400 hover:text-indigo-300">Create one</Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-zinc-100 p-4">
      {/* We wrap the form in Suspense because we are using useSearchParams() */}
      <Suspense fallback={<div className="text-zinc-500">Loading...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}