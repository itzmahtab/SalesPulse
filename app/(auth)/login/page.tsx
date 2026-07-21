// app/(auth)/login/page.tsx
'use client'

import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import Link from "next/link";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const t = useTranslations("auth.login");

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
      setError(t("invalid"));
      toast.error(t("invalid"));
      setLoading(false);
    } else {
      // Success! Push them to the dashboard shell.
      toast.success(t("success"));
      router.push("/dashboard");
    }
  }

  return (
    <div className="w-full max-w-md p-8 border border-border rounded-xl bg-card shadow-2xl">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-white mb-2">{t("title")}</h1>
        <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
      </div>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {isRegistered && !error && (
          <div className="p-3 text-sm text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-md">
            {t("registeredMessage")}
          </div>
        )}

        {error && (
          <div className="p-3 text-sm text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-md">
            {error}
          </div>
        )}
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">{t("emailLabel")}</label>
            <input name="email" type="email" required className="w-full p-2.5 rounded-md bg-background border border-input text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-muted-foreground mb-1">{t("passwordLabel")}</label>
            <input 
              name="password" 
              type={showPassword ? "text" : "password"} 
              required 
              className="w-full p-2.5 pr-10 rounded-md bg-background border border-input text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" 
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-8 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          className="w-full flex justify-center items-center bg-primary text-primary-foreground p-2.5 rounded-md hover:bg-primary/90 mt-4 font-medium transition-colors disabled:opacity-50"
        >
          {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t("signingIn")}</> : t("submitButton")}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        {t("noAccount")} <Link href="/register" className="text-primary hover:text-primary/80">{t("createOne")}</Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background text-foreground p-4">
      {/* We wrap the form in Suspense because we are using useSearchParams() */}
      <Suspense fallback={<div className="text-muted-foreground">Loading...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}