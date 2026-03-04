import React from 'react';
import { X, Loader2, Download, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: string | null;
  isLoading: boolean;
}

export const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose, report, isLoading }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[80vh] flex flex-col overflow-hidden"
        >
          <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-zinc-900 text-white rounded-lg">
                <FileText size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-zinc-900">Monthly Practice Report</h3>
                <p className="text-xs text-zinc-500">AI-Generated Financial Analysis</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 text-zinc-400 hover:text-zinc-900 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-8">
            {isLoading ? (
              <div className="h-64 flex flex-col items-center justify-center gap-4">
                <Loader2 className="animate-spin text-zinc-900" size={40} />
                <p className="text-sm font-medium text-zinc-500 italic">Analyzing practice data and generating insights...</p>
              </div>
            ) : report ? (
              <div className="prose prose-zinc max-w-none">
                <div className="whitespace-pre-wrap text-zinc-700 leading-relaxed font-serif text-lg">
                  {report}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-zinc-500">No report data available.</p>
              </div>
            )}
          </div>

          <div className="p-6 border-t border-zinc-100 bg-zinc-50 flex justify-end gap-3">
            <button 
              onClick={onClose}
              className="px-6 py-2.5 text-sm font-bold text-zinc-600 hover:text-zinc-900 transition-colors"
            >
              Close
            </button>
            {!isLoading && report && (
              <button 
                onClick={() => {
                  const blob = new Blob([report], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `Archiflow_Report_${new Date().toISOString().split('T')[0]}.txt`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="px-6 py-2.5 bg-zinc-900 text-white rounded-xl font-bold text-sm hover:bg-zinc-800 transition-colors flex items-center gap-2"
              >
                <Download size={16} />
                Download TXT
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
