import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResumeStore } from '../store/useResumeStore';
import { analyzeResume, getKeywordSuggestionsForRole } from '../utils/atsScorer';
import { exportToPDF, exportToDOCX, exportToTXT, exportToJSON, printResume } from '../utils/exporters';
import { executeAITask } from '../utils/aiGenerators';
import { TemplateRenderer, TEMPLATES_LIST } from '../templates/Templates';
import confetti from 'canvas-confetti';
import { 
  User, FileText, GraduationCap, Cpu, Briefcase, Folder, Award, Languages, 
  Heart, Users, Eye, Download, Sparkles, AlertCircle, Plus, 
  Trash2, ArrowLeft, ArrowRight, Check, Palette, 
  CheckCircle2, RefreshCw, Info
} from 'lucide-react';

export const Builder: React.FC = () => {
  const navigate = useNavigate();
  
  // Zustand Store hooks
  const {
    resumeData,
    themeSettings,
    templateId,
    activeStep,
    apiKey,
    apiProvider,
    setActiveStep,
    setTemplateId,
    updateThemeSettings,
    updatePersonalInfo,
    updateSummary,
    addEducation,
    updateEducation,
    removeEducation,
    reorderEducation,
    addSkill,
    updateSkill,
    removeSkill,
    reorderSkills,
    addExperience,
    updateExperience,
    removeExperience,
    reorderExperience,
    addProject,
    updateProject,
    removeProject,
    reorderProjects,
    addCertification,
    updateCertification,
    removeCertification,
    addInternship,
    updateInternship,
    removeInternship,
    addAchievement,
    updateAchievement,
    removeAchievement,
    addLanguage,
    updateLanguage,
    removeLanguage,
    addInterest,
    removeInterest,
    addReference,
    updateReference,
    removeReference,
    saveCurrentResume
  } = useResumeStore();

  // Local State UI Controls
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'theme' | 'ats' | 'ai'>('editor');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [activeAiTool, setActiveAiTool] = useState<string | null>(null);
  const [photoBase64, setPhotoBase64] = useState(resumeData.personalInfo.photo || '');

  // Sync photo state when resumeData changes from external sources
  useEffect(() => {
    if (resumeData.personalInfo.photo) {
      setPhotoBase64(resumeData.personalInfo.photo);
    }
  }, [resumeData.personalInfo.photo]);

  // Auto-Save sync indicator
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving'>('saved');

  useEffect(() => {
    setSaveStatus('saving');
    const timer = setTimeout(() => {
      saveCurrentResume();
      setSaveStatus('saved');
    }, 1000);
    return () => clearTimeout(timer);
  }, [resumeData, themeSettings, templateId, saveCurrentResume]);

  // Scorer Details
  const atsAnalysis = analyzeResume(resumeData);

  // HTML5 List Drag & Drop handlers
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number, listType: 'education' | 'skills' | 'experience' | 'projects') => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) return;

    if (listType === 'education') {
      const items = [...resumeData.education];
      const [draggedItem] = items.splice(draggedIndex, 1);
      items.splice(targetIndex, 0, draggedItem);
      reorderEducation(items);
    } else if (listType === 'skills') {
      const items = [...resumeData.skills];
      const [draggedItem] = items.splice(draggedIndex, 1);
      items.splice(targetIndex, 0, draggedItem);
      reorderSkills(items);
    } else if (listType === 'experience') {
      const items = [...resumeData.experience];
      const [draggedItem] = items.splice(draggedIndex, 1);
      items.splice(targetIndex, 0, draggedItem);
      reorderExperience(items);
    } else if (listType === 'projects') {
      const items = [...resumeData.projects];
      const [draggedItem] = items.splice(draggedIndex, 1);
      items.splice(targetIndex, 0, draggedItem);
      reorderProjects(items);
    }
    setDraggedIndex(null);
  };

  // Base64 Photo Upload loader
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2000000) {
        alert('File is too large. Please select an image under 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        setPhotoBase64(base64);
        updatePersonalInfo({ photo: base64 });
      };
      reader.readAsDataURL(file);
    }
  };

  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [isExportingDOCX, setIsExportingDOCX] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);

  // Trigger downloads with complete safety guards
  const handleDownloadPDF = async () => {
    if (isExportingPDF) return;
    setIsExportingPDF(true);
    try {
      const rawName = resumeData.personalInfo.fullName ? resumeData.personalInfo.fullName.trim() : '';
      const filename = rawName ? `${rawName.replace(/\s+/g, '_')}_Resume` : 'Resume';
      console.log('Initiating safe PDF download for:', filename);
      
      const success = await exportToPDF('resume-document', filename, themeSettings.pageSize);
      
      if (success) {
        console.log('Resume PDF downloaded successfully.');
        confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
      } else {
        console.error('PDF export failed');
        alert('Failed to generate PDF. Please check that all sections are valid.');
      }
    } catch (error) {
      console.error('PDF Download Error:', error);
      alert('An error occurred while generating the PDF. Please try again.');
    } finally {
      setIsExportingPDF(false);
    }
  };

  const handlePrint = () => {
    if (isPrinting) return;
    setIsPrinting(true);
    try {
      printResume();
    } catch (error) {
      console.error('Print Error:', error);
      alert('Failed to launch print dialog.');
    } finally {
      setTimeout(() => setIsPrinting(false), 800);
    }
  };

  const handleDownloadDOCX = async () => {
    if (isExportingDOCX) return;
    setIsExportingDOCX(true);
    try {
      const success = await exportToDOCX(resumeData);
      if (success) {
        console.log('Resume Word document downloaded successfully.');
      } else {
        alert('Failed to generate Word document. Please try again.');
      }
    } catch (error) {
      console.error('DOCX Download Error:', error);
      alert('An error occurred while generating the Word document.');
    } finally {
      setIsExportingDOCX(false);
    }
  };

  const handleDownloadTXT = () => {
    exportToTXT(resumeData);
  };

  const handleExportJSON = () => {
    exportToJSON(resumeData, themeSettings, templateId);
  };

  // AI completion trigger
  const runAIHelper = async (action: string, customText = '') => {
    setAiLoading(true);
    setActiveAiTool(action);
    setAiResponse('');
    
    try {
      const context = {
        title: resumeData.personalInfo.professionalTitle || 'Software Engineer',
        name: resumeData.personalInfo.fullName || 'Candidate',
        currentText: customText || resumeData.summary || '',
        skills: resumeData.skills.map(s => s.name)
      };
      
      // Add timeout for AI API calls
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
      
      const response = await executeAITask(action, context, { apiKey, provider: apiProvider });
      clearTimeout(timeoutId);
      setAiResponse(response);
    } catch (e: any) {
      const errorMsg = e.name === 'AbortError' 
        ? 'Request timed out. Please try again.'
        : e.message || 'Generation failed. Try verifying API credentials.';
      setAiResponse(`Error: ${errorMsg}`);
    } finally {
      setAiLoading(false);
    }
  };

  // Insert AI suggestion to store
  const handleApplyAISuggestion = (action: string) => {
    if (action === 'generate-summary' || action === 'improve-summary') {
      updateSummary(aiResponse);
    }
    setActiveAiTool(null);
    setAiResponse('');
  };

  // Steps definitions
  const steps = [
    { id: 0, name: 'Personal Details', icon: <User className="h-4.5 w-4.5" /> },
    { id: 1, name: 'Summary', icon: <FileText className="h-4.5 w-4.5" /> },
    { id: 2, name: 'Education', icon: <GraduationCap className="h-4.5 w-4.5" /> },
    { id: 3, name: 'Skills Profile', icon: <Cpu className="h-4.5 w-4.5" /> },
    { id: 4, name: 'Experience', icon: <Briefcase className="h-4.5 w-4.5" /> },
    { id: 5, name: 'Projects', icon: <Folder className="h-4.5 w-4.5" /> },
    { id: 6, name: 'Certificates', icon: <Award className="h-4.5 w-4.5" /> },
    { id: 7, name: 'Internships', icon: <Briefcase className="h-4.5 w-4.5" /> },
    { id: 8, name: 'Achievements', icon: <Award className="h-4.5 w-4.5" /> },
    { id: 9, name: 'Languages', icon: <Languages className="h-4.5 w-4.5" /> },
    { id: 10, name: 'Interests', icon: <Heart className="h-4.5 w-4.5" /> },
    { id: 11, name: 'References', icon: <Users className="h-4.5 w-4.5" /> }
  ];

  // Helper selectors
  const personal = resumeData.personalInfo;
  
  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden bg-gray-50/50 dark:bg-gray-950/20 transition-colors duration-300">
      
      {/* 1. LEFT SIDEBAR: STEP NAVIGATION */}
      <aside className="hidden lg:flex w-64 border-r border-gray-200 bg-white p-4 flex-col justify-between shrink-0 no-print dark:border-gray-800 dark:bg-gray-900 transition-colors">
        <div className="space-y-4">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" /> Exit to Dashboard
          </button>
          
          <div className="space-y-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Form Checklist</h3>
            <nav className="space-y-1 max-h-[calc(100vh-14rem)] overflow-y-auto pr-1">
              {steps.map((step) => (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(step.id)}
                  className={`w-full flex items-center gap-3 py-2 px-3 rounded-xl font-semibold text-xs transition-smooth ${
                    activeStep === step.id 
                      ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' 
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:hover:bg-gray-850 dark:hover:text-white'
                  }`}
                >
                  {step.icon}
                  <span>{step.name}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Sync Status Badge */}
        <div className="border-t pt-4 dark:border-gray-800 flex justify-between items-center text-[10px] text-gray-400 font-medium">
          <span>State Auto-Saved</span>
          <span className={`inline-flex items-center gap-1 font-bold ${saveStatus === 'saved' ? 'text-emerald-500' : 'text-amber-500'}`}>
            <RefreshCw className={`h-3 w-3 ${saveStatus === 'saving' ? 'animate-spin' : ''}`} />
            {saveStatus === 'saved' ? 'Synced' : 'Saving...'}
          </span>
        </div>
      </aside>

      {/* 2. MIDDLE PANEL: MULTI-STEP FORMS & TOOLS */}
      <div className="flex-1 flex flex-col min-w-0 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden no-print">
        
        {/* Workspace Subtabs */}
        <div className="flex border-b border-gray-150 dark:border-gray-800 px-4 py-2 justify-between items-center bg-gray-50 dark:bg-gray-900/50 no-print">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('editor')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-smooth ${activeTab === 'editor' ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm border border-gray-200 dark:border-gray-700' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
            >
              <FileText className="inline h-3.5 w-3.5 mr-1" /> Editor
            </button>
            <button
              onClick={() => setActiveTab('theme')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-smooth ${activeTab === 'theme' ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm border border-gray-200 dark:border-gray-700' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
            >
              <Palette className="inline h-3.5 w-3.5 mr-1" /> Customizer
            </button>
            <button
              onClick={() => setActiveTab('ats')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-smooth ${activeTab === 'ats' ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm border border-gray-200 dark:border-gray-700' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
            >
              <Award className="inline h-3.5 w-3.5 mr-1" /> ATS Checker
            </button>
            <button
              onClick={() => setActiveTab('ai')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-smooth ${activeTab === 'ai' ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm border border-gray-200 dark:border-gray-700' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
            >
              <Sparkles className="inline h-3.5 w-3.5 mr-1" /> AI Assistant
            </button>
          </div>
          
          {/* Step selector on mobile */}
          <div className="flex lg:hidden items-center gap-1.5 text-xs text-gray-500 font-bold">
            <span>Step {activeStep + 1}/12</span>
          </div>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* EDITOR FORM TAB */}
          {activeTab === 'editor' && (
            <div className="space-y-6">
              
              {/* STEP 1: PERSONAL INFORMATION */}
              {activeStep === 0 && (
                <div className="space-y-5">
                  <div className="border-b pb-3 dark:border-gray-800">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Personal Info</h2>
                    <p className="text-xs text-gray-400">Tell recruiters who you are and how to reach you.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center border-b pb-6 dark:border-gray-800">
                    <div className="col-span-1 flex flex-col items-center">
                      <div className="h-24 w-24 rounded-full overflow-hidden border border-gray-200 dark:border-gray-700 flex items-center justify-center bg-gray-50 dark:bg-gray-900 shadow-inner relative">
                        {photoBase64 ? (
                          <img src={photoBase64} alt="Avatar" className="h-full w-full object-cover" />
                        ) : (
                          <User className="h-8 w-8 text-gray-300" />
                        )}
                      </div>
                      <input 
                        type="file" 
                        id="avatar-loader" 
                        onChange={handlePhotoUpload} 
                        accept="image/*" 
                        className="hidden" 
                      />
                      <label 
                        htmlFor="avatar-loader"
                        className="mt-3 cursor-pointer text-[10px] font-bold text-indigo-600 hover:underline"
                      >
                        Upload Photo (Optional)
                      </label>
                      {photoBase64 && (
                        <button 
                          onClick={() => { setPhotoBase64(''); updatePersonalInfo({ photo: '' }); }}
                          className="text-[9px] text-red-500 font-bold hover:underline mt-1"
                        >
                          Remove Photo
                        </button>
                      )}
                    </div>

                    <div className="col-span-2 space-y-4">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-1">Full Name</label>
                        <input
                          type="text"
                          value={personal.fullName}
                          onChange={(e) => updatePersonalInfo({ fullName: e.target.value })}
                          placeholder="e.g. Alex Morgan"
                          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-xs outline-none focus:border-blue-600 dark:border-gray-700 dark:bg-gray-850 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-1">Professional Title</label>
                        <input
                          type="text"
                          value={personal.professionalTitle}
                          onChange={(e) => updatePersonalInfo({ professionalTitle: e.target.value })}
                          placeholder="e.g. Senior Software Engineer"
                          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-xs outline-none focus:border-blue-600 dark:border-gray-700 dark:bg-gray-850 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-1">Email Address 📧</label>
                      <input
                        type="email"
                        value={personal.email}
                        onChange={(e) => updatePersonalInfo({ email: e.target.value })}
                        placeholder="e.g. alex.morgan@email.com"
                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-xs outline-none focus:border-blue-600 dark:border-gray-700 dark:bg-gray-850 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-1">Phone Number 📱</label>
                      <input
                        type="tel"
                        value={personal.phone}
                        onChange={(e) => updatePersonalInfo({ phone: e.target.value })}
                        placeholder="e.g. +1 (555) 019-2834"
                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-xs outline-none focus:border-blue-600 dark:border-gray-700 dark:bg-gray-850 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-1">Location 📍</label>
                      <input
                        type="text"
                        value={personal.address}
                        onChange={(e) => updatePersonalInfo({ address: e.target.value })}
                        placeholder="e.g. San Francisco, CA"
                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-xs outline-none focus:border-blue-600 dark:border-gray-700 dark:bg-gray-850 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-1">LinkedIn Profile</label>
                      <input
                        type="text"
                        value={personal.linkedin}
                        onChange={(e) => updatePersonalInfo({ linkedin: e.target.value })}
                        placeholder="e.g. linkedin.com/in/username"
                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-xs outline-none focus:border-blue-600 dark:border-gray-700 dark:bg-gray-850 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-1">GitHub Account</label>
                      <input
                        type="text"
                        value={personal.github}
                        onChange={(e) => updatePersonalInfo({ github: e.target.value })}
                        placeholder="e.g. github.com/username"
                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-xs outline-none focus:border-blue-600 dark:border-gray-700 dark:bg-gray-850 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-1">Portfolio Website</label>
                      <input
                        type="text"
                        value={personal.portfolio}
                        onChange={(e) => updatePersonalInfo({ portfolio: e.target.value })}
                        placeholder="e.g. mywebsite.dev"
                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-xs outline-none focus:border-blue-600 dark:border-gray-700 dark:bg-gray-850 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: SUMMARY */}
              {activeStep === 1 && (
                <div className="space-y-5">
                  <div className="border-b pb-3 dark:border-gray-800">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Summary / About Me</h2>
                    <p className="text-xs text-gray-400">Write a short, engaging description highlighting your career highlights.</p>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="block text-[10px] font-bold uppercase tracking-wide text-gray-400">Summary Text</label>
                        <button
                          onClick={() => runAIHelper('improve-summary', resumeData.summary)}
                          className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                        >
                          <Sparkles className="h-3 w-3 animate-pulse" /> AI Improve Summary
                        </button>
                      </div>
                      <textarea
                        value={resumeData.summary}
                        onChange={(e) => updateSummary(e.target.value)}
                        placeholder="Write a concise 80-120 words summary highlighting your top projects and skills..."
                        rows={6}
                        className="w-full rounded-xl border border-gray-200 p-4 text-xs outline-none focus:border-blue-600 dark:border-gray-700 dark:bg-gray-850 dark:text-white leading-relaxed"
                      />
                    </div>

                    {/* AI Prompt Generator Widget Option 2 */}
                    <div className="rounded-xl border border-dashed border-gray-200 p-4 bg-gray-50/50 dark:border-gray-800 dark:bg-gray-900/50 space-y-3">
                      <h4 className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5 text-indigo-500" /> AI Prompter Option
                      </h4>
                      <p className="text-[10px] text-gray-500 leading-relaxed">
                        Copy the default recruiter-friendly prompt to optimize your summaries in ChatGPT / Claude, or generate instantly using our client-side AI helper button!
                      </p>
                      
                      <div className="bg-white p-3 rounded-lg border text-[10px] text-gray-400 dark:bg-gray-850 dark:border-gray-800 leading-relaxed font-mono">
                        "Create a professional ATS-friendly resume summary for a {personal.professionalTitle || 'Software Engineering'} student. Highlight technical skills, strengths, internships, certifications, leadership qualities, teamwork, communication, and career objectives. Keep it concise (80–120 words), impactful, and recruiter-friendly."
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(`Create a professional ATS-friendly resume summary for a ${personal.professionalTitle || 'Software Engineering'} student. Highlight technical skills, strengths, internships, certifications, leadership qualities, teamwork, communication, and career objectives. Keep it concise (80–120 words), impactful, and recruiter-friendly.`);
                            alert('Prompt copied to clipboard!');
                          }}
                          className="inline-flex h-8.5 items-center justify-center rounded-lg border border-gray-200 bg-white px-3 text-[10px] font-bold text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-850 dark:text-gray-300 dark:hover:bg-gray-800 transition-smooth"
                        >
                          📋 Copy Prompt Text
                        </button>
                        <button
                          onClick={() => runAIHelper('generate-summary')}
                          className="inline-flex h-8.5 items-center justify-center rounded-lg bg-indigo-600 px-3 text-[10px] font-bold text-white hover:bg-indigo-700 transition-smooth"
                        >
                          ⚡ Generate Summary Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: EDUCATION */}
              {activeStep === 2 && (
                <div className="space-y-5">
                  <div className="border-b pb-3 dark:border-gray-800 flex justify-between items-center">
                    <div>
                      <h2 className="text-lg font-bold text-gray-900 dark:text-white">Education History</h2>
                      <p className="text-xs text-gray-400">Add institutions where you studied. Drag to reorder.</p>
                    </div>
                    <button
                      onClick={() => addEducation({ degree: '', school: '', startYear: '', endYear: '', city: '', cgpaOrPercentage: '', description: '' })}
                      className="inline-flex h-8.5 items-center gap-1 rounded-lg bg-indigo-600 px-3 text-xs font-bold text-white hover:bg-indigo-700 transition-smooth"
                    >
                      <Plus className="h-4 w-4" /> Add Education
                    </button>
                  </div>

                  <div className="space-y-4">
                    {resumeData.education.map((edu, idx) => (
                      <div
                        key={edu.id}
                        draggable
                        onDragStart={() => handleDragStart(idx)}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, idx, 'education')}
                        className="p-5 border rounded-xl bg-gray-50/50 dark:border-gray-800 dark:bg-gray-900/50 cursor-move relative space-y-4"
                      >
                        <div className="flex justify-between items-center border-b pb-2 dark:border-gray-800">
                          <span className="text-[10px] font-bold text-gray-400 uppercase">Degree Entry {idx + 1}</span>
                          <button
                            onClick={() => removeEducation(edu.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-1">Degree Title</label>
                            <input
                              type="text"
                              value={edu.degree}
                              onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                              placeholder="e.g. B.S. in Computer Science"
                              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs outline-none focus:border-blue-600 dark:border-gray-700 dark:bg-gray-850 dark:text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-1">School / Institution</label>
                            <input
                              type="text"
                              value={edu.school}
                              onChange={(e) => updateEducation(edu.id, { school: e.target.value })}
                              placeholder="e.g. Stanford University"
                              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs outline-none focus:border-blue-600 dark:border-gray-700 dark:bg-gray-850 dark:text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-1">Start Year</label>
                            <input
                              type="text"
                              value={edu.startYear}
                              onChange={(e) => updateEducation(edu.id, { startYear: e.target.value })}
                              placeholder="e.g. 2018"
                              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs outline-none focus:border-blue-600 dark:border-gray-700 dark:bg-gray-850 dark:text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-1">End Year</label>
                            <input
                              type="text"
                              value={edu.endYear}
                              onChange={(e) => updateEducation(edu.id, { endYear: e.target.value })}
                              placeholder="e.g. 2022"
                              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs outline-none focus:border-blue-600 dark:border-gray-700 dark:bg-gray-850 dark:text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-1">CGPA / Percentage</label>
                            <input
                              type="text"
                              value={edu.cgpaOrPercentage || ''}
                              onChange={(e) => updateEducation(edu.id, { cgpaOrPercentage: e.target.value })}
                              placeholder="e.g. 3.8 / 4.0 or 85%"
                              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs outline-none focus:border-blue-600 dark:border-gray-700 dark:bg-gray-850 dark:text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-1">City / Location</label>
                            <input
                              type="text"
                              value={edu.city || ''}
                              onChange={(e) => updateEducation(edu.id, { city: e.target.value })}
                              placeholder="e.g. Stanford, CA"
                              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs outline-none focus:border-blue-600 dark:border-gray-700 dark:bg-gray-850 dark:text-white"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-1">Coursework / Description</label>
                          <textarea
                            value={edu.description || ''}
                            onChange={(e) => updateEducation(edu.id, { description: e.target.value })}
                            placeholder="Specialization in machine learning, database management..."
                            rows={3}
                            className="w-full rounded-lg border border-gray-200 p-3 text-xs outline-none focus:border-blue-600 dark:border-gray-700 dark:bg-gray-850 dark:text-white"
                          />
                        </div>
                      </div>
                    ))}
                    {resumeData.education.length === 0 && (
                      <p className="text-center text-xs text-gray-400 py-6 border border-dashed rounded-xl">Click 'Add Education' to start cataloging degrees.</p>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 4: SKILLS */}
              {activeStep === 3 && (
                <div className="space-y-5">
                  <div className="border-b pb-3 dark:border-gray-800">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Skills Profile Manager</h2>
                    <p className="text-xs text-gray-400">Classify capabilities. Use star meters to set skill expertise level.</p>
                  </div>

                  {/* Add skill row */}
                  <div className="flex flex-col sm:flex-row gap-3 items-end bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border dark:border-gray-800">
                    <div className="flex-1 w-full">
                      <label className="block text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-1">Skill Name</label>
                      <input
                        type="text"
                        id="new-skill-name"
                        placeholder="e.g. React.js, Python, Leadership"
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs outline-none focus:border-blue-600 dark:border-gray-700 dark:bg-gray-850 dark:text-white"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            const input = document.getElementById('new-skill-name') as HTMLInputElement;
                            const name = input.value.trim();
                            if (name) {
                              addSkill({ name, type: 'technical', rating: 4 });
                              input.value = '';
                            }
                          }
                        }}
                      />
                    </div>
                    
                    <div className="w-full sm:w-fit flex gap-3 justify-between">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-1">Category</label>
                        <select
                          id="new-skill-type"
                          className="rounded-lg border border-gray-200 px-3 py-2 text-xs outline-none focus:border-blue-600 dark:border-gray-700 dark:bg-gray-850 dark:text-white"
                        >
                          <option value="technical">Technical</option>
                          <option value="soft">Soft Skill</option>
                        </select>
                      </div>
                      
                      <button
                        onClick={() => {
                          const input = document.getElementById('new-skill-name') as HTMLInputElement;
                          const sel = document.getElementById('new-skill-type') as HTMLSelectElement;
                          const name = input.value.trim();
                          if (name) {
                            addSkill({ name, type: sel.value as 'technical' | 'soft', rating: 4 });
                            input.value = '';
                          }
                        }}
                        className="inline-flex h-8.5 items-center justify-center rounded-lg bg-indigo-600 px-4 text-xs font-bold text-white hover:bg-indigo-700 transition-smooth shrink-0 mt-auto"
                      >
                        Add Chip
                      </button>
                    </div>
                  </div>

                  {/* Skills lists */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Your Skills List</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-1">
                      {resumeData.skills.map((skill, idx) => (
                        <div
                          key={skill.id}
                          draggable
                          onDragStart={() => handleDragStart(idx)}
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDrop(e, idx, 'skills')}
                          className="flex justify-between items-center p-3 rounded-lg border bg-white cursor-move dark:border-gray-800 dark:bg-gray-850"
                        >
                          <div className="space-y-0.5">
                            <span className="text-xs font-bold text-gray-900 dark:text-white">{skill.name}</span>
                            <span className="block text-[8px] uppercase tracking-wider font-semibold text-gray-400">{skill.type}</span>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <div className="flex gap-0.5 text-xs text-amber-400">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <button
                                  key={i}
                                  onClick={() => updateSkill(skill.id, { rating: i + 1 })}
                                  className="hover:scale-110"
                                >
                                  {i < skill.rating ? '★' : '☆'}
                                </button>
                              ))}
                            </div>
                            <button
                              onClick={() => removeSkill(skill.id)}
                              className="text-gray-400 hover:text-red-500"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                      {resumeData.skills.length === 0 && (
                        <p className="col-span-2 text-center text-xs text-gray-400 py-6 border border-dashed rounded-xl">No skills added yet.</p>
                      )}
                    </div>
                  </div>
                  
                  {/* Suggestions block based on role */}
                  <div className="rounded-xl border border-gray-150 p-4 bg-gray-50/30 dark:border-gray-850 dark:bg-gray-900/30 space-y-3">
                    <h4 className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1">
                      <Info className="h-3.5 w-3.5 text-blue-500" /> Auto Keyword Suggestions
                    </h4>
                    <p className="text-[10px] text-gray-500">
                      Based on your current title <strong>({personal.professionalTitle || 'Software Engineer'})</strong>, we suggest including:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {getKeywordSuggestionsForRole(personal.professionalTitle).slice(0, 10).map((kw) => {
                        const exists = resumeData.skills.some(s => s.name.toLowerCase() === kw.toLowerCase());
                        if (exists) return null;
                        return (
                          <button
                            key={kw}
                            onClick={() => addSkill({ name: kw, type: 'technical', rating: 4 })}
                            className="px-2.5 py-1 text-[10px] font-semibold bg-white border rounded-lg hover:border-indigo-500 text-gray-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400"
                          >
                            + {kw}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 5: EXPERIENCE */}
              {activeStep === 4 && (
                <div className="space-y-5">
                  <div className="border-b pb-3 dark:border-gray-800 flex justify-between items-center">
                    <div>
                      <h2 className="text-lg font-bold text-gray-900 dark:text-white">Professional History</h2>
                      <p className="text-xs text-gray-400">Add jobs, internships, or freelance roles. Drag to reorder.</p>
                    </div>
                    <button
                      onClick={() => addExperience({ company: '', role: '', startDate: '', endDate: '', current: false, responsibilities: '', location: '', achievements: '' })}
                      className="inline-flex h-8.5 items-center gap-1 rounded-lg bg-indigo-600 px-3 text-xs font-bold text-white hover:bg-indigo-700 transition-smooth"
                    >
                      <Plus className="h-4 w-4" /> Add Job Role
                    </button>
                  </div>

                  <div className="space-y-4">
                    {resumeData.experience.map((exp, idx) => (
                      <div
                        key={exp.id}
                        draggable
                        onDragStart={() => handleDragStart(idx)}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, idx, 'experience')}
                        className="p-5 border rounded-xl bg-gray-50/50 dark:border-gray-800 dark:bg-gray-900/50 cursor-move space-y-4"
                      >
                        <div className="flex justify-between items-center border-b pb-2 dark:border-gray-800">
                          <span className="text-[10px] font-bold text-gray-400 uppercase">Experience Entry {idx + 1}</span>
                          <button
                            onClick={() => removeExperience(exp.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-1">Company Name</label>
                            <input
                              type="text"
                              value={exp.company}
                              onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                              placeholder="e.g. Innovate Solutions Inc."
                              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs outline-none focus:border-blue-600 dark:border-gray-700 dark:bg-gray-850 dark:text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-1">Job Role</label>
                            <input
                              type="text"
                              value={exp.role}
                              onChange={(e) => updateExperience(exp.id, { role: e.target.value })}
                              placeholder="e.g. Lead Software Engineer"
                              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs outline-none focus:border-blue-600 dark:border-gray-700 dark:bg-gray-850 dark:text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-1">Start Date</label>
                            <input
                              type="month"
                              value={exp.startDate}
                              onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })}
                              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs outline-none focus:border-blue-600 dark:border-gray-700 dark:bg-gray-850 dark:text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-1">End Date</label>
                            <input
                              type="month"
                              value={exp.endDate}
                              disabled={exp.current}
                              onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })}
                              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs outline-none focus:border-blue-600 dark:border-gray-700 dark:bg-gray-850 dark:text-white disabled:opacity-50"
                            />
                          </div>
                          <div className="sm:col-span-2 flex items-center gap-2">
                            <input
                              type="checkbox"
                              id={`exp-curr-${exp.id}`}
                              checked={exp.current}
                              onChange={(e) => updateExperience(exp.id, { current: e.target.checked })}
                              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <label htmlFor={`exp-curr-${exp.id}`} className="text-xs text-gray-600 dark:text-gray-400">Currently Working Here</label>
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-1">Location</label>
                            <input
                              type="text"
                              value={exp.location || ''}
                              onChange={(e) => updateExperience(exp.id, { location: e.target.value })}
                              placeholder="e.g. San Francisco, CA"
                              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs outline-none focus:border-blue-600 dark:border-gray-700 dark:bg-gray-850 dark:text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-1">Key Achievements (Optional)</label>
                            <input
                              type="text"
                              value={exp.achievements || ''}
                              onChange={(e) => updateExperience(exp.id, { achievements: e.target.value })}
                              placeholder="e.g. Received Innovator of the Year award in 2023."
                              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs outline-none focus:border-blue-600 dark:border-gray-700 dark:bg-gray-850 dark:text-white"
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <label className="block text-[10px] font-bold uppercase tracking-wide text-gray-400">Responsibilities</label>
                            <button
                              onClick={() => runAIHelper('rewrite-bullet', exp.responsibilities)}
                              className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                            >
                              <Sparkles className="h-3 w-3" /> Optimize bullets via AI
                            </button>
                          </div>
                          <textarea
                            value={exp.responsibilities}
                            onChange={(e) => updateExperience(exp.id, { responsibilities: e.target.value })}
                            placeholder="Describe your job impact. Use bullet points or separate sentences with new lines..."
                            rows={4}
                            className="w-full rounded-lg border border-gray-200 p-3 text-xs outline-none focus:border-blue-600 dark:border-gray-700 dark:bg-gray-850 dark:text-white leading-relaxed"
                          />
                        </div>
                      </div>
                    ))}
                    {resumeData.experience.length === 0 && (
                      <p className="text-center text-xs text-gray-400 py-6 border border-dashed rounded-xl">Click 'Add Job Role' to start filling professional details.</p>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 6: PROJECTS */}
              {activeStep === 5 && (
                <div className="space-y-5">
                  <div className="border-b pb-3 dark:border-gray-800 flex justify-between items-center">
                    <div>
                      <h2 className="text-lg font-bold text-gray-900 dark:text-white">Academic & Side Projects</h2>
                      <p className="text-xs text-gray-400">Showcase software builds or designs. Drag to reorder.</p>
                    </div>
                    <button
                      onClick={() => addProject({ name: '', description: '', technologies: [], githubLink: '', liveLink: '' })}
                      className="inline-flex h-8.5 items-center gap-1 rounded-lg bg-indigo-600 px-3 text-xs font-bold text-white hover:bg-indigo-700 transition-smooth"
                    >
                      <Plus className="h-4 w-4" /> Add Project
                    </button>
                  </div>

                  <div className="space-y-4">
                    {resumeData.projects.map((proj, idx) => (
                      <div
                        key={proj.id}
                        draggable
                        onDragStart={() => handleDragStart(idx)}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, idx, 'projects')}
                        className="p-5 border rounded-xl bg-gray-50/50 dark:border-gray-800 dark:bg-gray-900/50 cursor-move space-y-4"
                      >
                        <div className="flex justify-between items-center border-b pb-2 dark:border-gray-800">
                          <span className="text-[10px] font-bold text-gray-400 uppercase">Project Entry {idx + 1}</span>
                          <button
                            onClick={() => removeProject(proj.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-1">Project Name</label>
                            <input
                              type="text"
                              value={proj.name}
                              onChange={(e) => updateProject(proj.id, { name: e.target.value })}
                              placeholder="e.g. E-Commerce Platform"
                              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs outline-none focus:border-blue-600 dark:border-gray-700 dark:bg-gray-850 dark:text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-1">GitHub Code Link</label>
                            <input
                              type="text"
                              value={proj.githubLink}
                              onChange={(e) => updateProject(proj.id, { githubLink: e.target.value })}
                              placeholder="e.g. github.com/user/project"
                              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs outline-none focus:border-blue-600 dark:border-gray-700 dark:bg-gray-850 dark:text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-1">Live Demo URL</label>
                            <input
                              type="text"
                              value={proj.liveLink}
                              onChange={(e) => updateProject(proj.id, { liveLink: e.target.value })}
                              placeholder="e.g. project-demo.vercel.app"
                              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs outline-none focus:border-blue-600 dark:border-gray-700 dark:bg-gray-850 dark:text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-1">Technologies Used (Comma separated)</label>
                            <input
                              type="text"
                              value={proj.technologies.join(', ')}
                              onChange={(e) => updateProject(proj.id, { technologies: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                              placeholder="e.g. React, Node.js, SQL"
                              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs outline-none focus:border-blue-600 dark:border-gray-700 dark:bg-gray-850 dark:text-white"
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <label className="block text-[10px] font-bold uppercase tracking-wide text-gray-400">Description</label>
                            <button
                              onClick={() => runAIHelper('generate-project', proj.name)}
                              className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                            >
                              <Sparkles className="h-3 w-3" /> Auto Describe Project
                            </button>
                          </div>
                          <textarea
                            value={proj.description}
                            onChange={(e) => updateProject(proj.id, { description: e.target.value })}
                            placeholder="Describe what you built and how it optimizes developer workflows..."
                            rows={3}
                            className="w-full rounded-lg border border-gray-200 p-3 text-xs outline-none focus:border-blue-600 dark:border-gray-700 dark:bg-gray-850 dark:text-white leading-relaxed"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEPS 7 - 12 FALLBACKS AND OTHER SECTIONS */}
              {activeStep >= 6 && (
                <div className="space-y-5">
                  <div className="border-b pb-3 dark:border-gray-800">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">{steps[activeStep].name}</h2>
                    <p className="text-xs text-gray-400">Configure secondary information fields.</p>
                  </div>

                  {/* Certifications Step */}
                  {activeStep === 6 && (
                    <div className="space-y-4">
                      <button
                        onClick={() => addCertification({ name: '', issuer: '', date: '' })}
                        className="inline-flex h-8.5 items-center gap-1 rounded-lg bg-indigo-600 px-3 text-xs font-bold text-white hover:bg-indigo-700 transition-smooth"
                      >
                        <Plus className="h-4 w-4" /> Add Certificate
                      </button>

                      {resumeData.certifications.map((cert) => (
                        <div key={cert.id} className="p-4 border rounded-xl bg-gray-50/50 dark:border-gray-800 dark:bg-gray-900/50 space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold text-gray-400">Certification Details</span>
                            <button onClick={() => removeCertification(cert.id)} className="text-red-500"><Trash2 className="h-4.5 w-4.5" /></button>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <input
                              type="text"
                              value={cert.name}
                              onChange={e => updateCertification(cert.id, { name: e.target.value })}
                              placeholder="Certificate Name"
                              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs dark:border-gray-700 dark:bg-gray-850 dark:text-white"
                            />
                            <input
                              type="text"
                              value={cert.issuer}
                              onChange={e => updateCertification(cert.id, { issuer: e.target.value })}
                              placeholder="Issuing Organization"
                              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs dark:border-gray-700 dark:bg-gray-850 dark:text-white"
                            />
                            <input
                              type="month"
                              value={cert.date}
                              onChange={e => updateCertification(cert.id, { date: e.target.value })}
                              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs dark:border-gray-700 dark:bg-gray-850 dark:text-white"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Languages Step */}
                  {activeStep === 9 && (
                    <div className="space-y-4">
                      <button
                        onClick={() => addLanguage({ name: '', speaking: 'Fluent', reading: 'Fluent', writing: 'Fluent' })}
                        className="inline-flex h-8.5 items-center gap-1 rounded-lg bg-indigo-600 px-3 text-xs font-bold text-white hover:bg-indigo-700 transition-smooth"
                      >
                        <Plus className="h-4 w-4" /> Add Language
                      </button>

                      {resumeData.languages.map((lang) => (
                        <div key={lang.id} className="p-4 border rounded-xl bg-gray-50/50 dark:border-gray-800 dark:bg-gray-900/50 flex gap-4 items-center justify-between">
                          <input
                            type="text"
                            value={lang.name}
                            onChange={e => updateLanguage(lang.id, { name: e.target.value })}
                            placeholder="Language (e.g. Spanish)"
                            className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-xs dark:border-gray-700 dark:bg-gray-850 dark:text-white"
                          />
                          <select
                            value={lang.speaking}
                            onChange={e => updateLanguage(lang.id, { speaking: e.target.value as any })}
                            className="rounded-lg border border-gray-200 px-3 py-2 text-xs dark:border-gray-700 dark:bg-gray-850 dark:text-white"
                          >
                            <option value="Basic">Basic</option>
                            <option value="Conversational">Conversational</option>
                            <option value="Fluent">Fluent</option>
                            <option value="Native">Native</option>
                          </select>
                          <button onClick={() => removeLanguage(lang.id)} className="text-red-500"><Trash2 className="h-4.5 w-4.5" /></button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Internships Step */}
                  {activeStep === 7 && (
                    <div className="space-y-4">
                      <button
                        onClick={() => addInternship({ company: '', role: '', duration: '', description: '' })}
                        className="inline-flex h-8.5 items-center gap-1 rounded-lg bg-indigo-600 px-3 text-xs font-bold text-white hover:bg-indigo-700 transition-smooth"
                      >
                        <Plus className="h-4 w-4" /> Add Internship
                      </button>

                      {resumeData.internships.map((intern) => (
                        <div key={intern.id} className="p-4 border rounded-xl bg-gray-50/50 dark:border-gray-800 dark:bg-gray-900/50 space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold text-gray-400">Internship Details</span>
                            <button onClick={() => removeInternship(intern.id)} className="text-red-500"><Trash2 className="h-4.5 w-4.5" /></button>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <input
                              type="text"
                              value={intern.company}
                              onChange={e => updateInternship(intern.id, { company: e.target.value })}
                              placeholder="Company Name"
                              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs dark:border-gray-700 dark:bg-gray-850 dark:text-white"
                            />
                            <input
                              type="text"
                              value={intern.role}
                              onChange={e => updateInternship(intern.id, { role: e.target.value })}
                              placeholder="Role / Position"
                              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs dark:border-gray-700 dark:bg-gray-850 dark:text-white"
                            />
                            <input
                              type="text"
                              value={intern.duration}
                              onChange={e => updateInternship(intern.id, { duration: e.target.value })}
                              placeholder="Duration (e.g. 3 Months, Summer 2023)"
                              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs dark:border-gray-700 dark:bg-gray-850 dark:text-white sm:col-span-2"
                            />
                          </div>
                          <textarea
                            value={intern.description}
                            onChange={e => updateInternship(intern.id, { description: e.target.value })}
                            placeholder="Describe your responsibilities and contributions..."
                            rows={3}
                            className="w-full rounded-lg border border-gray-200 p-3 text-xs dark:border-gray-700 dark:bg-gray-850 dark:text-white leading-relaxed"
                          />
                        </div>
                      ))}
                      {resumeData.internships.length === 0 && (
                        <p className="text-center text-xs text-gray-400 py-6 border border-dashed rounded-xl">Click 'Add Internship' to add internship experience.</p>
                      )}
                    </div>
                  )}

                  {/* Achievements Step */}
                  {activeStep === 8 && (
                    <div className="space-y-4">
                      <button
                        onClick={() => addAchievement('')}
                        className="inline-flex h-8.5 items-center gap-1 rounded-lg bg-indigo-600 px-3 text-xs font-bold text-white hover:bg-indigo-700 transition-smooth"
                      >
                        <Plus className="h-4 w-4" /> Add Achievement
                      </button>

                      {resumeData.achievements.map((ach, idx) => (
                        <div key={idx} className="flex gap-3 items-center">
                          <input
                            type="text"
                            value={ach}
                            onChange={e => updateAchievement(idx, e.target.value)}
                            placeholder="e.g. Won 1st place in National Hackathon 2023"
                            className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-xs dark:border-gray-700 dark:bg-gray-850 dark:text-white"
                          />
                          <button onClick={() => removeAchievement(idx)} className="text-red-500 shrink-0"><Trash2 className="h-4.5 w-4.5" /></button>
                        </div>
                      ))}
                      {resumeData.achievements.length === 0 && (
                        <p className="text-center text-xs text-gray-400 py-6 border border-dashed rounded-xl">Click 'Add Achievement' to list awards, honours or notable accomplishments.</p>
                      )}
                    </div>
                  )}

                  {/* Interests Step */}
                  {activeStep === 10 && (
                    <div className="space-y-4">
                      <div className="flex gap-3">
                        <input
                          type="text"
                          id="new-interest-input"
                          placeholder="e.g. Open Source Development, Photography"
                          className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-xs dark:border-gray-700 dark:bg-gray-850 dark:text-white"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              const val = (e.target as HTMLInputElement).value.trim();
                              if (val) { addInterest(val); (e.target as HTMLInputElement).value = ''; }
                            }
                          }}
                        />
                        <button
                          onClick={() => {
                            const input = document.getElementById('new-interest-input') as HTMLInputElement;
                            const val = input?.value.trim();
                            if (val) { addInterest(val); input.value = ''; }
                          }}
                          className="inline-flex h-9 items-center gap-1 rounded-lg bg-indigo-600 px-3 text-xs font-bold text-white hover:bg-indigo-700"
                        >
                          <Plus className="h-4 w-4" /> Add
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {resumeData.interests.map((interest, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 text-xs font-semibold border border-indigo-200 dark:border-indigo-800"
                          >
                            {interest}
                            <button onClick={() => removeInterest(idx)} className="text-indigo-400 hover:text-red-500">×</button>
                          </span>
                        ))}
                      </div>
                      {resumeData.interests.length === 0 && (
                        <p className="text-center text-xs text-gray-400 py-6 border border-dashed rounded-xl">Type an interest and press Enter or click Add.</p>
                      )}
                    </div>
                  )}

                  {/* References Step */}
                  {activeStep === 11 && (
                    <div className="space-y-4">
                      <button
                        onClick={() => addReference({ name: '', company: '', role: '', phone: '', email: '' })}
                        className="inline-flex h-8.5 items-center gap-1 rounded-lg bg-indigo-600 px-3 text-xs font-bold text-white hover:bg-indigo-700 transition-smooth"
                      >
                        <Plus className="h-4 w-4" /> Add Reference
                      </button>

                      {resumeData.references.map((ref) => (
                        <div key={ref.id} className="p-4 border rounded-xl bg-gray-50/50 dark:border-gray-800 dark:bg-gray-900/50 space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold text-gray-400">Reference Details</span>
                            <button onClick={() => removeReference(ref.id)} className="text-red-500"><Trash2 className="h-4.5 w-4.5" /></button>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <input
                              type="text"
                              value={ref.name}
                              onChange={e => updateReference(ref.id, { name: e.target.value })}
                              placeholder="Full Name"
                              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs dark:border-gray-700 dark:bg-gray-850 dark:text-white"
                            />
                            <input
                              type="text"
                              value={ref.role}
                              onChange={e => updateReference(ref.id, { role: e.target.value })}
                              placeholder="Job Title / Role"
                              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs dark:border-gray-700 dark:bg-gray-850 dark:text-white"
                            />
                            <input
                              type="text"
                              value={ref.company}
                              onChange={e => updateReference(ref.id, { company: e.target.value })}
                              placeholder="Company / Organization"
                              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs dark:border-gray-700 dark:bg-gray-850 dark:text-white"
                            />
                            <input
                              type="tel"
                              value={ref.phone || ''}
                              onChange={e => updateReference(ref.id, { phone: e.target.value })}
                              placeholder="Phone Number"
                              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs dark:border-gray-700 dark:bg-gray-850 dark:text-white"
                            />
                            <input
                              type="email"
                              value={ref.email || ''}
                              onChange={e => updateReference(ref.id, { email: e.target.value })}
                              placeholder="Email Address"
                              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs dark:border-gray-700 dark:bg-gray-850 dark:text-white sm:col-span-2"
                            />
                          </div>
                        </div>
                      ))}
                      {resumeData.references.length === 0 && (
                        <p className="text-center text-xs text-gray-400 py-6 border border-dashed rounded-xl">Click 'Add Reference' to include professional references.</p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Form Navigation bottom row */}
              <div className="flex justify-between pt-6 border-t dark:border-gray-800">
                <button
                  disabled={activeStep === 0}
                  onClick={() => setActiveStep(activeStep - 1)}
                  className="inline-flex h-9.5 items-center gap-1 rounded-xl border border-gray-200 px-4 text-xs font-bold text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-850 disabled:opacity-50"
                >
                  <ArrowLeft className="h-4 w-4" /> Previous
                </button>
                <button
                  disabled={activeStep === steps.length - 1}
                  onClick={() => setActiveStep(activeStep + 1)}
                  className="inline-flex h-9.5 items-center gap-1 rounded-xl bg-indigo-600 px-4 text-xs font-bold text-white hover:bg-indigo-700"
                >
                  Next <ArrowRight className="h-4 w-4" />
                </button>
              </div>

            </div>
          )}

          {/* THEME CUSTOMIZER TAB */}
          {activeTab === 'theme' && (
            <div className="space-y-6">
              <div className="border-b pb-3 dark:border-gray-800">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Design & Typography System</h2>
                <p className="text-xs text-gray-400">Tailor the visual dimensions of the active templates.</p>
              </div>

              {/* Template selector drop selection */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-2">Active Layout Template</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {TEMPLATES_LIST.map((tpl) => (
                    <button
                      key={tpl.id}
                      onClick={() => setTemplateId(tpl.id)}
                      className={`p-2.5 text-left border rounded-xl text-[10px] font-semibold transition-smooth ${
                        templateId === tpl.id 
                          ? 'border-indigo-600 bg-indigo-50/50 text-indigo-600 dark:border-indigo-400 dark:bg-indigo-900/20 dark:text-indigo-400' 
                          : 'border-gray-200 text-gray-500 dark:border-gray-800 dark:text-gray-400'
                      }`}
                    >
                      {tpl.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Accent Color picker */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-2">Accent Color Palette</label>
                <div className="flex flex-wrap gap-2.5">
                  {['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#111827'].map((hex) => (
                    <button
                      key={hex}
                      onClick={() => updateThemeSettings({ accentColor: hex })}
                      className="h-7 w-7 rounded-full border shadow-sm flex items-center justify-center text-white"
                      style={{ backgroundColor: hex }}
                    >
                      {themeSettings.accentColor === hex && <Check className="h-3.5 w-3.5" />}
                    </button>
                  ))}
                  <input
                    type="color"
                    value={themeSettings.accentColor}
                    onChange={(e) => updateThemeSettings({ accentColor: e.target.value })}
                    className="h-7 w-7 border rounded cursor-pointer p-0 shrink-0"
                    title="Custom Accent Color"
                  />
                </div>
              </div>

              {/* Typography selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-1">Font Family</label>
                  <select
                    value={themeSettings.fontFamily}
                    onChange={e => updateThemeSettings({ fontFamily: e.target.value as any })}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-xs dark:border-gray-700 dark:bg-gray-850 dark:text-white"
                  >
                    <option value="Inter">Inter (Sans-Serif)</option>
                    <option value="Outfit">Outfit (Sleek Geometric)</option>
                    <option value="Poppins">Poppins (Warm Modern)</option>
                    <option value="Roboto">Roboto (Classic Sans)</option>
                    <option value="Playfair Display">Playfair Display (Luxury Serif)</option>
                    <option value="Merriweather">Merriweather (ATS Serif)</option>
                    <option value="Fira Code">Fira Code (Developer Mono)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-1">Heading Style</label>
                  <select
                    value={themeSettings.headingStyle}
                    onChange={e => updateThemeSettings({ headingStyle: e.target.value as any })}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-xs dark:border-gray-700 dark:bg-gray-850 dark:text-white"
                  >
                    <option value="default">Default Classic</option>
                    <option value="underline">Minimal Underline</option>
                    <option value="border-bottom">Full Border Bottom</option>
                    <option value="colored-bg">Tinted Background Accent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-1">Base Spacing / Margins</label>
                  <select
                    value={themeSettings.margins}
                    onChange={e => updateThemeSettings({ margins: e.target.value as any })}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-xs dark:border-gray-700 dark:bg-gray-850 dark:text-white"
                  >
                    <option value="sm">Tight (Single page priority)</option>
                    <option value="md">Balanced (Standard A4)</option>
                    <option value="lg">Spacious (Ample margins)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-1">Base Font Size</label>
                  <select
                    value={themeSettings.fontSize}
                    onChange={e => updateThemeSettings({ fontSize: e.target.value as any })}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-xs dark:border-gray-700 dark:bg-gray-850 dark:text-white"
                  >
                    <option value="sm">Small (Fits more text)</option>
                    <option value="md">Medium (Recruiter optimal)</option>
                    <option value="lg">Large (Highly scannable)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-1">Corner Borders (Radius)</label>
                  <select
                    value={themeSettings.borderRadius}
                    onChange={e => updateThemeSettings({ borderRadius: e.target.value as any })}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-xs dark:border-gray-700 dark:bg-gray-850 dark:text-white"
                  >
                    <option value="none">Flat Square</option>
                    <option value="sm">Soft Round (sm)</option>
                    <option value="md">Rounded (md)</option>
                    <option value="lg">Extra Rounded (xl)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-1">Print Dimension Target</label>
                  <select
                    value={themeSettings.pageSize}
                    onChange={e => updateThemeSettings({ pageSize: e.target.value as any })}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-xs dark:border-gray-700 dark:bg-gray-850 dark:text-white"
                  >
                    <option value="A4">A4 Standard (210mm x 297mm)</option>
                    <option value="Letter">US Letter (8.5" x 11")</option>
                  </select>
                </div>
              </div>

              {/* Toggles show/hides */}
              <div className="space-y-2 border-t pt-4 dark:border-gray-800 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Show Section Icons</span>
                  <input
                    type="checkbox"
                    checked={themeSettings.showSocialIcons}
                    onChange={e => updateThemeSettings({ showSocialIcons: e.target.checked })}
                    className="rounded border-gray-300 text-indigo-600"
                  />
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Show Profile Photo (Toggles Layout avatar)</span>
                  <input
                    type="checkbox"
                    checked={themeSettings.showPhoto}
                    onChange={e => updateThemeSettings({ showPhoto: e.target.checked })}
                    className="rounded border-gray-300 text-indigo-600"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ATS ANALYSIS PANEL TAB */}
          {activeTab === 'ats' && (
            <div className="space-y-6">
              <div className="border-b pb-3 dark:border-gray-800 flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">ATS Scorer Checklist</h2>
                  <p className="text-xs text-gray-400">Identifies structural and parsing errors inside your draft.</p>
                </div>
                <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/20 px-3 py-1 rounded-xl">
                  {atsAnalysis.score}
                </div>
              </div>

              {/* Match percentages */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span>ATS Keyword Match Rate</span>
                  <span>{atsAnalysis.keywordMatchPercent}%</span>
                </div>
                <div className="w-full bg-gray-150 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-600 h-full rounded-full transition-all duration-300" style={{ width: `${atsAnalysis.keywordMatchPercent}%` }} />
                </div>
              </div>

              {/* Suggestions items lists */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Parser Optimizations Checklist</h3>
                <div className="space-y-2">
                  {atsAnalysis.suggestions.map((s) => (
                    <div 
                      key={s.id}
                      className={`p-3 border rounded-xl flex gap-3 text-xs ${
                        s.type === 'warning' 
                          ? 'bg-amber-50/50 border-amber-200 text-amber-800 dark:bg-amber-950/20 dark:border-amber-900/30 dark:text-amber-300' 
                          : s.type === 'success'
                          ? 'bg-emerald-50/50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/20 dark:border-emerald-900/30 dark:text-emerald-300'
                          : 'bg-blue-50/50 border-blue-200 text-blue-800 dark:bg-blue-950/20 dark:border-blue-900/30 dark:text-blue-300'
                      }`}
                    >
                      {s.type === 'warning' ? <AlertCircle className="h-4.5 w-4.5 shrink-0" /> : <CheckCircle2 className="h-4.5 w-4.5 shrink-0" />}
                      <span><strong>[{s.category}]</strong> {s.message}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* AI ASSISTANT TAB */}
          {activeTab === 'ai' && (
            <div className="space-y-6">
              <div className="border-b pb-3 dark:border-gray-800">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">AI Writing Copilot</h2>
                <p className="text-xs text-gray-400">Generate cover letters, rewrite profiles, and prepare for interviews instantly.</p>
              </div>

              {/* Tool selections */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => runAIHelper('generate-cover-letter')}
                  className="py-2.5 px-3 border rounded-xl text-center text-xs font-semibold bg-gray-50 hover:bg-gray-100 dark:bg-gray-850 dark:border-gray-800 dark:hover:bg-gray-800 transition-smooth"
                >
                  ✉️ Cover Letter
                </button>
                <button
                  onClick={() => runAIHelper('generate-thank-you')}
                  className="py-2.5 px-3 border rounded-xl text-center text-xs font-semibold bg-gray-50 hover:bg-gray-100 dark:bg-gray-850 dark:border-gray-800 dark:hover:bg-gray-800 transition-smooth"
                >
                  ✉️ Thank You Email
                </button>
                <button
                  onClick={() => runAIHelper('generate-interview-intro')}
                  className="py-2.5 px-3 border rounded-xl text-center text-xs font-semibold bg-gray-50 hover:bg-gray-100 dark:bg-gray-850 dark:border-gray-800 dark:hover:bg-gray-800 transition-smooth"
                >
                  🗣️ Elevator Pitch
                </button>
                <button
                  onClick={() => runAIHelper('generate-experience')}
                  className="py-2.5 px-3 border rounded-xl text-center text-xs font-semibold bg-gray-50 hover:bg-gray-100 dark:bg-gray-850 dark:border-gray-800 dark:hover:bg-gray-800 transition-smooth"
                >
                  💼 Experience Bullets
                </button>
              </div>

              {/* Display Area */}
              {aiLoading ? (
                <div className="p-8 border border-dashed rounded-2xl flex flex-col items-center justify-center space-y-3">
                  <div className="h-8 w-8 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin" />
                  <p className="text-xs text-gray-500">AI Assistant compiles response templates...</p>
                </div>
              ) : aiResponse ? (
                <div className="p-5 border rounded-2xl bg-indigo-50/10 border-indigo-100 dark:border-indigo-900/30 space-y-4">
                  <div className="flex justify-between items-center border-b pb-2 dark:border-gray-800">
                    <span className="text-[10px] font-bold text-indigo-600 uppercase">AI Copilot Response</span>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(aiResponse);
                        alert('Copied AI text!');
                      }}
                      className="text-[10px] font-bold text-gray-500 hover:underline"
                    >
                      Copy Output
                    </button>
                  </div>
                  <pre className="text-xs text-gray-600 dark:text-gray-300 whitespace-pre-wrap leading-relaxed font-sans max-h-80 overflow-y-auto">
                    {aiResponse}
                  </pre>
                  
                  {(activeAiTool === 'generate-summary' || activeAiTool === 'improve-summary') && (
                    <button
                      onClick={() => handleApplyAISuggestion(activeAiTool)}
                      className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-xs font-bold text-white rounded-xl shadow transition-smooth"
                    >
                      Apply directly to Summary section
                    </button>
                  )}
                </div>
              ) : (
                <p className="text-center text-xs text-gray-400 py-8 border border-dashed rounded-xl">Click one of the helper items above to generate customized drafts.</p>
              )}
            </div>
          )}

        </div>
      </div>

      {/* 3. RIGHT PANEL: REAL-TIME LIVE PREVIEW */}
      <section id="resume-right-panel" className={`flex-1 flex flex-col bg-gray-200/50 dark:bg-gray-900/30 overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50 bg-gray-100 dark:bg-gray-950 p-6' : 'hidden md:flex'}`}>
        
        {/* Preview controls menu */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center no-print bg-white dark:bg-gray-900">
          <div className="flex gap-2">
            <button
              disabled={isExportingPDF}
              onClick={handleDownloadPDF}
              className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-3.5 text-xs font-bold text-white shadow-md shadow-blue-500/10 hover:from-blue-700 hover:to-indigo-700 transition-smooth disabled:opacity-60"
            >
              {isExportingPDF ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" /> Generating...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" /> PDF
                </>
              )}
            </button>
            <button
              disabled={isExportingDOCX}
              onClick={handleDownloadDOCX}
              className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-gray-200 px-3.5 text-xs font-bold text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 transition-smooth disabled:opacity-60"
            >
              {isExportingDOCX ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" /> DOCX...
                </>
              ) : (
                'Word DOC'
              )}
            </button>
            <button
              disabled={isPrinting}
              onClick={handlePrint}
              className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-gray-200 px-3.5 text-xs font-bold text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 transition-smooth disabled:opacity-60"
            >
              {isPrinting ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" /> Preparing...
                </>
              ) : (
                'Print Vector'
              )}
            </button>
            <button
              onClick={handleDownloadTXT}
              className="hidden lg:inline-flex h-9 items-center gap-1.5 rounded-xl border border-gray-200 px-3.5 text-xs font-bold text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 transition-smooth"
            >
              TXT
            </button>
            <button
              onClick={handleExportJSON}
              className="hidden lg:inline-flex h-9 items-center gap-1.5 rounded-xl border border-gray-200 px-3.5 text-xs font-bold text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 transition-smooth"
            >
              JSON
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-850"
              title="Toggle Fullscreen"
            >
              <Eye className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>

        {/* Scrollable Document Container */}
        <div id="resume-scroll-wrapper" className="flex-1 overflow-y-auto p-8 flex justify-center items-start">
          <div 
            id="resume-preview-container" 
            className="w-full max-w-[210mm] min-h-[297mm] bg-white border border-gray-200 shadow-xl rounded-xl overflow-hidden transition-colors"
          >
            <TemplateRenderer 
              templateId={templateId} 
              data={resumeData} 
              theme={themeSettings} 
            />
          </div>
        </div>
      </section>

    </div>
  );
};
