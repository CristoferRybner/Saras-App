import React, { useState, useEffect } from 'react';
import {
  ChatMessage,
  EffectuationWorkspaceState,
  PrincipleName,
  AvatarMood,
  ExtractedItem,
  MeansItem,
  QuiltPartner,
  LemonadeSurprise,
  PilotAction,
  AffordableLossState,
} from './types/effectuation';
import { INITIAL_CHAT_MESSAGES, INITIAL_WORKSPACE_STATE } from './data/initialData';
import { AvatarChamber } from './components/AvatarChamber';
import { DialogueStream } from './components/DialogueStream';
import { Composer } from './components/Composer';
import { EffectuationWorkspace, WorkspaceTabId } from './components/EffectuationWorkspace';
import { BookOpen, Sparkles, RotateCcw, MessageSquare, LayoutDashboard, Share2 } from 'lucide-react';

export default function App() {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('effectuation_messages');
    return saved ? JSON.parse(saved) : INITIAL_CHAT_MESSAGES;
  });

  const [workspaceState, setWorkspaceState] = useState<EffectuationWorkspaceState>(() => {
    const saved = localStorage.getItem('effectuation_workspace');
    return saved ? JSON.parse(saved) : INITIAL_WORKSPACE_STATE;
  });

  const [activeTab, setActiveTab] = useState<WorkspaceTabId>('means');
  const [isThinking, setIsThinking] = useState(false);
  const [avatarMood, setAvatarMood] = useState<AvatarMood>('reflective');
  const [activePrinciple, setActivePrinciple] = useState<PrincipleName>('Bird-in-Hand');
  const [latestSpeechText, setLatestSpeechText] = useState<string>(
    INITIAL_CHAT_MESSAGES[0].speechText || 'Welcome to the Effectuation Chamber.'
  );
  const [statusMessage, setStatusMessage] = useState<string>('Ready for sovereign dialogue');

  // Mobile layout switch: 'dialogue' | 'workspace'
  const [mobileView, setMobileView] = useState<'dialogue' | 'workspace'>('dialogue');

  // Persist state
  useEffect(() => {
    localStorage.setItem('effectuation_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('effectuation_workspace', JSON.stringify(workspaceState));
  }, [workspaceState]);

  // Handle incoming extracted items into workspace
  const integrateExtractedItems = (items: ExtractedItem[]) => {
    if (!items || items.length === 0) return;

    setWorkspaceState((prev) => {
      const next = { ...prev };

      items.forEach((item) => {
        if (item.category.startsWith('means_')) {
          const cat = item.category.replace('means_', '') as 'who_i_am' | 'what_i_know' | 'whom_i_know';
          const exists = next.means.some((m) => m.title.toLowerCase() === item.title.toLowerCase());
          if (!exists) {
            next.means = [
              ...next.means,
              {
                id: `m-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
                category: cat,
                title: item.title,
                description: item.detail,
                tags: ['Distilled from dialogue'],
                isCatalyst: true,
              },
            ];
          }
        } else if (item.category === 'affordable_loss') {
          const exists = next.affordableLoss.boundaryCommitments.some(
            (b) => b.text.toLowerCase() === item.detail.toLowerCase()
          );
          if (!exists) {
            next.affordableLoss = {
              ...next.affordableLoss,
              boundaryCommitments: [
                ...next.affordableLoss.boundaryCommitments,
                { id: `b-${Date.now()}`, text: item.detail || item.title, capped: true },
              ],
            };
          }
        } else if (item.category === 'crazy_quilt') {
          const exists = next.crazyQuilt.some((q) => q.name.toLowerCase() === item.title.toLowerCase());
          if (!exists) {
            next.crazyQuilt = [
              ...next.crazyQuilt,
              {
                id: `q-${Date.now()}`,
                name: item.title,
                role: 'Potential Co-creator',
                relationship: 'Identified in dialogue',
                commitmentType: 'Time / Advisory',
                commitmentDetail: item.detail,
                status: 'Identified',
              },
            ];
          }
        } else if (item.category === 'lemonade') {
          next.lemonade = [
            ...next.lemonade,
            {
              id: `l-${Date.now()}`,
              surpriseEvent: item.title,
              initialFear: 'Perceived setback or constraint',
              effectualReframe: item.detail,
              leveragedAction: 'Integrated into core venture narrative',
              date: 'Today',
            },
          ];
        } else if (item.category === 'pilot_action') {
          next.pilotActions = [
            ...next.pilotActions,
            {
              id: `p-${Date.now()}`,
              action: item.title,
              controllableFactor: item.detail,
              timeframe: 'Next 24 Hours',
              completed: false,
              principleLinked: 'Pilot-in-the-Plane',
            },
          ];
        }
      });

      return next;
    });
  };

  // Dispatch message to Counselor AI endpoint
  const handleSendMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsThinking(true);
    setStatusMessage('Sarasvathy is reflecting on your means...');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: messages.slice(-6).map((m) => ({ sender: m.sender, text: m.text })),
          workspaceState,
        }),
      });

      const data = await response.json();

      const counselorMsg: ChatMessage = {
        id: `cns-${Date.now()}`,
        sender: 'counselor',
        text: data.message,
        speechText: data.speechText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        principle: data.activePrinciple || 'Bird-in-Hand',
        mood: data.avatarMood || 'reflective',
        suggestedPrompts: data.suggestedPrompts,
        extractedItems: data.extractedItems,
      };

      setMessages((prev) => [...prev, counselorMsg]);
      setAvatarMood(data.avatarMood || 'reflective');
      setActivePrinciple(data.activePrinciple || 'Bird-in-Hand');
      if (data.speechText) {
        setLatestSpeechText(data.speechText);
      }

      if (data.extractedItems && data.extractedItems.length > 0) {
        integrateExtractedItems(data.extractedItems);
        setStatusMessage(`Distilled ${data.extractedItems.length} new effectual item(s) into canvas`);
      } else {
        setStatusMessage('Counsel provided');
      }
    } catch (err) {
      console.error('Chat error:', err);
      // Fallback response so user is never interrupted
      const fallbackMsg: ChatMessage = {
        id: `cns-${Date.now()}`,
        sender: 'counselor',
        text: `Consider the sovereign principle of **Bird-in-Hand**.\n\nEvery entrepreneurial venture begins not from a generic market prediction, but from who you are, what you know, and whom you know.\n\nWhat immediate step can you take in the next 24 hours that requires zero permission and zero speculative forecasting?`,
        speechText: "Every entrepreneurial venture begins with who you are, what you know, and whom you know. What immediate step requires zero prediction?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        principle: 'Bird-in-Hand',
        mood: 'reflective',
      };
      setMessages((prev) => [...prev, fallbackMsg]);
      setLatestSpeechText(fallbackMsg.speechText || '');
    } finally {
      setIsThinking(false);
    }
  };

  // Navigate directly to category tab from dialogue link
  const handleNavigateToCategory = (category: string) => {
    if (category.startsWith('means_')) {
      setActiveTab('means');
    } else if (category === 'affordable_loss') {
      setActiveTab('loss');
    } else if (category === 'crazy_quilt') {
      setActiveTab('quilt');
    } else if (category === 'lemonade') {
      setActiveTab('lemonade');
    } else if (category === 'pilot_action') {
      setActiveTab('pilot');
    }
    setMobileView('workspace');
  };

  const handleResetData = () => {
    if (confirm("Reset workspace and conversation to initial masterclass state?")) {
      setMessages(INITIAL_CHAT_MESSAGES);
      setWorkspaceState(INITIAL_WORKSPACE_STATE);
      setAvatarMood('reflective');
      setActivePrinciple('Bird-in-Hand');
      setLatestSpeechText(INITIAL_CHAT_MESSAGES[0].speechText || '');
      localStorage.removeItem('effectuation_messages');
      localStorage.removeItem('effectuation_workspace');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1B1C1C] flex flex-col antialiased">
      {/* Top Editorial Masthead Header */}
      <header className="border-b border-[#E5DCD2] bg-[#FAF8F5] px-6 py-3.5 shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-[#FAF0EB] border border-[#FFDBCF] text-[#D96B43]">
            <BookOpen size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-lg font-bold tracking-tight text-[#1B1C1C]">
                Editorial Effectuation
              </h1>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded bg-[#FAF0EB] text-[#D96B43] border border-[#FFDBCF]">
                Sarasvathy Framework
              </span>
            </div>
            <p className="text-xs text-[#56423C]">
              Socratic Venture Companion & Living Entrepreneurial Dossier
            </p>
          </div>
        </div>

        {/* Global actions and Mobile Switcher */}
        <div className="flex items-center gap-2">
          {/* Mobile view switch buttons */}
          <div className="flex md:hidden rounded border border-[#E5DCD2] bg-[#F4EFEB] p-0.5">
            <button
              onClick={() => setMobileView('dialogue')}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded ${
                mobileView === 'dialogue' ? 'bg-[#FAF8F5] text-[#1B1C1C] font-semibold' : 'text-[#56423C]'
              }`}
            >
              <MessageSquare size={13} />
              <span>Counsel</span>
            </button>
            <button
              onClick={() => setMobileView('workspace')}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded ${
                mobileView === 'workspace' ? 'bg-[#FAF8F5] text-[#1B1C1C] font-semibold' : 'text-[#56423C]'
              }`}
            >
              <LayoutDashboard size={13} />
              <span>Canvas</span>
            </button>
          </div>

          <button
            onClick={handleResetData}
            title="Reset to initial masterclass state"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#56423C] hover:text-[#1B1C1C] hover:bg-[#F4EFEB] rounded border border-transparent hover:border-[#E5DCD2] transition-all"
          >
            <RotateCcw size={13} />
            <span className="hidden sm:inline">Reset Example</span>
          </button>
        </div>
      </header>

      {/* Main Split-Pane Workspace (Desktop: 5 cols left, 7 cols right) */}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden max-w-[1720px] w-full mx-auto">
        {/* Left Pane: Interactive Avatar Chamber + Socratic Dialogue (5 cols / 42%) */}
        <div
          className={`flex-col md:w-[42%] lg:w-[40%] xl:w-[38%] border-r border-[#E5DCD2] bg-[#FAF8F5] h-full ${
            mobileView === 'dialogue' ? 'flex' : 'hidden md:flex'
          }`}
        >
          {/* 1. Interactive Avatar Chamber */}
          <AvatarChamber
            mood={avatarMood}
            isThinking={isThinking}
            activePrinciple={activePrinciple}
            latestSpeechText={latestSpeechText}
            onSelectPrinciplePrompt={handleSendMessage}
            statusMessage={statusMessage}
          />

          {/* 2. Socratic Dialogue Thread */}
          <DialogueStream
            messages={messages}
            isThinking={isThinking}
            onSelectPrompt={handleSendMessage}
            onNavigateToCategory={handleNavigateToCategory}
          />

          {/* 3. Bookish Dialogue Composer */}
          <Composer
            onSendMessage={handleSendMessage}
            isThinking={isThinking}
          />
        </div>

        {/* Right Pane: Dynamic Effectuation Workspace (7 cols / 58%) */}
        <div
          className={`flex-1 h-full overflow-hidden ${
            mobileView === 'workspace' ? 'flex' : 'hidden md:flex'
          }`}
        >
          <EffectuationWorkspace
            state={workspaceState}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onAddMean={(m) =>
              setWorkspaceState((prev) => ({
                ...prev,
                means: [...prev.means, { ...m, id: `m-${Date.now()}` }],
              }))
            }
            onToggleCatalyst={(id) =>
              setWorkspaceState((prev) => ({
                ...prev,
                means: prev.means.map((m) =>
                  m.id === id ? { ...m, isCatalyst: !m.isCatalyst } : m
                ),
              }))
            }
            onDeleteMean={(id) =>
              setWorkspaceState((prev) => ({
                ...prev,
                means: prev.means.filter((m) => m.id !== id),
              }))
            }
            onUpdateLossState={(lossState) =>
              setWorkspaceState((prev) => ({
                ...prev,
                affordableLoss: lossState,
              }))
            }
            onAddPartner={(p) =>
              setWorkspaceState((prev) => ({
                ...prev,
                crazyQuilt: [...prev.crazyQuilt, { ...p, id: `q-${Date.now()}` }],
              }))
            }
            onUpdatePartnerStatus={(id, status) =>
              setWorkspaceState((prev) => ({
                ...prev,
                crazyQuilt: prev.crazyQuilt.map((q) =>
                  q.id === id ? { ...q, status } : q
                ),
              }))
            }
            onDeletePartner={(id) =>
              setWorkspaceState((prev) => ({
                ...prev,
                crazyQuilt: prev.crazyQuilt.filter((q) => q.id !== id),
              }))
            }
            onAddSurprise={(s) =>
              setWorkspaceState((prev) => ({
                ...prev,
                lemonade: [...prev.lemonade, { ...s, id: `l-${Date.now()}` }],
              }))
            }
            onDeleteSurprise={(id) =>
              setWorkspaceState((prev) => ({
                ...prev,
                lemonade: prev.lemonade.filter((l) => l.id !== id),
              }))
            }
            onTogglePilotAction={(id) =>
              setWorkspaceState((prev) => ({
                ...prev,
                pilotActions: prev.pilotActions.map((p) =>
                  p.id === id ? { ...p, completed: !p.completed } : p
                ),
              }))
            }
            onAddPilotAction={(a) =>
              setWorkspaceState((prev) => ({
                ...prev,
                pilotActions: [...prev.pilotActions, { ...a, id: `p-${Date.now()}` }],
              }))
            }
            onDeletePilotAction={(id) =>
              setWorkspaceState((prev) => ({
                ...prev,
                pilotActions: prev.pilotActions.filter((p) => p.id !== id),
              }))
            }
            onUpdateVision={(vision) =>
              setWorkspaceState((prev) => ({
                ...prev,
                founderVision: vision,
              }))
            }
            onTriggerCounselorAction={(prompt) => {
              handleSendMessage(prompt);
              if (window.innerWidth < 768) {
                setMobileView('dialogue');
              }
            }}
          />
        </div>
      </main>
    </div>
  );
}
