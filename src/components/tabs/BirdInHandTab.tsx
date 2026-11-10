import React, { useState } from 'react';
import { MeansItem } from '../../types/effectuation';
import { PrincipleBadge } from '../PrincipleBadge';
import { Plus, Star, Tag, Trash2, Lightbulb, UserCheck, BookOpen, Users } from 'lucide-react';

interface BirdInHandTabProps {
  means: MeansItem[];
  onAddMean: (mean: Omit<MeansItem, 'id'>) => void;
  onToggleCatalyst: (id: string) => void;
  onDeleteMean: (id: string) => void;
  onAskCounselorAboutMeans: () => void;
}

export const BirdInHandTab: React.FC<BirdInHandTabProps> = ({
  means,
  onAddMean,
  onToggleCatalyst,
  onDeleteMean,
  onAskCounselorAboutMeans,
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'who_i_am' | 'what_i_know' | 'whom_i_know'>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'who_i_am' | 'what_i_know' | 'whom_i_know'>('who_i_am');
  const [newDescription, setNewDescription] = useState('');
  const [newTags, setNewTags] = useState('');

  const filteredMeans = activeCategory === 'all'
    ? means
    : means.filter((m) => m.category === activeCategory);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddMean({
      title: newTitle.trim(),
      category: newCategory,
      description: newDescription.trim(),
      tags: newTags.split(',').map((t) => t.trim()).filter(Boolean),
      isCatalyst: true,
    });

    setNewTitle('');
    setNewDescription('');
    setNewTags('');
    setShowAddForm(false);
  };

  const categoryMeta = {
    who_i_am: {
      label: 'Who I Am',
      sub: 'Identity, values, intrinsic taste, obsession',
      icon: UserCheck,
      color: 'text-[#9D3E1A]',
      bg: 'bg-[#FAF0EB]',
    },
    what_i_know: {
      label: 'What I Know',
      sub: 'Tacit expertise, skills, domain insight',
      icon: BookOpen,
      color: 'text-[#4A6B5D]',
      bg: 'bg-[#E5EFE9]',
    },
    whom_i_know: {
      label: 'Whom I Know',
      sub: 'Immediate allies, latent networks, suppliers',
      icon: Users,
      color: 'text-[#B07C4A]',
      bg: 'bg-[#F8F2EB]',
    },
  };

  return (
    <div className="space-y-6">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5DCD2]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <PrincipleBadge principle="Bird-in-Hand" size="md" />
            <span className="text-xs text-[#8A726A] font-medium tracking-wide">Pillar I</span>
          </div>
          <h2 className="font-serif text-2xl font-semibold text-[#1B1C1C]">
            Inventory of Sovereign Means
          </h2>
          <p className="text-sm text-[#56423C] mt-1 max-w-xl">
            Effectual founders do not wait for external opportunities or massive funding. They construct viable moves from who they are, what they know, and whom they already know.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded bg-[#D96B43] hover:bg-[#BD5630] text-white transition-all shadow-sm hover:translate-y-[1px]"
          >
            <Plus size={13} />
            <span>Record Mean</span>
          </button>

          <button
            onClick={onAskCounselorAboutMeans}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded border border-[#4A6B5D] text-[#4A6B5D] hover:bg-[#E5EFE9] transition-all"
            title="Ask the counselor to analyze unexpected combos in your means"
          >
            <Lightbulb size={13} />
            <span>Combine Means</span>
          </button>
        </div>
      </div>

      {/* Category Pill Filters */}
      <div className="flex items-center gap-2 border-b border-[#E5DCD2] pb-2">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
            activeCategory === 'all'
              ? 'bg-[#1B1C1C] text-[#FAF8F5]'
              : 'text-[#56423C] hover:bg-[#EFE8E1]'
          }`}
        >
          All Means ({means.length})
        </button>
        {(['who_i_am', 'what_i_know', 'whom_i_know'] as const).map((cat) => {
          const meta = categoryMeta[cat];
          const count = means.filter((m) => m.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded transition-colors ${
                activeCategory === cat
                  ? 'bg-[#EFE8E1] text-[#1B1C1C] font-semibold'
                  : 'text-[#56423C] hover:bg-[#EFE8E1]'
              }`}
            >
              <meta.icon size={12} className={meta.color} />
              <span>{meta.label}</span>
              <span className="text-[11px] text-[#8A726A]">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Add Mean Form Drawer */}
      {showAddForm && (
        <form
          onSubmit={handleCreate}
          className="p-5 rounded-md bg-[#F4EFEB] border border-[#E5DCD2] space-y-4 animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between pb-2 border-b border-[#E5DCD2]">
            <h3 className="font-serif font-semibold text-base text-[#1B1C1C]">
              Articulate a New Sovereign Asset
            </h3>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-xs text-[#8A726A] hover:text-[#1B1C1C]"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#56423C]">
                Asset / Capability Title
              </label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. 10 years experience in hospitality logistics"
                className="w-full text-sm p-2 rounded bg-[#FAF8F5] border border-[#E5DCD2] focus:outline-none focus:border-[#D96B43]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#56423C]">
                Category
              </label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as any)}
                className="w-full text-sm p-2 rounded bg-[#FAF8F5] border border-[#E5DCD2] focus:outline-none focus:border-[#D96B43]"
              >
                <option value="who_i_am">Who I Am (Identity)</option>
                <option value="what_i_know">What I Know (Expertise)</option>
                <option value="whom_i_know">Whom I Know (Network)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#56423C]">
              Nuanced Context & Tangible Reality
            </label>
            <textarea
              rows={2}
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Why is this a concrete asset? How does it anchor your direct agency?"
              className="w-full text-sm p-2 rounded bg-[#FAF8F5] border border-[#E5DCD2] focus:outline-none focus:border-[#D96B43]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#56423C]">
              Tags (Comma separated)
            </label>
            <input
              type="text"
              value={newTags}
              onChange={(e) => setNewTags(e.target.value)}
              placeholder="Craft, Acoustic physics, Direct contact"
              className="w-full text-sm p-2 rounded bg-[#FAF8F5] border border-[#E5DCD2] focus:outline-none focus:border-[#D96B43]"
            />
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
              className="px-4 py-1.5 text-xs font-semibold rounded bg-[#D96B43] hover:bg-[#BD5630] text-white shadow-sm"
            >
              Save to Means
            </button>
          </div>
        </form>
      )}

      {/* Means Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredMeans.map((item) => {
          const meta = categoryMeta[item.category];
          const Icon = meta.icon;

          return (
            <div
              key={item.id}
              className={`p-4 rounded bg-[#F4EFEB] border border-[#E5DCD2] hover:border-[#DBD1C5] transition-all flex flex-col justify-between group ${
                item.isCatalyst ? 'ring-1 ring-[#D96B43]/30' : ''
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-0.5 rounded-full ${meta.bg} ${meta.color}`}
                  >
                    <Icon size={11} />
                    <span>{meta.label}</span>
                  </span>

                  <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onToggleCatalyst(item.id)}
                      title={item.isCatalyst ? 'Marked as Core Catalyst' : 'Mark as Core Catalyst'}
                      className={`p-1 rounded hover:bg-[#EFE8E1] ${
                        item.isCatalyst ? 'text-[#D96B43]' : 'text-[#8A726A]'
                      }`}
                    >
                      <Star size={13} fill={item.isCatalyst ? 'currentColor' : 'none'} />
                    </button>
                    <button
                      onClick={() => onDeleteMean(item.id)}
                      title="Remove mean"
                      className="p-1 rounded text-[#8A726A] hover:text-[#BA1A1A] hover:bg-[#EFE8E1]"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                <h4 className="font-serif font-semibold text-base text-[#1B1C1C] mb-1.5">
                  {item.title}
                </h4>

                <p className="text-sm text-[#56423C] leading-relaxed mb-3">
                  {item.description}
                </p>
              </div>

              {item.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-[#E5DCD2]/60">
                  <Tag size={11} className="text-[#8A726A]" />
                  {item.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="text-[11px] px-2 py-0.5 rounded bg-[#FAF8F5] text-[#56423C] border border-[#E5DCD2]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
