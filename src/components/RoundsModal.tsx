import React from 'react';
import { X, Brain, Zap, Target, RefreshCw } from 'lucide-react';
import { GAME_RULES } from '../data/rules';

interface RoundsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RoundsModal: React.FC<RoundsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
      id="rounds-modal-overlay" 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        id="rounds-modal-content"
        className="relative w-full max-w-lg bg-[#0A0A0B] border border-[#1E293B] rounded-2xl p-6 text-[#F8FAFC] shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-[#1E293B] mb-4">
          <div>
            <h2 className="text-xl font-black uppercase italic tracking-tight text-[#F8FAFC]">
              Protocol <span className="text-[#38BDF8]">Manifest</span>
            </h2>
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#64748B] font-mono">10 Cognitive Flexibility Rounds</p>
          </div>
          <button 
            id="close-rounds-modal-btn"
            onClick={onClose}
            className="p-2 rounded-sm text-[#64748B] hover:text-[#F8FAFC] hover:bg-[#111116] border border-transparent hover:border-[#1E293B] transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 mb-6">
          <p className="text-xs text-[#94A3B8] italic">
            Mind Switch measures and trains cognitive agility, inhibitory control, working memory, and rapid task switching.
          </p>

          <div className="grid grid-cols-2 gap-2 text-[11px] text-[#64748B] py-2">
            <div className="flex items-center gap-1.5 bg-[#111116] border border-[#1E293B] p-2 rounded-sm">
              <Target className="w-3.5 h-3.5 text-[#22C55E] shrink-0" />
              <span>R01-02: Selective Focus</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#111116] border border-[#1E293B] p-2 rounded-sm">
              <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>R03-04: Stroop Effect</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#111116] border border-[#1E293B] p-2 rounded-sm">
              <Brain className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span>R05 & 08: Working Memory</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#111116] border border-[#1E293B] p-2 rounded-sm">
              <RefreshCw className="w-3.5 h-3.5 text-[#38BDF8] shrink-0" />
              <span>R09-10: Task Switching</span>
            </div>
          </div>
        </div>

        <div className="space-y-2.5 max-h-[46vh] overflow-y-auto pr-1">
          {GAME_RULES.map((rule) => (
            <div 
              key={rule.id}
              className="bg-[#111116] p-3 rounded-sm border border-[#1E293B] flex items-start gap-3 text-left"
            >
              <div className="w-7 h-7 rounded-sm bg-[#38BDF8]/10 border border-[#38BDF8]/30 text-[#38BDF8] flex items-center justify-center font-bold font-mono text-xs shrink-0 mt-0.5">
                0{rule.id}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-[#F8FAFC] tracking-wide">{rule.title}</span>
                  <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded-sm bg-[#0A0A0B] border border-[#1E293B] text-[#38BDF8]">
                    {rule.domain}
                  </span>
                </div>
                <p className="text-xs text-[#94A3B8] mt-1 font-medium">{rule.text}</p>
                <p className="text-[10px] text-[#64748B] italic mt-0.5">{rule.hint}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 pt-4 border-t border-[#1E293B]">
          <button 
            id="modal-understand-btn"
            onClick={onClose}
            className="w-full h-12 border border-[#38BDF8] bg-[#38BDF8]/10 text-[#38BDF8] font-bold uppercase tracking-widest rounded-xl hover:bg-[#38BDF8] hover:text-[#0A0A0B] active:scale-[0.98] transition-all text-xs cursor-pointer shadow-[0_0_20px_-5px_rgba(56,189,248,0.2)]"
          >
            Acknowledge Protocol
          </button>
        </div>
      </div>
    </div>
  );
};
