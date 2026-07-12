'use client'

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Activity, ArrowRight, Sparkles, BarChart3, Zap, Package, Globe,
  Users, Quote, ChevronRight, MessageCircle, ExternalLink, Mail,
  Star
} from "lucide-react";
import { useTranslations } from "next-intl";
import LanguageToggle from "@/components/layout/LanguageToggle";
import ModeToggle from "@/components/ModeToggle";

const stats = [
  { key: "revenue", value: "$12.4B", icon: BarChart3 },
  { key: "users", value: "24K+", icon: Users },
  { key: "responses", value: "1.2M", icon: Sparkles },
  { key: "uptime", value: "99.9%", icon: Zap },
];

const companies = [
  "Nexus", "Aether", "Pulse", "Vertex", "Orbit", "Cascade"
];

const footerSections = [
  {
    titleKey: "product",
    links: [
      { labelKey: "features", href: "#features" },
      { labelKey: "pricing", href: "#" },
      { labelKey: "integrations", href: "#" },
      { labelKey: "changelog", href: "#" },
    ],
  },
  {
    titleKey: "company",
    links: [
      { labelKey: "about", href: "#" },
      { labelKey: "blog", href: "#" },
      { labelKey: "careers", href: "#" },
      { labelKey: "contact", href: "#" },
    ],
  },
  {
    titleKey: "legal",
    links: [
      { labelKey: "privacy", href: "#" },
      { labelKey: "terms", href: "#" },
      { labelKey: "cookie", href: "#" },
    ],
  },
  {
    titleKey: "resources",
    links: [
      { labelKey: "docs", href: "#" },
      { labelKey: "api", href: "#" },
      { labelKey: "help", href: "#" },
      { labelKey: "status", href: "#" },
    ],
  },
];

