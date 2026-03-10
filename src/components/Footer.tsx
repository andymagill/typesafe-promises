import { Heart } from 'lucide-react';

const otherStuffLinks = [
  { label: 'Free Code Camp', url: 'https://www.freecodecamp.org/' },
  { label: 'Andrew`s Blog', url: 'https://magill.dev/blog' },
  { label: 'Stellar Boat', url: 'https://stellarboat.magill.dev' },
  { label: 'Markdown Mixer', url: 'https://markdownmizer.com' },
];

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50 mt-12">
      <div className="max-w-6xl mx-auto px-8 py-8 grid grid-cols-1 sm:grid-cols-2 gap-6 text-center sm:text-left text-sm text-gray-600">
        {/* Left column: Creator + License */}
        <div className="space-y-2">
          <p className="flex items-center justify-center sm:justify-start gap-1 flex-wrap">
            Coded with{' '}
            <Heart size={14} className="text-red-500 fill-red-500 inline-block" />{' '}
            by{' '}
            <a
              href="https://magill.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              Andrew Magill
            </a>
          </p>
          <p>
            Licensed under{' '}
            <a
              href="https://creativecommons.org/licenses/by-sa/4.0/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              CC BY-SA 4.0
            </a>
          </p>
        </div>

        {/* Right column: Other Stuff */}
        <div className="text-center sm:text-right">
          <div className="text-gray-500 font-bold">Other Stuff:</div>
          <p className="flex items-center justify-center sm:justify-end flex-wrap">
            {otherStuffLinks.map((link, idx) => (
              <span key={link.label} className="flex items-center">
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 hover:underline"
                >
                  {link.label}
                </a>
                {idx < otherStuffLinks.length - 1 && (
                  <span className="text-gray-400 mx-2">|</span>
                )}
              </span>
            ))}
          </p>
        </div>
      </div>
    </footer>
  );
}
