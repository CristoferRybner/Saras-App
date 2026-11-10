import React, { useState } from 'react';
import { QuiltPartner } from '../../types/effectuation';
import { PrincipleBadge } from '../PrincipleBadge';
import { Grid, Plus, Handshake, Users, CheckCircle, Clock, Trash2 } from 'lucide-react';

interface CrazyQuiltTabProps {
  partners: QuiltPartner[];
  onAddPartner: (partner: Omit<QuiltPartner, 'id'>) => void;
  onUpdatePartnerStatus: (id: string, status: QuiltPartner['status']) => void;
  onDeletePartner: (id: string) => void;
  onAskCounselorAboutQuilt: () => void;
}

export const CrazyQuiltTab: React.FC<CrazyQuiltTabProps> = ({
  partners,
  onAddPartner,
  onUpdatePartnerStatus,
  onDeletePartner,
  onAskCounselorAboutQuilt,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [relationship, setRelationship] = useState('');
  const [commitmentType, setCommitmentType] = useState<QuiltPartner['commitmentType']>('Pre-order');
  const [commitmentDetail, setCommitmentDetail] = useState('');
  const [status, setStatus] = useState<QuiltPartner['status']>('Identified');

  const filtered = filterStatus === 'all'
    ? partners
    : partners.filter((p) => p.status === filterStatus);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddPartner({
      name: name.trim(),
      role: role.trim() || 'Co-creator',
      relationship: relationship.trim() || 'Network contact',
      commitmentType,
      commitmentDetail: commitmentDetail.trim() || 'Committed participation in pilot tests',
      status,
    });

    setName('');
    setRole('');
    setRelationship('');
    setCommitmentDetail('');
    setShowAddModal(false);
  };

  const getStatusBadge = (s: QuiltPartner['status']) => {
    switch (s) {
      case 'Committed':
        return { bg: 'bg-[#C6EBD9]', text: 'text-[#002116]', border: 'border-[#4A6B5D]' };
      case 'Co-Creating':
        return { bg: 'bg-[#FAF0EB]', text: 'text-[#9D3E1A]', border: 'border-[#D96B43]' };
      case 'Conversation Scheduled':
        return { bg: 'bg-[#F8F2EB]', text: 'text-[#7B542B]', border: 'border-[#B07C4A]' };
      case 'Identified':
      default:
        return { bg: 'bg-[#EFE8E1]', text: 'text-[#56423C]', border: 'border-[#E5DCD2]' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5DCD2]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <PrincipleBadge principle="Crazy Quilt" size="md" />
            <span className="text-xs text-[#8A726A] font-medium tracking-wide">Pillar III</span>
          </div>
          <h2 className="font-serif text-2xl font-semibold text-[#1B1C1C]">
            The Crazy Quilt of Stakeholders
          </h2>
          <p className="text-sm text-[#56423C] mt-1 max-w-xl">
            You do not compete in a pre-existing vacuum. You stitch a patchwork quilt of self-selected partners who put skin-in-the-game to co-create the venture.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded bg-[#4A6B5D] hover:bg-[#3B574B] text-white transition-all shadow-sm"
          >
            <Plus size={13} />
            <span>Invite Stakeholder</span>
          </button>

          <button
            onClick={onAskCounselorAboutQuilt}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded border border-[#D96B43] text-[#D96B43] hover:bg-[#FAF0EB] transition-all"
          >
            <Handshake size={13} />
            <span>Ask Counselor</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E5DCD2] pb-2 overflow-x-auto">
        {['all', 'Committed', 'Co-Creating', 'Conversation Scheduled', 'Identified'].map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`px-3 py-1 text-xs font-medium rounded whitespace-nowrap transition-colors ${
              filterStatus === s
                ? 'bg-[#1B1C1C] text-[#FAF8F5]'
                : 'text-[#56423C] hover:bg-[#EFE8E1]'
            }`}
          >
            {s === 'all' ? `All Stakeholders (${partners.length})` : s}
          </button>
        ))}
      </div>

      {/* Add Stakeholder Modal / Form */}
      {showAddModal && (
        <form
          onSubmit={handleSubmit}
          className="p-5 rounded-md bg-[#F4EFEB] border border-[#E5DCD2] space-y-4 animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between pb-2 border-b border-[#E5DCD2]">
            <h3 className="font-serif font-semibold text-base text-[#1B1C1C]">
              Add Stakeholder to Your Crazy Quilt
            </h3>
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="text-xs text-[#8A726A] hover:text-[#1B1C1C]"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#56423C]">
                Name / Organization
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Elena Vance or Local Art Gallery"
                className="w-full text-sm p-2 rounded bg-[#FAF8F5] border border-[#E5DCD2] focus:outline-none focus:border-[#4A6B5D]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#56423C]">
                Role & Capability
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Commercial Pilot Space / Distributor"
                className="w-full text-sm p-2 rounded bg-[#FAF8F5] border border-[#E5DCD2] focus:outline-none focus:border-[#4A6B5D]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#56423C]">
                Commitment Type
              </label>
              <select
                value={commitmentType}
                onChange={(e) => setCommitmentType(e.target.value as any)}
                className="w-full text-sm p-2 rounded bg-[#FAF8F5] border border-[#E5DCD2] focus:outline-none focus:border-[#4A6B5D]"
              >
                <option value="Pre-order">Pre-order / Paid Pilot</option>
                <option value="Time / Advisory">Time / Advisory Co-Creation</option>
                <option value="Resource / Facility">Resource / Facility Access</option>
                <option value="Distribution">Distribution / Client Intro</option>
                <option value="Introductions">Introductions</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#56423C]">
                Commitment Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full text-sm p-2 rounded bg-[#FAF8F5] border border-[#E5DCD2] focus:outline-none focus:border-[#4A6B5D]"
              >
                <option value="Identified">Identified (Potential ally)</option>
                <option value="Conversation Scheduled">Conversation Scheduled</option>
                <option value="Co-Creating">Co-Creating (Testing together)</option>
                <option value="Committed">Committed (Skin-in-the-game)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#56423C]">
              Tangible Skin-in-the-game / Commitment Detail
            </label>
            <textarea
              rows={2}
              required
              value={commitmentDetail}
              onChange={(e) => setCommitmentDetail(e.target.value)}
              placeholder="What specific resource, pre-order, or pilot test have they agreed to?"
              className="w-full text-sm p-2 rounded bg-[#FAF8F5] border border-[#E5DCD2] focus:outline-none focus:border-[#4A6B5D]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="px-3 py-1.5 text-xs text-[#56423C] hover:bg-[#EFE8E1] rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold rounded bg-[#4A6B5D] hover:bg-[#3B574B] text-white shadow-sm"
            >
              Add to Quilt
            </button>
          </div>
        </form>
      )}

      {/* Quilt Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((partner) => {
          const badge = getStatusBadge(partner.status);

          return (
            <div
              key={partner.id}
              className="p-5 rounded bg-[#FAF8F5] border border-[#E5DCD2] hover:border-[#DBD1C5] shadow-[0_1px_3px_rgba(45,45,45,0.02)] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${badge.bg} ${badge.text} ${badge.border}`}>
                    {partner.status}
                  </span>

                  <div className="flex items-center gap-1">
                    <select
                      value={partner.status}
                      onChange={(e) => onUpdatePartnerStatus(partner.id, e.target.value as any)}
                      className="text-[11px] bg-[#F4EFEB] border border-[#E5DCD2] rounded px-1.5 py-0.5 text-[#56423C] focus:outline-none"
                    >
                      <option value="Identified">Identified</option>
                      <option value="Conversation Scheduled">Scheduled</option>
                      <option value="Co-Creating">Co-Creating</option>
                      <option value="Committed">Committed</option>
                    </select>

                    <button
                      onClick={() => onDeletePartner(partner.id)}
                      className="p-1 text-[#8A726A] hover:text-[#BA1A1A] rounded"
                      title="Remove partner"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>

                <h3 className="font-serif font-semibold text-base text-[#1B1C1C]">
                  {partner.name}
                </h3>
                <p className="text-xs text-[#8A726A] mb-3">
                  {partner.role} • {partner.relationship}
                </p>

                <div className="p-3 rounded bg-[#F4EFEB] border border-[#E5DCD2]/70 mb-3">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-[#4A6B5D] mb-1">
                    Commitment: {partner.commitmentType}
                  </div>
                  <p className="text-xs text-[#1B1C1C] leading-relaxed">
                    {partner.commitmentDetail}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#E5DCD2]/60 text-[11px] text-[#8A726A]">
                <span>Co-Creation Vector</span>
                <span className="font-serif italic text-[#56423C]">Quilt Node #{partner.id.slice(-3)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
