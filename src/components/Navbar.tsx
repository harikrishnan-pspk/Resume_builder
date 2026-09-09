import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useResumeStore } from '../store/useResumeStore';
import { Sun, Moon, Cpu, FileText, Check, Settings, X } from 'lucide-react';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { isDarkMode, toggleDarkMode, apiKey, apiProvider, setApiKey } = useResumeStore();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [localKey, setLocalKey] = useState(apiKey);
  const [localProvider, setLocalProvider] = useState<'openai' | 'gemini'>(apiProvider);
  const [savedStatus, setSavedStatus] = useState(false);

  const handleSaveAPIKey = (e: React.FormEvent) => {
    e.preventDefault();
    setApiKey(localKey, localProvider);
    setSavedStatus(true);
    setTimeout(() => {
      setSavedStatus(false);
      setIsSettingsOpen(false);
    }, 1200);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md transition-colors duration-300 no-print">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-md shadow-blue-500/20">
            <FileText className="h-5.5 w-5.5 text-white" />
          </div>
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-xl font-extrabold tracking-tight text-transparent dark:from-blue-400 dark:to-indigo-400">
            CVBuilder.AI
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-600 dark:text-gray-300">
          <Link 
            to="/" 
            className={`transition-colors duration-200 hover:text-blue-600 dark:hover:text-blue-400 ${isActive('/') ? 'text-blue-600 dark:text-blue-400' : ''}`}
          >
            Home
          </Link>
          <Link 
            to="/dashboard" 
            className={`transition-colors duration-200 hover:text-blue-600 dark:hover:text-blue-400 ${isActive('/dashboard') ? 'text-blue-600 dark:text-blue-400' : ''}`}
          >
            Dashboard
          </Link>
          <Link 
            to="/builder" 
            className={`transition-colors duration-200 hover:text-blue-600 dark:hover:text-blue-400 ${isActive('/builder') ? 'text-blue-600 dark:text-blue-400' : ''}`}
          >
            Resume Builder
          </Link>
        </nav>

        {/* Quick Actions */}
        <div className="flex items-center gap-3">
          {/* Settings API button */}
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
            title="AI Configuration"
          >
            <Settings className="h-5 w-5" />
          </button>

          {/* Theme Switcher */}
          <button
            onClick={toggleDarkMode}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
          >
            {isDarkMode ? <Sun className="h-5 w-5 text-amber-500" /> : <Moon className="h-5 w-5 text-indigo-600" />}
          </button>

          <Link
            to="/builder"
            className="hidden sm:inline-flex h-10 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 text-sm font-semibold text-white shadow-md shadow-blue-500/10 hover:from-blue-700 hover:to-indigo-700 transition-smooth"
          >
            Build Your Resume
          </Link>
        </div>
      </div>

      {/* AI API Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-800 border border-gray-200 dark:border-gray-700 transition-smooth">
            <div className="flex items-center justify-between border-b pb-3 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Cpu className="h-5 w-5 text-indigo-600 dark:text-indigo-400" /> AI API Settings
              </h3>
              <button 
                onClick={() => setIsSettingsOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAPIKey} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">
                  Select Provider
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setLocalProvider('openai')}
                    className={`py-2 px-3 text-sm font-semibold border rounded-xl text-center transition-smooth ${
                      localProvider === 'openai' 
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-600 dark:border-indigo-400 dark:bg-indigo-900/30 dark:text-indigo-400' 
                        : 'border-gray-200 text-gray-500 dark:border-gray-700 dark:text-gray-400'
                    }`}
                  >
                    OpenAI (GPT-4o)
                  </button>
                  <button
                    type="button"
                    onClick={() => setLocalProvider('gemini')}
                    className={`py-2 px-3 text-sm font-semibold border rounded-xl text-center transition-smooth ${
                      localProvider === 'gemini' 
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-600 dark:border-indigo-400 dark:bg-indigo-900/30 dark:text-indigo-400' 
                        : 'border-gray-200 text-gray-500 dark:border-gray-700 dark:text-gray-400'
                    }`}
                  >
                    Google Gemini
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">
                  API Key
                </label>
                <input
                  type="password"
                  value={localKey}
                  onChange={(e) => setLocalKey(e.target.value)}
                  placeholder={localProvider === 'openai' ? 'sk-...' : 'AIzaSy...'}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-indigo-600 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:border-indigo-400"
                />
              </div>

              <div className="rounded-lg bg-gray-50 dark:bg-gray-900/50 p-3 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                <strong>💡 Info:</strong> By default, we use an in-browser local mock assistant. Provide your own key to enable true LLM generation (all calls are sent directly from your browser to OpenAI/Google servers).
              </div>

              <div className="flex gap-2 justify-end pt-2 border-t dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => setIsSettingsOpen(false)}
                  className="rounded-xl border border-gray-200 dark:border-gray-700 px-4 py-2.5 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/10 transition-smooth"
                >
                  {savedStatus ? (
                    <>
                      <Check className="h-4 w-4" /> Saved!
                    </>
                  ) : (
                    'Save Key'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};
