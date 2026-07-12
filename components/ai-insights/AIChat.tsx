// components/ai-insights/AIChat.tsx
'use client'

import { useState } from "react";
import { getAIInsights } from "@/app/actions/ai-insights";
import { Send, Loader2, Sparkles, TrendingUp, Package, AlertCircle } from "lucide-react";
import { useTranslations } from "next-intl";

interface Message {
  role: "user" | "assistant";
  content: string;
  insights?: Array<{
    type: string;
    title: string;
    data: unknown;
    insight: string;
  }>;
}

export default function AIChat() {
  const t = useTranslations("ai");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const result = await getAIInsights(input);
      
      if (result.error) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: `${t("chat.errorPrefix")}: ${result.error}` },
        ]);
      } else if (result.success && result.insights) {
        const responseContent = result.insights.map((i) => i.insight).join("\n\n");
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: responseContent,
            insights: result.insights,
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: t("chat.errorMessage") },
      ]);
    }

    setLoading(false);
  }

  function handleSuggestion(text: string) {
    setInput(text);
  }

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] bg-zinc-900/40 border border-zinc-800 rounded-xl">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-zinc-800">
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="font-semibold text-zinc-100">{t("chat.headerTitle")}</h2>
          <p className="text-xs text-zinc-500">{t("chat.headerSubtitle")}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="h-16 w-16 rounded-full bg-indigo-500/10 flex items-center justify-center mb-4">
              <Sparkles className="h-8 w-8 text-indigo-500" />
            </div>
            <h3 className="text-lg font-semibold text-zinc-200 mb-2">{t("chat.welcomeTitle")}</h3>
            <p className="text-zinc-500 text-sm mb-6 max-w-md">
              {t("chat.welcomeDesc")}
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {Object.values(t.raw("chat.suggestions") as Record<string, string>).map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => handleSuggestion(suggestion)}
                  className="px-3 py-1.5 text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-full border border-zinc-700 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-4 ${
                message.role === "user"
                  ? "bg-indigo-600 text-white"
                  : "bg-zinc-800 text-zinc-200"
              }`}
            >
              {message.role === "assistant" && (
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4 text-indigo-400" />
                  <span className="text-xs font-medium text-indigo-400">{t("chat.insightLabel")}</span>
                </div>
              )}
              <div className="text-sm whitespace-pre-wrap">{message.content}</div>
              
              {message.insights && message.insights.length > 0 && (
                <div className="mt-4 space-y-3">
                  {message.insights.map((insight, i) => (
                    <div
                      key={i}
                      className="p-3 bg-zinc-900/50 rounded-lg border border-zinc-700"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {insight.type === "stat" && <TrendingUp className="h-4 w-4 text-emerald-500" />}
                        {insight.type === "list" && <Package className="h-4 w-4 text-amber-500" />}
                        {insight.type === "text" && <AlertCircle className="h-4 w-4 text-rose-500" />}
                        <span className="text-xs font-medium text-zinc-400">{insight.title}</span>
                      </div>
                      {insight.data !== null && insight.data !== undefined && (
                        <div className="text-xs text-zinc-500">
                          {insight.type === "stat" && (
                            <div className="grid grid-cols-3 gap-2">
                              {Object.entries(insight.data as Record<string, number>).slice(0, 3).map(([key, val]) => (
                                <div key={key} className="text-center">
                                  <div className="text-zinc-400 capitalize">{key}</div>
                                  <div className="font-semibold text-zinc-200">
                                    {typeof val === "number" && key !== "margin"
                                      ? `৳${val.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
                                      : typeof val === "number"
                                      ? `${val.toFixed(1)}%`
                                      : String(val)}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                          {insight.type === "list" && (insight.data as { total?: number; lowStock?: unknown[]; outOfStock?: unknown[] }).lowStock && (
                            <div>
                              <div className="flex justify-between text-zinc-300 mb-1">
                                <span>{t("insightTypes.totalProducts")}:</span>
                                <span className="font-medium">{(insight.data as { total: number }).total}</span>
                              </div>
                              <div className="flex justify-between text-amber-500 mb-1">
                                <span>{t("insightTypes.lowStock")}:</span>
                                <span className="font-medium">{(insight.data as { lowStock: unknown[] }).lowStock.length}</span>
                              </div>
                              <div className="flex justify-between text-rose-500 mb-1">
                                <span>{t("insightTypes.outOfStock")}:</span>
                                <span className="font-medium">{(insight.data as { outOfStock: unknown[] }).outOfStock.length}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-zinc-800 text-zinc-200 rounded-lg p-4 flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-indigo-400" />
              <span className="text-sm">{t("chat.analyzing")}</span>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-zinc-800">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t("chat.placeholder")}
            className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-500 outline-none focus:border-indigo-500 transition-colors"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
