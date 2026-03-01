import { Copy, Check } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

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
    <div className="relative rounded-lg overflow-hidden shadow-lg animate-codeSlide">
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

      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          padding: '1.5rem 1.5rem 1.5rem 1.5rem',
          paddingTop: '3rem',
          fontSize: '0.875rem',
          lineHeight: '1.625',
          overflow: 'auto',
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
