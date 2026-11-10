export type PrincipleName = 
  | 'Bird-in-Hand'
  | 'Affordable Loss'
  | 'Crazy Quilt'
  | 'Lemonade'
  | 'Pilot-in-the-Plane';

export type AvatarMood = 'reflective' | 'probing' | 'synthesizing' | 'catalytic' | 'encouraging';

export interface ChatMessage {
  id: string;
  sender: 'counselor' | 'user';
  text: string;
  speechText?: string;
  timestamp: string;
  principle?: PrincipleName;
  mood?: AvatarMood;
  suggestedPrompts?: string[];
  extractedItems?: ExtractedItem[];
}

export interface ExtractedItem {
  category: 
    | 'means_who_i_am' 
    | 'means_what_i_know' 
    | 'means_whom_i_know' 
    | 'affordable_loss' 
    | 'crazy_quilt' 
    | 'lemonade' 
    | 'pilot_action';
  title: string;
  detail: string;
  actionable?: boolean;
}

export interface MeansItem {
  id: string;
  category: 'who_i_am' | 'what_i_know' | 'whom_i_know';
  title: string;
  description: string;
  tags: string[];
  isCatalyst?: boolean;
}

export interface AffordableLossState {
  financialCeiling: number; // in USD
  financialDescription: string;
  temporalHoursPerWeek: number;
  temporalWeeksDuration: number;
  reputationTolerance: 'private_lab' | 'small_circle' | 'public_experiment';
  emotionalReadinessScore: number; // 1 - 10
  boundaryCommitments: {
    id: string;
    text: string;
    capped: boolean;
  }[];
}

export interface QuiltPartner {
  id: string;
  name: string;
  role: string;
  relationship: string;
  commitmentType: 'Pre-order' | 'Time / Advisory' | 'Resource / Facility' | 'Distribution' | 'Introductions';
  commitmentDetail: string;
  status: 'Identified' | 'Conversation Scheduled' | 'Co-Creating' | 'Committed';
}

export interface LemonadeSurprise {
  id: string;
  surpriseEvent: string; // The unexpected roadblock or rejection
  initialFear: string; // What seemed lost
  effectualReframe: string; // The asset or angle discovered
  leveragedAction: string; // Action taken
  date: string;
}

export interface PilotAction {
  id: string;
  action: string;
  controllableFactor: string; // Why this is under personal control vs prediction
  timeframe: 'Next 24 Hours' | 'This Week' | 'Within 14 Days';
  completed: boolean;
  principleLinked: PrincipleName;
}

export interface EffectuationWorkspaceState {
  means: MeansItem[];
  affordableLoss: AffordableLossState;
  crazyQuilt: QuiltPartner[];
  lemonade: LemonadeSurprise[];
  pilotActions: PilotAction[];
  founderVision: string;
}
