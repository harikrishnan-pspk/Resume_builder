import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResumeStore } from '../store/useResumeStore';
import { analyzeResume } from '../utils/atsScorer';
import {
  FileText, Plus, Upload, Trash2, Edit3, Copy, Calendar, Award,
  BarChart2, Type, Clock, CheckCircle2, ChevronRight, AlertTriangle
} from 'lucide-react';
import { motion } from 'framer-motion';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    savedResumes,
    resumeData,
    createNewResume,
    loadResume,
    deleteResume,
    saveCurrentResume,
    importResumeJSON
  } = useResumeStore();

  const handleCreateNew = () => {
    createNewResume();
    navigate('/builder');
  };

  const handleLoadResume = (id: string) => {
    loadResume(id);
    navigate('/builder');
  };

  const handleDuplicate = (id: string) => {
    const resume = savedResumes.find(r => r.id === id);
    if (resume) {
      // Temporarily load this resume, change its ID, then save
      loadResume(id);
      // We alter the ID in Zustand state directly
      useResumeStore.setState((state) => ({
        resumeData: {
          ...state.resumeData,
          id: `resume-${Date.now()}`,
          title: `${state.resumeData.title} (Copy)`,
          lastSaved: new Date().toISOString()
        }
      }));
      saveCurrentResume();
      // Reload current if there was a different one active before, but we can just stay on the duplicate
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        const success = importResumeJSON(text);
        if (success) {
          alert('Resume imported successfully!');
          navigate('/builder');
        } else {
          alert('Failed to import JSON. Invalid format.');
        }
      };
      reader.readAsText(file);
    }
  };

  // Analyze active resume for dashboard statistics
  const atsAnalysis = analyzeResume(resumeData);
  const wordCount = resumeData.summary.split(/\s+/).filter(Boolean).length +
    resumeData.experience.reduce((acc, job) => acc + job.responsibilities.split(/\s+/).filter(Boolean).length, 0);
  const readingTime = Math.max(1, Math.round(wordCount / 200)); // Average 200 WPM

  // Calculate completion percentage based on core sections
  const calculateCompletion = () => {
    let fields = 0;
    let filled = 0;

    const check = (val: any) => {
      fields++;
      if (val && (typeof val !== 'string' || val.trim().length > 0)) filled++;
    };

    check(resumeData.personalInfo.fullName);
    check(resumeData.personalInfo.professionalTitle);
    check(resumeData.personalInfo.email);
    check(resumeData.personalInfo.phone);
    check(resumeData.summary);

    fields++; if (resumeData.skills.length > 0) filled++;
    fields++; if (resumeData.experience.length > 0) filled++;
    fields++; if (resumeData.education.length > 0) filled++;
    fields++; if (resumeData.projects.length > 0) filled++;

    return Math.round((filled / fields) * 100);
  };

  const completionPercent = calculateCompletion();

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50/50 px-4 py-8 dark:bg-gray-900/40 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="mx-auto max-w-7xl space-y-8">

        {/* Header Title Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              Welcome Back
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Manage your resumes, track templates, and view live application strength.
            </p>
          </div>
          <div className="flex gap-3">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json"
              className="hidden"
            />
            <button
              onClick={handleImportClick}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 transition-smooth"
            >
              <Upload className="h-4.5 w-4.5" /> Import Backup
            </button>
            <button
              onClick={handleCreateNew}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-500/10 hover:from-blue-700 hover:to-indigo-700 transition-smooth"
            >
              <Plus className="h-4.5 w-4.5" /> Create New Resume
            </button>
          </div>
        </div>

        {/* Core Analytics Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {/* ATS Score */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">ATS Match Rating</span>
              <Award className="h-5.5 w-5.5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-gray-900 dark:text-white">{atsAnalysis.score}</span>
              <span className="text-sm font-semibold text-gray-500">/100</span>
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-md w-fit">
              Strength: {atsAnalysis.strength}
            </div>
          </div>

          {/* Word Count */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">Word Count</span>
              <Type className="h-5.5 w-5.5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-gray-900 dark:text-white">{wordCount}</span>
              <span className="text-sm font-medium text-gray-500">words</span>
            </div>
            <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
              Optimal range: 400 - 800 WPM
            </p>
          </div>

          {/* Reading Time */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">Reading Time</span>
              <Clock className="h-5.5 w-5.5 text-violet-600 dark:text-violet-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-gray-900 dark:text-white">{readingTime}</span>
              <span className="text-sm font-medium text-gray-500">min read</span>
            </div>
            <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
              Average recruiter scan time: 7 sec
            </p>
          </div>

          {/* Completion Status */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">Profile Completion</span>
              <CheckCircle2 className="h-5.5 w-5.5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-gray-900 dark:text-white">{completionPercent}%</span>
            </div>
            <div className="mt-3 w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-600 dark:bg-emerald-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${completionPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Resumes List Grid */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FileText className="h-5 w-5 text-gray-400" /> Saved Resumes
          </h2>

          {savedResumes.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white/50 p-12 text-center dark:border-gray-800 dark:bg-gray-900/20">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-400 border border-gray-200 dark:border-gray-800 mb-4">
                <FileText className="h-6 w-6" />
              </div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">No resumes created yet</h3>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 max-w-sm">
                Get started by creating your very first professional resume or loading our pre-configured software engineer template.
              </p>
              <div className="mt-6 flex gap-3">
                <button
                  onClick={handleCreateNew}
                  className="inline-flex h-9.5 items-center justify-center rounded-xl bg-indigo-600 px-4 text-xs font-bold text-white hover:bg-indigo-700 transition-smooth"
                >
                  Create From Scratch
                </button>
                <button
                  onClick={() => {
                    // Save default as current if list is empty
                    saveCurrentResume();
                    alert('Loaded demo resume data!');
                  }}
                  className="inline-flex h-9.5 items-center justify-center rounded-xl border border-gray-200 bg-white px-4 text-xs font-bold text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 transition-smooth"
                >
                  Load Demo Data
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {savedResumes.map((resume) => {
                const resAts = analyzeResume(resume.data);
                return (
                  <motion.div
                    key={resume.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
                  >
                    <div>
                      {/* Card Title Header */}
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <h3 className="font-bold text-gray-900 dark:text-white leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {resume.title}
                          </h3>
                          <p className="text-xs text-gray-400 mt-1 uppercase font-semibold tracking-wider">
                            Template: {resume.templateId.replace('-', ' ')}
                          </p>
                        </div>
                        <div className="flex h-9.5 w-9.5 items-center justify-center rounded-xl bg-blue-50 text-blue-600 font-extrabold text-sm dark:bg-blue-900/20 dark:text-blue-400">
                          {resAts.score}
                        </div>
                      </div>

                      {/* Timeline saved */}
                      <div className="mt-4 flex items-center gap-1 text-[11px] text-gray-400">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>Saved {new Date(resume.lastSaved).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-800">
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => handleLoadResume(resume.id)}
                          className="flex h-8.5 w-8.5 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-blue-600 hover:text-blue-600 dark:border-gray-800 dark:text-gray-400 dark:hover:border-blue-400 dark:hover:text-blue-400 transition-smooth"
                          title="Edit Resume"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDuplicate(resume.id)}
                          className="flex h-8.5 w-8.5 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-indigo-600 hover:text-indigo-600 dark:border-gray-800 dark:text-gray-400 dark:hover:border-indigo-400 dark:hover:text-indigo-400 transition-smooth"
                          title="Duplicate Resume"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteResume(resume.id)}
                          className="flex h-8.5 w-8.5 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-red-600 hover:text-red-600 dark:border-gray-800 dark:text-gray-400 dark:hover:border-red-400 dark:hover:text-red-400 transition-smooth"
                          title="Delete Resume"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <button
                        onClick={() => {
                          loadResume(resume.id);
                          navigate('/portfolio');
                        }}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        Portfolio <ChevronRight className="h-3 w-3" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* ATS Real-time Checklist & Tips */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <BarChart2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" /> Active Resume ATS Suggestions
          </h3>
          <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
            Analyzing current active draft: <strong>{resumeData.title}</strong>
          </p>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Issues to Resolve</h4>
              <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
                {atsAnalysis.suggestions.filter(s => s.type === 'warning').map((s) => (
                  <div key={s.id} className="flex gap-2.5 items-start p-2.5 rounded-lg bg-amber-50/50 border border-amber-200/50 text-xs text-amber-800 dark:bg-amber-950/20 dark:border-amber-900/30 dark:text-amber-300">
                    <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                    <span><strong>[{s.category}]</strong> {s.message}</span>
                  </div>
                ))}
                {atsAnalysis.suggestions.filter(s => s.type === 'warning').length === 0 && (
                  <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                    🎉 Excellent! No warnings found on your active resume.
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Strength Indicators</h4>
              <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
                {atsAnalysis.suggestions.filter(s => s.type === 'success').map((s) => (
                  <div key={s.id} className="flex gap-2.5 items-start p-2.5 rounded-lg bg-emerald-50/50 border border-emerald-200/50 text-xs text-emerald-800 dark:bg-emerald-950/20 dark:border-emerald-900/30 dark:text-emerald-300">
                    <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>{s.message}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
