// app/(dashboard)/ai-insights/page.tsx
import AIChat from "@/components/ai-insights/AIChat";

export default function AIInsightsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">AI Insights</h1>
        <p className="text-zinc-400 text-sm">Get intelligent insights about your business performance.</p>
      </div>
      
      <AIChat />
    </div>
  );
}
