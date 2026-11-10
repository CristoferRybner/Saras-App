import React, { useState } from 'react';
import { AffordableLossState } from '../../types/effectuation';
import { PrincipleBadge } from '../PrincipleBadge';
import { ShieldCheck, Plus, CheckCircle2, Circle, AlertCircle, DollarSign, Clock, Eye, HeartHandshake } from 'lucide-react';

interface AffordableLossTabProps {
  state: AffordableLossState;
  onUpdateState: (newState: AffordableLossState) => void;
  onAskCounselorAboutLoss: () => void;
}

export const AffordableLossTab: React.FC<AffordableLossTabProps> = ({
  state,
  onUpdateState,
  onAskCounselorAboutLoss,
}) => {
  const [newCommitmentText, setNewCommitmentText] = useState('');

  const handleToggleCapped = (id: string) => {
    const updated = state.boundaryCommitments.map((b) =>
      b.id === id ? { ...b, capped: !b.capped } : b
    );
    onUpdateState({ ...state, boundaryCommitments: updated });
  };

  const handleAddCommitment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommitmentText.trim()) return;

    const newCommitment = {
      id: `b-${Date.now()}`,
      text: newCommitmentText.trim(),
      capped: true,
    };

    onUpdateState({
      ...state,
      boundaryCommitments: [...state.boundaryCommitments, newCommitment],
    });
    setNewCommitmentText('');
  };

  const handleDeleteCommitment = (id: string) => {
    onUpdateState({
      ...state,
      boundaryCommitments: state.boundaryCommitments.filter((b) => b.id !== id),
    });
  };

  return (
    <div className="space-y-6">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5DCD2]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <PrincipleBadge principle="Affordable Loss" size="md" />
            <span className="text-xs text-[#8A726A] font-medium tracking-wide">Pillar II</span>
          </div>
          <h2 className="font-serif text-2xl font-semibold text-[#1B1C1C]">
            Downside Armor & Risk Boundaries
          </h2>
          <p className="text-sm text-[#56423C] mt-1 max-w-xl">
            Never bet on speculative forecasts. Define the exact financial, temporal, and psychological stakes you can walk away from without regret.
          </p>
        </div>

        <button
          onClick={onAskCounselorAboutLoss}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded bg-[#4A6B5D] hover:bg-[#446557] text-white transition-all shadow-sm"
        >
          <ShieldCheck size={14} />
          <span>Audit Loss Boundaries</span>
        </button>
      </div>

      {/* Downside Capping Overview Card */}
      <div className="p-5 rounded-md bg-[#FAF8F5] border border-[#DBD1C5] shadow-[0_1px_3px_rgba(45,45,45,0.03)]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-[#4A6B5D]" />
            <h3 className="font-serif font-semibold text-base text-[#1B1C1C]">
              Downside Risk Protection Matrix
            </h3>
          </div>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#E5EFE9] text-[#4A6B5D] font-semibold border border-[#C6EBD9]">
            Downside Sovereignly Capped
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Financial Ceiling */}
          <div className="p-4 rounded bg-[#F4EFEB] border border-[#E5DCD2]">
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#9D3E1A] mb-1">
              <DollarSign size={13} />
              <span>Capital Ceiling</span>
            </div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="font-serif text-2xl font-bold text-[#1B1C1C]">
                ${state.financialCeiling.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={10000}
              step={250}
              value={state.financialCeiling}
              onChange={(e) =>
                onUpdateState({ ...state, financialCeiling: Number(e.target.value) })
              }
              className="w-full mt-3 accent-[#D96B43]"
            />
            <p className="text-[11px] text-[#56423C] mt-1.5">
              Zero debt or outside equity required for this experiment.
            </p>
          </div>

          {/* Temporal Stake */}
          <div className="p-4 rounded bg-[#F4EFEB] border border-[#E5DCD2]">
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#4A6B5D] mb-1">
              <Clock size={13} />
              <span>Time Allowance</span>
            </div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="font-serif text-2xl font-bold text-[#1B1C1C]">
                {state.temporalHoursPerWeek}h
              </span>
              <span className="text-xs text-[#56423C]">/ week for</span>
              <span className="font-serif text-lg font-bold text-[#1B1C1C]">
                {state.temporalWeeksDuration}w
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-3">
              <div>
                <label className="text-[10px] text-[#8A726A] uppercase font-semibold">Hours</label>
                <input
                  type="number"
                  min={1}
                  max={40}
                  value={state.temporalHoursPerWeek}
                  onChange={(e) =>
                    onUpdateState({ ...state, temporalHoursPerWeek: Number(e.target.value) })
                  }
                  className="w-full text-xs p-1 rounded bg-[#FAF8F5] border border-[#E5DCD2]"
                />
              </div>
              <div>
                <label className="text-[10px] text-[#8A726A] uppercase font-semibold">Weeks</label>
                <input
                  type="number"
                  min={1}
                  max={52}
                  value={state.temporalWeeksDuration}
                  onChange={(e) =>
                    onUpdateState({ ...state, temporalWeeksDuration: Number(e.target.value) })
                  }
                  className="w-full text-xs p-1 rounded bg-[#FAF8F5] border border-[#E5DCD2]"
                />
              </div>
            </div>
          </div>

          {/* Reputation / Social Exposure */}
          <div className="p-4 rounded bg-[#F4EFEB] border border-[#E5DCD2]">
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#B07C4A] mb-1">
              <Eye size={13} />
              <span>Visibility Boundary</span>
            </div>
            <select
              value={state.reputationTolerance}
              onChange={(e) =>
                onUpdateState({ ...state, reputationTolerance: e.target.value as any })
              }
              className="w-full mt-2 text-xs p-1.5 rounded bg-[#FAF8F5] border border-[#E5DCD2] text-[#1B1C1C] font-medium"
            >
              <option value="private_lab">Private Lab (Only confidants)</option>
              <option value="small_circle">Small Circle (Curated allies & early users)</option>
              <option value="public_experiment">Public Experiment (Open build-in-public)</option>
            </select>
            <p className="text-[11px] text-[#56423C] mt-2">
              Controlled exposure frees you from early stage performance anxiety.
            </p>
          </div>

          {/* Emotional Resilience */}
          <div className="p-4 rounded bg-[#F4EFEB] border border-[#E5DCD2]">
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#7B542B] mb-1">
              <HeartHandshake size={13} />
              <span>Emotional Readiness</span>
            </div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="font-serif text-2xl font-bold text-[#1B1C1C]">
                {state.emotionalReadinessScore} / 10
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              value={state.emotionalReadinessScore}
              onChange={(e) =>
                onUpdateState({ ...state, emotionalReadinessScore: Number(e.target.value) })
              }
              className="w-full mt-3 accent-[#4A6B5D]"
            />
            <p className="text-[11px] text-[#56423C] mt-1.5">
              Capacity to treat rejections as informative data points.
            </p>
          </div>
        </div>
      </div>

      {/* Explicit Boundary Commitments */}
      <div className="p-5 rounded-md bg-[#F4EFEB] border border-[#E5DCD2]">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#E5DCD2]">
          <div>
            <h3 className="font-serif font-semibold text-base text-[#1B1C1C]">
              Downside Inviolable Pledges
            </h3>
            <p className="text-xs text-[#56423C]">
              Rules you swear to follow so your downside remains strictly controlled.
            </p>
          </div>
          <span className="text-xs text-[#8A726A] font-medium">
            {state.boundaryCommitments.filter((b) => b.capped).length} / {state.boundaryCommitments.length} Active
          </span>
        </div>

        <div className="space-y-2.5">
          {state.boundaryCommitments.map((commitment) => (
            <div
              key={commitment.id}
              onClick={() => handleToggleCapped(commitment.id)}
              className="flex items-start justify-between gap-3 p-3 rounded bg-[#FAF8F5] border border-[#E5DCD2] hover:border-[#DBD1C5] cursor-pointer transition-all"
            >
              <div className="flex items-start gap-2.5">
                <button
                  type="button"
                  className="mt-0.5 text-[#4A6B5D]"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleCapped(commitment.id);
                  }}
                >
                  {commitment.capped ? (
                    <CheckCircle2 size={16} className="text-[#4A6B5D]" />
                  ) : (
                    <Circle size={16} className="text-[#8A726A]" />
                  )}
                </button>
                <span
                  className={`text-sm leading-relaxed ${
                    commitment.capped ? 'text-[#1B1C1C]' : 'text-[#8A726A] line-through'
                  }`}
                >
                  {commitment.text}
                </span>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteCommitment(commitment.id);
                }}
                className="text-xs text-[#8A726A] hover:text-[#BA1A1A] p-1"
                title="Remove boundary"
              >
                &times;
              </button>
            </div>
          ))}
        </div>

        {/* Add Boundary Input */}
        <form onSubmit={handleAddCommitment} className="mt-4 flex gap-2">
          <input
            type="text"
            value={newCommitmentText}
            onChange={(e) => setNewCommitmentText(e.target.value)}
            placeholder="e.g. Will not hire an employee until revenues cover 6 months salary..."
            className="flex-1 text-sm p-2 rounded bg-[#FAF8F5] border border-[#E5DCD2] focus:outline-none focus:border-[#4A6B5D]"
          />
          <button
            type="submit"
            className="flex items-center gap-1 px-3.5 py-2 text-xs font-semibold rounded bg-[#4A6B5D] hover:bg-[#446557] text-white"
          >
            <Plus size={13} />
            <span>Add Pledge</span>
          </button>
        </form>
      </div>
    </div>
  );
};
