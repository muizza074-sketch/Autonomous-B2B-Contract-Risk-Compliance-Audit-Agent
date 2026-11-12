import React, { useState, useEffect } from 'react';
import { SAMPLE_CONTRACTS } from './data/sampleContracts';
import { ContractDocument, ClauseAnalysis, ChatMessage } from './types/contract';
import { Header } from './components/Header';
import { ContractSelector } from './components/ContractSelector';
import { DocumentViewer } from './components/DocumentViewer';
import { IntelligencePanel } from './components/IntelligencePanel';
import { UploadModal } from './components/UploadModal';
import { ExportModal } from './components/ExportModal';

export default function App() {
  const [documents, setDocuments] = useState<ContractDocument[]>(SAMPLE_CONTRACTS);
  const [activeDocumentId, setActiveDocumentId] = useState<string>(SAMPLE_CONTRACTS[0].id);
  const [selectedClauseId, setSelectedClauseId] = useState<string | null>(SAMPLE_CONTRACTS[0].clauses[0]?.id || null);

  // Chat messages per document map
  const [chatHistories, setChatHistories] = useState<Record<string, ChatMessage[]>>({
    'doc-msa-01': [
      {
        id: 'msg-init-1',
        role: 'assistant',
        content: `Welcome to ContractGuardian. I've audited "NexusCloud Enterprise Master Services Agreement".\n\nIdentified **4 High-Risk provisions** requiring immediate negotiation attention:\n1. **Section 8.1 & 8.2**: Unilateral Customer Indemnification for broad patent claims while Vendor IP defense is capped at only 1 month of subscription fees (MRR).\n2. **Section 10.3**: 10-day data breach notification window directly breaches GDPR Article 33's 72-hour statutory deadline.\n3. **Section 12.1**: Narrow 90-day cancellation window triggering automatic 24-month renewal with 15% annual fee escalation.\n\nAsk me any edge case query below or select a clause on the left to review proposed counter-clauses.`,
        timestamp: new Date().toISOString(),
        citations: [
          { sectionNumber: 'Section 8.1', quote: 'Customer agrees to defend, indemnify, and hold harmless Vendor...' },
          { sectionNumber: 'Section 10.3', quote: 'report confirmed security incidents... within ten (10) business days' },
        ],
      },
    ],
  });

  const [activeTab, setActiveTab] = useState<'clauses' | 'ask' | 'playbook'>('clauses');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Theme mode
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Apply dark mode class to html element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Current active document
  const activeDocument = documents.find((d) => d.id === activeDocumentId) || documents[0];

  // Active chat messages
  const currentChatMessages = chatHistories[activeDocument.id] || [];

  const handleAddChatMessage = (msg: ChatMessage) => {
    setChatHistories((prev) => ({
      ...prev,
      [activeDocument.id]: [...(prev[activeDocument.id] || []), msg],
    }));
  };

  const handleUpdateClause = (updatedClause: ClauseAnalysis) => {
    setDocuments((prevDocs) =>
      prevDocs.map((doc) => {
        if (doc.id !== activeDocument.id) return doc;
        return {
          ...doc,
          clauses: doc.clauses.map((c) => (c.id === updatedClause.id ? updatedClause : c)),
        };
      })
    );
  };

  const handleContractAdded = (newDoc: ContractDocument) => {
    setDocuments((prev) => [newDoc, ...prev]);
    setActiveDocumentId(newDoc.id);
    setSelectedClauseId(newDoc.clauses[0]?.id || null);
    setActiveTab('clauses');

    // Add introductory message
    const introMsg: ChatMessage = {
      id: `init-${Date.now()}`,
      role: 'assistant',
      content: `I've analyzed "${newDoc.title}". Overall Risk Score: ${newDoc.overallRiskScore}/100 with ${newDoc.riskSummary.high} high-risk and ${newDoc.riskSummary.medium} medium-risk clauses identified. How would you like to review this contract?`,
      timestamp: new Date().toISOString(),
    };
    setChatHistories((prev) => ({
      ...prev,
      [newDoc.id]: [introMsg],
    }));
  };

  const handleDeleteDocument = (id: string) => {
    const updated = documents.filter((d) => d.id !== id);
    if (updated.length > 0) {
      setDocuments(updated);
      if (activeDocumentId === id) {
        setActiveDocumentId(updated[0].id);
        setSelectedClauseId(updated[0].clauses[0]?.id || null);
      }
    }
  };

  const handleAskAboutClause = (clause: ClauseAnalysis) => {
    setActiveTab('ask');
    const query = `Please evaluate the risks of ${clause.sectionNumber} (${clause.title}): "${clause.exactQuote}". What are our strongest procurement leverage points to renegotiate this?`;
    
    // Add user question
    const userMsg: ChatMessage = {
      id: `chat-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toISOString(),
    };
    handleAddChatMessage(userMsg);

    // Immediate intelligent legal analysis response
    const aiAnswer = `### Analysis of ${clause.sectionNumber}: ${clause.title}\n\n**Risk Classification:** ${clause.riskLevel.toUpperCase()} (${clause.category})\n\n**Key Commercial Pitfall:** ${clause.explanation}\n\n**Market Standard Benchmark:** ${clause.marketStandard}\n\n**Recommended Redline Proposal:**\n> "${clause.suggestedCounterClause}"\n\n**Procurement Tip:** ${clause.negotiationTip || 'Insist on reciprocal protections.'}`;

    const aiMsg: ChatMessage = {
      id: `chat-ai-${Date.now() + 1}`,
      role: 'assistant',
      content: aiAnswer,
      timestamp: new Date().toISOString(),
      citations: [{ sectionNumber: clause.sectionNumber, quote: clause.exactQuote.substring(0, 60) + '...' }],
    };
    handleAddChatMessage(aiMsg);
  };

  const handleAcceptCounterClause = (clauseId: string) => {
    const clause = activeDocument.clauses.find((c) => c.id === clauseId);
    if (clause) {
      handleUpdateClause({
        ...clause,
        status: clause.status === 'accepted' ? 'pending' : 'accepted',
      });
    }
  };

  const highRiskCount = activeDocument.clauses.filter((c) => c.riskLevel === 'High Risk').length;

  return (
    <div className="flex flex-col h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden font-sans antialiased">
      {/* Top Bar Contract (Wordmark, Nav links, Redline Export CTA) */}
      <Header
        onExportClick={() => setIsExportModalOpen(true)}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        activeDocumentTitle={activeDocument.title}
        totalClausesCount={activeDocument.clauses.length}
        highRiskCount={highRiskCount}
      />

      {/* Multi-Document Switcher & Drag-and-Drop Area */}
      <ContractSelector
        documents={documents}
        activeDocumentId={activeDocument.id}
        onSelectDocument={(id) => {
          setActiveDocumentId(id);
          const doc = documents.find((d) => d.id === id);
          setSelectedClauseId(doc?.clauses[0]?.id || null);
        }}
        onOpenUploadModal={() => setIsUploadModalOpen(true)}
        onDeleteDocument={handleDeleteDocument}
      />

      {/* Split-Screen Main Viewport */}
      <main className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden">
        {/* Left Side (50-55% width on desktop): Interactive Document Viewer */}
        <section 
          aria-label="Contract Document Viewer"
          className="w-full lg:w-[54%] h-1/2 lg:h-full flex flex-col min-h-0"
        >
          <DocumentViewer
            document={activeDocument}
            selectedClauseId={selectedClauseId}
            onSelectClause={(clauseId) => setSelectedClauseId(clauseId)}
            onAskAboutClause={handleAskAboutClause}
            onAcceptCounterClause={handleAcceptCounterClause}
          />
        </section>

        {/* Right Side (45-50% width on desktop): AI Risk & Clause Intelligence Panel */}
        <section 
          aria-label="Clause Risk Intelligence & Edge-Case Interrogation"
          className="w-full lg:w-[46%] h-1/2 lg:h-full flex flex-col min-h-0 border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-800"
        >
          <IntelligencePanel
            document={activeDocument}
            selectedClauseId={selectedClauseId}
            onSelectClause={(clauseId) => setSelectedClauseId(clauseId)}
            onUpdateClause={handleUpdateClause}
            chatMessages={currentChatMessages}
            onAddChatMessage={handleAddChatMessage}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </section>
      </main>

      {/* Upload Contract Modal */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onContractAdded={handleContractAdded}
      />

      {/* Export Redline Report Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        document={activeDocument}
      />
    </div>
  );
}
