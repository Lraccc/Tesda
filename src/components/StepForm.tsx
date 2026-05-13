import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ChevronRight, 
  ChevronLeft, 
  Plus, 
  Trash2, 
  User, 
  GraduationCap, 
  Code2, 
  FolderPlus, 
  Briefcase, 
  Award,
  Target
} from "lucide-react";
import { ResumeData } from "../types";
import { cn } from "../lib/utils";

interface StepFormProps {
  onComplete: (data: Partial<ResumeData>) => void;
  isLoading: boolean;
  onStepChange: (step: number) => void;
}

export default function StepForm({ onComplete, isLoading, onStepChange }: StepFormProps) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<Partial<ResumeData>>({
    template: "software",
    personalInfo: {
      fullName: "",
      email: "",
      phone: "",
      linkedin: "",
      github: "",
      location: "Metro Manila, PH"
    },
    education: [{ degree: "", school: "", year: "" }],
    techSkills: { languages: [], frameworks: [], tools: [] },
    projects: [{ title: "", description: "", technologies: [] }],
    experience: [{ role: "", company: "", duration: "", description: "" }],
    certifications: []
  });

  const nextStep = () => {
    const next = step + 1;
    setStep(next);
    onStepChange(next);
  };
  
  const prevStep = () => {
    const prev = step - 1;
    setStep(prev);
    onStepChange(prev);
  };

  const updatePersonalInfo = (field: string, value: string) => {
    setData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo!, [field]: value }
    }));
  };

  const addEducation = () => {
    setData(prev => ({
      ...prev,
      education: [...(prev.education || []), { degree: "", school: "", year: "" }]
    }));
  };

  const updateEducation = (index: number, field: string, value: string) => {
    const nextEd = [...(data.education || [])];
    nextEd[index] = { ...nextEd[index], [field]: value };
    setData(prev => ({ ...prev, education: nextEd }));
  };

  const removeEducation = (index: number) => {
    setData(prev => ({
      ...prev,
      education: prev.education?.filter((_, i) => i !== index)
    }));
  };

  const addProject = () => {
    setData(prev => ({
      ...prev,
      projects: [...(prev.projects || []), { title: "", description: "", technologies: [] }]
    }));
  };

  const updateProject = (index: number, field: string, value: any) => {
    const nextArr = [...(data.projects || [])];
    nextArr[index] = { ...nextArr[index], [field]: value };
    setData(prev => ({ ...prev, projects: nextArr }));
  };

  const addExperience = () => {
    setData(prev => ({
      ...prev,
      experience: [...(prev.experience || []), { role: "", company: "", duration: "", description: "" }]
    }));
  };

  const updateExperience = (index: number, field: string, value: string) => {
    const nextArr = [...(data.experience || [])];
    nextArr[index] = { ...nextArr[index], [field]: value };
    setData(prev => ({ ...prev, experience: nextArr }));
  };

  return (
    <div className="w-full max-w-2xl mx-auto py-12 px-6">
      <AnimatePresence mode="wait">
        <motion.div
           key={step}
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           exit={{ opacity: 0, y: -10 }}
           className="space-y-8"
        >
          {step === 1 && (
            <div className="space-y-8">
              <div className="space-y-2">
                <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-black uppercase rounded border border-blue-100">Step 01</span>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">Choose your Career Path</h2>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">Select a template to refine your resume's DNA.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: "student", title: "IT Student / OJT", desc: "For undergraduate internships." },
                  { id: "software", title: "Software Dev", desc: "Fresh grad dev roles." },
                  { id: "qa", title: "QA / Testing", desc: "Quality assurance path." },
                  { id: "data", title: "Data / Analytics", desc: "Data & ML focused." }
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setData(prev => ({ ...prev, template: t.id as any }))}
                    className={cn(
                      "p-4 rounded-xl border flex flex-col text-left transition-all",
                      data.template === t.id ? "border-blue-600 bg-blue-50/30" : "border-slate-200 bg-white hover:border-slate-300"
                    )}
                  >
                    <h3 className="font-bold text-slate-800 text-sm">{t.title}</h3>
                    <p className="text-[11px] text-slate-500 mt-1">{t.desc}</p>
                  </button>
                ))}
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Target Role</label>
                <input
                  type="text"
                  placeholder="e.g. Junior Web Developer"
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-slate-300"
                  value={data.targetRole || ""}
                  onChange={(e) => setData(prev => ({ ...prev, targetRole: e.target.value }))}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-black uppercase rounded border border-blue-100">Step 02</span>
                <h2 className="text-2xl font-bold text-slate-900">Persona Details</h2>
                <p className="text-xs text-slate-500 font-medium">How should recruiters identify you?</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-6 rounded-2xl border border-slate-200">
                {[
                  { label: "Full Name", key: "fullName", placeholder: "Juan Dela Cruz" },
                  { label: "Email", key: "email", type: "email", placeholder: "juan@example.com" },
                  { label: "Phone", key: "phone", placeholder: "0917-xxx-xxxx" },
                  { label: "Location", key: "location", placeholder: "Metro Manila, PH" },
                  { label: "LinkedIn", key: "linkedin", placeholder: "linkedin.com/in/..." },
                  { label: "GitHub", key: "github", placeholder: "github.com/..." }
                ].map((f) => (
                  <div key={f.key} className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">{f.label}</label>
                    <input
                      type={f.type || "text"}
                      placeholder={f.placeholder}
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/10 outline-none"
                      value={(data.personalInfo as any)?.[f.key]}
                      onChange={(e) => updatePersonalInfo(f.key, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
               <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-black uppercase rounded border border-blue-100">Step 03</span>
                  <h2 className="text-2xl font-bold text-slate-900">Academics</h2>
                </div>
                <button onClick={addEducation} className="text-xs font-black text-blue-600 hover:text-blue-700 flex items-center gap-1 uppercase tracking-widest">
                  <Plus size={14} /> Add School
                </button>
              </div>

              <div className="space-y-3">
                {data.education?.map((ed, i) => (
                  <div key={i} className="p-4 bg-white border border-slate-200 rounded-xl relative group animation-scale-in">
                    {data.education!.length > 1 && (
                      <button onClick={() => removeEducation(i)} className="absolute top-3 right-3 text-slate-300 hover:text-red-500 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    )}
                    <div className="space-y-3">
                       <div className="space-y-1.5 flex-1">
                        <label className="text-[9px] font-black uppercase text-slate-400">School</label>
                        <input className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-100 rounded-lg outline-none focus:border-blue-300" value={ed.school} onChange={(e) => updateEducation(i, "school", e.target.value)} />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5 flex-1">
                          <label className="text-[9px] font-black uppercase text-slate-400">Degree</label>
                          <input className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-100 rounded-lg outline-none focus:border-blue-300" placeholder="BSCS" value={ed.degree} onChange={(e) => updateEducation(i, "degree", e.target.value)} />
                        </div>
                        <div className="space-y-1.5 w-32">
                          <label className="text-[9px] font-black uppercase text-slate-400">Year</label>
                          <input className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-100 rounded-lg outline-none focus:border-blue-300" placeholder="2024" value={ed.year} onChange={(e) => updateEducation(i, "year", e.target.value)} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-black uppercase rounded border border-blue-100">Step 04</span>
                <h2 className="text-2xl font-bold text-slate-900">Technical Arsenal</h2>
                <p className="text-xs text-slate-500 font-medium">Categorize your expertise (Separate with commas).</p>
              </div>

              <div className="grid grid-cols-1 gap-4 bg-white p-6 rounded-2xl border border-slate-200">
                {[
                  { label: "Languages", key: "languages", placeholder: "Java, Python, JS..." },
                  { label: "Frameworks / Libs", key: "frameworks", placeholder: "React, Node, Spring..." },
                  { label: "Tools / DevOps", key: "tools", placeholder: "Docker, Git, AWS..." }
                ].map((f) => (
                  <div key={f.key} className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">{f.label}</label>
                    <textarea
                      placeholder={f.placeholder}
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/10 outline-none resize-none h-20"
                      value={(data.techSkills as any)?.[f.key]?.join(", ") || ""}
                      onChange={(e) => setData(prev => ({ 
                        ...prev, 
                        techSkills: { ...prev.techSkills!, [f.key]: e.target.value.split(",").map(s => s.trim()).filter(Boolean) }
                      }))}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-black uppercase rounded border border-blue-100">Step 05</span>
                  <h2 className="text-2xl font-bold text-slate-900">Portfolio Focus</h2>
                </div>
                <button onClick={addProject} className="text-xs font-black text-blue-600 hover:text-blue-700 flex items-center gap-1 uppercase tracking-widest">
                  <Plus size={14} /> Add Project
                </button>
              </div>

              <div className="space-y-3">
                {data.projects?.map((prj, i) => (
                  <div key={i} className="p-4 bg-white border border-slate-200 rounded-xl relative group">
                    <button onClick={() => setData(prev => ({ ...prev, projects: prev.projects?.filter((_, idx) => idx !== i) }))} className="absolute top-3 right-3 text-slate-300 hover:text-red-500 transition-colors">
                      <Trash2 size={14} />
                    </button>
                    <div className="space-y-3">
                      <input placeholder="Title" className="w-full bg-transparent font-bold text-slate-800 focus:outline-none placeholder:text-slate-300" value={prj.title} onChange={(e) => updateProject(i, "title", e.target.value)} />
                      <input placeholder="Tech stacks (comma separated)" className="text-[11px] w-full bg-slate-50 px-2 py-1.5 rounded text-slate-600 focus:outline-none font-mono" value={prj.technologies?.join(", ") || ""} onChange={(e) => updateProject(i, "technologies", e.target.value.split(",").map(s => s.trim()).filter(Boolean))} />
                      <textarea placeholder="The impact: Optimized load times by 40% using..." className="w-full text-xs bg-transparent focus:outline-none resize-none min-h-[60px]" value={prj.description} onChange={(e) => updateProject(i, "description", e.target.value)} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-black uppercase rounded border border-blue-100">Step 06</span>
                  <h2 className="text-2xl font-bold text-slate-900">Work Experience / OJT</h2>
                </div>
                <button onClick={addExperience} className="text-xs font-black text-blue-600 hover:text-blue-700 flex items-center gap-1 uppercase tracking-widest">
                  <Plus size={14} /> Add Experience
                </button>
              </div>

              <div className="space-y-3">
                {data.experience?.map((exp, i) => (
                  <div key={i} className="p-4 bg-white border border-slate-200 rounded-xl relative group">
                    <button onClick={() => setData(prev => ({ ...prev, experience: prev.experience?.filter((_, idx) => idx !== i) }))} className="absolute top-3 right-3 text-slate-300 hover:text-red-500 transition-colors">
                      <Trash2 size={14} />
                    </button>
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <input placeholder="Role" className="flex-1 bg-transparent font-bold text-slate-800 focus:outline-none" value={exp.role} onChange={(e) => updateExperience(i, "role", e.target.value)} />
                        <input placeholder="Duration" className="w-32 bg-transparent text-[11px] font-bold text-slate-400 text-right focus:outline-none" value={exp.duration} onChange={(e) => updateExperience(i, "duration", e.target.value)} />
                      </div>
                      <input placeholder="Company" className="w-full bg-transparent text-sm text-blue-600 font-semibold focus:outline-none" value={exp.company} onChange={(e) => updateExperience(i, "company", e.target.value)} />
                      <textarea placeholder="Key wins/tasks..." className="w-full text-xs bg-transparent focus:outline-none resize-none min-h-[80px]" value={exp.description} onChange={(e) => updateExperience(i, "description", e.target.value)} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 7 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-black uppercase rounded border border-blue-100">Step 07</span>
                <h2 className="text-2xl font-bold text-slate-900">Credentials</h2>
                <p className="text-xs text-slate-500 font-medium">Add professional certificates (one per line).</p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200">
                <textarea
                  placeholder="AWS Cloud Practitioner&#10;Google Tech Support..."
                  className="w-full px-4 py-4 min-h-[200px] text-sm bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-blue-500/10 outline-none resize-none"
                  value={data.certifications?.join("\n") || ""}
                  onChange={(e) => setData(prev => ({ 
                    ...prev, 
                    certifications: e.target.value.split("\n").map(s => s.trim()).filter(Boolean) 
                  }))}
                />
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-8 border-t border-slate-200">
            {step > 1 ? (
              <button onClick={prevStep} className="flex items-center gap-1.5 px-4 py-2 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-slate-600 transition-colors">
                <ChevronLeft size={16} /> Previous
              </button>
            ) : <div />}

            <button
              onClick={step === 7 ? () => onComplete(data) : nextStep}
              disabled={isLoading}
              className="group flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-black uppercase tracking-widest transition-all shadow-md shadow-blue-100 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>{step === 7 ? "Generate Final Resume" : "Continue Process"}</span>
                  <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
