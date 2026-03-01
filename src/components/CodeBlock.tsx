import { Copy, Check } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

interface CodeBlockProps {
  code: string;
  language?: string;
}

export function CodeBlock({ code, language = 'typescript' }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    return () => {
      // Cleanup: clear any pending timeout on unmount
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);

      // Clear any existing timer before setting a new one
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('[CodeBlock] Failed to copy to clipboard', err);
      // Optionally: Show an error message to the user
    }
  };

  return (
    <div className="relative bg-gray-900 rounded-lg overflow-hidden shadow-lg animate-codeSlide">
      <button
        onClick={handleCopy}
        className="absolute top-4 right-4 p-2 hover:bg-gray-800 rounded-lg transition-colors z-10"
        title="Copy code"
        aria-label="Copy code to clipboard"
      >
        {copied ? (
          <Check size={20} className="text-green-400" aria-hidden="true" />
        ) : (
          <Copy size={20} className="text-gray-400" aria-hidden="true" />
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
