import { motion } from "motion/react";
import { 
  Download, 
  Mail, 
  Phone, 
  MapPin, 
  Linkedin, 
  Github, 
  Flame, 
  CheckCircle,
  FileText,
  Save
} from "lucide-react";
import { ResumeData } from "../types";

interface ResumePreviewProps {
  data: ResumeData;
  onRoast: () => void;
  onSave: () => void;
  isSaving: boolean;
}

export default function ResumePreview({ data, onRoast, onSave, isSaving }: ResumePreviewProps) {
  return (
    <div className="h-full flex overflow-hidden">
      {/* Controls Sidebar */}
      <div className="w-80 border-r border-slate-200 bg-white flex flex-col p-6 shrink-0 space-y-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
             <div className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-black uppercase rounded border border-blue-100">DRAFT</div>
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Optimized for ATS</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">Final Verification</h2>
          <p className="text-xs text-slate-500 leading-relaxed font-medium">
            We've refined your descriptions with high-impact action verbs. Review the output below.
          </p>
        </div>

        <div className="space-y-2 pt-4 border-t border-slate-50">
          <button 
            onClick={onSave}
            disabled={isSaving}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-md shadow-blue-100 disabled:opacity-50"
          >
            {isSaving ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Save size={14} />
                <span>Save To Profile</span>
              </>
            )}
          </button>
          
          <button 
            onClick={onRoast}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-sm"
          >
            <Flame size={14} className="text-red-500" />
            <span>Roast Mode</span>
          </button>

          <button className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-slate-200 text-slate-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-all">
            <Download size={14} />
            <span>Export (PDF)</span>
          </button>
        </div>

        <div className="mt-auto p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
          <div className="flex items-center gap-2">
            <CheckCircle size={16} className="text-green-500" />
            <span className="text-[10px] font-black uppercase text-slate-600">Health Check</span>
          </div>
          <div className="space-y-1">
             <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden">
                <div className="w-[85%] h-full bg-green-500" />
             </div>
             <p className="text-[9px] font-bold text-slate-400">Target Role: {data.targetRole || "IT Professional"}</p>
          </div>
        </div>
      </div>

      {/* Preview Canvas */}
      <div className="flex-1 overflow-y-auto bg-slate-200 p-12 flex justify-center items-start">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-[700px] min-h-[900px] bg-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-sm p-16 flex flex-col border border-slate-300 relative"
        >
          <div className="absolute top-6 right-6 text-[9px] font-black tracking-widest text-green-600 bg-green-50 px-2 py-1 rounded border border-green-100">
            DRAFT PREVIEW
          </div>

          <header className="text-center mb-10 space-y-2">
            <h1 className="text-4xl font-bold uppercase tracking-tight text-slate-900">{data.personalInfo.fullName}</h1>
            <div className="flex flex-wrap justify-center items-center gap-y-1 gap-x-4 text-[11px] font-bold text-slate-500 uppercase tracking-wide">
              <span>{data.personalInfo.location}</span>
              <span className="text-slate-300">•</span>
              <span>{data.personalInfo.phone}</span>
              <span className="text-slate-300">•</span>
              <span>{data.personalInfo.email}</span>
            </div>
            <div className="flex justify-center gap-4 text-[10px] font-bold text-blue-600 uppercase tracking-widest">
              {data.personalInfo.linkedin && (
                <a href={data.personalInfo.linkedin} className="hover:underline">LinkedIn</a>
              )}
              {data.personalInfo.github && (
                <a href={data.personalInfo.github} className="text-slate-900 hover:underline">GitHub</a>
              )}
            </div>
          </header>

          <div className="space-y-8 flex-1">
            {/* Summary */}
            <section className="space-y-2">
              <h2 className="text-xs font-black border-b border-slate-900 pb-1 uppercase tracking-tight">Professional Summary</h2>
              <p className="text-[12px] text-slate-700 leading-relaxed font-medium">
                {data.summary}
              </p>
            </section>

            {/* Education */}
            <section className="space-y-3">
              <h2 className="text-xs font-black border-b border-slate-900 pb-1 uppercase tracking-tight">Education</h2>
              {data.education?.map((ed, i) => (
                <div key={i} className="flex justify-between items-baseline">
                  <div>
                    <h3 className="text-[12px] font-black text-slate-800 uppercase leading-none">{ed.school}</h3>
                    <p className="text-[10px] text-slate-500 italic mt-1">{ed.degree}</p>
                  </div>
                  <span className="text-[11px] font-bold text-slate-400">{ed.year}</span>
                </div>
              ))}
            </section>

            {/* Skills */}
            <section className="space-y-3">
              <h2 className="text-xs font-black border-b border-slate-900 pb-1 uppercase tracking-tight">Technical Skills</h2>
              <div className="grid grid-cols-1 gap-2 pt-1">
                {[
                  { l: "Languages", v: data.techSkills.languages },
                  { l: "Frameworks", v: data.techSkills.frameworks },
                  { l: "Tools", v: data.techSkills.tools }
                ].map((s, i) => (
                  <div key={i} className="flex gap-4">
                    <span className="min-w-[100px] text-[10px] font-black uppercase text-slate-400">{s.l}:</span>
                    <p className="text-[11px] font-bold text-slate-700">{s.v?.join(", ") || "None listed"}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Experience */}
            <section className="space-y-4">
              <h2 className="text-xs font-black border-b border-slate-900 pb-1 uppercase tracking-tight">Experience / OJT</h2>
              <div className="space-y-6">
                {data.experience?.map((exp, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between items-baseline">
                      <h3 className="text-[12px] font-black text-slate-900 uppercase">{exp.role} @ {exp.company}</h3>
                      <span className="text-[10px] font-black text-slate-400">{exp.duration}</span>
                    </div>
                    <div className="text-[11px] text-slate-700 leading-relaxed font-medium space-y-1">
                      {(exp.description || "").split("\n").map((line, idx) => (
                        <div key={idx} className="flex gap-2">
                           <span className="text-slate-300">•</span>
                           <span>{line.replace(/^•\s*/, "")}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Projects */}
            <section className="space-y-4">
              <h2 className="text-xs font-black border-b border-slate-900 pb-1 uppercase tracking-tight">Projects</h2>
              <div className="space-y-6">
                {data.projects?.map((prj, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between items-baseline">
                      <h3 className="text-[12px] font-black text-slate-900 uppercase underline decoration-slate-200 underline-offset-4">{prj.title}</h3>
                      <div className="flex gap-2">
                        {prj.technologies?.slice(0, 2).map((t, idx) => (
                          <span key={idx} className="text-[9px] font-black px-1.5 py-0.5 bg-slate-100 rounded text-slate-500 uppercase">{t}</span>
                        ))}
                      </div>
                    </div>
                    <div className="text-[11px] text-slate-700 leading-relaxed font-medium space-y-1">
                      {(prj.description || "").split("\n").map((line, idx) => (
                        <div key={idx} className="flex gap-2">
                           <span className="text-slate-300">•</span>
                           <span>{line.replace(/^•\s*/, "")}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function Award({ size, className }: { size: number, className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <circle cx="12" cy="8" r="6" />
      <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
    </svg>
  );
}
