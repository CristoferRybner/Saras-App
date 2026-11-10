import React, { useState } from 'react';
import { EffectuationWorkspaceState } from '../../types/effectuation';
import { PrincipleBadge } from '../PrincipleBadge';
import { FileText, Copy, Check, Printer, Download, BookOpen, Quote } from 'lucide-react';

interface DossierTabProps {
  state: EffectuationWorkspaceState;
  onUpdateVision: (vision: string) => void;
}

export const DossierTab: React.FC<DossierTabProps> = ({ state, onUpdateVision }) => {
  const [copied, setCopied] = useState(false);
  const [editingVision, setEditingVision] = useState(false);
  const [visionDraft, setVisionDraft] = useState(state.founderVision);

  const handleCopyMarkdown = () => {
    const markdown = `# The Effectual Venture Dossier
Generated via Editorial Effectuation

## Venture Articulation
${state.founderVision}

---

## 1. Bird-in-Hand (Means Inventory)
${state.means.map((m) => `- **${m.title}** (${m.category}): ${m.description} [${m.tags.join(', ')}]`).join('\n')}

---

## 2. Affordable Loss (Risk Boundaries)
- Financial Ceiling: $${state.affordableLoss.financialCeiling.toLocaleString()}
- Temporal Allowance: ${state.affordableLoss.temporalHoursPerWeek} hrs/week for ${state.affordableLoss.temporalWeeksDuration} weeks
- Reputation Exposure: ${state.affordableLoss.reputationTolerance}
- Emotional Readiness Score: ${state.affordableLoss.emotionalReadinessScore}/10

### Inviolable Commitments:
${state.affordableLoss.boundaryCommitments.map((b) => `- [${b.capped ? 'x' : ' '}] ${b.text}`).join('\n')}

---

## 3. The Crazy Quilt (Committed Stakeholders)
${state.crazyQuilt.map((q) => `- **${q.name}** (${q.role}): Status: ${q.status}. Commitment: ${q.commitmentType} — ${q.commitmentDetail}`).join('\n')}

---

## 4. Lemonade (Surprises Turned to Moats)
${state.lemonade.map((l) => `- **Surprise:** ${l.surpriseEvent}\n  *Initial Fear:* ${l.initialFear}\n  *Effectual Reframe:* ${l.effectualReframe}\n  *Action:* ${l.leveragedAction}`).join('\n')}

---

## 5. Pilot-in-the-Plane (48-Hour Controllable Actions)
${state.pilotActions.map((p) => `- [${p.completed ? 'x' : ' '}] **${p.action}** (${p.timeframe}) — Locus: ${p.controllableFactor}`).join('\n')}
`;

    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const saveVision = () => {
    onUpdateVision(visionDraft);
    setEditingVision(false);
  };

  return (
    <div className="space-y-6">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5DCD2]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-[#8A726A] font-medium tracking-wide uppercase">Synthesis</span>
          </div>
          <h2 className="font-serif text-2xl font-semibold text-[#1B1C1C]">
            Founder&apos;s Effectual Dossier
          </h2>
          <p className="text-sm text-[#56423C] mt-1 max-w-xl">
            A masterclass synthesis of your means, commitments, and downside boundaries—assembled not as an untested pitch deck, but as a living record of entrepreneurial agency.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyMarkdown}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded bg-[#F4EFEB] hover:bg-[#EFE8E1] border border-[#E5DCD2] text-[#1B1C1C] transition-all"
          >
            {copied ? <Check size={13} className="text-[#4A6B5D]" /> : <Copy size={13} />}
            <span>{copied ? 'Copied' : 'Copy Dossier'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded bg-[#D96B43] hover:bg-[#BD5630] text-white transition-all shadow-sm"
          >
            <Printer size={13} />
            <span>Print / PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Folio Card */}
      <div className="p-8 rounded-lg bg-[#FAF8F5] border border-[#DBD1C5] shadow-[0_2px_8px_rgba(45,45,45,0.04)] space-y-8 font-sans">
        {/* Folio Banner */}
        <div className="border-b border-[#E5DCD2] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-serif uppercase tracking-widest text-[#8A726A]">
              Confidential Founder Memorandum
            </span>
            <h1 className="font-serif text-3xl font-semibold text-[#1B1C1C] mt-1">
              Effectual Venture Framework
            </h1>
          </div>

          <div className="text-right">
            <span className="text-xs font-mono text-[#8A726A]">
              Protocol: Sarasvathy Effectuation Matrix
            </span>
            <div className="text-xs text-[#56423C] mt-0.5">
              Live Verified Canvas
            </div>
          </div>
        </div>

        {/* Venture Vision */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#9D3E1A]">
              Venture Articulation & Thesis
            </span>
            <button
              onClick={() => setEditingVision(!editingVision)}
              className="text-xs text-[#8A726A] hover:text-[#9D3E1A]"
            >
              {editingVision ? 'Cancel' : 'Edit Thesis'}
            </button>
          </div>

          {editingVision ? (
            <div className="space-y-2">
              <textarea
                value={visionDraft}
                onChange={(e) => setVisionDraft(e.target.value)}
                rows={3}
                className="w-full p-3 rounded text-sm bg-[#F4EFEB] border border-[#E5DCD2] text-[#1B1C1C]"
              />
              <button
                onClick={saveVision}
                className="px-3 py-1 text-xs font-semibold rounded bg-[#D96B43] text-white"
              >
                Save Thesis
              </button>
            </div>
          ) : (
            <blockquote className="p-4 rounded bg-[#F4EFEB] border-l-3 border-[#D96B43] font-serif italic text-lg leading-relaxed text-[#1B1C1C]">
              &ldquo;{state.founderVision}&rdquo;
            </blockquote>
          )}
        </div>

        {/* 5 Pillars Snapshot */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#E5DCD2]">
          {/* Means Summary */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <PrincipleBadge principle="Bird-in-Hand" size="sm" />
              <span className="text-xs text-[#8A726A]">{state.means.length} Assets Registered</span>
            </div>
            <ul className="space-y-2 text-xs">
              {state.means.slice(0, 4).map((m) => (
                <li key={m.id} className="p-2.5 rounded bg-[#F4EFEB] border border-[#E5DCD2]/70">
                  <strong className="text-[#1B1C1C] block font-medium">{m.title}</strong>
                  <span className="text-[#56423C]">{m.description}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Affordable Loss Summary */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <PrincipleBadge principle="Affordable Loss" size="sm" />
              <span className="text-xs text-[#4A6B5D] font-semibold">Downside Shielded</span>
            </div>
            <div className="p-3.5 rounded bg-[#F4EFEB] border border-[#E5DCD2]/70 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#56423C]">Financial Ceiling:</span>
                <strong className="text-[#1B1C1C] font-serif text-sm">${state.affordableLoss.financialCeiling.toLocaleString()}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#56423C]">Time Budget:</span>
                <strong className="text-[#1B1C1C]">{state.affordableLoss.temporalHoursPerWeek}h/wk ({state.affordableLoss.temporalWeeksDuration} weeks)</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#56423C]">Pledges Capped:</span>
                <strong className="text-[#4A6B5D]">
                  {state.affordableLoss.boundaryCommitments.filter((b) => b.capped).length} Active Limits
                </strong>
              </div>
            </div>
          </div>
        </div>

        {/* Crazy Quilt & Lemonade Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#E5DCD2]">
          {/* Crazy Quilt */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <PrincipleBadge principle="Crazy Quilt" size="sm" />
              <span className="text-xs text-[#8A726A]">{state.crazyQuilt.length} Stakeholders</span>
            </div>
            <ul className="space-y-2 text-xs">
              {state.crazyQuilt.map((q) => (
                <li key={q.id} className="p-2.5 rounded bg-[#F4EFEB] border border-[#E5DCD2]/70 flex items-center justify-between">
                  <div>
                    <strong className="text-[#1B1C1C] block">{q.name}</strong>
                    <span className="text-[#56423C]">{q.commitmentType}: {q.commitmentDetail}</span>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#FAF8F5] text-[#4A6B5D] border border-[#E5DCD2]">
                    {q.status}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Pilot Agency Sprints */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <PrincipleBadge principle="Pilot-in-the-Plane" size="sm" />
              <span className="text-xs text-[#8A726A]">
                {state.pilotActions.filter((p) => p.completed).length} / {state.pilotActions.length} Complete
              </span>
            </div>
            <ul className="space-y-2 text-xs">
              {state.pilotActions.map((p) => (
                <li
                  key={p.id}
                  className={`p-2.5 rounded border ${
                    p.completed
                      ? 'bg-[#E5EFE9] border-[#C6EBD9] text-[#2D4D40]'
                      : 'bg-[#F4EFEB] border-[#E5DCD2]/70 text-[#1B1C1C]'
                  }`}
                >
                  <div className="font-medium">{p.action}</div>
                  <div className="text-[11px] text-[#56423C] mt-0.5">
                    {p.timeframe} • {p.controllableFactor}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Editorial Footer Quote */}
        <div className="pt-6 border-t border-[#E5DCD2] text-center">
          <p className="font-serif italic text-sm text-[#56423C] max-w-xl mx-auto">
            &ldquo;Markets are not out there waiting to be discovered. They are made by people willing to make commitments and act on the means at hand.&rdquo;
          </p>
          <span className="block text-[11px] uppercase tracking-wider text-[#8A726A] mt-1 font-semibold">
            — Saras Sarasvathy, What Makes Entrepreneurs Entrepreneurial?
          </span>
        </div>
      </div>
    </div>
  );
};
