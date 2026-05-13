import { motion } from "motion/react";
import { AlertCircle, ChevronLeft, ShieldAlert, Flame, Terminal, CheckSquare } from "lucide-react";
import { RoastResult } from "../types";

interface RoastViewProps {
  roast: RoastResult;
  onRefresh: () => void;
  onBack: () => void;
}

export default function RoastView({ roast, onRefresh, onBack }: RoastViewProps) {
  return (
    <div className="h-full flex overflow-hidden">
      {/* Controls Sidebar */}
      <div className="w-80 border-r border-slate-200 bg-white flex flex-col p-6 shrink-0 space-y-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
             <div className="px-2 py-0.5 bg-red-50 text-red-700 text-[10px] font-black uppercase rounded border border-red-100 italic">OFFENSIVE</div>
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Reality Check</span>
          </div>
          <div className="space-y-1">
             <h2 className="text-xl font-bold text-slate-900 leading-tight">Brutal Feedback</h2>
             <div className="flex items-center gap-2 mt-2">
                <span className="text-[11px] font-black bg-slate-900 text-white px-2 py-0.5 rounded uppercase">Score: {roast.overallScore}</span>
             </div>
          </div>
        </div>

        <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar flex-1">
           <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-2 border-b border-slate-100 pb-2">Diagnostic Log (Fixes)</h3>
           {roast.fixes?.map((fix, i) => (
             <div key={i} className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-2 group hover:border-red-200 transition-colors">
                <div className="flex items-center justify-between">
                   <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider font-mono">[{fix.section}]</span>
                   <AlertCircle size={12} className="text-red-400" />
                </div>
                <p className="text-[11px] font-bold text-slate-800 leading-tight">"{fix.issue}"</p>
                <div className="flex gap-2 pt-1 border-t border-slate-200/50">
                   <CheckSquare size={12} className="text-green-500 shrink-0 mt-0.5" />
                   <p className="text-[10px] font-bold text-slate-500 leading-relaxed italic">{fix.fix}</p>
                </div>
             </div>
           ))}
        </div>

        <div className="space-y-2 pt-4 border-t border-slate-50">
          <button 
            onClick={onRefresh}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-sm shadow-red-100"
          >
            <Flame size={14} />
            <span>Generate New Roast</span>
          </button>

          <button 
            onClick={onBack}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-slate-200 text-slate-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-all"
          >
            <ChevronLeft size={14} />
            <span>Return to Canvas</span>
          </button>
        </div>
      </div>

      {/* Roast Content */}
      <div className="flex-1 overflow-y-auto bg-slate-950 p-12 flex justify-center items-start">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-2xl bg-white rounded-sm shadow-2xl overflow-hidden border-4 border-slate-900 p-12 font-mono relative"
        >
          {/* Decorative Corner */}
          <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden">
            <div className="absolute top-4 right-[-24px] rotate-45 bg-red-600 text-white text-[9px] font-black px-10 py-1 uppercase tracking-widest">
              CRITICAL
            </div>
          </div>

          <div className="space-y-12">
            <div className="space-y-4">
               <div className="flex items-center gap-2 text-slate-400">
                  <Terminal size={16} />
                  <span className="text-[10px] font-bold tracking-widest uppercase">System.log --analysis --brutal</span>
               </div>
               <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none italic">
                 "Professional Suicide Prevention"
               </h1>
            </div>

            <div className="space-y-10">
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="relative pl-6 border-l-2 border-red-500"
              >
                <span className="absolute left-[-5px] top-0 w-2 h-2 bg-red-500 rotate-45" />
                <p className="text-sm leading-relaxed text-slate-800 font-bold italic">
                  {roast.critique}
                </p>
              </motion.div>
            </div>

            <div className="pt-12 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center text-slate-400 font-black text-[10px]">AI</div>
                 <div className="space-y-0.5">
                    <p className="text-[10px] font-black text-slate-900 uppercase">Assessment Complete</p>
                    <p className="text-[9px] font-bold text-slate-400">STATUS: FAILED_REJECTED</p>
                 </div>
              </div>
              <div className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
                © ResumeAI Professional
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
