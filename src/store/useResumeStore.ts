import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ResumeData, ThemeSettings, SavedResume, PersonalInfo, Education, Skill, Experience, Project, Certification, Internship, Language, Reference } from '../types/resume';
import { analyzeResume } from '../utils/atsScorer';

interface ResumeState {
  // Active Resume State
  resumeData: ResumeData;
  themeSettings: ThemeSettings;
  templateId: string;

  // Dashboard & Navigation State
  savedResumes: SavedResume[];
  activeStep: number;
  isDarkMode: boolean;
  apiKey: string;
  apiProvider: 'openai' | 'gemini';

  // Actions
  updatePersonalInfo: (info: Partial<PersonalInfo>) => void;
  updateSummary: (summary: string) => void;

  addEducation: (edu: Omit<Education, 'id'>) => void;
  updateEducation: (id: string, edu: Partial<Education>) => void;
  removeEducation: (id: string) => void;
  reorderEducation: (list: Education[]) => void;

  addSkill: (skill: Omit<Skill, 'id'>) => void;
  updateSkill: (id: string, skill: Partial<Skill>) => void;
  removeSkill: (id: string) => void;
  reorderSkills: (list: Skill[]) => void;

  addExperience: (exp: Omit<Experience, 'id'>) => void;
  updateExperience: (id: string, exp: Partial<Experience>) => void;
  removeExperience: (id: string) => void;
  reorderExperience: (list: Experience[]) => void;

  addProject: (proj: Omit<Project, 'id'>) => void;
  updateProject: (id: string, proj: Partial<Project>) => void;
  removeProject: (id: string) => void;
  reorderProjects: (list: Project[]) => void;

  addCertification: (cert: Omit<Certification, 'id'>) => void;
  updateCertification: (id: string, cert: Partial<Certification>) => void;
  removeCertification: (id: string) => void;

  addInternship: (intern: Omit<Internship, 'id'>) => void;
  updateInternship: (id: string, intern: Partial<Internship>) => void;
  removeInternship: (id: string) => void;

  addAchievement: (achievement: string) => void;
  updateAchievement: (index: number, achievement: string) => void;
  removeAchievement: (index: number) => void;

  addLanguage: (lang: Omit<Language, 'id'>) => void;
  updateLanguage: (id: string, lang: Partial<Language>) => void;
  removeLanguage: (id: string) => void;

  addInterest: (interest: string) => void;
  removeInterest: (index: number) => void;

  addReference: (ref: Omit<Reference, 'id'>) => void;
  updateReference: (id: string, ref: Partial<Reference>) => void;
  removeReference: (id: string) => void;

  updateThemeSettings: (settings: Partial<ThemeSettings>) => void;
  setTemplateId: (id: string) => void;
  setActiveStep: (step: number) => void;
  toggleDarkMode: () => void;
  setApiKey: (key: string, provider: 'openai' | 'gemini') => void;

  // Saved Resumes Management
  saveCurrentResume: () => void;
  loadResume: (id: string) => void;
  deleteResume: (id: string) => void;
  createNewResume: () => void;
  importResumeJSON: (jsonString: string) => boolean;
}

const defaultPersonalInfo: PersonalInfo = {
  fullName: '',
  professionalTitle: '',
  email: '',
  phone: '',
  address: '',
  linkedin: '',
  github: '',
  portfolio: '',
  photo: ''
};

const defaultSummary = '';

const defaultEducation: Education[] = [];

const defaultSkills: Skill[] = [];

const defaultExperience: Experience[] = [];

const defaultProjects: Project[] = [];

const defaultCertifications: Certification[] = [];

const defaultInternships: Internship[] = [];

const defaultAchievements: string[] = [];

const defaultLanguages: Language[] = [];

const defaultInterests: string[] = [];

const defaultReferences: Reference[] = [];

const defaultThemeSettings: ThemeSettings = {
  accentColor: '#3b82f6', // Corporate blue
  fontFamily: 'Inter',
  fontSize: 'md',
  lineHeight: 'normal',
  margins: 'md',
  borderRadius: 'md',
  headingStyle: 'underline',
  showPhoto: true,
  showSocialIcons: true,
  pageSize: 'A4'
};

const createNewResumeData = (id: string, title = 'Untitled Resume'): ResumeData => ({
  id,
  title,
  lastSaved: new Date().toISOString(),
  personalInfo: {
    fullName: '',
    professionalTitle: '',
    email: '',
    phone: '',
    address: '',
    linkedin: '',
    github: '',
    portfolio: '',
    photo: ''
  },
  summary: '',
  education: [],
  skills: [],
  experience: [],
  projects: [],
  certifications: [],
  internships: [],
  achievements: [],
  languages: [],
  interests: [],
  references: []
});

