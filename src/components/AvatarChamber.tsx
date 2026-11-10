import React, { useState, useEffect, useRef } from 'react';
import { AvatarMood, PrincipleName } from '../types/effectuation';
import { Volume2, VolumeX, Sparkles, MessageSquareQuote, RefreshCw, Radio } from 'lucide-react';

interface AvatarChamberProps {
  mood: AvatarMood;
  isThinking: boolean;
  activePrinciple: PrincipleName;
  latestSpeechText?: string;
  onSelectPrinciplePrompt?: (prompt: string) => void;
  statusMessage?: string;
}

export const AvatarChamber: React.FC<AvatarChamberProps> = ({
  mood,
  isThinking,
  activePrinciple,
  latestSpeechText,
  onSelectPrinciplePrompt,
  statusMessage,
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [blink, setBlink] = useState(false);
  const [mouthPhase, setMouthPhase] = useState(0);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Natural blinking effect
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 180);
    }, 3800 + Math.random() * 2500);

    return () => clearInterval(blinkInterval);
  }, []);

  // Mouth animation during speech
  useEffect(() => {
    let mouthInterval: any;
    if (isSpeaking) {
      mouthInterval = setInterval(() => {
        setMouthPhase((prev) => (prev + 1) % 4);
      }, 120);
    } else {
      setMouthPhase(0);
    }
    return () => clearInterval(mouthInterval);
  }, [isSpeaking]);

  // Voice Speech Synthesis Handler
  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    if (!voiceEnabled) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 0.98;

    // Pick a thoughtful voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      (v) =>
        (v.name.includes('Natural') || v.name.includes('Serena') || v.name.includes('Google UK English Female') || v.name.includes('Samantha') || v.lang.startsWith('en')) &&
        !v.name.includes('Bad')
    );
    if (preferredVoice) utterance.voice = preferredVoice;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  // Speak when speech text updates if voice is enabled
  useEffect(() => {
    if (latestSpeechText && voiceEnabled) {
      speakText(latestSpeechText);
    }
  }, [latestSpeechText, voiceEnabled]);

  const toggleVoice = () => {
    if (voiceEnabled) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setVoiceEnabled(false);
    } else {
      setVoiceEnabled(true);
      if (latestSpeechText) {
        speakText(latestSpeechText);
      }
    }
  };

  const replayVoice = () => {
    if (latestSpeechText) {
      if (!voiceEnabled) setVoiceEnabled(true);
      speakText(latestSpeechText);
    }
  };

  // Get mood colors and attributes
  const getMoodAura = () => {
    switch (mood) {
      case 'catalytic':
        return {
          glow: 'from-[#FFDBCF]/40 to-transparent',
          accent: '#D96B43',
          label: 'Catalytic Provocation',
          quote: 'Action precedes clarity.',
        };
      case 'probing':
        return {
          glow: 'from-[#FFE7D9]/50 to-transparent',
          accent: '#BD5630',
          label: 'Socratic Inquiry',
          quote: 'Who in your immediate circle can commit today?',
        };
      case 'synthesizing':
        return {
          glow: 'from-[#C6EBD9]/40 to-transparent',
          accent: '#4A6B5D',
          label: 'Pattern Synthesis',
          quote: 'Weaving your means into a tangible tapestry.',
        };
      case 'encouraging':
        return {
          glow: 'from-[#FFDCBD]/40 to-transparent',
          accent: '#B07C4A',
          label: 'Reflective Warmth',
          quote: 'Every enterprise is created from sovereign means.',
        };
      case 'reflective':
      default:
        return {
          glow: 'from-[#EFE8E1]/60 to-transparent',
          accent: '#7B542B',
          label: 'Contemplative Stance',
          quote: 'Downside capped, sovereign agency intact.',
        };
    }
  };

  const aura = getMoodAura();

  return (
    <div className="relative border-b border-[#E5DCD2] bg-[#FAF8F5] p-5 transition-all">
      {/* Background ambient radial glow matching editorial mood */}
      <div
        className={`absolute inset-0 bg-radial ${aura.glow} opacity-60 pointer-events-none transition-all duration-700`}
      />

      {/* Header bar with Counselor Persona & Voice Controls */}
      <div className="relative flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <span className="flex h-2.5 w-2.5 rounded-full bg-[#D96B43] animate-pulse" />
          <h2 className="font-serif text-lg font-semibold tracking-tight text-[#1B1C1C]">
            Professor Sarasvathy
          </h2>
          <span className="text-[11px] font-medium tracking-wide uppercase px-2 py-0.5 rounded-sm bg-[#EFE8E1] text-[#56423C]">
            Fellow & Counselor
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {latestSpeechText && (
            <button
              onClick={replayVoice}
              title="Replay counsel voice"
              className="p-1.5 rounded text-[#56423C] hover:text-[#D96B43] hover:bg-[#F4EFEB] transition-colors"
            >
              <RefreshCw size={14} className={isSpeaking ? 'animate-spin' : ''} />
            </button>
          )}

          <button
            onClick={toggleVoice}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded border transition-colors ${
              voiceEnabled
                ? 'bg-[#E5EFE9] border-[#4A6B5D] text-[#4A6B5D] font-medium'
                : 'bg-[#F4EFEB] border-[#E5DCD2] text-[#56423C] hover:border-[#DBD1C5]'
            }`}
            title={voiceEnabled ? 'Mute counselor speech' : 'Enable counselor voice read-aloud'}
          >
            {voiceEnabled ? <Volume2 size={13} /> : <VolumeX size={13} />}
            <span>{voiceEnabled ? 'Voice Active' : 'Enable Voice'}</span>
          </button>
        </div>
      </div>

      {/* Main Avatar Presentation and Socratic Thought Balloon */}
      <div className="relative flex items-center gap-5">
        {/* Animated Stylized Avatar Portrait */}
        <div className="relative shrink-0 group cursor-pointer" onClick={replayVoice}>
          {/* Outer ring with status pulse */}
          <div
            className={`relative w-24 h-24 rounded-full p-1 bg-gradient-to-br from-[#E5DCD2] to-[#FAF8F5] shadow-sm border border-[#DBD1C5] overflow-hidden transition-all duration-500 ${
              isSpeaking ? 'ring-2 ring-[#D96B43]/50 ring-offset-2' : ''
            }`}
          >
            {/* SVG Editorial Portrait */}
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full rounded-full transition-transform duration-300 group-hover:scale-105"
            >
              <defs>
                <linearGradient id="skin" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#F5DFD0" />
                  <stop offset="100%" stopColor="#E6C8B5" />
                </linearGradient>
                <linearGradient id="hair" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3E3430" />
                  <stop offset="100%" stopColor="#251E1C" />
                </linearGradient>
                <linearGradient id="coat" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4A6B5D" />
                  <stop offset="100%" stopColor="#2A4237" />
                </linearGradient>
                <linearGradient id="scarf" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#D96B43" />
                  <stop offset="100%" stopColor="#BD5630" />
                </linearGradient>
              </defs>

              {/* Studio Canvas Background */}
              <circle cx="50" cy="50" r="48" fill="#F4EFEB" />

              {/* Shoulders / Tweed Blazer */}
              <path
                d="M18 96 C 22 75, 40 70, 50 70 C 60 70, 78 75, 82 96 Z"
                fill="url(#coat)"
              />

              {/* Terracotta Silk Scarf / Lapel */}
              <path
                d="M42 70 L 50 84 L 58 70 L 53 66 L 47 66 Z"
                fill="url(#scarf)"
              />

              {/* Neck */}
              <rect x="44" y="55" width="12" height="15" rx="3" fill="url(#skin)" />

              {/* Head / Jaw */}
              <ellipse cx="50" cy="46" rx="19" ry="22" fill="url(#skin)" />

              {/* Hair (Swept, elegant academic silver-charcoal hair) */}
              <path
                d="M30 44 C 29 25, 40 18, 50 18 C 62 18, 71 25, 70 44 C 68 34, 62 26, 50 26 C 38 26, 32 34, 30 44 Z"
                fill="url(#hair)"
              />
              {/* Hair highlights */}
              <path
                d="M42 21 C 48 19, 56 20, 62 23 C 58 22, 52 21, 44 23 Z"
                fill="#8E8581"
              />

              {/* Horn-rimmed Counselor Eyeglasses */}
              <g stroke="#3A2C27" strokeWidth="1.6" fill="none">
                <rect x="36" y="38" width="11" height="8" rx="2" fill="#FAF8F5" fillOpacity="0.3" />
                <rect x="53" y="38" width="11" height="8" rx="2" fill="#FAF8F5" fillOpacity="0.3" />
                <path d="M47 41 L 53 41" />
                <path d="M36 41 L 32 40" />
                <path d="M64 41 L 68 40" />
              </g>

              {/* Eyes with realistic blinking */}
              {blink ? (
                // Closed eyelid line
                <g stroke="#3A2C27" strokeWidth="1.4" strokeLinecap="round">
                  <path d="M38 43 Q 41.5 45 45 43" />
                  <path d="M55 43 Q 58.5 45 62 43" />
                </g>
              ) : (
                // Open eyes with inquisitive gaze
                <g>
                  <circle cx="41.5" cy="42" r="2.2" fill="#2D2D2D" />
                  <circle cx="42.2" cy="41.3" r="0.7" fill="#FFFFFF" />
                  <circle cx="58.5" cy="42" r="2.2" fill="#2D2D2D" />
                  <circle cx="59.2" cy="41.3" r="0.7" fill="#FFFFFF" />
                </g>
              )}

              {/* Subtle intellectual eyebrow curvature */}
              <path
                d="M37 35.5 Q 41 33.5 46 35.5"
                stroke="#4E403B"
                strokeWidth="1.3"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M54 35.5 Q 59 33.5 63 35.5"
                stroke="#4E403B"
                strokeWidth="1.3"
                fill="none"
                strokeLinecap="round"
              />

              {/* Nose */}
              <path
                d="M50 42 L 48.5 50 L 51.5 50"
                stroke="#CFA892"
                strokeWidth="1.2"
                fill="none"
                strokeLinecap="round"
              />

              {/* Mouth with speech animation */}
              {isSpeaking ? (
                mouthPhase === 0 ? (
                  <ellipse cx="50" cy="56" rx="3.5" ry="2" fill="#803D35" />
                ) : mouthPhase === 1 ? (
                  <path d="M47 55 Q 50 58 53 55" stroke="#803D35" strokeWidth="1.8" fill="none" />
                ) : mouthPhase === 2 ? (
                  <ellipse cx="50" cy="56" rx="2" ry="2.5" fill="#803D35" />
                ) : (
                  <path d="M47 56 Q 50 55 53 56" stroke="#803D35" strokeWidth="1.8" fill="none" />
                )
              ) : isThinking ? (
                // Contemplative pursed mouth
                <path d="M48 56 L 52 56" stroke="#803D35" strokeWidth="1.8" strokeLinecap="round" />
              ) : (
                // Warm, serene subtle smile
                <path d="M46 55.5 Q 50 58.5 54 55.5" stroke="#803D35" strokeWidth="1.6" fill="none" strokeLinecap="round" />
              )}
            </svg>

            {/* Speaking audio wave overlay badge */}
            {isSpeaking && (
              <div className="absolute bottom-1 right-1 flex items-end gap-0.5 px-1 py-0.5 rounded bg-[#FAF8F5]/90 border border-[#DBD1C5]">
                <span className="w-0.5 h-2 bg-[#D96B43] animate-[bounce_0.6s_infinite_100ms]" />
                <span className="w-0.5 h-3.5 bg-[#D96B43] animate-[bounce_0.6s_infinite_200ms]" />
                <span className="w-0.5 h-2 bg-[#D96B43] animate-[bounce_0.6s_infinite_300ms]" />
              </div>
            )}
          </div>
        </div>

        {/* Thought invocation box / Live state */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span
              className="text-[11px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full border"
              style={{
                backgroundColor: '#FAF8F5',
                borderColor: aura.accent,
                color: aura.accent,
              }}
            >
              {aura.label}
            </span>

            {isThinking && (
              <span className="inline-flex items-center gap-1 text-xs text-[#9D3E1A] font-medium animate-pulse">
                <Radio size={12} className="animate-spin" />
                <span>Pondering means & commitments...</span>
              </span>
            )}
          </div>

          <p className="font-serif italic text-[15px] leading-relaxed text-[#2D2D2D] line-clamp-2">
            &ldquo;{latestSpeechText || aura.quote}&rdquo;
          </p>

          {statusMessage && (
            <p className="mt-1 text-xs text-[#56423C] flex items-center gap-1">
              <Sparkles size={11} className="text-[#D96B43]" />
              <span>{statusMessage}</span>
            </p>
          )}
        </div>
      </div>

      {/* Socratic quick-intervention pills */}
      <div className="mt-3.5 pt-3 border-t border-[#E5DCD2]/70 flex flex-wrap items-center gap-1.5">
        <span className="text-[11px] uppercase tracking-wider text-[#8A726A] font-semibold mr-1 flex items-center gap-1">
          <MessageSquareQuote size={12} />
          Explore:
        </span>

        {[
          { label: 'Uncover Hidden Means', prompt: 'Help me inventory the latent means and skills I might be taking for granted.' },
          { label: 'Define Affordable Loss', prompt: 'How do I objectively calculate what I can afford to lose over the next 90 days?' },
          { label: 'Stitch Crazy Quilt', prompt: 'How do I turn a loose contact into an active co-creating partner?' },
          { label: 'Reframe a Roadblock', prompt: 'I ran into an unexpected surprise or rejection. How do we turn this into Lemonade?' },
        ].map((item, idx) => (
          <button
            key={idx}
            onClick={() => onSelectPrinciplePrompt?.(item.prompt)}
            className="text-xs px-2.5 py-1 rounded bg-[#F4EFEB] hover:bg-[#EFE8E1] text-[#2D2D2D] hover:text-[#9D3E1A] border border-[#E5DCD2] transition-colors"
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
};
