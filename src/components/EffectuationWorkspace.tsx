import React from 'react';
import { EffectuationWorkspaceState, PrincipleName, MeansItem, QuiltPartner, LemonadeSurprise, PilotAction, AffordableLossState } from '../types/effectuation';
import { BirdInHandTab } from './tabs/BirdInHandTab';
import { AffordableLossTab } from './tabs/AffordableLossTab';
import { CrazyQuiltTab } from './tabs/CrazyQuiltTab';
import { LemonadeTab } from './tabs/LemonadeTab';
import { PilotInPlaneTab } from './tabs/PilotInPlaneTab';
import { DossierTab } from './tabs/DossierTab';
import { Feather, Shield, Grid, Sparkles, Compass, FileText, Layers } from 'lucide-react';

export type WorkspaceTabId = 'means' | 'loss' | 'quilt' | 'lemonade' | 'pilot' | 'dossier';

interface EffectuationWorkspaceProps {
  state: EffectuationWorkspaceState;
  activeTab: WorkspaceTabId;
  onTabChange: (tab: WorkspaceTabId) => void;
  onAddMean: (mean: Omit<MeansItem, 'id'>) => void;
  onToggleCatalyst: (id: string) => void;
  onDeleteMean: (id: string) => void;
  onUpdateLossState: (lossState: AffordableLossState) => void;
  onAddPartner: (partner: Omit<QuiltPartner, 'id'>) => void;
  onUpdatePartnerStatus: (id: string, status: QuiltPartner['status']) => void;
  onDeletePartner: (id: string) => void;
  onAddSurprise: (surprise: Omit<LemonadeSurprise, 'id'>) => void;
  onDeleteSurprise: (id: string) => void;
  onTogglePilotAction: (id: string) => void;
  onAddPilotAction: (action: Omit<PilotAction, 'id'>) => void;
  onDeletePilotAction: (id: string) => void;
  onUpdateVision: (vision: string) => void;
  onTriggerCounselorAction: (prompt: string) => void;
}

