import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Search, 
  ChevronUp, 
  ChevronDown, 
  FileText, 
  Sparkles, 
  Check, 
  AlertTriangle, 
  Eye, 
  GitCompare, 
  AlignLeft, 
  Bookmark,
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import { ContractDocument, ClauseAnalysis, RiskLevel } from '../types/contract';

interface DocumentViewerProps {
  document: ContractDocument;
  selectedClauseId: string | null;
  onSelectClause: (clauseId: string) => void;
  onAskAboutClause: (clause: ClauseAnalysis) => void;
  onAcceptCounterClause: (clauseId: string) => void;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  document,
  selectedClauseId,
  onSelectClause,
  onAskAboutClause,
  onAcceptCounterClause,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'highlights' | 'redline' | 'clean'>('highlights');
  const [showSectionOutline, setShowSectionOutline] = useState(false);

  const viewerContainerRef = useRef<HTMLDivElement>(null);

  // Parse sections/lines from content
  const lines = useMemo(() => {
    return document.content.split('\n');
  }, [document.content]);

  // Section outline items
  const sectionOutline = useMemo(() => {
    const sections: { title: string; lineIndex: number }[] = [];
    lines.forEach((line, idx) => {
      if (line.match(/^(SECTION|ARTICLE|CLAUSE)\s+[0-9]+/i) || line.match(/^[0-9]+\.\s+[A-Z\s]{3,}/)) {
        sections.push({ title: line.trim(), lineIndex: idx });
      }
    });
    return sections;
  }, [lines]);

