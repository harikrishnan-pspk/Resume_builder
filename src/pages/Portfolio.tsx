import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResumeStore } from '../store/useResumeStore';
import { 
  ArrowLeft, Download, Code, Globe, Mail, Phone, MapPin, 
  Settings, Check 
} from 'lucide-react';
import { motion } from 'framer-motion';

// Presets for the generated portfolio website styling
const THEMES = [
  { id: 'modern-teal', name: 'Teal Elegance', primary: '#0f766e', bg: 'bg-slate-50', text: 'text-slate-800', navBg: 'bg-white/80', button: 'bg-teal-700 hover:bg-teal-800 text-white' },
  { id: 'slate-glass', name: 'Sleek Dark Glass', primary: '#6366f1', bg: 'bg-gray-950', text: 'text-gray-100', navBg: 'bg-gray-900/80', button: 'bg-indigo-600 hover:bg-indigo-700 text-white' },
  { id: 'cyberpunk', name: 'Neon Cyber', primary: '#f43f5e', bg: 'bg-zinc-950', text: 'text-zinc-200', navBg: 'bg-zinc-900/80', button: 'bg-rose-500 hover:bg-rose-600 text-white' },
  { id: 'warm-minimal', name: 'Minimalist Sand', primary: '#b45309', bg: 'bg-[#fafaf9]', text: 'text-stone-800', navBg: 'bg-stone-50/80', button: 'bg-amber-800 hover:bg-amber-900 text-white' }
];

