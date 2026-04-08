
// app/page.tsx
'use client'

import Link from "next/link";
import { motion } from "framer-motion";
import { Activity, ArrowRight, Sparkles, BarChart3, Zap } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen selection:bg-indigo-500/30 overflow-x-hidden text-zinc-100">
      
      {/* --- Dynamic Background Blobs --- */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-[500px] w-[500px] bg-purple-400/30 blur-[120px] rounded-full" />
        <div className="absolute top-20 right-[-200px] h-[500px] w-[500px] bg-pink-400/30 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-200px] left-1/3 h-[500px] w-[500px] bg-blue-400/30 blur-[120px] rounded-full" />
        <div className="absolute top-[200px] left-1/2 h-[500px] w-[500px] bg-sky-400/30 blur-[120px] rounded-full" />
      </div>

      {/* 1. Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-xl text-black font-bold">
          <Activity className="h-6 w-6 text-indigo-500" />
          <span>SalesPulse</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/login" className="text-sm font-medium text-zinc-700 hover:text-black transition-colors border border-zinc-800 rounded-full px-5 py-2 hover:bg-black hover:text-white transition-all">
            Sign In
          </Link>
          <Link href="/register" className="text-sm font-medium bg-white text-zinc-950 px-5 py-2 rounded-full hover:bg-zinc-200 transition-all">
            Get Started
          </Link>
        </div>
      </nav>

      {/* 2. Hero Section */}
      <section className="relative z-10 pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 backdrop-blur-md text-xs font-medium text-zinc-300 mb-6">
              <Sparkles className="h-3 w-3 text-indigo-400" />
              Next-Gen AI Sales Intelligence
            </span>
            
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-zinc-800 to-black">
              Your Sales Data. <br /> Now with a Pulse.
            </h1>
            
            <p className="text-lg md:text-xl text-zinc-700 max-w-2xl mx-auto mb-10 leading-relaxed">
              The AI-driven dashboard that doesn't just show you numbers—it tells you what they mean. Track inventory, forecast revenue, and talk to your data.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register" className="group flex items-center gap-2 bg-indigo-800 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-indigo-600 transition-all shadow-[0_0_25px_rgba(79,70,229,0.3)]">
                Get Started Free
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1.5 transition-transform" />
              </Link>
              <Link href="/login" className="px-8 py-4 rounded-full font-semibold text-lg border border-zinc-800 bg-zinc-900/50 backdrop-blur-md hover:bg-zinc-900/40 transition-all">
                Live Demo
              </Link>
            </div>
          </motion.div>

          {/* Glassmorphism Dashboard Preview */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-20 relative mx-auto max-w-5xl"
          >
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/20 p-2 backdrop-blur-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)]">
              <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 overflow-hidden aspect-video flex flex-col items-center justify-center">
                <BarChart3 className="h-16 w-16 text-zinc-800 mb-4" />
                <p className="text-zinc-600 font-medium">Dashboard Interface Preview</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. Features Section */}
      <section className="relative z-10 py-24 border-t border-zinc-900/50 bg-zinc-950/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "AI Business Insights", desc: "Natural language queries for your inventory and sales performance.", icon: Sparkles },
              { title: "Real-time Tracking", desc: "Instant updates across all your business locations and channels.", icon: Zap },
              { title: "Visual Growth", desc: "Interactive reports and forecasting powered by Llama 3.3.", icon: BarChart3 }
            ].map((feature, i) => (
              <div key={i} className="p-8 rounded-2xl bg-zinc-900/20 border border-zinc-800/50 backdrop-blur-md hover:border-zinc-700 transition-all group">
                <feature.icon className="h-10 w-10 text-indigo-500 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
