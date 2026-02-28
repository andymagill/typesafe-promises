import React from 'react';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface CodeBlockProps {
  code: string;
  language?: string;
}

export function CodeBlock({ code, language = 'typescript' }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative bg-gray-900 rounded-lg overflow-hidden shadow-lg animate-codeSlide">
      <button
        onClick={handleCopy}
        className="absolute top-4 right-4 p-2 hover:bg-gray-800 rounded-lg transition-colors z-10"
        title="Copy code"
      >
        {copied ? (
          <Check size={20} className="text-green-400" />
        ) : (
          <Copy size={20} className="text-gray-400" />
        )}
      </button>

      <pre className="p-6 pt-12 overflow-x-auto">
        <code className={`language-${language} text-gray-100 text-sm leading-relaxed font-mono`}>
          {code}
        </code>
      </pre>
    </div>
  );
}
