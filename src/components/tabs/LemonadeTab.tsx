import React, { useState } from 'react';
import { LemonadeSurprise } from '../../types/effectuation';
import { PrincipleBadge } from '../PrincipleBadge';
import { Sparkles, Plus, RefreshCw, Trash2, Zap } from 'lucide-react';

interface LemonadeTabProps {
  surprises: LemonadeSurprise[];
  onAddSurprise: (surprise: Omit<LemonadeSurprise, 'id'>) => void;
  onDeleteSurprise: (id: string) => void;
  onAskCounselorToReframe: (eventText: string) => void;
}

export const LemonadeTab: React.FC<LemonadeTabProps> = ({
  surprises,
  onAddSurprise,
  onDeleteSurprise,
  onAskCounselorToReframe,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [eventText, setEventText] = useState('');
  const [fearText, setFearText] = useState('');
  const [reframeText, setReframeText] = useState('');
  const [actionText, setActionText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventText.trim()) return;

    onAddSurprise({
      surpriseEvent: eventText.trim(),
      initialFear: fearText.trim() || 'Temporary disruption to initial assumptions',
      effectualReframe: reframeText.trim() || 'Turned unexpected friction into a novel differentiation vector',
      leveragedAction: actionText.trim() || 'Shifted prototype focus immediately',
      date: 'Just logged',
    });

    setEventText('');
    setFearText('');
    setReframeText('');
    setActionText('');
    setShowAddForm(false);
  };

  const handleTriggerAICounsel = () => {
    if (eventText.trim()) {
      onAskCounselorToReframe(eventText.trim());
    } else {
      onAskCounselorToReframe('I just faced an unexpected rejection from a client or vendor.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5DCD2]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <PrincipleBadge principle="Lemonade" size="md" />
            <span className="text-xs text-[#8A726A] font-medium tracking-wide">Pillar IV</span>
          </div>
          <h2 className="font-serif text-2xl font-semibold text-[#1B1C1C]">
            The Lemonade Alchemy Lab
          </h2>
          <p className="text-sm text-[#56423C] mt-1 max-w-xl">
            Surprises and rejections are not execution failures. In effectuation, they are unannounced gifts that reveal hidden physics and spark new venture directions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded bg-[#B07C4A] hover:bg-[#966C41] text-white transition-all shadow-sm"
          >
            <Plus size={13} />
            <span>Log Surprise</span>
          </button>

          <button
            onClick={handleTriggerAICounsel}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded border border-[#B07C4A] text-[#B07C4A] hover:bg-[#F8F2EB] transition-all"
          >
            <Zap size={13} />
            <span>Reframe with Counselor</span>
          </button>
        </div>
      </div>

      {/* Add Surprise Drawer */}
      {showAddForm && (
        <form
          onSubmit={handleSubmit}
          className="p-5 rounded-md bg-[#F4EFEB] border border-[#E5DCD2] space-y-4 animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between pb-2 border-b border-[#E5DCD2]">
            <h3 className="font-serif font-semibold text-base text-[#1B1C1C]">
              Log an Unexpected Contingency or Roadblock
            </h3>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-xs text-[#8A726A] hover:text-[#1B1C1C]"
            >
              Cancel
            </button>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#56423C]">
              What was the surprise or rejection?
            </label>
            <input
              type="text"
              required
              value={eventText}
              onChange={(e) => setEventText(e.target.value)}
              placeholder="e.g. Supplier doubled minimum order quantity from 50 to 500 units"
              className="w-full text-sm p-2 rounded bg-[#FAF8F5] border border-[#E5DCD2] focus:outline-none focus:border-[#B07C4A]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#56423C]">
                Initial Causal Fear
              </label>
              <input
                type="text"
                value={fearText}
                onChange={(e) => setFearText(e.target.value)}
                placeholder="e.g. Feared we couldn't afford manufacturing"
                className="w-full text-sm p-2 rounded bg-[#FAF8F5] border border-[#E5DCD2] focus:outline-none focus:border-[#B07C4A]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#56423C]">
                Effectual Reframe (The Lemonade)
              </label>
              <input
                type="text"
                value={reframeText}
                onChange={(e) => setReframeText(e.target.value)}
                placeholder="e.g. Partnered with 3 local studios to pool orders together"
                className="w-full text-sm p-2 rounded bg-[#FAF8F5] border border-[#E5DCD2] focus:outline-none focus:border-[#B07C4A]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#56423C]">
              Tangible Leveraged Action
            </label>
            <input
              type="text"
              value={actionText}
              onChange={(e) => setActionText(e.target.value)}
              placeholder="e.g. Formed a regional buying consortium that gives us wholesale leverage"
              className="w-full text-sm p-2 rounded bg-[#FAF8F5] border border-[#E5DCD2] focus:outline-none focus:border-[#B07C4A]"
            />
          </div>

          <div className="flex justify-between items-center pt-2">
            <button
              type="button"
              onClick={handleTriggerAICounsel}
              className="text-xs text-[#9D3E1A] hover:underline flex items-center gap-1"
            >
              <Sparkles size={12} />
              <span>Ask Professor Sarasvathy to synthesize a reframe first</span>
            </button>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3 py-1.5 text-xs text-[#56423C] hover:bg-[#EFE8E1] rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-semibold rounded bg-[#B07C4A] hover:bg-[#966C41] text-white shadow-sm"
              >
                Save Lemonade Entry
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Surprises Feed */}
      <div className="space-y-4">
        {surprises.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded bg-[#FAF8F5] border border-[#E5DCD2] hover:border-[#DBD1C5] shadow-[0_1px_3px_rgba(45,45,45,0.02)] transition-all"
          >
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#E5DCD2]/60">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#F8F2EB] text-[#B07C4A] border border-[#F0BD8B]">
                  Contingency Turned
                </span>
                <span className="text-xs text-[#8A726A]">• {item.date}</span>
              </div>

              <button
                onClick={() => onDeleteSurprise(item.id)}
                className="text-xs text-[#8A726A] hover:text-[#BA1A1A] p-1"
                title="Remove entry"
              >
                <Trash2 size={13} />
              </button>
            </div>

            {/* Roadblock vs Reframe Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="p-3.5 rounded bg-[#F4EFEB] border border-[#E5DCD2]">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-[#BA1A1A] mb-1">
                  The Surprise / Friction
                </div>
                <h4 className="font-serif font-semibold text-sm text-[#1B1C1C] mb-1">
                  {item.surpriseEvent}
                </h4>
                <p className="text-xs text-[#56423C] italic">
                  Initial Fear: {item.initialFear}
                </p>
              </div>

              <div className="p-3.5 rounded bg-[#FAF0EB] border border-[#FFDBCF]">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-[#9D3E1A] mb-1 flex items-center gap-1">
                  <Sparkles size={11} />
                  Effectual Reframe
                </div>
                <p className="text-sm font-medium text-[#1B1C1C] leading-relaxed">
                  {item.effectualReframe}
                </p>
              </div>
            </div>

            {/* Leveraged Action Outcome */}
            <div className="p-3 rounded bg-[#E5EFE9] border border-[#C6EBD9] flex items-start gap-2.5">
              <RefreshCw size={14} className="text-[#4A6B5D] mt-0.5 shrink-0" />
              <div>
                <span className="text-xs font-semibold text-[#002116] mr-1">
                  Venture Angle Adopted:
                </span>
                <span className="text-xs text-[#2D4D40] leading-relaxed">
                  {item.leveragedAction}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
