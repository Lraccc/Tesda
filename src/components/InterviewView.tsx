import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ChevronLeft, 
  Send, 
  User, 
  Bot, 
  BarChart3, 
  Trophy, 
  AlertCircle, 
  Lightbulb,
  CheckCircle2,
  Lock,
  Play
} from "lucide-react";
import { 
  InterviewMessage, 
  InterviewScorecard, 
  ResumeData, 
  InterviewType, 
  Difficulty 
} from "../types";
import { getNextInterviewQuestion, evaluateInterviewAnswer, generateFinalScorecard } from "../services/geminiService";
import { cn } from "../lib/utils";

interface InterviewViewProps {
  resume: ResumeData;
  onBack: () => void;
}

export default function InterviewView({ resume, onBack }: InterviewViewProps) {
  const [setup, setSetup] = useState<{ type: InterviewType; difficulty: Difficulty } | null>(null);
  const [history, setHistory] = useState<InterviewMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [scorecard, setScorecard] = useState<InterviewScorecard | null>(null);
  const [isFinishing, setIsFinishing] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [history, isLoading]);

  const startInterview = async (type: InterviewType, difficulty: Difficulty) => {
    setSetup({ type, difficulty });
    setIsLoading(true);
    try {
      const firstQuestion = await getNextInterviewQuestion(resume, [], type, difficulty);
      setHistory([{ role: "ai", content: firstQuestion }]);
    } catch (error) {
      console.error("Failed to start interview:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading || !setup) return;

    const userMessage = inputValue.trim();
    setInputValue("");
    
    // Add user message
    const newHistory = [...history, { role: "user", content: userMessage } as InterviewMessage];
    setHistory(newHistory);
    setIsLoading(true);

    try {
      const lastAiQuestion = history[history.length - 1].content;
      const evaluation = await evaluateInterviewAnswer(lastAiQuestion, userMessage, resume);
      
      // Update the user message with feedback
      const historyWithFeedback = [...newHistory];
      historyWithFeedback[historyWithFeedback.length - 1].feedback = evaluation;
      
      // If we've reached 8-12 questions, we might want to offer to finish
      if (historyWithFeedback.filter(m => m.role === "ai").length >= 8) {
        setHistory(historyWithFeedback);
        // We let the user choose to continue or finish
      } else {
        const nextQuestion = await getNextInterviewQuestion(resume, historyWithFeedback, setup.type, setup.difficulty);
        setHistory([...historyWithFeedback, { role: "ai", content: nextQuestion }]);
      }
    } catch (error) {
      console.error("Interview step failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const finishInterview = async () => {
    setIsFinishing(true);
    try {
      const result = await generateFinalScorecard(resume, history);
      setScorecard(result);
    } catch (error) {
      console.error("Failed to generate scorecard:", error);
    } finally {
      setIsFinishing(false);
    }
  };

  if (!setup) {
    return (
      <div className="h-full bg-slate-50 flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl bg-white border border-slate-200 rounded-3xl p-10 shadow-xl space-y-8"
        >
          <div className="space-y-2 text-center">
             <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Play size={32} />
             </div>
             <h2 className="text-3xl font-black text-slate-900 tracking-tight">Phase 3: Interview Lab</h2>
             <p className="text-slate-500 font-medium">Ready to test your skills? Select your challenge parameters.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">Interview Focus</label>
              <div className="grid grid-cols-1 gap-2">
                {(["Technical", "HR", "Mixed"] as InterviewType[]).map((t) => (
                  <button 
                    key={t}
                    onClick={() => setSetup(prev => ({ ...prev!, type: t }))}
                    className={cn(
                      "p-4 rounded-xl border text-left transition-all font-bold",
                      setup?.type === t ? "border-blue-600 bg-blue-50 text-blue-700" : "border-slate-100 hover:border-slate-200"
                    )}
                  >
                    {t} Focus
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">Difficulty Grade</label>
              <div className="grid grid-cols-1 gap-2">
                {(["Entry-level", "Mid-level", "Competitive"] as Difficulty[]).map((d) => (
                  <button 
                    key={d}
                    onClick={() => setSetup(prev => ({ ...prev!, difficulty: d }))}
                    className={cn(
                      "p-4 rounded-xl border text-left transition-all font-bold",
                      setup?.difficulty === d ? "border-blue-600 bg-blue-50 text-blue-700" : "border-slate-100 hover:border-slate-200"
                    )}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-50 flex items-center justify-between">
             <button onClick={onBack} className="text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-slate-600 transition-colors flex items-center gap-2">
                <ChevronLeft size={16} /> Back
             </button>
             <button 
              disabled={!setup?.type || !setup?.difficulty}
              onClick={() => startInterview(setup!.type, setup!.difficulty)}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-100 transition-all disabled:opacity-50"
             >
                Initialize Session
             </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (scorecard) {
    return (
      <div className="h-full bg-slate-50 overflow-y-auto p-12">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-4xl mx-auto space-y-8"
        >
          <div className="bg-slate-900 rounded-[2.5rem] p-12 text-white shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 blur-[100px] -mr-32 -mt-32" />
             
             <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                <div className="w-32 h-32 rounded-full border-4 border-white/10 flex items-center justify-center shrink-0">
                   <div className="text-center">
                      <span className="text-4xl font-black">{scorecard.overallScore}</span>
                      <p className="text-[10px] font-black uppercase opacity-60">Score</p>
                   </div>
                </div>
                <div className="space-y-4 text-center md:text-left">
                   <div className="flex items-center justify-center md:justify-start gap-2">
                      <div className="px-2 py-0.5 bg-green-500 text-white text-[10px] font-black uppercase rounded">{scorecard.verdict}</div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Official Scorecard</span>
                   </div>
                   <h2 className="text-4xl font-black tracking-tight leading-none">Session Performance Analysis.</h2>
                   <p className="text-slate-400 font-medium italic">"Based on your responses, you demonstrate {scorecard.overallScore > 80 ? "exceptional" : "solid"} understanding of the {setup.type} role requirements."</p>
                </div>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="bg-white border border-slate-200 rounded-3xl p-8 space-y-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                   <Lightbulb size={16} className="text-yellow-500" />
                   Core Strengths
                </h3>
                <div className="space-y-3">
                   {scorecard.topStrengths?.map((str, i) => (
                     <div key={i} className="flex gap-3 items-start">
                        <CheckCircle2 size={16} className="text-green-500 mt-0.5 shrink-0" />
                        <p className="text-sm font-bold text-slate-800 leading-tight">{str}</p>
                     </div>
                   ))}
                </div>
             </div>

             <div className="bg-white border border-slate-200 rounded-3xl p-8 space-y-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                   <AlertCircle size={16} className="text-red-500" />
                   Growth Opportunities
                </h3>
                <div className="space-y-3">
                   {scorecard.topWeaknesses?.map((weak, i) => (
                     <div key={i} className="flex gap-3 items-start">
                        <div className="w-4 h-4 rounded bg-red-50 text-red-500 flex items-center justify-center text-[10px] font-black mt-0.5 shrink-0">!</div>
                        <p className="text-sm font-bold text-slate-600 leading-tight">{weak}</p>
                     </div>
                   ))}
                </div>
             </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-8 space-y-6">
             <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Category Breakdown</h3>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {scorecard.categoryBreakdown?.map((cat, i) => (
                  <div key={i} className="space-y-2">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-tight">{cat.category}</p>
                     <div className="flex items-end shadow-sm border border-slate-100 rounded-lg p-3 gap-2">
                        <span className="text-xl font-black text-slate-900">{cat.score}</span>
                        <span className="text-[10px] font-bold text-slate-400 mb-1">/100</span>
                     </div>
                  </div>
                ))}
             </div>
          </div>

          <div className="flex justify-center pt-8">
             <button onClick={onBack} className="flex items-center gap-2 px-8 py-3 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-xl transition-all hover:bg-black">
                Finish Session
             </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-slate-950 overflow-hidden">
      {/* Header */}
      <header className="px-8 py-4 bg-slate-900 border-b border-white/5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="text-slate-400 hover:text-white transition-colors">
            <ChevronLeft size={20} />
          </button>
          <div>
             <h3 className="text-sm font-bold text-white uppercase tracking-tight">Interview Lab</h3>
             <div className="flex items-center gap-2">
                <span className="text-[9px] font-black text-blue-400 uppercase">{setup.type} Session</span>
                <span className="w-1 h-1 bg-white/20 rounded-full" />
                <span className="text-[9px] font-black text-slate-500 uppercase">{setup.difficulty}</span>
             </div>
          </div>
        </div>
        <div className="flex items-center gap-6">
           <div className="hidden md:flex gap-4">
              <div className="text-right">
                 <p className="text-[9px] font-black text-slate-500 uppercase">Confidence</p>
                 <div className="flex gap-0.5 mt-0.5">
                    {[1,2,3,4,5].map(i => (
                      <div key={i} className={cn(
                        "w-2 h-1 rounded-full",
                        history.length > 1 && history[history.length-2]?.feedback?.confidence! >= i ? "bg-green-500" : "bg-white/10"
                      )} />
                    ))}
                 </div>
              </div>
              <div className="text-right">
                 <p className="text-[9px] font-black text-slate-500 uppercase">Clarity</p>
                 <div className="flex gap-0.5 mt-0.5">
                    {[1,2,3,4,5].map(i => (
                      <div key={i} className={cn(
                        "w-2 h-1 rounded-full",
                        history.length > 1 && history[history.length-2]?.feedback?.clarity! >= i ? "bg-blue-500" : "bg-white/10"
                      )} />
                    ))}
                 </div>
              </div>
           </div>
           {history.filter(m => m.role === "ai").length >= 8 && (
             <button 
              onClick={finishInterview}
              disabled={isFinishing}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-[10px] font-black uppercase tracking-widest transition-all"
             >
                {isFinishing ? "Processing..." : "Finish Interview"}
             </button>
           )}
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 md:p-12 space-y-12 custom-scrollbar">
         {history?.map((msg, i) => (
           <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={i} 
            className={cn(
              "flex gap-6 max-w-4xl mx-auto",
              msg.role === "user" ? "flex-row-reverse" : ""
            )}
           >
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border",
                msg.role === "ai" ? "bg-blue-600/10 border-blue-500/20 text-blue-400" : "bg-slate-800 border-white/5 text-slate-400"
              )}>
                 {msg.role === "ai" ? <Bot size={20} /> : <User size={20} />}
              </div>
              
              <div className={cn(
                "space-y-4 flex-1",
                msg.role === "user" ? "text-right" : ""
              )}>
                 <div className={cn(
                   "p-6 rounded-2xl border text-sm leading-relaxed",
                   msg.role === "ai" 
                    ? "bg-slate-900 border-white/5 text-slate-300" 
                    : "bg-blue-600 border-blue-500 text-white ml-auto max-w-[80%]"
                 )}>
                    {msg.content}
                 </div>

                 {msg.feedback && (
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                      <div className="bg-slate-900/50 border border-white/5 rounded-xl p-4 space-y-2">
                         <div className="flex items-center gap-2 text-[10px] font-black text-green-400 uppercase tracking-widest">
                            <Trophy size={12} /> Strength
                         </div>
                         <p className="text-[12px] text-slate-400 italic">"{msg.feedback.strengths}"</p>
                      </div>
                      <div className="bg-slate-900/50 border border-white/5 rounded-xl p-4 space-y-2">
                         <div className="flex items-center gap-2 text-[10px] font-black text-blue-400 uppercase tracking-widest">
                            <Lightbulb size={12} /> Refinement
                         </div>
                         <p className="text-[12px] text-slate-400 italic">"{msg.feedback.betterPhrasing}"</p>
                      </div>
                   </div>
                 )}
              </div>
           </motion.div>
         ))}
         {isLoading && (
           <div className="flex gap-6 max-w-4xl mx-auto">
              <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                 <Bot size={20} className="animate-pulse" />
              </div>
              <div className="flex gap-1 items-center pt-4">
                 <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
                 <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
                 <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" />
              </div>
           </div>
         )}
         <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <footer className="p-6 bg-slate-900/50 border-t border-white/5 shrink-0">
         <div className="max-w-4xl mx-auto relative">
            <textarea 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Structure your answer using STAR method..."
              className="w-full bg-slate-950 border border-white/5 rounded-2xl py-4 pl-6 pr-16 text-white text-sm focus:border-blue-500/50 outline-none transition-all resize-none h-20"
            />
            <button 
              onClick={handleSend}
              disabled={isLoading || !inputValue.trim()}
              className="absolute right-3 bottom-3 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all shadow-lg shadow-blue-100 disabled:opacity-50"
            >
               <Send size={18} />
            </button>
         </div>
      </footer>
    </div>
  );
}