export const Portfolio: React.FC = () => {
  const navigate = useNavigate();
  const { resumeData } = useResumeStore();
  const [activeTheme, setActiveTheme] = useState(THEMES[0]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMsg, setContactMsg] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  // Expose the static self-contained HTML code representing their standalone portfolio website
  const generateStaticHTML = () => {
    const isDark = activeTheme.id === 'slate-glass' || activeTheme.id === 'cyberpunk';
    const primaryColor = activeTheme.primary;
    const bodyBg = isDark ? '#090d16' : '#f8fafc';
    const textBase = isDark ? '#f3f4f6' : '#1f2937';

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${resumeData.personalInfo.fullName} | Portfolio</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    :root {
      --primary: ${primaryColor};
    }
    body {
      background-color: ${bodyBg};
      color: ${textBase};
      font-family: system-ui, -apple-system, sans-serif;
    }
    .text-primary { color: var(--primary); }
    .bg-primary { background-color: var(--primary); }
    .border-primary { border-color: var(--primary); }
  </style>
</head>
<body class="transition-colors duration-300">
  <!-- Nav -->
  <nav class="sticky top-0 z-50 backdrop-blur-md border-b ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-slate-200'} py-4 px-6 md:px-12 flex justify-between items-center">
    <span class="font-extrabold text-lg tracking-tight text-primary">${resumeData.personalInfo.fullName}</span>
    <div class="space-x-6 text-sm font-semibold">
      <a href="#about" class="hover:text-primary">About</a>
      <a href="#skills" class="hover:text-primary">Skills</a>
      <a href="#experience" class="hover:text-primary">Experience</a>
      <a href="#projects" class="hover:text-primary">Projects</a>
      <a href="#contact" class="px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90">Contact</a>
    </div>
  </nav>

  <!-- Hero -->
  <header class="py-24 px-6 md:px-12 max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
    <div class="space-y-6 max-w-2xl text-center md:text-left">
      <h1 class="text-4xl md:text-6xl font-extrabold tracking-tight">Hi, I'm <span class="text-primary">${resumeData.personalInfo.fullName}</span></h1>
      <p class="text-lg md:text-xl font-medium text-slate-500">${resumeData.personalInfo.professionalTitle}</p>
      <p class="${isDark ? 'text-slate-400' : 'text-slate-600'} leading-relaxed">${resumeData.summary}</p>
      
      <div class="flex flex-wrap justify-center md:justify-start gap-4 text-sm font-semibold pt-4">
        ${resumeData.personalInfo.email ? `<span class="flex items-center gap-2">📧 ${resumeData.personalInfo.email}</span>` : ''}
        ${resumeData.personalInfo.phone ? `<span class="flex items-center gap-2">📱 ${resumeData.personalInfo.phone}</span>` : ''}
        ${resumeData.personalInfo.address ? `<span class="flex items-center gap-2">📍 ${resumeData.personalInfo.address}</span>` : ''}
      </div>
    </div>
  </header>

  <!-- Skills -->
  <section id="skills" class="py-20 px-6 md:px-12 max-w-5xl mx-auto border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}">
    <h2 class="text-2xl md:text-3xl font-extrabold mb-8 tracking-tight">My Skills</h2>
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      ${resumeData.skills.map(s => `
        <div class="p-4 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}">
          <div class="font-bold text-sm">${s.name}</div>
          <div class="text-xs text-primary mt-1">${'★'.repeat(s.rating)}${'☆'.repeat(5 - s.rating)}</div>
        </div>
      `).join('')}
    </div>
  </section>

  <!-- Experience -->
  <section id="experience" class="py-20 px-6 md:px-12 max-w-5xl mx-auto border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}">
    <h2 class="text-2xl md:text-3xl font-extrabold mb-8 tracking-tight">Experience</h2>
    <div class="space-y-8">
      ${resumeData.experience.map(exp => `
        <div class="relative pl-6 border-l-2 border-primary">
          <span class="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-primary"></span>
          <div class="flex justify-between items-baseline font-bold text-sm">
            <span>${exp.role} <span class="font-normal opacity-70">at</span> ${exp.company}</span>
            <span class="text-xs font-semibold opacity-70">${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}</span>
          </div>
          <p class="text-xs text-slate-500 mt-0.5">${exp.location || ''}</p>
          <ul class="list-disc pl-5 mt-3 space-y-1 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}">
            ${exp.responsibilities.split('\n').map(line => `<li>${line.replace(/^•\s*/, '')}</li>`).join('')}
          </ul>
        </div>
      `).join('')}
    </div>
  </section>

  <!-- Projects -->
  <section id="projects" class="py-20 px-6 md:px-12 max-w-5xl mx-auto border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}">
    <h2 class="text-2xl md:text-3xl font-extrabold mb-8 tracking-tight">Featured Projects</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      ${resumeData.projects.map(p => `
        <div class="p-6 rounded-2xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} hover:shadow-lg transition">
          <h3 class="font-bold text-lg">${p.name}</h3>
          <p class="text-sm opacity-80 mt-2 mb-4">${p.description}</p>
          <div class="flex flex-wrap gap-1.5 mb-4">
            ${p.technologies.map(t => `<span class="px-2 py-0.5 bg-slate-100 dark:bg-slate-850 rounded text-xs font-semibold">${t}</span>`).join('')}
          </div>
          <div class="flex gap-4 text-xs font-semibold text-primary">
            ${p.githubLink ? `<a href="${p.githubLink}" target="_blank">View Code</a>` : ''}
            ${p.liveLink ? `<a href="${p.liveLink}" target="_blank">Live Demo</a>` : ''}
          </div>
        </div>
      `).join('')}
    </div>
  </section>

  <!-- Contact -->
  <section id="contact" class="py-20 px-6 md:px-12 max-w-5xl mx-auto border-t ${isDark ? 'border-slate-800' : 'border-slate-200'} text-center space-y-6">
    <h2 class="text-2xl md:text-3xl font-extrabold tracking-tight">Let's Connect</h2>
    <p class="text-sm text-slate-500 max-w-md mx-auto">Feel free to reach out if you're looking for a developer, have a question, or just want to say hi.</p>
    <div class="flex justify-center gap-6 pt-4 text-lg">
      ${resumeData.personalInfo.email ? `<a href="mailto:${resumeData.personalInfo.email}" class="hover:text-primary">📧 Email</a>` : ''}
      ${resumeData.personalInfo.linkedin ? `<a href="https://${resumeData.personalInfo.linkedin}" target="_blank" class="hover:text-primary">🌐 LinkedIn</a>` : ''}
    </div>
  </section>
</body>
</html>`;
  };

  const handleCopyCode = () => {
    const code = generateStaticHTML();
    navigator.clipboard.writeText(code);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownloadCode = () => {
    const code = generateStaticHTML();
    const blob = new Blob([code], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'index.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    alert('Downloaded portfolio static HTML site!');
  };

  const isDarkModePreset = activeTheme.id === 'slate-glass' || activeTheme.id === 'cyberpunk';

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-gray-100 dark:bg-gray-950 transition-colors duration-300">
      
      {/* 1. PORTFOLIO CONFIGURATION SIDEBAR */}
      {sidebarOpen && (
        <aside className="w-80 border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 p-6 flex flex-col justify-between shrink-0 no-print transition-colors">
          <div className="space-y-6">
            <button
              onClick={() => navigate('/dashboard')}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-gray-950 dark:hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Dashboard
            </button>

            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                <Settings className="h-5 w-5 text-indigo-600" /> Portfolio Manager
              </h3>
              <p className="text-[11px] text-gray-400 mt-1">
                Render a responsive landing page using your resume details.
              </p>
            </div>

            {/* Themes Customization List */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Design Theme</h4>
              <div className="space-y-2">
                {THEMES.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => setActiveTheme(theme)}
                    className={`w-full py-2.5 px-3.5 rounded-xl border text-left font-semibold text-xs flex justify-between items-center transition-smooth ${
                      activeTheme.id === theme.id 
                        ? 'border-indigo-600 bg-indigo-50/50 text-indigo-600 dark:border-indigo-400 dark:bg-indigo-900/20 dark:text-indigo-400' 
                        : 'border-gray-200 text-gray-500 dark:border-gray-800 dark:text-gray-400'
                    }`}
                  >
                    <span>{theme.name}</span>
                    <span className="h-4.5 w-4.5 rounded-full border shadow-sm" style={{ backgroundColor: theme.primary }} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Code Exporter */}
          <div className="border-t border-gray-150 pt-5 dark:border-gray-800 space-y-2">
            <button
              onClick={handleCopyCode}
              className="w-full flex h-10 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white text-xs font-bold text-gray-700 hover:bg-gray-50 dark:border-gray-850 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 transition-smooth"
            >
              {isCopied ? <><Check className="h-4 w-4 text-emerald-500" /> Copied!</> : <><Code className="h-4 w-4" /> Copy Static Code</>}
            </button>
            <button
              onClick={handleDownloadCode}
              className="w-full flex h-10 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-xs font-bold text-white shadow-md shadow-blue-500/10 hover:from-blue-700 hover:to-indigo-700 transition-smooth"
            >
              <Download className="h-4 w-4" /> Download HTML Index
            </button>
          </div>
        </aside>
      )}

      {/* 2. MAIN WORKSPACE / LIVE WEBSITE RENDERER */}
      <main className="flex-1 flex flex-col overflow-y-auto max-h-[calc(100vh-4rem)]">
        
        {/* Toggle Sidebar Button */}
        <div className="p-4 bg-gray-100 border-b dark:bg-gray-950 dark:border-gray-900 flex justify-between items-center no-print">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white"
          >
            <Settings className="h-4 w-4" /> {sidebarOpen ? 'Hide Editor Panel' : 'Show Theme Editor'}
          </button>
          <span className="text-[10px] font-mono text-gray-400">Live Interactive Web Portfolio (Preview Mode)</span>
        </div>

        {/* Dynamic Website Shell Container */}
        <div className={`flex-1 ${activeTheme.bg} ${activeTheme.text} transition-colors duration-300`}>
          
          {/* Custom Web Nav */}
          <nav className={`sticky top-0 z-20 ${activeTheme.navBg} border-b ${isDarkModePreset ? 'border-gray-850' : 'border-gray-200'} px-6 py-4 flex justify-between items-center backdrop-blur-md`}>
            <span className="font-extrabold text-sm tracking-tight" style={{ color: activeTheme.primary }}>{resumeData.personalInfo.fullName || 'Candidate Name'}</span>
            <div className="hidden sm:flex space-x-6 text-[11px] font-bold">
              <a href="#about-web" className="hover:opacity-85">About</a>
              <a href="#skills-web" className="hover:opacity-85">Skills</a>
              <a href="#experience-web" className="hover:opacity-85">Experience</a>
              <a href="#projects-web" className="hover:opacity-85 font-semibold text-white px-3 py-1.5 rounded bg-blue-600" style={{ backgroundColor: activeTheme.primary }}>Contact</a>
            </div>
          </nav>

          {/* Hero Area */}
          <header id="about-web" className="max-w-4xl mx-auto px-6 py-20 text-center sm:text-left space-y-6">
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight">
              Hi, I'm <span style={{ color: activeTheme.primary }}>{resumeData.personalInfo.fullName || 'Candidate Name'}</span>
            </h1>
            <p className="text-base font-bold text-gray-500 dark:text-gray-400 tracking-wide uppercase">
              {resumeData.personalInfo.professionalTitle || 'Software Architect'}
            </p>
            <p className="text-xs leading-relaxed max-w-2xl text-justify opacity-80">
              {resumeData.summary || 'Summary profile bio descriptions will render here once written inside the builder.'}
            </p>

            <div className="flex flex-wrap gap-4 text-xs font-semibold pt-4 justify-center sm:justify-start opacity-90">
              {resumeData.personalInfo.email && <span className="flex items-center gap-1.5"><Mail size={12} /> {resumeData.personalInfo.email}</span>}
              {resumeData.personalInfo.phone && <span className="flex items-center gap-1.5"><Phone size={12} /> {resumeData.personalInfo.phone}</span>}
              {resumeData.personalInfo.address && <span className="flex items-center gap-1.5"><MapPin size={12} /> {resumeData.personalInfo.address}</span>}
            </div>
          </header>

          {/* Skills Grid */}
          {resumeData.skills.length > 0 && (
            <section id="skills-web" className={`max-w-4xl mx-auto px-6 py-16 border-t ${isDarkModePreset ? 'border-gray-900' : 'border-gray-100'}`}>
              <h2 className="text-2xl font-extrabold tracking-tight mb-8">Capabilities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {resumeData.skills.map((skill) => (
                  <div key={skill.id} className={`p-4 rounded-xl border shadow-sm ${isDarkModePreset ? 'bg-gray-900/50 border-gray-800' : 'bg-white border-gray-200'}`}>
                    <span className="text-xs font-bold text-gray-800 dark:text-gray-100">{skill.name}</span>
                    <div className="flex mt-1 text-[10px]" style={{ color: activeTheme.primary }}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i}>{i < skill.rating ? '★' : '☆'}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Experience Timeline */}
          {resumeData.experience.length > 0 && (
            <section id="experience-web" className={`max-w-4xl mx-auto px-6 py-16 border-t ${isDarkModePreset ? 'border-gray-900' : 'border-gray-100'}`}>
              <h2 className="text-2xl font-extrabold tracking-tight mb-8">Professional Milestones</h2>
              <div className="space-y-8">
                {resumeData.experience.map((exp) => (
                  <div key={exp.id} className="relative pl-6 border-l-2" style={{ borderLeftColor: activeTheme.primary }}>
                    <span className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full" style={{ backgroundColor: activeTheme.primary }} />
                    <div className="flex justify-between items-baseline font-bold text-xs">
                      <span className="text-gray-900 dark:text-white">{exp.role} <span className="opacity-75 font-normal">at</span> {exp.company}</span>
                      <span className="text-[10px] opacity-75">{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                    </div>
                    <ul className="list-disc pl-5 mt-3 space-y-1 text-xs text-gray-500 dark:text-gray-400">
                      {exp.responsibilities.split('\n').map((line, idx) => line.trim() && (
                        <li key={idx}>{line.replace(/^•\s*/, '')}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects Showcases */}
          {resumeData.projects.length > 0 && (
            <section id="projects-web" className={`max-w-4xl mx-auto px-6 py-16 border-t ${isDarkModePreset ? 'border-gray-900' : 'border-gray-100'}`}>
              <h2 className="text-2xl font-extrabold tracking-tight mb-8">Open Source & Live Builds</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {resumeData.projects.map((p) => (
                  <div 
                    key={p.id} 
                    className={`p-6 rounded-2xl border shadow-sm flex flex-col justify-between ${
                      isDarkModePreset ? 'bg-gray-900/50 border-gray-800' : 'bg-white border-gray-200'
                    }`}
                  >
                    <div>
                      <h3 className="font-bold text-sm text-gray-950 dark:text-white">{p.name}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 mb-4 text-justify leading-relaxed">
                        {p.description}
                      </p>
                    </div>
                    <div>
                      <div className="flex flex-wrap gap-1 mb-4">
                        {p.technologies.map((t, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-[10px] font-semibold text-gray-600 dark:text-gray-400">{t}</span>
                        ))}
                      </div>
                      <div className="flex gap-4 text-xs font-semibold" style={{ color: activeTheme.primary }}>
                        {p.githubLink && <a href={`https://${p.githubLink}`} target="_blank" rel="noreferrer" className="flex items-center gap-1"><svg className="h-3 w-3 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.82 1.102.82 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg> Github</a>}
                        {p.liveLink && <a href={`https://${p.liveLink}`} target="_blank" rel="noreferrer" className="flex items-center gap-1"><Globe size={12} /> Live Link</a>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Contact Section Mock */}
          <section className={`max-w-4xl mx-auto px-6 py-16 border-t ${isDarkModePreset ? 'border-gray-900' : 'border-gray-100'} pb-24 text-center space-y-6`}>
            <h2 className="text-2xl font-extrabold tracking-tight">Let's Connect</h2>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              If you have an opportunity or want to collaborate on a design project, leave a message below.
            </p>
            
            <form onSubmit={(e) => { e.preventDefault(); alert('Message sent!'); }} className="max-w-md mx-auto space-y-3 text-left">
              <input 
                type="text" 
                placeholder="Full Name" 
                value={contactName}
                onChange={e => setContactName(e.target.value)}
                className={`w-full p-2.5 rounded-xl border text-xs outline-none focus:border-indigo-500 ${isDarkModePreset ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`} 
              />
              <input 
                type="email" 
                placeholder="Email Address" 
                value={contactEmail}
                onChange={e => setContactEmail(e.target.value)}
                className={`w-full p-2.5 rounded-xl border text-xs outline-none focus:border-indigo-500 ${isDarkModePreset ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`} 
              />
              <textarea 
                placeholder="Your Message" 
                rows={4}
                value={contactMsg}
                onChange={e => setContactMsg(e.target.value)}
                className={`w-full p-2.5 rounded-xl border text-xs outline-none focus:border-indigo-500 ${isDarkModePreset ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`} 
              />
              <button 
                type="submit" 
                className={`w-full py-2.5 rounded-xl text-xs font-bold shadow-md transition-smooth ${activeTheme.button}`}
              >
                Send Message
              </button>
            </form>
          </section>

          {/* Web Footer */}
          <footer className={`py-8 text-center text-[10px] border-t opacity-70 ${isDarkModePreset ? 'border-gray-900' : 'border-gray-100'}`}>
            <p>© 2026 {resumeData.personalInfo.fullName}. Crafted automatically via CVBuilder.AI.</p>
          </footer>

        </div>
      </main>

    </div>
  );
};
