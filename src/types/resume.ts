export interface PersonalInfo {
  photo?: string;
  fullName: string;
  professionalTitle: string;
  email: string;
  phone: string;
  address: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  dob?: string;
  nationality?: string;
}

export interface Education {
  id: string;
  degree: string;
  school: string;
  city?: string;
  cgpaOrPercentage?: string;
  startYear: string;
  endYear: string;
  description?: string;
}

export interface Skill {
  id: string;
  name: string;
  type: 'technical' | 'soft';
  rating: number; // 1 to 5 stars
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  location?: string;
  startDate: string;
  endDate: string;
  current: boolean;
  responsibilities: string; // Plain text or bullet-separated
  achievements?: string;
}

export interface Project {
  id: string;
  name: string;
  githubLink?: string;
  liveLink?: string;
  description: string;
  technologies: string[];
  achievements?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  credentialId?: string;
  credentialUrl?: string;
}

export interface Internship {
  id: string;
  company: string;
  role: string;
  duration: string;
  description: string;
}

export interface Language {
  id: string;
  name: string;
  speaking: 'Basic' | 'Conversational' | 'Fluent' | 'Native';
  reading: 'Basic' | 'Conversational' | 'Fluent' | 'Native';
  writing: 'Basic' | 'Conversational' | 'Fluent' | 'Native';
}

export interface Reference {
  id: string;
  name: string;
  company: string;
  role: string;
  phone?: string;
  email?: string;
}

export interface ResumeData {
  id: string;
  title: string;
  lastSaved: string;
  personalInfo: PersonalInfo;
  summary: string;
  education: Education[];
  skills: Skill[];
  experience: Experience[];
  projects: Project[];
  certifications: Certification[];
  internships: Internship[];
  achievements: string[];
  languages: Language[];
  interests: string[];
  references: Reference[];
}

export interface ThemeSettings {
  accentColor: string; // Hex color code e.g. "#3b82f6"
  fontFamily: 'Inter' | 'Playfair Display' | 'Outfit' | 'Fira Code' | 'Merriweather' | 'Roboto' | 'Poppins';
  fontSize: 'sm' | 'md' | 'lg';
  lineHeight: 'snug' | 'normal' | 'relaxed';
  margins: 'sm' | 'md' | 'lg';
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'full';
  headingStyle: 'default' | 'underline' | 'border-bottom' | 'colored-bg';
  showPhoto: boolean;
  showSocialIcons: boolean;
  pageSize: 'A4' | 'Letter';
}

export interface SavedResume {
  id: string;
  title: string;
  lastSaved: string;
  data: ResumeData;
  theme: ThemeSettings;
  templateId: string;
  atsScore?: number;
}
