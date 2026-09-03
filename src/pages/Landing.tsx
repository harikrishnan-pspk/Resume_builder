import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResumeStore } from '../store/useResumeStore';
import { 
  FileText, Sparkles, CheckCircle2, Award, Globe, Shield, Zap, 
  ArrowRight, Star, ChevronDown, Monitor, Share2, HelpCircle 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TEMPLATES_LIST } from '../templates/Templates';

export const Landing: React.FC = () => {
  const navigate = useNavigate();
  const { createNewResume } = useResumeStore();
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);
  const [selectedDemoTemplate, setSelectedDemoTemplate] = useState('modern-minimal');

  const handleStartBuilding = () => {
    createNewResume();
    navigate('/builder');
  };

  const toggleFAQ = (index: number) => {
    setActiveFAQ(activeFAQ === index ? null : index);
  };

  const faqs = [
    {
      q: 'Is this resume builder really free?',
      a: 'Yes! You can design, edit, structure, and print your resume to PDF or export it to MS Word and JSON completely for free. We do not lock basic layouts behind a paywall.'
    },
    {
      q: 'Are the templates ATS-friendly?',
      a: 'Absolutely. All our resume designs are built following rigid structural layouts (using table/block hierarchies) that match parsing heuristics used by modern ATS engines. We even provide a Harvard style template specifically designed for maximum parser compatibility.'
    },
    {
      q: 'How does the AI Assistant work?',
      a: 'Our AI Assistant offers two modes. Out-of-the-box, it uses a rule-based smart engine that produces optimized text templates for summaries and bullet points. Alternatively, you can enter your own OpenAI or Google Gemini API Key in the settings to unlock actual full-scale LLM generation directly in the client!'
    },
    {
      q: 'Is my data secure?',
      a: 'Yes, 100%. All your resume details, custom settings, and API keys are stored directly inside your browser\'s local storage. None of your sensitive data is sent to a backend database, keeping your personal details completely private.'
    },
    {
      q: 'Can I publish my resume as a website?',
      a: 'Yes! With our One-Click Portfolio Generator, you can turn your resume data into a beautiful, fully responsive, animated portfolio page. You can customize the look and even download the code as a self-contained ZIP bundle to host it on Netlify or GitHub Pages.'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Connor',
      role: 'Software Engineer at Netflix',
      text: 'Using the Google Style template with the real-time ATS Scorer helped me optimize my keywords and landing interviews. The auto-save saved me hours of re-typing!',
      rating: 5
    },
    {
      name: 'David Kim',
      role: 'Product Manager at Stripe',
      text: 'The one-click portfolio generator is insane. I downloaded the ZIP file, uploaded it to GitHub Pages, and had my personal portfolio live in under 5 minutes.',
      rating: 5
    },
    {
      name: 'Jessica Taylor',
      role: 'UX Designer',
      text: 'The typography, spacing controls, and color customizers are so granular compared to other editors. It feels like a premium design tool, not a rigid form builder.',
      rating: 5
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-900 transition-colors duration-300">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-20 pb-16 lg:pt-28 lg:pb-24">
        {/* Ambient Gradients */}
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div className="relative left-[calc(50%-11rem)] aspect-1155/678 w-[36rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-blue-600 to-indigo-500 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72rem]" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Hero Text Info */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 px-3.5 py-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400">
                <Sparkles className="h-3.5 w-3.5" /> Next-Gen Resume Architect
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl lg:text-6xl leading-none">
                Build a Resume That Lands the{' '}
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-violet-400">
                  Dream Job.
                </span>
              </h1>
              <p className="text-base text-gray-500 dark:text-gray-400 max-w-xl mx-auto lg:mx-0">
                Create ATS-friendly, premium resumes in minutes. Customize typography, spacing, and colors instantly. Turn your draft into a portfolio site with one click.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-3 pt-2">
                <button
                  onClick={handleStartBuilding}
                  className="inline-flex h-12.5 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 font-semibold text-white shadow-lg shadow-blue-500/20 hover:from-blue-700 hover:to-indigo-700 transition-smooth hover:scale-[1.02]"
                >
                  Build Your Resume For Free <ArrowRight className="h-4.5 w-4.5" />
                </button>
                <a
                  href="#templates"
                  className="inline-flex h-12.5 items-center justify-center rounded-xl border border-gray-200 bg-white px-6 font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 transition-smooth"
                >
                  Explore Templates
                </a>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap justify-center lg:justify-start items-center gap-6 pt-4 text-xs text-gray-400 dark:text-gray-500">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> ATS Scored</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Word / PDF Ready</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Offline Auto-Save</span>
              </div>
            </div>

            {/* Interactive Resume Visualizer Mockup */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="relative w-full max-w-lg p-1.5 bg-gray-200/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-3xl shadow-2xl backdrop-blur-md">
                
                {/* Visualizer window header */}
                <div className="flex items-center gap-1.5 px-4 py-2 border-b dark:border-gray-700 text-xs">
                  <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
                  <div className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
                  <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
                  <span className="text-[10px] text-gray-400 font-mono ml-4">https://cvbuilder.ai/editor</span>
                </div>

                {/* Animated Mockup Resume inside */}
                <div className="bg-white p-6 rounded-2xl min-h-[360px] text-[#2d3748] shadow-inner text-[10px] space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b-2 border-indigo-600">
                    <div>
                      <div className="w-24 h-4 bg-gray-200 rounded animate-pulse" />
                      <div className="w-16 h-2.5 bg-gray-150 rounded mt-1.5" />
                    </div>
                    <div className="w-20 h-2 bg-gray-150 rounded" />
                  </div>
                  
                  <div className="space-y-1.5">
                    <div className="w-24 h-3 bg-indigo-50 rounded" style={{ backgroundColor: '#e0e7ff' }} />
                    <div className="w-full h-10 bg-gray-50 rounded p-2 text-gray-400 italic">
                      "Highly analytical product development engineer specialized in full stack web products and microservices architectures..."
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2 space-y-3">
                      <div className="w-20 h-3 bg-indigo-50 rounded" style={{ backgroundColor: '#e0e7ff' }} />
                      <div className="space-y-1">
                        <div className="w-full h-2 bg-gray-100 rounded" />
                        <div className="w-[90%] h-2 bg-gray-100 rounded" />
                        <div className="w-[85%] h-2 bg-gray-100 rounded" />
                      </div>
                    </div>
                    <div className="col-span-1 space-y-3">
                      <div className="w-12 h-3 bg-indigo-50 rounded" style={{ backgroundColor: '#e0e7ff' }} />
                      <div className="flex flex-wrap gap-1">
                        <span className="px-1.5 py-0.5 bg-gray-100 rounded text-[8px] font-semibold text-gray-500">React</span>
                        <span className="px-1.5 py-0.5 bg-gray-100 rounded text-[8px] font-semibold text-gray-500">TypeScript</span>
                        <span className="px-1.5 py-0.5 bg-gray-100 rounded text-[8px] font-semibold text-gray-500">Node</span>
                        <span className="px-1.5 py-0.5 bg-gray-100 rounded text-[8px] font-semibold text-gray-500">SQL</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Overlapping Floating HUD card */}
                <div className="absolute -bottom-6 -left-6 rounded-2xl bg-white/90 p-4 shadow-xl border border-gray-150 dark:bg-gray-800/90 dark:border-gray-700 max-w-[160px] backdrop-blur-md">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600">
                      <Award className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-[10px] text-gray-400 font-semibold uppercase">ATS Score</div>
                      <div className="text-sm font-extrabold text-gray-900 dark:text-white">92 / 100</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. CORE FEATURES GRID */}
      <section className="py-20 bg-gray-50/50 dark:bg-gray-950/20 border-y border-gray-100 dark:border-gray-800 transition-colors">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Packed with Premium Features
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
              Everything you need to craft, optimize, review, and host your resume for free.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {/* Live Sync Preview */}
            <div className="p-6 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm space-y-4 transition-smooth hover:shadow-md">
              <div className="h-10 w-10 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400">
                <Monitor className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">Live Split-Screen Preview</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Watch your resume adapt instantly as you type. Switch templates, spacing, fonts, and colors on the fly.
              </p>
            </div>

            {/* ATS Score Checker */}
            <div className="p-6 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm space-y-4 transition-smooth hover:shadow-md">
              <div className="h-10 w-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Award className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">Built-in ATS Scorer</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Analyze formatting errors, summary strengths, bullet density, and role-specific keywords immediately.
              </p>
            </div>

            {/* One-Click Portfolio */}
            <div className="p-6 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm space-y-4 transition-smooth hover:shadow-md">
              <div className="h-10 w-10 bg-violet-50 dark:bg-violet-900/30 rounded-xl flex items-center justify-center text-violet-600 dark:text-violet-400">
                <Share2 className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">One-Click Portfolio Generator</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Convert your details into a responsive web portfolio instantly. Download the code or host it anywhere.
              </p>
            </div>

            {/* AI Assistant */}
            <div className="p-6 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm space-y-4 transition-smooth hover:shadow-md">
              <div className="h-10 w-10 bg-amber-50 dark:bg-amber-900/30 rounded-xl flex items-center justify-center text-amber-600 dark:text-amber-400">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">AI Writing Assistant</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Rewrite weak bullet points, auto-generate cover letters, and generate elevator pitches for interview setups.
              </p>
            </div>

            {/* Security */}
            <div className="p-6 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm space-y-4 transition-smooth hover:shadow-md">
              <div className="h-10 w-10 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Shield className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">Strict Data Privacy</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Zero cloud database storing. All your data stays client-side, protected inside your browser storage.
              </p>
            </div>

            {/* Fast Exporters */}
            <div className="p-6 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm space-y-4 transition-smooth hover:shadow-md">
              <div className="h-10 w-10 bg-rose-50 dark:bg-rose-900/30 rounded-xl flex items-center justify-center text-rose-600 dark:text-rose-400">
                <Zap className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">Instant Export Utilities</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Download structured PDFs, vector-perfect printable sheets, MS Word documents, and JSON schema configs instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. RESUME TEMPLATES SECTION */}
      <section className="py-20" id="templates">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Pick from 12 Premium Layouts
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
              Click on any design to load the editor and immediately begin styling your credentials.
            </p>
          </div>

          {/* Interactive template selector preview catalog */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEMPLATES_LIST.slice(0, 8).map((tpl) => (
              <div 
                key={tpl.id}
                onClick={handleStartBuilding}
                className="group cursor-pointer overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-lg dark:border-gray-800 dark:bg-gray-900 transition-smooth"
              >
                {/* Visual template thumbnail mockup */}
                <div className="h-44 bg-gray-50 dark:bg-gray-850 p-4 border-b border-gray-150 dark:border-gray-800 relative flex items-center justify-center overflow-hidden">
                  <div className="w-[120px] h-[170px] bg-white dark:bg-gray-900 rounded shadow-md border dark:border-gray-800 group-hover:scale-105 transition-smooth p-2.5 space-y-2">
                    <div className="h-2 w-10 bg-gray-200 rounded" />
                    <div className="h-1.5 w-full bg-gray-100 rounded" />
                    <div className="h-1.5 w-[90%] bg-gray-100 rounded" />
                    <div className="h-0.5 w-full bg-gray-200" />
                    <div className="h-1.5 w-12 bg-gray-200 rounded" />
                    <div className="h-1.5 w-full bg-gray-100 rounded" />
                  </div>
                  <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity font-bold text-xs">
                    <span className="bg-blue-600 px-3 py-1.5 rounded-lg shadow-md flex items-center gap-1">Use Template <ArrowRight size={10} /></span>
                  </div>
                </div>
                
                {/* Template metadata */}
                <div className="p-4 space-y-1">
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
                    {tpl.name}
                  </h4>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">
                    {tpl.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. CLIENT TESTIMONIALS */}
      <section className="py-20 bg-gray-50/50 dark:bg-gray-950/20 border-t border-gray-100 dark:border-gray-800 transition-colors">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              Hear From Happy Job Seekers
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
              Our builder helps software engineers, product managers, and UI/UX designers land jobs at top tier tech firms.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <div key={idx} className="p-6 rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 shadow-sm flex flex-col justify-between">
                <p className="text-xs italic text-gray-600 dark:text-gray-300 leading-relaxed">
                  "{t.text}"
                </p>
                <div className="mt-6 border-t pt-4 dark:border-gray-800 flex justify-between items-center">
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 dark:text-white">{t.name}</h4>
                    <p className="text-[10px] text-gray-400">{t.role}</p>
                  </div>
                  <div className="flex text-amber-400">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-amber-400" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. FAQs ACCORDION */}
      <section className="py-20" id="faq">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-12">
            <HelpCircle className="h-8 w-8 mx-auto text-blue-600" />
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div 
                key={idx}
                className="overflow-hidden border border-gray-200 dark:border-gray-800 rounded-2xl bg-white dark:bg-gray-900"
              >
                <button
                  onClick={() => toggleFAQ(idx)}
                  className="flex w-full items-center justify-between p-5 text-left text-sm font-bold text-gray-900 dark:text-white"
                >
                  <span>{faq.q}</span>
                  <ChevronDown 
                    className={`h-4.5 w-4.5 text-gray-400 transition-transform duration-300 ${activeFAQ === idx ? 'rotate-180' : ''}`} 
                  />
                </button>
                <AnimatePresence initial={false}>
                  {activeFAQ === idx && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="border-t border-gray-150 dark:border-gray-800"
                    >
                      <p className="p-5 text-xs text-gray-500 dark:text-gray-400 leading-relaxed text-justify">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION SECTION */}
      <section className="py-20 border-t border-gray-150 dark:border-gray-800 relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white overflow-hidden">
        {/* Decorative backdrop shapes */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent pointer-events-none" />

        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-3xl font-extrabold sm:text-4xl tracking-tight leading-tight">
            Ready to Stand Out in Your Next Application?
          </h2>
          <p className="text-sm opacity-90 max-w-md mx-auto leading-relaxed">
            Create an ATS-friendly, professional resume in under 10 minutes. Zero credit card or registration required.
          </p>
          <div className="pt-2">
            <button
              onClick={handleStartBuilding}
              className="inline-flex h-12 px-8 items-center justify-center rounded-xl bg-white text-indigo-600 font-bold hover:bg-gray-100 transition-smooth shadow-lg shadow-black/10 hover:scale-[1.02]"
            >
              Build Your Resume For Free
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
