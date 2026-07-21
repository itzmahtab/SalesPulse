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
    <div className="flex flex-col min-h-[400px] h-[calc(100vh-200px)] bg-background border border-border rounded-xl">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-border">
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="font-semibold text-foreground">{t("chat.headerTitle")}</h2>
          <p className="text-xs text-muted-foreground">{t("chat.headerSubtitle")}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">{t("chat.welcomeTitle")}</h3>
            <p className="text-muted-foreground text-sm mb-6 max-w-md">
              {t("chat.welcomeDesc")}
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {Object.values(t.raw("chat.suggestions") as Record<string, string>).map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => handleSuggestion(suggestion)}
                  className="px-3 py-1.5 text-xs bg-muted hover:bg-secondary/80 text-foreground rounded-full border border-border transition-colors"
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
                  ? "bg-blue-600 text-white"
                  : "bg-muted text-foreground"
              }`}
            >
              {message.role === "assistant" && (
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="text-xs font-medium text-primary">{t("chat.insightLabel")}</span>
                </div>
              )}
              <div className="text-sm whitespace-pre-wrap">{message.content}</div>
              
              {message.insights && message.insights.length > 0 && (
                <div className="mt-4 space-y-3">
                  {message.insights.map((insight, i) => (
                    <div
                      key={i}
                      className="p-3 bg-card rounded-lg border border-border"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {insight.type === "stat" && <TrendingUp className="h-4 w-4 text-emerald-500" />}
                        {insight.type === "list" && <Package className="h-4 w-4 text-amber-500" />}
                        {insight.type === "text" && <AlertCircle className="h-4 w-4 text-rose-500" />}
                        <span className="text-xs font-medium text-muted-foreground">{insight.title}</span>
                      </div>
                      {insight.data !== null && insight.data !== undefined && (
                        <div className="text-xs text-muted-foreground">
                          {insight.type === "stat" && (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                              {Object.entries(insight.data as Record<string, number>).slice(0, 3).map(([key, val]) => (
                                <div key={key} className="text-center">
                                  <div className="text-muted-foreground capitalize">{key}</div>
                                  <div className="font-semibold text-foreground">
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
                              <div className="flex justify-between text-foreground mb-1">
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
            <div className="bg-muted text-foreground rounded-lg p-4 flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <span className="text-sm">{t("chat.analyzing")}</span>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-border">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t("chat.placeholder")}
            className="flex-1 bg-background border border-input rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="px-4 py-2.5 bg-black text-white dark:bg-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
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
