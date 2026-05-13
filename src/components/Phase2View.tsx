import { motion } from "motion/react";
import { 
  ChevronLeft, 
  Target, 
  BookOpen, 
  FileText, 
  Copy, 
  Check, 
  Sparkles,
  ArrowRight,
  Play
} from "lucide-react";
import { Phase2Data, ResumeData } from "../types";
import { useState } from "react";
import { cn } from "../lib/utils";

interface Phase2ViewProps {
  data: Phase2Data;
  resume: ResumeData;
  onBack: () => void;
  onStartInterview: () => void;
}

export default function Phase2View({ data, resume, onBack, onStartInterview }: Phase2ViewProps) {
  const [activeTab, setActiveTab] = useState<"portfolio" | "targeting" | "letter">("portfolio");
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="h-full flex overflow-hidden">
      {/* Sidebar Controls */}
      <div className="w-80 border-r border-slate-200 bg-white flex flex-col p-6 shrink-0 space-y-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
             <div className="px-2 py-0.5 bg-purple-50 text-purple-700 text-[10px] font-black uppercase rounded border border-purple-100 italic">PHASE 02</div>
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Growth & Strategy</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 leading-tight">Career Growth Mode</h2>
          <p className="text-xs text-slate-500 leading-relaxed font-medium">
            Beyond the resume. We've generated assets to help you land the role and shine online.
          </p>
        </div>

        <nav className="space-y-1 pt-4">
          {[
            { id: "portfolio", label: "Portfolio Descriptions", icon: BookOpen },
            { id: "targeting", label: "Job-Role Targeting", icon: Target },
            { id: "letter", label: "Cover Letter", icon: FileText }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                activeTab === tab.id 
                  ? "bg-slate-900 text-white shadow-lg shadow-slate-200" 
                  : "text-slate-500 hover:bg-slate-50"
              )}
            >
              <tab.icon size={14} />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto space-y-2 pt-6 border-t border-slate-50">
           <button 
            onClick={onStartInterview}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-md shadow-blue-100 transition-all font-sans"
          >
            <Play size={14} />
            <span>Start Interview Lab</span>
          </button>
          <button 
            onClick={onBack}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-slate-200 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all"
          >
            <ChevronLeft size={14} />
            <span>Back to Canvas</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto bg-slate-50 p-12">
        <div className="max-w-3xl mx-auto space-y-8">
          {activeTab === "portfolio" && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Portfolio Polish</h3>
                <p className="text-sm text-slate-500">Ready-to-use descriptions for your GitHub repos or personal site.</p>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {data.portfolioDescriptions?.map((desc, i) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    key={i} 
                    className="group bg-white border border-slate-200 rounded-2xl p-8 space-y-4 hover:border-purple-200 transition-colors shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-black text-slate-900 border-b-2 border-purple-200 inline-block">{desc.projectTitle}</h4>
                      <button 
                        onClick={() => copyToClipboard(desc.polishedDescription, `port-${i}`)}
                        className="text-slate-400 hover:text-slate-900 transition-colors"
                      >
                        {copied === `port-${i}` ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                      </button>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed font-medium">
                      {desc.polishedDescription}
                    </p>
                    <div className="flex items-center gap-4 pt-4 text-[10px] font-black text-purple-600 uppercase tracking-widest">
                       <span className="flex items-center gap-1"><Sparkles size={12} /> AI Enhanced</span>
                       <span className="flex items-center gap-1"><ArrowRight size={12} /> Best for LinkedIn/GitHub</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "targeting" && (
            <div className="space-y-8">
               <div className="space-y-1">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">ATS Targeting: {resume.targetRole}</h3>
                <p className="text-sm text-slate-500">We've specifically tailored your resume dna for this exact role.</p>
              </div>

              <div className="bg-slate-900 rounded-3xl p-8 text-white space-y-6 shadow-2xl">
                 <div className="space-y-2">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                       <Sparkles size={12} className="text-purple-400" />
                       Tailored Summary
                    </span>
                    <p className="text-sm leading-relaxed text-slate-300 font-medium italic">"{data.tailoredResume.summary}"</p>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-white/10">
                    <div className="space-y-4">
                       <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Recommended Keywords</span>
                       <div className="flex flex-wrap gap-2">
                          {data.tailoredResume.jobKeywords?.map((kw, i) => (
                            <span key={i} className="px-2 py-1 bg-white/5 border border-white/10 rounded text-[10px] font-bold text-slate-300 uppercase">
                              {kw}
                            </span>
                          ))}
                       </div>
                    </div>
                    <div className="space-y-4">
                       <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Optimized Skill Priorities</span>
                       <div className="space-y-2">
                          <p className="text-[11px] text-slate-400 font-bold uppercase">Focus: <span className="text-white">{data.tailoredResume.techSkills?.frameworks?.slice(0, 3).join(", ") || "N/A"}</span></p>
                          <p className="text-[11px] text-slate-400 font-bold uppercase">Standard: <span className="text-white">{data.tailoredResume.techSkills?.languages?.slice(0, 3).join(", ") || "N/A"}</span></p>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-3xl p-8 space-y-6">
                 <h4 className="font-black text-slate-900 flex items-center gap-2 uppercase text-xs tracking-widest">
                    <Target size={16} className="text-blue-600" />
                    How to use this data?
                 </h4>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      { title: "The Summary", text: "Replace your current resume summary with our tailored version to hit ATS filters instantly." },
                      { title: "Keywords", text: "Naturally weave 2-3 of these into your project descriptions or experience bullets." },
                      { title: "Skill Order", text: "List the mentioned frameworks first in your technical skills section." }
                    ].map((step, i) => (
                      <div key={i} className="space-y-2">
                         <span className="text-[10px] font-black text-blue-600">0{i+1}</span>
                         <p className="text-[11px] font-bold text-slate-900 uppercase tracking-tight">{step.title}</p>
                         <p className="text-[11px] text-slate-500 leading-relaxed">{step.text}</p>
                      </div>
                    ))}
                 </div>
              </div>
            </div>
          )}

          {activeTab === "letter" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">Drafted Cover Letter</h3>
                  <p className="text-sm text-slate-500">A personalized pitch for the {resume.targetRole} role.</p>
                </div>
                 <button 
                    onClick={() => copyToClipboard(data.coverLetter || "", "letter")}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all"
                  >
                    {copied === "letter" ? <Check size={14} /> : <Copy size={14} />}
                    <span>{copied === "letter" ? "Copied" : "Copy Letter"}</span>
                  </button>
              </div>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white border border-slate-200 shadow-xl rounded-sm p-12 min-h-[600px] font-serif italic text-slate-700 leading-relaxed relative"
              >
                 <div className="absolute top-0 right-0 p-8 opacity-5">
                    <FileText size={160} />
                 </div>
                 <div className="relative z-10 whitespace-pre-wrap text-sm">
                    {data.coverLetter}
                 </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
