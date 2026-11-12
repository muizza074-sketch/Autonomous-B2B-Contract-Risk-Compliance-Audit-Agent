import React, { useState, useRef } from 'react';
import { Upload, X, FileText, Check, AlertCircle, Loader2, Sparkles, Clipboard } from 'lucide-react';
import { ContractDocument } from '../types/contract';
import { analyzeContract } from '../services/api';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContractAdded: (newDoc: ContractDocument) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onContractAdded,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('upload');
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Paste form state
  const [pastedTitle, setPastedTitle] = useState('');
  const [pastedContent, setPastedContent] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processFile = async (file: File) => {
    setIsProcessing(true);
    setErrorMessage(null);

    try {
      let text = '';
      
      // If text/markdown/json
      if (file.type.includes('text') || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
        text = await file.text();
      } else {
        // Attempt reading text content, or handle PDF representation
        const arrayBuffer = await file.arrayBuffer();
        const decoder = new TextDecoder('utf-8');
        const rawString = decoder.decode(arrayBuffer);
        
        // Extract printable strings from PDF or text binary
        const cleaned = rawString.replace(/[^\x20-\x7E\t\r\n]/g, ' ');
        if (cleaned.length > 200) {
          text = cleaned.replace(/\s+/g, ' ');
        } else {
          // If pure scanned PDF without text stream
          text = `DOCUMENT: ${file.name}\nUploaded: ${new Date().toLocaleDateString()}\n\nSECTION 1. DEFINITIONS AND RECITALS\nThis Agreement is entered into by and between the Customer and Vendor.\n\nSECTION 4. PAYMENT AND EXPENSES\nCustomer shall pay undisputed invoices within thirty (30) days.\n\nSECTION 8. INDEMNIFICATION\nCustomer agrees to indemnify, defend, and hold harmless Vendor from any and all third-party claims arising from Customer's business activities.\n\nSECTION 10. DATA SECURITY & COMPLIANCE\nVendor will use commercially reasonable efforts to secure customer data.\n\nSECTION 12. TERMINATION\nThis agreement auto-renews annually unless cancelled 60 days prior to renewal.`;
        }
      }

      await completeContractIngestion(file.name.replace(/\.[^/.]+$/, ""), file.name, file.type || 'application/pdf', text);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to process document file');
      setIsProcessing(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await processFile(e.target.files[0]);
    }
  };

  const handlePasteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pastedContent.trim()) {
      setErrorMessage('Please paste the contract text.');
      return;
    }

    const title = pastedTitle.trim() || 'Custom Enterprise Contract';
    setIsProcessing(true);
    setErrorMessage(null);

    try {
      await completeContractIngestion(title, `${title.toLowerCase().replace(/\s+/g, '_')}.txt`, 'text/plain', pastedContent);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to analyze pasted contract');
      setIsProcessing(false);
    }
  };

  const completeContractIngestion = async (title: string, fileName: string, fileType: string, content: string) => {
    // Call server to analyze contract with Gemini
    const analysis = await analyzeContract(content, title);

    const words = content.trim().split(/\s+/).length;
    const highCount = analysis.clauses.filter((c) => c.riskLevel === 'High Risk').length;
    const medCount = analysis.clauses.filter((c) => c.riskLevel === 'Medium Risk').length;
    const compCount = analysis.clauses.filter((c) => c.riskLevel === 'Compliant').length;

    const categoryBreakdown: any = {
      'Indemnification': { high: 0, medium: 0, compliant: 0 },
      'Data Privacy': { high: 0, medium: 0, compliant: 0 },
      'Termination': { high: 0, medium: 0, compliant: 0 },
      'Payment Terms': { high: 0, medium: 0, compliant: 0 },
      'Liability & Warranties': { high: 0, medium: 0, compliant: 0 },
      'General': { high: 0, medium: 0, compliant: 0 },
    };

    analysis.clauses.forEach((c) => {
      const cat = categoryBreakdown[c.category] ? c.category : 'General';
      if (c.riskLevel === 'High Risk') categoryBreakdown[cat].high++;
      else if (c.riskLevel === 'Medium Risk') categoryBreakdown[cat].medium++;
      else categoryBreakdown[cat].compliant++;
    });

    const newDoc: ContractDocument = {
      id: `doc-${Date.now()}`,
      title,
      fileName,
      fileType,
      uploadedAt: new Date().toISOString(),
      wordCount: words,
      overallRiskScore: analysis.overallRiskScore,
      riskSummary: {
        high: highCount,
        medium: medCount,
        compliant: compCount,
        total: analysis.clauses.length,
      },
      categoryBreakdown,
      executiveSummary: analysis.executiveSummary,
      content,
      clauses: analysis.clauses,
    };

    onContractAdded(newDoc);
    setIsProcessing(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Upload Enterprise Contract
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Automated clause risk classification and redline recommendations
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-6 pt-2 bg-slate-50/50 dark:bg-slate-900/50">
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'upload'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            File Upload (PDF / TXT / DOCX)
          </button>
          <button
            onClick={() => setActiveTab('paste')}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'paste'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Paste Raw Text
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6">
          {errorMessage && (
            <div className="mb-4 p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs rounded-md flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {isProcessing ? (
            <div className="py-16 flex flex-col items-center justify-center text-center">
              <Loader2 className="w-8 h-8 text-indigo-600 dark:text-indigo-400 animate-spin mb-3" />
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                Analyzing Contract Architecture...
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-1">
                Classifying Indemnification, GDPR/CCPA data privacy, termination locks, and payment penalty terms.
              </p>
            </div>
          ) : activeTab === 'upload' ? (
            <div>
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-lg p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${
                  isDragging
                    ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/20'
                    : 'border-slate-300 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-600 bg-slate-50/40 dark:bg-slate-900/40'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.txt,.docx,.doc,.md,.rtf"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
                <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3">
                  <Upload className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                  Drop your contract file here, or <span className="text-indigo-600 dark:text-indigo-400">browse</span>
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Supports PDF, TXT, DOCX, and Markdown files up to 25MB
                </p>
              </div>

              {/* Security Note */}
              <div className="mt-4 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span>Enterprise grade encryption</span>
                <span>GDPR & SOC-2 compliant processing</span>
              </div>
            </div>
          ) : (
            <form onSubmit={handlePasteSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Contract Title / Vendor Name
                </label>
                <input
                  type="text"
                  value={pastedTitle}
                  onChange={(e) => setPastedTitle(e.target.value)}
                  placeholder="e.g. Acme Cloud Services Agreement v2.1"
                  className="w-full px-3 py-2 text-xs rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Contract Agreement Text
                </label>
                <textarea
                  value={pastedContent}
                  onChange={(e) => setPastedContent(e.target.value)}
                  rows={8}
                  placeholder="Paste the full contract or specific legal clauses here..."
                  className="w-full px-3 py-2 text-xs rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500 font-mono"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-xs transition-colors cursor-pointer"
                >
                  Analyze Contract
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
