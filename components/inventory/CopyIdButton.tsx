// components/inventory/CopyIdButton.tsx
'use client'

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

export default function CopyIdButton({ id }: { id: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button 
      onClick={handleCopy}
      className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-1 rounded hover:text-white transition-colors flex items-center gap-1 ml-auto"
    >
      {copied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
      {copied ? "Copied!" : "ID"}
    </button>
  );
}