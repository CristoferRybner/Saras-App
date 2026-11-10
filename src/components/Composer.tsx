import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Send, Sparkles } from 'lucide-react';

interface ComposerProps {
  onSendMessage: (text: string) => void;
  isThinking: boolean;
  placeholder?: string;
}

export const Composer: React.FC<ComposerProps> = ({
  onSendMessage,
  isThinking,
  placeholder = "Articulate a mean, dilemma, partner opportunity, or risk limit...",
}) => {
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Setup Web Speech Recognition if supported
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript) {
          setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleMic = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition isn't supported in this browser. You can type directly.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.warn('Could not start recognition:', err);
      }
    }
  };

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || isThinking) return;

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    onSendMessage(trimmed);
    setInput('');

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 140)}px`;
  };

  return (
    <div className="border-t border-[#E5DCD2] bg-[#FAF8F5] p-4 transition-all">
      <div className="relative rounded bg-[#F4EFEB] border border-[#E5DCD2] focus-within:border-[#D96B43] focus-within:ring-1 focus-within:ring-[#D96B43] transition-all">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder={isListening ? "Listening to your voice... Speak freely..." : placeholder}
          rows={2}
          className="w-full bg-transparent p-3 text-[15px] leading-relaxed text-[#1B1C1C] placeholder-[#8A726A] focus:outline-none resize-none"
        />

        {/* Action Controls & Indicators */}
        <div className="flex items-center justify-between px-3 pb-2.5 pt-1">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleMic}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded transition-all ${
                isListening
                  ? 'bg-[#FFDBCF] text-[#9D3E1A] font-semibold animate-pulse border border-[#D96B43]'
                  : 'text-[#56423C] hover:text-[#9D3E1A] hover:bg-[#EFE8E1] border border-transparent'
              }`}
              title="Dictate reflection using your microphone"
            >
              {isListening ? <MicOff size={13} /> : <Mic size={13} />}
              <span>{isListening ? 'Listening...' : 'Dictate'}</span>
            </button>

            <span className="text-[11px] text-[#8A726A] hidden sm:inline">
              Press <kbd className="px-1 py-0.5 rounded bg-[#FAF8F5] border border-[#E5DCD2] text-[10px]">Enter</kbd> to counsel
            </span>
          </div>

          <button
            type="button"
            onClick={handleSend}
            disabled={!input.trim() || isThinking}
            className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded tracking-wide transition-all ${
              !input.trim() || isThinking
                ? 'bg-[#EFE8E1] text-[#8A726A] cursor-not-allowed'
                : 'bg-[#D96B43] hover:bg-[#BD5630] text-white shadow-sm hover:translate-y-[1px] active:translate-y-[2px]'
            }`}
          >
            {isThinking ? (
              <>
                <Sparkles size={13} className="animate-spin" />
                <span>Reflecting...</span>
              </>
            ) : (
              <>
                <span>Catalyze</span>
                <Send size={12} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
