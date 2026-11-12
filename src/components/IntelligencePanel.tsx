import React, { useState } from 'react';
import { 
  AlertCircle, 
  CheckCircle2, 
  AlertTriangle, 
  Send, 
  Copy, 
  Check, 
  Sparkles, 
  MessageSquare, 
  ListFilter, 
  SlidersHorizontal,
  ChevronRight,
  ShieldAlert,
  HelpCircle,
  Briefcase,
  Layers,
  ArrowRight,
  CornerDownRight,
  RefreshCw
} from 'lucide-react';
import { ContractDocument, ClauseAnalysis, ClauseCategory, RiskLevel, ChatMessage } from '../types/contract';
import { askContract, generateAlternateCounter } from '../services/api';

interface IntelligencePanelProps {
  document: ContractDocument;
  selectedClauseId: string | null;
  onSelectClause: (clauseId: string) => void;
  onUpdateClause: (updated: ClauseAnalysis) => void;
  chatMessages: ChatMessage[];
  onAddChatMessage: (msg: ChatMessage) => void;
  activeTab: 'clauses' | 'ask' | 'playbook';
  onTabChange: (tab: 'clauses' | 'ask' | 'playbook') => void;
}

export const IntelligencePanel: React.FC<IntelligencePanelProps> = ({
  document,
  selectedClauseId,
  onSelectClause,
  onUpdateClause,
  chatMessages,
  onAddChatMessage,
  activeTab,
  onTabChange,
}) => {
  // Filters
  const [selectedRiskFilter, setSelectedRiskFilter] = useState<'All' | RiskLevel>('All');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');

  // Chat state
  const [chatInput, setChatInput] = useState('');
  const [isAsking, setIsAsking] = useState(false);

  // Copy feedback state
  const [copiedClauseId, setCopiedClauseId] = useState<string | null>(null);
  const [tuningClauseId, setTuningClauseId] = useState<string | null>(null);

  // Filter clauses
  const filteredClauses = document.clauses.filter((clause) => {
    if (selectedRiskFilter !== 'All' && clause.riskLevel !== selectedRiskFilter) {
      return false;
    }
    if (selectedCategoryFilter !== 'All' && clause.category !== selectedCategoryFilter) {
      return false;
    }
    return true;
  });

  // Calculate risk statistics
  const highRiskCount = document.clauses.filter((c) => c.riskLevel === 'High Risk').length;
  const medRiskCount = document.clauses.filter((c) => c.riskLevel === 'Medium Risk').length;
  const compRiskCount = document.clauses.filter((c) => c.riskLevel === 'Compliant').length;

  const handleCopyCounter = (clause: ClauseAnalysis) => {
    const textToCopy = clause.customCounterClause || clause.suggestedCounterClause;
    navigator.clipboard.writeText(textToCopy);
    setCopiedClauseId(clause.id);
    setTimeout(() => setCopiedClauseId(null), 2000);
  };

  const handleTuneTone = async (clause: ClauseAnalysis, tone: 'aggressive' | 'balanced' | 'vendor_favorable') => {
    setTuningClauseId(clause.id);
    try {
      const newCounter = await generateAlternateCounter(clause.exactQuote, clause.category, tone);
      onUpdateClause({
        ...clause,
        customCounterClause: newCounter,
        status: 'customized',
      });
    } catch (e) {
      console.error(e);
    } finally {
      setTuningClauseId(null);
    }
  };

  const handleToggleAccept = (clause: ClauseAnalysis) => {
    const newStatus = clause.status === 'accepted' ? 'pending' : 'accepted';
    onUpdateClause({
      ...clause,
      status: newStatus,
    });
  };

  const handleSendChat = async (queryText?: string) => {
    const text = queryText || chatInput;
    if (!text.trim() || isAsking) return;

    const userMsg: ChatMessage = {
      id: `chat-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };
    onAddChatMessage(userMsg);
    setChatInput('');
    setIsAsking(true);

    try {
      const response = await askContract(
        document.content,
        document.title,
        text,
        chatMessages.map((m) => ({ role: m.role, content: m.content }))
      );

      const aiMsg: ChatMessage = {
        id: `chat-ai-${Date.now()}`,
        role: 'assistant',
        content: response.answer,
        timestamp: new Date().toISOString(),
        citations: response.citations,
      };
      onAddChatMessage(aiMsg);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `chat-err-${Date.now()}`,
        role: 'assistant',
        content: `Error: Unable to query contract. ${err?.message || 'Please try again.'}`,
        timestamp: new Date().toISOString(),
      };
      onAddChatMessage(errorMsg);
    } finally {
      setIsAsking(false);
    }
  };

  const preconfiguredQuestions = [
    'What happens if service uptime drops below 99.9%?',
    'Does vendor have the right to unilaterally increase prices on renewal?',
    'Who pays for patent infringement defense under indemnification?',
    'What are our data deletion rights and timeline upon contract termination?',
    'Is there an aggregate limitation of liability super-cap carveout?'
  ];

  return (
    <div className="flex flex-col h-full bg-slate-50/50 dark:bg-slate-900 overflow-hidden">
      {/* Top Section: High-Density Executive Risk Score Card */}
      <div className="p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shrink-0">
        <div className="flex items-center justify-between gap-4 mb-2.5">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Exposure Index
              </span>
              <span className="text-[11px] text-slate-400">·</span>
              <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                Enterprise Benchmark Audit
              </span>
            </div>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums">
                {document.overallRiskScore}
              </span>
              <span className="text-xs text-slate-500 font-mono">/ 100</span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                document.overallRiskScore > 65
                  ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                  : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
              }`}>
                {document.overallRiskScore > 65 ? 'High Risk Exposure' : 'Moderate Exposure'}
              </span>
            </div>
          </div>

          {/* Risk Distribution Breakdown */}
          <div className="flex items-center gap-2 text-right">
            <div className="flex flex-col items-end">
              <span className="text-[11px] text-slate-500 dark:text-slate-400">Classified Clauses</span>
              <div className="flex items-center gap-2 font-mono text-xs tabular-nums mt-0.5">
                <span className="text-rose-600 dark:text-rose-400 font-bold">{highRiskCount} High</span>
                <span className="text-slate-300 dark:text-slate-700">·</span>
                <span className="text-amber-600 dark:text-amber-400 font-bold">{medRiskCount} Med</span>
                <span className="text-slate-300 dark:text-slate-700">·</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">{compRiskCount} Comp</span>
              </div>
            </div>
          </div>
        </div>

        {/* Multi-segment risk progress bar */}
        <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
          <div 
            style={{ width: `${(highRiskCount / Math.max(1, document.clauses.length)) * 100}%` }} 
            className="bg-rose-500 h-full"
            title={`${highRiskCount} High Risk Clauses`}
          />
          <div 
            style={{ width: `${(medRiskCount / Math.max(1, document.clauses.length)) * 100}%` }} 
            className="bg-amber-500 h-full"
            title={`${medRiskCount} Medium Risk Clauses`}
          />
          <div 
            style={{ width: `${(compRiskCount / Math.max(1, document.clauses.length)) * 100}%` }} 
            className="bg-emerald-500 h-full"
            title={`${compRiskCount} Compliant Clauses`}
          />
        </div>

        {/* Executive Summary Kicker */}
        <p className="mt-2.5 text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
          {document.executiveSummary}
        </p>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center border-b border-slate-200 dark:border-slate-800 px-4 bg-white dark:bg-slate-900 shrink-0">
        <button
          onClick={() => onTabChange('clauses')}
          className={`flex items-center gap-2 px-3 py-2.5 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'clauses'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Clause Intelligence ({document.clauses.length})</span>
        </button>

        <button
          onClick={() => onTabChange('ask')}
          className={`flex items-center gap-2 px-3 py-2.5 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'ask'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Ask this Contract</span>
          {chatMessages.length > 0 && (
            <span className="font-mono text-[10px] bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 px-1.5 py-0.2 rounded-full">
              {chatMessages.length}
            </span>
          )}
        </button>

        <button
          onClick={() => onTabChange('playbook')}
          className={`flex items-center gap-2 px-3 py-2.5 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'playbook'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>Procurement Playbook</span>
        </button>
      </div>

      {/* TAB 1: CLAUSE INTELLIGENCE */}
      {activeTab === 'clauses' && (
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {/* Filter Bar */}
          <div className="p-3 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 space-y-2 shrink-0">
            {/* Risk Level Filter Buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
              <span className="text-[11px] font-semibold text-slate-500 mr-1 shrink-0">Risk:</span>
              {(['All', 'High Risk', 'Medium Risk', 'Compliant'] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setSelectedRiskFilter(lvl)}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                    selectedRiskFilter === lvl
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>

            {/* Category Filter Buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto text-xs pt-1">
              <span className="text-[11px] font-semibold text-slate-500 mr-1 shrink-0">Category:</span>
              {['All', 'Indemnification', 'Data Privacy', 'Termination', 'Payment Terms'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategoryFilter(cat)}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors whitespace-nowrap cursor-pointer ${
                    selectedCategoryFilter === cat
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Clause Cards Scrollable Viewport */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {filteredClauses.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                No clauses match the selected risk and category filter.
              </div>
            ) : (
              filteredClauses.map((clause) => {
                const isSelected = clause.id === selectedClauseId;
                const isCopied = copiedClauseId === clause.id;
                const isTuning = tuningClauseId === clause.id;
                const isAccepted = clause.status === 'accepted';

                return (
                  <div
                    key={clause.id}
                    id={`clause-card-${clause.id}`}
                    onClick={() => onSelectClause(clause.id)}
                    className={`p-4 rounded-lg border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white dark:bg-slate-800 border-indigo-500 dark:border-indigo-500 shadow-md ring-1 ring-indigo-500'
                        : 'bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs'
                    }`}
                  >
                    {/* Clause Header */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                          {clause.sectionNumber}
                        </span>
                        <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">
                          {clause.title}
                        </span>
                      </div>

                      {/* Risk Badge */}
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded shrink-0 ${
                        clause.riskLevel === 'High Risk'
                          ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400 border border-rose-200 dark:border-rose-900'
                          : clause.riskLevel === 'Medium Risk'
                          ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400 border border-amber-200 dark:border-amber-900'
                          : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900'
                      }`}>
                        {clause.riskLevel}
                      </span>
                    </div>

                    {/* Verbatim Excerpt */}
                    <div className="p-2.5 rounded bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 font-serif text-xs text-slate-700 dark:text-slate-300 italic mb-2.5">
                      "{clause.exactQuote}"
                    </div>

                    {/* Risk Diagnosis */}
                    <div className="space-y-1.5 text-xs mb-3">
                      <div className="text-slate-600 dark:text-slate-300 leading-relaxed">
                        <strong className="text-slate-900 dark:text-white font-semibold">Risk Analysis: </strong>
                        {clause.explanation}
                      </div>

                      <div className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                        <strong className="text-slate-700 dark:text-slate-300 font-medium">Market Benchmark: </strong>
                        {clause.marketStandard}
                      </div>
                    </div>

                    {/* AI-Suggested Redline Counter-Clause */}
                    {clause.riskLevel !== 'Compliant' && (
                      <div className="p-3 rounded-md bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200/80 dark:border-indigo-900/60 mb-3">
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 dark:text-indigo-300">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Recommended Counter-Clause</span>
                            {clause.status === 'customized' && (
                              <span className="text-[10px] font-normal text-indigo-500">(Custom tuned)</span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopyCounter(clause);
                              }}
                              className="inline-flex items-center gap-1 text-[11px] font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200 cursor-pointer"
                            >
                              {isCopied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                              <span>{isCopied ? 'Copied' : 'Copy'}</span>
                            </button>
                          </div>
                        </div>

                        <p className="text-xs font-sans text-slate-800 dark:text-slate-100 leading-relaxed">
                          {clause.customCounterClause || clause.suggestedCounterClause}
                        </p>

                        {/* Tone Tuning Controls */}
                        <div className="mt-2.5 pt-2 border-t border-indigo-200/50 dark:border-indigo-900/40 flex items-center justify-between text-[11px]">
                          <span className="text-indigo-900/70 dark:text-indigo-300/70">Tune Negotiation Stance:</span>
                          <div className="flex items-center gap-1">
                            <button
                              disabled={isTuning}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTuneTone(clause, 'aggressive');
                              }}
                              className="px-2 py-0.5 rounded bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 text-indigo-800 dark:text-indigo-200 text-[10px] font-medium cursor-pointer"
                            >
                              Buyer-Strict
                            </button>
                            <button
                              disabled={isTuning}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTuneTone(clause, 'balanced');
                              }}
                              className="px-2 py-0.5 rounded bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 text-indigo-800 dark:text-indigo-200 text-[10px] font-medium cursor-pointer"
                            >
                              Balanced
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Bottom Action Footer */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs">
                      {clause.negotiationTip && (
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[260px]" title={clause.negotiationTip}>
                          💡 {clause.negotiationTip}
                        </span>
                      )}

                      <div className="flex items-center gap-2 ml-auto">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onTabChange('ask');
                            handleSendChat(`Analyze this specific clause in detail and provide the top 3 negotiation pushbacks: "${clause.sectionNumber}: ${clause.exactQuote}"`);
                          }}
                          className="px-2.5 py-1 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors cursor-pointer"
                        >
                          Ask AI
                        </button>

                        {clause.riskLevel !== 'Compliant' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleAccept(clause);
                            }}
                            className={`px-3 py-1 text-xs font-semibold rounded transition-colors cursor-pointer ${
                              isAccepted
                                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                                : 'bg-indigo-600 text-white hover:bg-indigo-700'
                            }`}
                          >
                            {isAccepted ? 'Accepted in Redline' : 'Accept Counter'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* TAB 2: INTERACTIVE "ASK THIS CONTRACT" CONVERSATIONAL SUB-PANEL */}
      {activeTab === 'ask' && (
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden bg-white dark:bg-slate-900">
          {/* Quick Query Suggestion Chips */}
          <div className="p-3 bg-slate-50 dark:bg-slate-900/70 border-b border-slate-200 dark:border-slate-800 shrink-0">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1.5">
              Procurement Edge-Case Inquiries:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {preconfiguredQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendChat(q)}
                  className="px-2.5 py-1 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 hover:border-indigo-400 dark:hover:border-indigo-600 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left cursor-pointer"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Message Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatMessages.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center text-center px-4">
                <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-2">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Ask ContractGuardian
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mt-1 leading-relaxed">
                  Query specific edge cases, uptime liabilities, data breach notification windows, or indemnity carveouts. Answers cite exact contract sections.
                </p>
              </div>
            ) : (
              chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-lg p-3 text-xs leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{msg.content}</div>

                    {/* Citations */}
                    {msg.citations && msg.citations.length > 0 && (
                      <div className="mt-2.5 pt-2 border-t border-slate-200 dark:border-slate-700 space-y-1">
                        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                          Contract Citations:
                        </span>
                        {msg.citations.map((cite, cIdx) => (
                          <div
                            key={cIdx}
                            className="p-1.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-700 dark:text-slate-300 font-mono flex items-center justify-between"
                          >
                            <span>{cite.sectionNumber}</span>
                            <span className="text-[10px] text-indigo-600 dark:text-indigo-400">Cited</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 px-1">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))
            )}

            {isAsking && (
              <div className="flex items-center gap-2 text-xs text-slate-500 p-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                <span>Interrogating contract terms with Gemini...</span>
              </div>
            )}
          </div>

          {/* Chat Input Bar */}
          <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendChat();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Ask any contract question (e.g. Can vendor assign upon M&A?)..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                disabled={isAsking}
                className="flex-1 px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md text-slate-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
              />
              <button
                type="submit"
                disabled={isAsking || !chatInput.trim()}
                className="px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-md shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Query</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 3: PROCUREMENT NEGOTIATION PLAYBOOK */}
      {activeTab === 'playbook' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="p-4 rounded-lg bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">
              Procurement Negotiation Leverage & Strategy
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              Recommended negotiation trade-offs to secure favorable legal protections without stalling deal closure:
            </p>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className="font-semibold text-slate-900 dark:text-white mb-1">
                  1. Trade Payment Terms for IP Indemnity
                </div>
                <p className="text-slate-600 dark:text-slate-400">
                  Vendor pushed Net 15. Agree to Net 30 or Net 45 in exchange for striking uncapped Customer patent liability in Section 8.1 and making Vendor IP indemnification completely uncapped.
                </p>
              </div>

              <div className="p-3 rounded bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className="font-semibold text-slate-900 dark:text-white mb-1">
                  2. Regulatory Hardline on 36-Hour Breach Notice
                </div>
                <p className="text-slate-600 dark:text-slate-400">
                  Cite mandatory GDPR Article 33 compliance. Frame the 36-hour notice requirement as non-negotiable statutory adherence rather than commercial preference.
                </p>
              </div>

              <div className="p-3 rounded bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className="font-semibold text-slate-900 dark:text-white mb-1">
                  3. Chronic SLA Failure Exit Ramp
                </div>
                <p className="text-slate-600 dark:text-slate-400">
                  Reject SLA credits as sole remedy. Insist that system uptime below 99.0% for two consecutive months triggers Customer right to terminate for cause with full pro-rata refund.
                </p>
              </div>
            </div>
          </div>

          {/* Redline Adoption Status */}
          <div className="p-4 rounded-lg bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-2">
              Redline Adoption Summary
            </h4>
            <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 mb-3">
              <span>Accepted Counter-Clauses:</span>
              <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">
                {document.clauses.filter((c) => c.status === 'accepted').length} of {document.clauses.length}
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  document.clauses.forEach((c) => {
                    if (c.riskLevel === 'High Risk') {
                      onUpdateClause({ ...c, status: 'accepted' });
                    }
                  });
                }}
                className="flex-1 py-1.5 px-3 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 rounded border border-indigo-200 dark:border-indigo-800 transition-colors cursor-pointer"
              >
                Accept All High-Risk Counter-Clauses
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
