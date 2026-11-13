import { Fragment, ReactNode } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { parseRemoteReleaseSections } from '../data/changelog';

interface ReleaseNotesViewProps {
  notes?: string;
  fallbackText?: string;
  tone?: 'emerald' | 'slate';
}

/**
 * Merender teks dengan inline Markdown (**bold**, *italic*, `code`) secara aman ke elemen React
 */
function renderInlineTokens(text: string, tone: 'emerald' | 'slate'): ReactNode[] {
  const tokenRegex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
  const parts = text.split(tokenRegex);

  const boldClass = tone === 'emerald' ? 'font-semibold text-emerald-900' : 'font-semibold text-slate-900';
  const codeClass =
    tone === 'emerald'
      ? 'px-1 py-0.5 rounded bg-emerald-900/10 border border-emerald-700/20 font-mono text-[10px] text-emerald-900'
      : 'px-1 py-0.5 rounded bg-slate-900/5 border border-slate-900/10 font-mono text-[10px] text-slate-800';

  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return (
        <strong key={index} className={boldClass}>
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
      return (
        <em key={index} className="italic">
          {part.slice(1, -1)}
        </em>
      );
    }
    if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
      return (
        <code key={index} className={codeClass}>
          {part.slice(1, -1)}
        </code>
      );
    }
    return <Fragment key={index}>{part}</Fragment>;
  });
}

export function ReleaseNotesView({
  notes,
  fallbackText,
  tone = 'emerald',
}: ReleaseNotesViewProps) {
  const sections = parseRemoteReleaseSections(notes);

  if (sections.length === 0) {
    if (!fallbackText) return null;
    return (
      <p className={`text-[11px] leading-relaxed ${tone === 'emerald' ? 'text-emerald-800' : 'text-slate-600'}`}>
        {fallbackText}
      </p>
    );
  }

  const headingColor = tone === 'emerald' ? 'text-emerald-800' : 'text-slate-500';
  const itemColor = tone === 'emerald' ? 'text-emerald-800' : 'text-slate-700';
  const iconColor = tone === 'emerald' ? 'text-emerald-600' : 'text-blue-600';

  return (
    <div className="space-y-2.5 max-h-44 overflow-y-auto pr-1">
      {sections.map((section, sIdx) => (
        <div key={`${section.category}-${sIdx}`} className="space-y-1">
          <p className={`text-[10px] font-bold uppercase tracking-wider ${headingColor}`}>
            {section.category}
          </p>
          <ul className="space-y-1">
            {section.items.map((item, iIdx) => (
              <li
                key={iIdx}
                className={`flex items-start gap-2 text-[11px] leading-relaxed ${itemColor}`}
              >
                <CheckCircle2 size={12} className={`${iconColor} shrink-0 mt-0.5`} />
                <span className="min-w-0 break-words">{renderInlineTokens(item, tone)}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
