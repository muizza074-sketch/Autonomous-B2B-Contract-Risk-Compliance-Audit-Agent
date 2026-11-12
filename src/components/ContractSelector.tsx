import React from 'react';
import { Plus, FileText, AlertTriangle, CheckCircle2, Trash2, Upload } from 'lucide-react';
import { ContractDocument } from '../types/contract';

interface ContractSelectorProps {
  documents: ContractDocument[];
  activeDocumentId: string;
  onSelectDocument: (id: string) => void;
  onOpenUploadModal: () => void;
  onDeleteDocument: (id: string) => void;
}

export const ContractSelector: React.FC<ContractSelectorProps> = ({
  documents,
  activeDocumentId,
  onSelectDocument,
  onOpenUploadModal,
  onDeleteDocument,
}) => {
  return (
    <div className="flex items-center justify-between gap-4 px-6 py-2.5 bg-slate-100/90 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 text-xs overflow-x-auto">
      {/* Document Tabs */}
      <div className="flex items-center gap-1.5 min-w-0">
        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mr-1 shrink-0">
          Contracts:
        </span>
        {documents.map((doc) => {
          const isActive = doc.id === activeDocumentId;
          const highRiskCount = doc.clauses.filter((c) => c.riskLevel === 'High Risk').length;

          return (
            <div
              key={doc.id}
              onClick={() => onSelectDocument(doc.id)}
              className={`group flex items-center gap-2 px-3 py-1.5 rounded-md border text-xs font-medium cursor-pointer transition-all whitespace-nowrap shrink-0 ${
                isActive
                  ? 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'bg-transparent border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <FileText className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
              <span className="truncate max-w-[200px]" title={doc.title}>
                {doc.title}
              </span>

              {/* High risk indicator */}
              {highRiskCount > 0 ? (
                <span className="font-mono text-[11px] font-semibold text-rose-600 dark:text-rose-400 tabular-nums">
                  {highRiskCount} high
                </span>
              ) : (
                <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              )}

              {/* Delete button (only if more than 1 doc) */}
              {documents.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteDocument(doc.id);
                  }}
                  title="Remove document from workspace"
                  className="opacity-0 group-hover:opacity-100 hover:text-rose-600 dark:hover:text-rose-400 p-0.5 rounded transition-opacity"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </div>
          );
        })}

        <button
          onClick={onOpenUploadModal}
          className="flex items-center gap-1.5 px-3 py-1.5 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-dashed border-indigo-300 dark:border-indigo-800 rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer font-medium"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Upload Contract</span>
        </button>
      </div>

      {/* Quick stats for active document */}
      {(() => {
        const active = documents.find((d) => d.id === activeDocumentId);
        if (!active) return null;
        return (
          <div className="hidden md:flex items-center gap-3 text-slate-500 dark:text-slate-400 text-[11px] font-mono shrink-0">
            <span>{active.wordCount.toLocaleString()} words</span>
            <span aria-hidden="true">·</span>
            <span>Risk Score: <strong className={`${active.overallRiskScore > 70 ? 'text-rose-600 dark:text-rose-400' : 'text-amber-600 dark:text-amber-400'} font-bold`}>{active.overallRiskScore}/100</strong></span>
          </div>
        );
      })()}
    </div>
  );
};