export const EffectuationWorkspace: React.FC<EffectuationWorkspaceProps> = ({
  state,
  activeTab,
  onTabChange,
  onAddMean,
  onToggleCatalyst,
  onDeleteMean,
  onUpdateLossState,
  onAddPartner,
  onUpdatePartnerStatus,
  onDeletePartner,
  onAddSurprise,
  onDeleteSurprise,
  onTogglePilotAction,
  onAddPilotAction,
  onDeletePilotAction,
  onUpdateVision,
  onTriggerCounselorAction,
}) => {
  const tabs = [
    {
      id: 'means' as WorkspaceTabId,
      label: 'Bird-in-Hand',
      sublabel: 'Means',
      icon: Feather,
      count: state.means.length,
      color: 'text-[#D96B43]',
      activeBorder: 'border-b-[#D96B43]',
    },
    {
      id: 'loss' as WorkspaceTabId,
      label: 'Affordable Loss',
      sublabel: 'Risk Armor',
      icon: Shield,
      count: `$${(state.affordableLoss.financialCeiling / 1000).toFixed(1)}k`,
      color: 'text-[#2D2D2D]',
      activeBorder: 'border-b-[#2D2D2D]',
    },
    {
      id: 'quilt' as WorkspaceTabId,
      label: 'Crazy Quilt',
      sublabel: 'Partners',
      icon: Grid,
      count: state.crazyQuilt.length,
      color: 'text-[#4A6B5D]',
      activeBorder: 'border-b-[#4A6B5D]',
    },
    {
      id: 'lemonade' as WorkspaceTabId,
      label: 'Lemonade',
      sublabel: 'Alchemy',
      icon: Sparkles,
      count: state.lemonade.length,
      color: 'text-[#B07C4A]',
      activeBorder: 'border-b-[#B07C4A]',
    },
    {
      id: 'pilot' as WorkspaceTabId,
      label: 'Pilot-in-Plane',
      sublabel: 'Agency',
      icon: Compass,
      count: `${state.pilotActions.filter((p) => p.completed).length}/${state.pilotActions.length}`,
      color: 'text-[#1B1C1C]',
      activeBorder: 'border-b-[#1B1C1C]',
    },
    {
      id: 'dossier' as WorkspaceTabId,
      label: 'Dossier',
      sublabel: 'Synthesis',
      icon: FileText,
      count: undefined,
      color: 'text-[#56423C]',
      activeBorder: 'border-b-[#56423C]',
    },
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-[#FAF8F5] overflow-hidden">
      {/* Editorial Navigation Bar */}
      <div className="border-b border-[#E5DCD2] bg-[#FAF8F5] px-6 pt-3 shrink-0">
        <div className="flex items-center justify-between pb-2 mb-1 border-b border-[#E5DCD2]/50">
          <div className="flex items-center gap-2">
            <Layers size={14} className="text-[#8A726A]" />
            <span className="text-[11px] font-semibold uppercase tracking-widest text-[#8A726A]">
              Dynamic Effectuation Canvas
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#56423C]">
            <span className="w-2 h-2 rounded-full bg-[#4A6B5D]" />
            <span>Sovereign Agency Live</span>
          </div>
        </div>

        {/* Tab Strip */}
        <div className="flex space-x-1 sm:space-x-2 overflow-x-auto scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 py-3 px-3 text-xs font-medium border-b-2 whitespace-nowrap transition-all ${
                  isActive
                    ? `border-[#D96B43] text-[#1B1C1C] font-semibold bg-[#F4EFEB]/50 rounded-t`
                    : 'border-transparent text-[#56423C] hover:text-[#1B1C1C] hover:border-[#DBD1C5]'
                }`}
              >
                <Icon size={14} className={isActive ? tab.color : 'text-[#8A726A]'} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-[#FAF8F5] text-[#1B1C1C] font-semibold' : 'bg-[#EFE8E1] text-[#8A726A]'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content Body */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'means' && (
          <BirdInHandTab
            means={state.means}
            onAddMean={onAddMean}
            onToggleCatalyst={onToggleCatalyst}
            onDeleteMean={onDeleteMean}
            onAskCounselorAboutMeans={() =>
              onTriggerCounselorAction(
                "Review my registered Means. How might 2 or 3 of these assets combine into a non-obvious pilot offering?"
              )
            }
          />
        )}

        {activeTab === 'loss' && (
          <AffordableLossTab
            state={state.affordableLoss}
            onUpdateState={onUpdateLossState}
            onAskCounselorAboutLoss={() =>
              onTriggerCounselorAction(
                "Audit my Affordable Loss settings. Am I accidentally falling into expected return forecasting, or is my downside genuinely capped?"
              )
            }
          />
        )}

        {activeTab === 'quilt' && (
          <CrazyQuiltTab
            partners={state.crazyQuilt}
            onAddPartner={onAddPartner}
            onUpdatePartnerStatus={onUpdatePartnerStatus}
            onDeletePartner={onDeletePartner}
            onAskCounselorAboutQuilt={() =>
              onTriggerCounselorAction(
                "How do I convert an 'Identified' stakeholder into a 'Committed' co-creator without coming across as a generic pitch?"
              )
            }
          />
        )}

        {activeTab === 'lemonade' && (
          <LemonadeTab
            surprises={state.lemonade}
            onAddSurprise={onAddSurprise}
            onDeleteSurprise={onDeleteSurprise}
            onAskCounselorToReframe={(event) =>
              onTriggerCounselorAction(
                `I experienced this unexpected surprise: "${event}". Help me reframe it through the Lemonade Principle into a strategic asset.`
              )
            }
          />
        )}

        {activeTab === 'pilot' && (
          <PilotInPlaneTab
            actions={state.pilotActions}
            onToggleAction={onTogglePilotAction}
            onAddAction={onAddPilotAction}
            onDeleteAction={onDeletePilotAction}
            onAskCounselorForSprint={() =>
              onTriggerCounselorAction(
                "Synthesize a new 48-Hour Micro-Action Sprint under my direct personal agency, requiring zero market prediction."
              )
            }
          />
        )}

        {activeTab === 'dossier' && (
          <DossierTab
            state={state}
            onUpdateVision={onUpdateVision}
          />
        )}
      </div>
    </div>
  );
};