export const useResumeStore = create<ResumeState>()(
  persist(
    (set, _get) => ({
      // Active Resume Data
      resumeData: {
        id: 'default-resume-id',
        title: 'Full Stack Engineer Resume',
        lastSaved: new Date().toISOString(),
        personalInfo: defaultPersonalInfo,
        summary: defaultSummary,
        education: defaultEducation,
        skills: defaultSkills,
        experience: defaultExperience,
        projects: defaultProjects,
        certifications: defaultCertifications,
        internships: defaultInternships,
        achievements: defaultAchievements,
        languages: defaultLanguages,
        interests: defaultInterests,
        references: defaultReferences
      },
      themeSettings: defaultThemeSettings,
      templateId: 'modern-minimal',

      // Dashboard & Settings
      savedResumes: [],
      activeStep: 0,
      isDarkMode: false,
      apiKey: '',
      apiProvider: 'openai',

      // Personal Info
      updatePersonalInfo: (info) => set((state) => ({
        resumeData: {
          ...state.resumeData,
          personalInfo: { ...state.resumeData.personalInfo, ...info },
          lastSaved: new Date().toISOString()
        }
      })),

      // Summary
      updateSummary: (summary) => set((state) => ({
        resumeData: {
          ...state.resumeData,
          summary,
          lastSaved: new Date().toISOString()
        }
      })),

      // Education
      addEducation: (edu) => set((state) => ({
        resumeData: {
          ...state.resumeData,
          education: [...state.resumeData.education, { ...edu, id: `edu-${Date.now()}` }],
          lastSaved: new Date().toISOString()
        }
      })),
      updateEducation: (id, edu) => set((state) => ({
        resumeData: {
          ...state.resumeData,
          education: state.resumeData.education.map((item) => item.id === id ? { ...item, ...edu } : item),
          lastSaved: new Date().toISOString()
        }
      })),
      removeEducation: (id) => set((state) => ({
        resumeData: {
          ...state.resumeData,
          education: state.resumeData.education.filter((item) => item.id !== id),
          lastSaved: new Date().toISOString()
        }
      })),
      reorderEducation: (list) => set((state) => ({
        resumeData: {
          ...state.resumeData,
          education: list,
          lastSaved: new Date().toISOString()
        }
      })),

      // Skills
      addSkill: (skill) => set((state) => ({
        resumeData: {
          ...state.resumeData,
          skills: [...state.resumeData.skills, { ...skill, id: `sk-${Date.now()}` }],
          lastSaved: new Date().toISOString()
        }
      })),
      updateSkill: (id, skill) => set((state) => ({
        resumeData: {
          ...state.resumeData,
          skills: state.resumeData.skills.map((item) => item.id === id ? { ...item, ...skill } : item),
          lastSaved: new Date().toISOString()
        }
      })),
      removeSkill: (id) => set((state) => ({
        resumeData: {
          ...state.resumeData,
          skills: state.resumeData.skills.filter((item) => item.id !== id),
          lastSaved: new Date().toISOString()
        }
      })),
      reorderSkills: (list) => set((state) => ({
        resumeData: {
          ...state.resumeData,
          skills: list,
          lastSaved: new Date().toISOString()
        }
      })),

      // Experience
      addExperience: (exp) => set((state) => ({
        resumeData: {
          ...state.resumeData,
          experience: [...state.resumeData.experience, { ...exp, id: `exp-${Date.now()}` }],
          lastSaved: new Date().toISOString()
        }
      })),
      updateExperience: (id, exp) => set((state) => ({
        resumeData: {
          ...state.resumeData,
          experience: state.resumeData.experience.map((item) => item.id === id ? { ...item, ...exp } : item),
          lastSaved: new Date().toISOString()
        }
      })),
      removeExperience: (id) => set((state) => ({
        resumeData: {
          ...state.resumeData,
          experience: state.resumeData.experience.filter((item) => item.id !== id),
          lastSaved: new Date().toISOString()
        }
      })),
      reorderExperience: (list) => set((state) => ({
        resumeData: {
          ...state.resumeData,
          experience: list,
          lastSaved: new Date().toISOString()
        }
      })),

      // Projects
      addProject: (proj) => set((state) => ({
        resumeData: {
          ...state.resumeData,
          projects: [...state.resumeData.projects, { ...proj, id: `proj-${Date.now()}` }],
          lastSaved: new Date().toISOString()
        }
      })),
      updateProject: (id, proj) => set((state) => ({
        resumeData: {
          ...state.resumeData,
          projects: state.resumeData.projects.map((item) => item.id === id ? { ...item, ...proj } : item),
          lastSaved: new Date().toISOString()
        }
      })),
      removeProject: (id) => set((state) => ({
        resumeData: {
          ...state.resumeData,
          projects: state.resumeData.projects.filter((item) => item.id !== id),
          lastSaved: new Date().toISOString()
        }
      })),
      reorderProjects: (list) => set((state) => ({
        resumeData: {
          ...state.resumeData,
          projects: list,
          lastSaved: new Date().toISOString()
        }
      })),

      // Certifications
      addCertification: (cert) => set((state) => ({
        resumeData: {
          ...state.resumeData,
          certifications: [...state.resumeData.certifications, { ...cert, id: `cert-${Date.now()}` }],
          lastSaved: new Date().toISOString()
        }
      })),
      updateCertification: (id, cert) => set((state) => ({
        resumeData: {
          ...state.resumeData,
          certifications: state.resumeData.certifications.map((item) => item.id === id ? { ...item, ...cert } : item),
          lastSaved: new Date().toISOString()
        }
      })),
      removeCertification: (id) => set((state) => ({
        resumeData: {
          ...state.resumeData,
          certifications: state.resumeData.certifications.filter((item) => item.id !== id),
          lastSaved: new Date().toISOString()
        }
      })),

      // Internships
      addInternship: (intern) => set((state) => ({
        resumeData: {
          ...state.resumeData,
          internships: [...state.resumeData.internships, { ...intern, id: `int-${Date.now()}` }],
          lastSaved: new Date().toISOString()
        }
      })),
      updateInternship: (id, intern) => set((state) => ({
        resumeData: {
          ...state.resumeData,
          internships: state.resumeData.internships.map((item) => item.id === id ? { ...item, ...intern } : item),
          lastSaved: new Date().toISOString()
        }
      })),
      removeInternship: (id) => set((state) => ({
        resumeData: {
          ...state.resumeData,
          internships: state.resumeData.internships.filter((item) => item.id !== id),
          lastSaved: new Date().toISOString()
        }
      })),

      // Achievements
      addAchievement: (achievement) => set((state) => ({
        resumeData: {
          ...state.resumeData,
          achievements: [...state.resumeData.achievements, achievement],
          lastSaved: new Date().toISOString()
        }
      })),
      updateAchievement: (index, achievement) => set((state) => ({
        resumeData: {
          ...state.resumeData,
          achievements: state.resumeData.achievements.map((item, idx) => idx === index ? achievement : item),
          lastSaved: new Date().toISOString()
        }
      })),
      removeAchievement: (index) => set((state) => ({
        resumeData: {
          ...state.resumeData,
          achievements: state.resumeData.achievements.filter((_, idx) => idx !== index),
          lastSaved: new Date().toISOString()
        }
      })),

      // Languages
      addLanguage: (lang) => set((state) => ({
        resumeData: {
          ...state.resumeData,
          languages: [...state.resumeData.languages, { ...lang, id: `lang-${Date.now()}` }],
          lastSaved: new Date().toISOString()
        }
      })),
      updateLanguage: (id, lang) => set((state) => ({
        resumeData: {
          ...state.resumeData,
          languages: state.resumeData.languages.map((item) => item.id === id ? { ...item, ...lang } : item),
          lastSaved: new Date().toISOString()
        }
      })),
      removeLanguage: (id) => set((state) => ({
        resumeData: {
          ...state.resumeData,
          languages: state.resumeData.languages.filter((item) => item.id !== id),
          lastSaved: new Date().toISOString()
        }
      })),

      // Interests
      addInterest: (interest) => set((state) => ({
        resumeData: {
          ...state.resumeData,
          interests: [...state.resumeData.interests, interest],
          lastSaved: new Date().toISOString()
        }
      })),
      removeInterest: (index) => set((state) => ({
        resumeData: {
          ...state.resumeData,
          interests: state.resumeData.interests.filter((_, idx) => idx !== index),
          lastSaved: new Date().toISOString()
        }
      })),

      // References
      addReference: (ref) => set((state) => ({
        resumeData: {
          ...state.resumeData,
          references: [...state.resumeData.references, { ...ref, id: `ref-${Date.now()}` }],
          lastSaved: new Date().toISOString()
        }
      })),
      updateReference: (id, ref) => set((state) => ({
        resumeData: {
          ...state.resumeData,
          references: state.resumeData.references.map((item) => item.id === id ? { ...item, ...ref } : item),
          lastSaved: new Date().toISOString()
        }
      })),
      removeReference: (id) => set((state) => ({
        resumeData: {
          ...state.resumeData,
          references: state.resumeData.references.filter((item) => item.id !== id),
          lastSaved: new Date().toISOString()
        }
      })),

      // Themes, steps, keys, modes
      updateThemeSettings: (settings) => set((state) => ({
        themeSettings: { ...state.themeSettings, ...settings }
      })),
      setTemplateId: (id) => set({ templateId: id }),
      setActiveStep: (step) => set({ activeStep: step }),
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
      setApiKey: (key, provider) => set({ apiKey: key, apiProvider: provider }),

      // Saved Resumes Management
      saveCurrentResume: () => set((state) => {
        const existingIdx = state.savedResumes.findIndex((r) => r.id === state.resumeData.id);
        const updatedResume: SavedResume = {
          id: state.resumeData.id,
          title: state.resumeData.title,
          lastSaved: new Date().toISOString(),
          data: state.resumeData,
          theme: state.themeSettings,
          templateId: state.templateId,
          atsScore: analyzeResume(state.resumeData).score
        };

        let newList = [...state.savedResumes];
        if (existingIdx >= 0) {
          newList[existingIdx] = updatedResume;
        } else {
          newList.unshift(updatedResume);
        }

        return { savedResumes: newList };
      }),

      loadResume: (id) => set((state) => {
        const found = state.savedResumes.find((r) => r.id === id);
        if (found) {
          return {
            resumeData: {
              ...createNewResumeData(found.data.id, found.data.title),
              ...found.data,
              personalInfo: { ...defaultPersonalInfo, ...(found.data.personalInfo || {}) },
              education: found.data.education || [],
              skills: found.data.skills || [],
              experience: found.data.experience || [],
              projects: found.data.projects || [],
              certifications: found.data.certifications || [],
              internships: found.data.internships || [],
              achievements: found.data.achievements || [],
              languages: found.data.languages || [],
              interests: found.data.interests || [],
              references: found.data.references || []
            },
            themeSettings: { ...defaultThemeSettings, ...(found.theme || {}) },
            templateId: found.templateId || 'modern-minimal'
          };
        }
        return {};
      }),

      deleteResume: (id) => set((state) => ({
        savedResumes: state.savedResumes.filter((r) => r.id !== id)
      })),

      createNewResume: () => set((state) => {
        const newId = `resume-${Date.now()}`;
        const newResume = createNewResumeData(newId);

        // Save the previous one first
        const currentSavedList = [...state.savedResumes];
        const existingIdx = currentSavedList.findIndex((r) => r.id === state.resumeData.id);
        const activeSaved: SavedResume = {
          id: state.resumeData.id,
          title: state.resumeData.title,
          lastSaved: new Date().toISOString(),
          data: state.resumeData,
          theme: state.themeSettings,
          templateId: state.templateId
        };

        if (existingIdx >= 0) {
          currentSavedList[existingIdx] = activeSaved;
        } else {
          currentSavedList.unshift(activeSaved);
        }

        return {
          resumeData: newResume,
          themeSettings: defaultThemeSettings,
          templateId: 'modern-minimal',
          savedResumes: currentSavedList,
          activeStep: 0
        };
      }),

      importResumeJSON: (jsonString) => {
        try {
          const parsed = JSON.parse(jsonString);
          const dataObj = parsed.data || parsed;
          if (dataObj && (dataObj.personalInfo || Array.isArray(dataObj.skills))) {
            const importedResume: ResumeData = {
              id: dataObj.id || `resume-${Date.now()}`,
              title: dataObj.title || 'Imported Resume',
              lastSaved: new Date().toISOString(),
              personalInfo: { ...defaultPersonalInfo, ...(dataObj.personalInfo || {}) },
              summary: dataObj.summary || '',
              education: dataObj.education || [],
              skills: dataObj.skills || [],
              experience: dataObj.experience || [],
              projects: dataObj.projects || [],
              certifications: dataObj.certifications || [],
              internships: dataObj.internships || [],
              achievements: dataObj.achievements || [],
              languages: dataObj.languages || [],
              interests: dataObj.interests || [],
              references: dataObj.references || []
            };

            set({
              resumeData: importedResume,
              themeSettings: parsed.themeSettings || parsed.theme || defaultThemeSettings,
              templateId: parsed.templateId || 'modern-minimal'
            });
            return true;
          }
          return false;
        } catch (e) {
          console.error('Import failed', e);
          return false;
        }
      }
    }),
    {
      name: 'resume-builder-storage', // key in local storage
      partialize: (state) => ({
        savedResumes: state.savedResumes,
        resumeData: state.resumeData,
        themeSettings: state.themeSettings,
        templateId: state.templateId,
        apiKey: state.apiKey,
        apiProvider: state.apiProvider,
        isDarkMode: state.isDarkMode
      })
    }
  )
);