function FadeInUp({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default function LandingPage() {
  const t = useTranslations("landing");

  return (
    <div className="relative min-h-screen bg-background selection:bg-indigo-500/30 overflow-x-hidden text-foreground">

      {/* Ambient background orbs - dark mode */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden dark:block hidden">
        <div className="absolute -top-48 -left-48 h-[600px] w-[600px] bg-indigo-500/10 blur-[150px] rounded-full" />
        <div className="absolute top-20 right-[-300px] h-[600px] w-[600px] bg-purple-500/8 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-200px] left-1/3 h-[500px] w-[500px] bg-emerald-500/8 blur-[150px] rounded-full" />
        <div className="absolute top-[40%] left-[60%] h-[400px] w-[400px] bg-sky-500/8 blur-[120px] rounded-full" />
      </div>

      {/* --- Floating Navigation --- */}
      <nav className="relative z-20 pt-6">
        <div className="mx-auto w-max rounded-full border border-border bg-background/80 backdrop-blur-2xl px-4 sm:px-6 py-2.5 flex items-center gap-6 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold text-foreground mr-2">
            <Activity className="h-5 w-5 text-indigo-400" />
            <span>SalesPulse</span>
          </Link>
          <div className="hidden md:flex items-center gap-5 text-sm">
            <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              {t("nav.features")}
            </Link>
            <Link href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">
              {t("nav.testimonials")}
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              {t("nav.pricing")}
            </Link>
          </div>
          <div className="flex items-center gap-2 ml-2">
            <ModeToggle />
            <LanguageToggle />
            <Link
              href="/login"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5"
            >
              {t("nav.signIn")}
            </Link>
            <Link
              href="/register"
              className="text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-1.5 rounded-full transition-all active:scale-[0.98]"
            >
              {t("nav.getStarted")}
            </Link>
          </div>
        </div>
      </nav>

      {/* --- Hero Section --- */}
      <section className="relative z-10 pt-20 pb-32 md:pb-48">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Hero left: text */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-medium text-indigo-300 mb-6">
                <Sparkles className="h-3 w-3 text-indigo-400" />
                {t("hero.badge")}
              </span>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-none mb-6">
                <span className="text-foreground">{t("hero.titlePart1")}</span>
                <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                  {t("hero.titlePart2")}
                </span>
              </h1>

              <p className="text-base sm:text-lg text-muted-foreground max-w-[65ch] leading-relaxed mb-10">
                {t("hero.subtitle")}
              </p>

              <div className="flex flex-col sm:flex-row items-start gap-4">
                <Link
                  href="/register"
                  className="group inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-7 py-3.5 rounded-full font-semibold text-base transition-all active:scale-[0.98] shadow-[0_0_30px_rgba(79,70,229,0.25)]"
                >
                  {t("buttons.getStartedFree")}
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground px-7 py-3.5 rounded-full font-medium text-base border-border hover:border-foreground/20 transition-all"
                >
                  {t("buttons.liveDemo")}
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>

            {/* Hero right: glass card with preview */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              <div className="relative rounded-2xl border border-border bg-card/60 backdrop-blur-xl p-2 shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
                <div className="rounded-xl border border-border bg-background/80 overflow-hidden">
                  <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border">
                    <div className="h-2.5 w-2.5 rounded-full bg-rose-500/70" />
                    <div className="h-2.5 w-2.5 rounded-full bg-amber-500/70" />
                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/70" />
                    <span className="ml-2 text-[10px] text-muted-foreground/60 font-mono">SalesPulse Dashboard</span>
                  </div>
                  <div className="aspect-[4/3] relative overflow-hidden bg-gradient-to-br from-muted/50 via-muted/30 to-background flex items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent dark:from-indigo-500/5" />
                    <div className="relative z-10 w-full p-6">
                      {/* Mini chart bars */}
                      <div className="flex items-end gap-2 h-24 mb-4">
                        {[40, 65, 45, 80, 55, 90, 70, 95, 60, 85, 75, 100].map((h, i) => (
                          <div key={i} className="flex-1 bg-gradient-to-t from-indigo-500/40 to-indigo-400/20 rounded-t-sm"
                            style={{ height: `${h}%` }}
                          />
                        ))}
                      </div>
                      {/* Mini KPI row */}
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { label: "Revenue", value: "৳48.2K" },
                          { label: "Orders", value: "156" },
                          { label: "Profit", value: "৳12.8K" },
                        ].map((kpi) => (
                          <div key={kpi.label} className="bg-card/80 rounded-lg border border-border p-2.5">
                            <div className="text-[10px] text-muted-foreground">{kpi.label}</div>
                            <div className="text-sm font-bold text-foreground">{kpi.value}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative dot */}
              <div className="absolute -bottom-4 -right-4 h-24 w-24 rounded-full bg-indigo-500/10 blur-[40px] pointer-events-none" />
            </motion.div>

          </div>
        </div>
      </section>

      {/* --- Trusted By / Logo Wall --- */}
      <FadeInUp>
        <section className="relative z-10 py-16 border-y border-border">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground font-medium mb-8">
              {t("trustedBy")}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
              {companies.map((name) => (
                <div key={name} className="flex items-center gap-2 text-muted-foreground/60">
                  <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center">
                    <span className="text-[10px] font-bold text-muted-foreground">{name[0]}</span>
                  </div>
                  <span className="text-sm font-semibold">{name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </FadeInUp>

      {/* --- Stats Section --- */}
      <FadeInUp>
        <section className="relative z-10 py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
              {stats.map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.key}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className="text-center"
                  >
                    <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 mb-4">
                      <Icon className="h-6 w-6 text-indigo-400" />
                    </div>
                    <div className="text-3xl md:text-4xl font-bold text-foreground mb-1">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{t(`stats.${stat.key}`)}</div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      </FadeInUp>

      {/* --- Features Section --- */}
      <section id="features" className="relative z-10 py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <FadeInUp>
            <div className="text-center mb-16">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted/50 border border-border text-xs font-medium text-muted-foreground mb-4">
                <Zap className="h-3 w-3 text-indigo-400" />
                Everything you need
              </span>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
                Powerful features for <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">modern sales teams</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                Everything from inventory management to AI-powered insights, built into one seamless platform.
              </p>
            </div>
          </FadeInUp>

          {/* Asymmetric bento grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {/* Feature 1 (AI Insights) — spans 2 cols, 2 rows */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="md:col-span-2 md:row-span-2 rounded-2xl border border-border bg-gradient-to-br from-card/80 to-background/80 backdrop-blur-xl p-6 md:p-8 group hover:border-indigo-500/20 transition-all"
            >
              <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4">
                <Sparkles className="h-5 w-5 text-indigo-400" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3">{t("features.aiInsights.title")}</h3>
              <p className="text-muted-foreground text-sm md:text-base leading-relaxed max-w-[75%]">
                {t("features.aiInsights.desc")}
              </p>
              {/* Feature preview */}
              <div className="mt-6 rounded-xl border border-border bg-background/60 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-5 w-5 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                    <Sparkles className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-xs font-medium text-indigo-400">AI Assistant</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-muted mt-0.5 flex items-center justify-center">
                      <span className="text-[8px] text-muted-foreground">U</span>
                    </div>
                    <p className="text-xs text-foreground/80">What products are low in stock?</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-indigo-500/20 mt-0.5 flex items-center justify-center">
                      <Sparkles className="h-2.5 w-2.5 text-indigo-400" />
                    </div>
                    <p className="text-xs text-muted-foreground">You have 12 products below threshold. Top priorities: Wireless Mouse (3 left), USB-C Hub (2 left)...</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Feature 2 (Real-time) */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-2xl border border-border bg-card/40 backdrop-blur-xl p-6 md:p-8 group hover:border-indigo-500/20 transition-all"
            >
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4">
                <Zap className="h-5 w-5 text-emerald-400" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">{t("features.realTime.title")}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{t("features.realTime.desc")}</p>
            </motion.div>

            {/* Feature 3 (Visual Growth) */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-2xl border border-border bg-card/40 backdrop-blur-xl p-6 md:p-8 group hover:border-indigo-500/20 transition-all"
            >
              <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4">
                <BarChart3 className="h-5 w-5 text-amber-400" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">{t("features.visualGrowth.title")}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{t("features.visualGrowth.desc")}</p>
            </motion.div>

            {/* Feature 4 (Inventory) */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-2xl border border-border bg-card/40 backdrop-blur-xl p-6 md:p-8 group hover:border-indigo-500/20 transition-all"
            >
              <div className="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-4">
                <Package className="h-5 w-5 text-cyan-400" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">{t("features.inventory.title")}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{t("features.inventory.desc")}</p>
            </motion.div>

            {/* Feature 5 (Multi-currency) */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-2xl border border-border bg-card/40 backdrop-blur-xl p-6 md:p-8 group hover:border-indigo-500/20 transition-all"
            >
              <div className="h-10 w-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-4">
                <Globe className="h-5 w-5 text-purple-400" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">{t("features.multiCurrency.title")}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{t("features.multiCurrency.desc")}</p>
            </motion.div>

            {/* Feature 6 (Team) */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-2xl border border-border bg-card/40 backdrop-blur-xl p-6 md:p-8 group hover:border-indigo-500/20 transition-all"
            >
              <div className="h-10 w-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-4">
                <Users className="h-5 w-5 text-rose-400" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">{t("features.team.title")}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{t("features.team.desc")}</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- Testimonial Section --- */}
      <section id="testimonials" className="relative z-10 py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <FadeInUp>
            <div className="max-w-4xl mx-auto">
              <div className="relative rounded-2xl border border-border bg-card/80 backdrop-blur-xl p-8 md:p-12">
                <Quote className="absolute top-6 right-8 h-12 w-12 text-indigo-500/10" />
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-500 text-amber-500" />
                  ))}
                </div>
                <blockquote className="text-lg md:text-xl text-foreground/80 leading-relaxed mb-8 max-w-[85%]">
                  {t("testimonial.quote")}
                </blockquote>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-lg font-bold text-white">
                    S
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">{t("testimonial.name")}</div>
                    <div className="text-sm text-muted-foreground">{t("testimonial.role")}</div>
                  </div>
                </div>
              </div>
            </div>
          </FadeInUp>
        </div>
      </section>

      {/* --- CTA Section --- */}
      <FadeInUp>
          <section className="relative z-10 py-20 md:py-32">
          <div className="max-w-7xl mx-auto px-6">
            <div className="relative rounded-3xl border border-border bg-card/60 backdrop-blur-xl p-10 md:p-16 text-center overflow-hidden">
              {/* Background orbs */}
              <div className="hidden dark:block absolute -top-20 -right-20 h-40 w-40 bg-indigo-500/20 blur-[80px] rounded-full pointer-events-none" />
              <div className="hidden dark:block absolute -bottom-20 -left-20 h-40 w-40 bg-purple-500/20 blur-[80px] rounded-full pointer-events-none" />

              <div className="relative z-10">
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-4 max-w-3xl mx-auto">
                  {t("cta.title")}
                </h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-10">
                  {t("cta.subtitle")}
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link
                    href="/register"
                    className="group inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all active:scale-[0.98] shadow-[0_0_30px_rgba(79,70,229,0.3)]"
                  >
                    {t("cta.button")}
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground px-8 py-4 rounded-full font-medium text-lg border border-border hover:border-border transition-all"
                  >
                    {t("buttons.liveDemo")}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </FadeInUp>

      {/* --- Footer --- */}
      <footer className="relative z-10 border-t border-border">
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-20">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-10 md:gap-8">

            {/* Brand column */}
            <div className="col-span-2">
              <Link href="/" className="flex items-center gap-2 text-lg font-bold text-foreground mb-4">
                <Activity className="h-5 w-5 text-indigo-400" />
                <span>SalesPulse</span>
              </Link>
              <p className="text-sm text-muted-foreground max-w-sm mb-6 leading-relaxed">
                {t("footer.tagline")}
              </p>
              <div className="flex items-center gap-3">
                {[Globe, MessageCircle, ExternalLink, Mail].map((Icon, i) => (
                  <Link
                    key={i}
                    href="#"
                    className="h-8 w-8 rounded-lg bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-border transition-all"
                  >
                    <Icon className="h-4 w-4" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Link columns */}
            {footerSections.map((section) => (
              <div key={section.titleKey}>
                <h4 className="text-xs uppercase tracking-[0.12em] text-muted-foreground font-medium mb-4">
                  {t(`footer.${section.titleKey}`)}
                </h4>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.labelKey}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {t(`footer.${link.labelKey}`)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

          </div>

          {/* Bottom bar */}
          <div className="mt-16 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">
              {t("footer.copyright")}
            </p>
            <div className="flex items-center gap-4">
              <Link href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                {t("footer.privacy")}
              </Link>
              <Link href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                {t("footer.terms")}
              </Link>
              <Link href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                {t("footer.cookie")}
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
