// app/(auth)/register/page.tsx
'use client'

import { registerUser } from "@/app/actions/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const t = useTranslations("auth.register");

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
      toast.success(t("success"));
      router.push("/login?registered=true"); 
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background text-foreground p-4">
      <div className="w-full max-w-md p-8 border border-border rounded-xl bg-card shadow-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-white mb-2">{t("title")}</h1>
          <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
        </div>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && (
            <div className="p-3 text-sm text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-md">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">{t("businessNameLabel")}</label>
              <input name="businessName" required className="w-full p-2.5 rounded-md bg-background border border-input text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">{t("userNameLabel")}</label>
              <input name="userName" required className="w-full p-2.5 rounded-md bg-background border border-input text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
            </div>

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
            {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t("settingUp")}</> : t("submitButton")}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {t("haveAccount")} <Link href="/login" className="text-primary hover:text-primary/80">{t("logIn")}</Link>
        </p>
      </div>
    </div>
  );
}