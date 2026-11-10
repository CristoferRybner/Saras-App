import React, { useState } from 'react';
import { PilotAction, PrincipleName } from '../../types/effectuation';
import { PrincipleBadge } from '../PrincipleBadge';
import { Compass, Plus, CheckCircle2, Circle, ArrowUpRight, Clock, Target, Trash2 } from 'lucide-react';

interface PilotInPlaneTabProps {
  actions: PilotAction[];
  onToggleAction: (id: string) => void;
  onAddAction: (action: Omit<PilotAction, 'id'>) => void;
  onDeleteAction: (id: string) => void;
  onAskCounselorForSprint: () => void;
}

export const PilotInPlaneTab: React.FC<PilotInPlaneTabProps> = ({
  actions,
  onToggleAction,
  onAddAction,
  onDeleteAction,
  onAskCounselorForSprint,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [actionText, setActionText] = useState('');
  const [controllableText, setControllableText] = useState('');
  const [timeframe, setTimeframe] = useState<PilotAction['timeframe']>('Next 24 Hours');
  const [principleLinked, setPrincipleLinked] = useState<PrincipleName>('Pilot-in-the-Plane');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!actionText.trim()) return;

    onAddAction({
      action: actionText.trim(),
      controllableFactor: controllableText.trim() || 'Direct personal execution without relying on unknown third-party speculation.',
      timeframe,
      completed: false,
      principleLinked,
    });

    setActionText('');
    setControllableText('');
    setShowAddForm(false);
  };

  const completedCount = actions.filter((a) => a.completed).length;

  return (
    <div className="space-y-6">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5DCD2]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <PrincipleBadge principle="Pilot-in-the-Plane" size="md" />
            <span className="text-xs text-[#8A726A] font-medium tracking-wide">Pillar V</span>
          </div>
          <h2 className="font-serif text-2xl font-semibold text-[#1B1C1C]">
            Non-Predictive Agency & 48-Hour Sprints
          </h2>
          <p className="text-sm text-[#56423C] mt-1 max-w-xl">
            You are the pilot. Weather conditions cannot be predicted 6 months out, but immediate navigational controls are under your direct hand.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded bg-[#1B1C1C] hover:bg-[#303030] text-white transition-all shadow-sm"
          >
            <Plus size={13} />
            <span>Plot Micro-Action</span>
          </button>

          <button
            onClick={onAskCounselorForSprint}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded border border-[#1B1C1C] text-[#1B1C1C] hover:bg-[#EFE8E1] transition-all"
          >
            <Compass size={13} />
            <span>Generate 48h Sprint</span>
          </button>
        </div>
      </div>

      {/* Sprint Progress Bar */}
      <div className="p-4 rounded bg-[#FAF8F5] border border-[#DBD1C5] flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-[#ECE8E3] text-[#1A1A1A]">
            <Target size={18} />
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[#56423C]">
              Direct Agency Velocity
            </div>
            <div className="text-sm font-medium text-[#1B1C1C]">
              {completedCount} of {actions.length} Controllable Actions Executed
            </div>
          </div>
        </div>

        <div className="w-36 bg-[#E5DCD2] h-2 rounded-full overflow-hidden">
          <div
            className="bg-[#D96B43] h-full transition-all duration-500"
            style={{
              width: `${actions.length ? (completedCount / actions.length) * 100 : 0}%`,
            }}
          />
        </div>
      </div>

      {/* Add Action Drawer */}
      {showAddForm && (
        <form
          onSubmit={handleSubmit}
          className="p-5 rounded-md bg-[#F4EFEB] border border-[#E5DCD2] space-y-4 animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between pb-2 border-b border-[#E5DCD2]">
            <h3 className="font-serif font-semibold text-base text-[#1B1C1C]">
              Define an Action Under Direct Agency
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
              Action to Execute
            </label>
            <input
              type="text"
              required
              value={actionText}
              onChange={(e) => setActionText(e.target.value)}
              placeholder="e.g. Call Elena to bring 2 sample swatches for acoustic test..."
              className="w-full text-sm p-2 rounded bg-[#FAF8F5] border border-[#E5DCD2] focus:outline-none focus:border-[#1B1C1C]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#56423C]">
                Why is this 100% Controllable? (No Prediction)
              </label>
              <input
                type="text"
                value={controllableText}
                onChange={(e) => setControllableText(e.target.value)}
                placeholder="We already possess Elena's direct phone number."
                className="w-full text-sm p-2 rounded bg-[#FAF8F5] border border-[#E5DCD2] focus:outline-none focus:border-[#1B1C1C]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#56423C]">
                Timeframe
              </label>
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value as any)}
                className="w-full text-sm p-2 rounded bg-[#FAF8F5] border border-[#E5DCD2] focus:outline-none focus:border-[#1B1C1C]"
              >
                <option value="Next 24 Hours">Next 24 Hours (Immediate)</option>
                <option value="This Week">This Week (High agency)</option>
                <option value="Within 14 Days">Within 14 Days</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#56423C]">
              Anchoring Principle
            </label>
            <select
              value={principleLinked}
              onChange={(e) => setPrincipleLinked(e.target.value as any)}
              className="w-full text-sm p-2 rounded bg-[#FAF8F5] border border-[#E5DCD2] focus:outline-none focus:border-[#1B1C1C]"
            >
              <option value="Pilot-in-the-Plane">Pilot-in-the-Plane (Direct Agency)</option>
              <option value="Bird-in-Hand">Bird-in-Hand (Mobilize Means)</option>
              <option value="Affordable Loss">Affordable Loss (Capped Experiment)</option>
              <option value="Crazy Quilt">Crazy Quilt (Secure Commitment)</option>
              <option value="Lemonade">Lemonade (Turn Surprise)</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 text-xs text-[#56423C] hover:bg-[#EFE8E1] rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold rounded bg-[#1B1C1C] hover:bg-[#303030] text-white shadow-sm"
            >
              Add Action
            </button>
          </div>
        </form>
      )}

      {/* Action Sprint Checklist */}
      <div className="space-y-3">
        {actions.map((item) => (
          <div
            key={item.id}
            onClick={() => onToggleAction(item.id)}
            className={`p-4 rounded border transition-all cursor-pointer flex items-start justify-between gap-4 ${
              item.completed
                ? 'bg-[#F4EFEB]/60 border-[#E5DCD2] opacity-75'
                : 'bg-[#FAF8F5] border-[#E5DCD2] hover:border-[#DBD1C5] shadow-[0_1px_2px_rgba(45,45,45,0.02)]'
            }`}
          >
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <button
                type="button"
                className="mt-0.5 text-[#D96B43]"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleAction(item.id);
                }}
              >
                {item.completed ? (
                  <CheckCircle2 size={18} className="text-[#4A6B5D]" />
                ) : (
                  <Circle size={18} className="text-[#8A726A]" />
                )}
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span
                    className={`font-serif text-base leading-snug font-medium ${
                      item.completed ? 'text-[#8A726A] line-through' : 'text-[#1B1C1C]'
                    }`}
                  >
                    {item.action}
                  </span>
                </div>

                <p className="text-xs text-[#56423C] mb-2 leading-relaxed">
                  <strong className="text-[#8A726A] font-semibold">Locus of Agency:</strong> {item.controllableFactor}
                </p>

                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded bg-[#F4EFEB] text-[#56423C] border border-[#E5DCD2]">
                    <Clock size={11} />
                    <span>{item.timeframe}</span>
                  </span>

                  <PrincipleBadge principle={item.principleLinked} size="sm" />
                </div>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteAction(item.id);
              }}
              className="text-xs text-[#8A726A] hover:text-[#BA1A1A] p-1.5"
              title="Remove action"
            >
              <Trash2 size={13} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
