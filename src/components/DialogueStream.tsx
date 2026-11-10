import React, { useRef, useEffect } from 'react';
import { ChatMessage, PrincipleName } from '../types/effectuation';
import { PrincipleBadge } from './PrincipleBadge';
import { Sparkles, ArrowRight, CornerDownRight } from 'lucide-react';

interface DialogueStreamProps {
  messages: ChatMessage[];
  isThinking: boolean;
  onSelectPrompt: (prompt: string) => void;
  onNavigateToCategory?: (category: string) => void;
}

export const DialogueStream: React.FC<DialogueStreamProps> = ({
  messages,
  isThinking,
  onSelectPrompt,
  onNavigateToCategory,
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  // Markdown-like formatter for bold, italics, quotes
  const renderFormattedText = (raw: string) => {
    // Split into paragraphs
    const paragraphs = raw.split('\n\n');

    return paragraphs.map((paragraph, pIdx) => {
      // Check if it's a blockquote
      if (paragraph.startsWith('>')) {
        const quoteContent = paragraph.replace(/^>\s*/, '').replace(/^"|"$/g, '');
        return (
          <blockquote
            key={pIdx}
            className="my-3 pl-4 border-l-2 border-[#D96B43] font-serif italic text-[16px] leading-relaxed text-[#2D2D2D] bg-[#FAF8F5]/60 py-1.5 pr-2 rounded-r"
          >
            {quoteContent}
          </blockquote>
        );
      }

      // Check if it's a bullet list
      if (paragraph.includes('\n* ') || paragraph.startsWith('* ')) {
        const items = paragraph.split('\n* ').map((i) => i.replace(/^\*\s*/, ''));
        return (
          <ul key={pIdx} className="my-2 space-y-1.5 list-disc pl-5 text-[15px] leading-relaxed text-[#1B1C1C]">
            {items.map((item, iIdx) => (
              <li key={iIdx} dangerouslySetInnerHTML={{ __html: formatInline(item) }} />
            ))}
          </ul>
        );
      }

      // Numbered list
      if (/^\d+\.\s/.test(paragraph)) {
        const lines = paragraph.split('\n');
        return (
          <ol key={pIdx} className="my-2 space-y-1.5 list-decimal pl-5 text-[15px] leading-relaxed text-[#1B1C1C]">
            {lines.map((line, lIdx) => {
              const cleaned = line.replace(/^\d+\.\s*/, '');
              return <li key={lIdx} dangerouslySetInnerHTML={{ __html: formatInline(cleaned) }} />;
            })}
          </ol>
        );
      }

      return (
        <p
          key={pIdx}
          className="my-2 text-[15px] leading-relaxed text-[#1B1C1C]"
          dangerouslySetInnerHTML={{ __html: formatInline(paragraph) }}
        />
      );
    });
  };

  const formatInline = (str: string) => {
    return str
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-[#1B1C1C]">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="font-serif italic">$1</em>');
  };

  return (
    <div className="flex-1 overflow-y-auto p-5 space-y-6">
      {messages.map((message) => {
        const isCounselor = message.sender === 'counselor';

        return (
          <div
            key={message.id}
            className={`flex flex-col transition-all ${
              isCounselor ? 'items-start' : 'items-end'
            }`}
          >
            {/* Sender metadata & Principle Badge */}
            <div className="flex items-center gap-2 mb-1.5 px-1">
              <span className="text-[12px] font-semibold text-[#56423C]">
                {isCounselor ? 'Professor Sarasvathy' : 'Founder'}
              </span>
              <span className="text-[11px] text-[#8A726A]">• {message.timestamp}</span>

              {message.principle && (
                <PrincipleBadge principle={message.principle as PrincipleName} size="sm" />
              )}
            </div>

            {/* Bubble Container */}
            <div
              className={`max-w-[92%] rounded-md transition-all ${
                isCounselor
                  ? 'bg-[#F4EFEB] p-5 shadow-[0_1px_3px_rgba(45,45,45,0.02)] border border-[#E5DCD2]/50'
                  : 'bg-[#FAF8F5] border border-[#DBD1C5] p-4 text-[#1B1C1C]'
              }`}
            >
              <div className="font-sans antialiased text-[#1B1C1C]">
                {renderFormattedText(message.text)}
              </div>

              {/* Extracted Effectuation Insights & Workspace Auto-Updates */}
              {message.extractedItems && message.extractedItems.length > 0 && (
                <div className="mt-4 pt-3 border-t border-[#E5DCD2] space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#9D3E1A]">
                    <Sparkles size={13} />
                    <span>Distilled into Effectuation Canvas</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {message.extractedItems.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => onNavigateToCategory?.(item.category)}
                        className="group flex items-center gap-2 px-3 py-1.5 rounded bg-[#FAF8F5] border border-[#E5DCD2] hover:border-[#D96B43] text-left transition-all"
                      >
                        <span className="text-xs font-medium text-[#1B1C1C] group-hover:text-[#D96B43]">
                          {item.title}
                        </span>
                        <ArrowRight size={11} className="text-[#8A726A] group-hover:text-[#D96B43] transition-transform group-hover:translate-x-0.5" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Suggested Socratic Follow-up Prompts */}
            {isCounselor && message.suggestedPrompts && message.suggestedPrompts.length > 0 && (
              <div className="mt-3 pl-2 flex flex-col items-start gap-1.5 max-w-[92%]">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-[#8A726A] flex items-center gap-1">
                  <CornerDownRight size={11} />
                  Socratic Options:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {message.suggestedPrompts.map((prompt, pIdx) => (
                    <button
                      key={pIdx}
                      onClick={() => onSelectPrompt(prompt)}
                      className="text-xs text-left px-3 py-1.5 rounded bg-[#FAF8F5] hover:bg-[#EFE8E1] text-[#2D2D2D] hover:text-[#9D3E1A] border border-[#DBD1C5] hover:border-[#D96B43] transition-all"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Counselor Thinking State indicator */}
      {isThinking && (
        <div className="flex flex-col items-start">
          <div className="flex items-center gap-2 mb-1.5 px-1">
            <span className="text-[12px] font-semibold text-[#56423C]">Professor Sarasvathy</span>
            <span className="text-[11px] text-[#8A726A]">• Reflecting</span>
          </div>
          <div className="bg-[#F4EFEB] p-4 rounded-md border border-[#E5DCD2]/60 flex items-center gap-3">
            <div className="flex gap-1.5 items-center">
              <span className="w-2 h-2 rounded-full bg-[#D96B43] animate-bounce [animation-delay:-0.3s]" />
              <span className="w-2 h-2 rounded-full bg-[#D96B43] animate-bounce [animation-delay:-0.15s]" />
              <span className="w-2 h-2 rounded-full bg-[#D96B43] animate-bounce" />
            </div>
            <span className="text-xs font-serif italic text-[#56423C]">
              Weaving your reflection through the 5 Effectuation Principles...
            </span>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
};