  // Search match positions
  const searchMatches = useMemo(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) return [];
    const query = searchQuery.toLowerCase();
    const matches: number[] = [];
    lines.forEach((line, idx) => {
      if (line.toLowerCase().includes(query)) {
        matches.push(idx);
      }
    });
    return matches;
  }, [lines, searchQuery]);

  // Scroll to active match when searching
  const handleNextMatch = () => {
    if (searchMatches.length === 0) return;
    const nextIdx = (currentMatchIndex + 1) % searchMatches.length;
    setCurrentMatchIndex(nextIdx);
    scrollToLine(searchMatches[nextIdx]);
  };

  const handlePrevMatch = () => {
    if (searchMatches.length === 0) return;
    const prevIdx = (currentMatchIndex - 1 + searchMatches.length) % searchMatches.length;
    setCurrentMatchIndex(prevIdx);
    scrollToLine(searchMatches[prevIdx]);
  };

  const scrollToLine = (lineIdx: number) => {
    const el = window.document.getElementById(`doc-line-${lineIdx}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // When a clause is selected from outside, scroll to its section in the viewer
  useEffect(() => {
    if (!selectedClauseId) return;
    const clause = document.clauses.find((c) => c.id === selectedClauseId);
    if (!clause) return;

    // Find the line that best matches the clause's exact quote or sectionNumber
    const quoteSnip = clause.exactQuote.substring(0, 35).toLowerCase();
    const lineIndex = lines.findIndex((l) => l.toLowerCase().includes(quoteSnip));
    if (lineIndex !== -1) {
      scrollToLine(lineIndex);
    }
  }, [selectedClauseId, document.clauses, lines]);

  // Helper to test if a line belongs to a clause
  const getClauseForLine = (lineText: string): ClauseAnalysis | undefined => {
    if (lineText.length < 15) return undefined;
    const cleanLine = lineText.toLowerCase();

    return document.clauses.find((c) => {
      const q = c.exactQuote.toLowerCase();
      // Check for quote containment or substantial overlap
      const firstPart = q.substring(0, Math.min(45, q.length));
      return cleanLine.includes(firstPart) || (firstPart.length > 20 && firstPart.includes(cleanLine.substring(0, 30)));
    });
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 overflow-hidden">
      {/* Viewer Header & Controls */}
      <div className="flex flex-col gap-2 p-3 bg-slate-50/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 shrink-0">
        <div className="flex items-center justify-between gap-3">
          {/* Document Title & Type */}
          <div className="flex items-center gap-2 min-w-0">
            <div className="p-1.5 rounded bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h2 className="text-xs font-bold text-slate-900 dark:text-white truncate" title={document.title}>
                {document.title}
              </h2>
              <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                <span>{document.fileName}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums">{lines.length} lines</span>
              </div>
            </div>
          </div>

          {/* View Mode Segmented Control */}
          <div className="flex items-center p-0.5 bg-slate-200/60 dark:bg-slate-800 rounded-md shrink-0">
            <button
              onClick={() => setViewMode('highlights')}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded transition-colors whitespace-nowrap ${
                viewMode === 'highlights'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Show color-coded risk highlights"
            >
              <Eye className="w-3.5 h-3.5 text-indigo-500" />
              <span>Risk Highlights</span>
            </button>
            <button
              onClick={() => setViewMode('redline')}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded transition-colors whitespace-nowrap ${
                viewMode === 'redline'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Show proposed counter-clause redline diff"
            >
              <GitCompare className="w-3.5 h-3.5 text-emerald-500" />
              <span>Redline Diff</span>
            </button>
            <button
              onClick={() => setViewMode('clean')}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded transition-colors whitespace-nowrap ${
                viewMode === 'clean'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="View clean original contract text"
            >
              <AlignLeft className="w-3.5 h-3.5 text-slate-400" />
              <span>Clean</span>
            </button>
          </div>
        </div>

        {/* Search Bar & Section Outline Toggle */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search contract terms (e.g. indemnification, breach, uptime)..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentMatchIndex(0);
              }}
              className="w-full pl-8 pr-16 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md text-slate-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
            />
            {searchMatches.length > 0 && (
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[11px] font-mono text-slate-500">
                <span className="tabular-nums">
                  {currentMatchIndex + 1}/{searchMatches.length}
                </span>
                <button onClick={handlePrevMatch} className="hover:text-slate-900 dark:hover:text-white p-0.5">
                  <ChevronUp className="w-3 h-3" />
                </button>
                <button onClick={handleNextMatch} className="hover:text-slate-900 dark:hover:text-white p-0.5">
                  <ChevronDown className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>

          {sectionOutline.length > 0 && (
            <button
              onClick={() => setShowSectionOutline(!showSectionOutline)}
              className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium border rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                showSectionOutline
                  ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400'
                  : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Sections ({sectionOutline.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* Section Outline Dropdown Drawer */}
      {showSectionOutline && (
        <div className="bg-slate-50 dark:bg-slate-800/90 border-b border-slate-200 dark:border-slate-700 p-2 max-h-44 overflow-y-auto z-10 shrink-0">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 px-2">
            Table of Contents
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-1 text-xs">
            {sectionOutline.map((sec, idx) => (
              <button
                key={idx}
                onClick={() => {
                  scrollToLine(sec.lineIndex);
                  setShowSectionOutline(false);
                }}
                className="text-left px-2 py-1 rounded hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 truncate cursor-pointer transition-colors"
              >
                {sec.title}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Document Content Scrollable Viewport */}
      <div 
        ref={viewerContainerRef}
        className="flex-1 overflow-y-auto p-6 font-serif text-[13.5px] leading-relaxed text-slate-800 dark:text-slate-200 select-text"
      >
        <div className="max-w-3xl mx-auto space-y-3 pb-16">
          {lines.map((line, idx) => {
            const isHeading = line.match(/^(SECTION|ARTICLE|CLAUSE)\s+[0-9]+/i) || line.match(/^[A-Z\s]{4,}$/);
            const clause = getClauseForLine(line);
            const isSelected = clause && clause.id === selectedClauseId;

            // Search query hit
            const hasSearchMatch = searchQuery && line.toLowerCase().includes(searchQuery.toLowerCase());

            // Redline view logic
            const showRedline = viewMode === 'redline' && clause && clause.riskLevel !== 'Compliant';

            return (
              <div
                key={idx}
                id={`doc-line-${idx}`}
                className={`relative group flex gap-3 px-3 py-1.5 rounded transition-all ${
                  isHeading ? 'pt-4 pb-1 border-b border-slate-200 dark:border-slate-800' : ''
                } ${
                  isSelected
                    ? 'ring-2 ring-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/40'
                    : clause && viewMode === 'highlights'
                    ? clause.riskLevel === 'High Risk'
                      ? 'bg-rose-50/70 dark:bg-rose-950/25 border-l-2 border-rose-500'
                      : clause.riskLevel === 'Medium Risk'
                      ? 'bg-amber-50/70 dark:bg-amber-950/25 border-l-2 border-amber-500'
                      : 'bg-emerald-50/60 dark:bg-emerald-950/20 border-l-2 border-emerald-500'
                    : hasSearchMatch
                    ? 'bg-yellow-100/70 dark:bg-yellow-950/40'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                }`}
              >
                {/* Line number */}
                <span className="font-mono text-[11px] text-slate-300 dark:text-slate-600 select-none w-8 text-right shrink-0 pt-0.5 tabular-nums">
                  {idx + 1}
                </span>

                {/* Line Text & Clause Interactivity */}
                <div className="flex-1 min-w-0">
                  {isHeading ? (
                    <h3 className="font-sans font-bold text-slate-900 dark:text-white tracking-tight text-sm">
                      {line}
                    </h3>
                  ) : showRedline ? (
                    <div className="space-y-2">
                      {/* Original Struck-Through */}
                      <p className="line-through text-rose-700/80 dark:text-rose-400/80 bg-rose-50/60 dark:bg-rose-950/40 px-1.5 py-0.5 rounded">
                        {line}
                      </p>
                      {/* Proposed Counter-Clause Insertion */}
                      <div className="p-2.5 rounded bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 text-xs font-sans text-slate-800 dark:text-slate-100">
                        <div className="flex items-center justify-between gap-2 mb-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                          <span>PROPOSED COUNTER-CLAUSE ({clause.category})</span>
                          <button
                            onClick={() => onAcceptCounterClause(clause.id)}
                            className="px-2 py-0.5 text-[10px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded cursor-pointer"
                          >
                            Accept Redline
                          </button>
                        </div>
                        <p className="underline decoration-emerald-500 decoration-1">
                          {clause.customCounterClause || clause.suggestedCounterClause}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p 
                        onClick={() => clause && onSelectClause(clause.id)}
                        className={`${clause ? 'cursor-pointer' : ''}`}
                      >
                        {line}
                      </p>

                      {/* Clause Quick Tag in Highlights Mode */}
                      {clause && viewMode === 'highlights' && (
                        <div className="mt-1.5 flex items-center justify-between text-[11px] font-sans">
                          <button
                            onClick={() => onSelectClause(clause.id)}
                            className="inline-flex items-center gap-1.5 font-semibold hover:underline cursor-pointer"
                          >
                            <span className={
                              clause.riskLevel === 'High Risk'
                                ? 'text-rose-600 dark:text-rose-400'
                                : clause.riskLevel === 'Medium Risk'
                                ? 'text-amber-600 dark:text-amber-400'
                                : 'text-emerald-600 dark:text-emerald-400'
                            }>
                              {clause.riskLevel}: {clause.title}
                            </span>
                          </button>

                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onAskAboutClause(clause);
                              }}
                              className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 cursor-pointer"
                            >
                              <MessageSquare className="w-2.5 h-2.5" />
                              Ask AI
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onSelectClause(clause.id);
                              }}
                              className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded border border-slate-300 dark:border-slate-700 hover:bg-slate-200 cursor-pointer"
                            >
                              <ExternalLink className="w-2.5 h-2.5" />
                              Analyze
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
