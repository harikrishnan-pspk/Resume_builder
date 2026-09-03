import React from 'react';
import { ResumeData, ThemeSettings } from '../types/resume';
import { 
  Mail, Phone, MapPin, Globe, Briefcase, GraduationCap, 
  Trophy, Cpu, Folder, Award, Languages, Heart, Users 
} from 'lucide-react';

interface TemplateProps {
  data: ResumeData;
  theme: ThemeSettings;
}

// ----------------------------------------------------
// SHARED UTILITIES
// ----------------------------------------------------

const getFontClass = (font: ThemeSettings['fontFamily']) => {
  switch (font) {
    case 'Inter': return 'font-inter';
    case 'Playfair Display': return 'font-playfair';
    case 'Outfit': return 'font-outfit';
    case 'Fira Code': return 'font-fira';
    case 'Merriweather': return 'font-merriweather';
    case 'Roboto': return 'font-roboto';
    case 'Poppins': return 'font-poppins';
    default: return 'font-inter';
  }
};

const getFontSizeClasses = (size: ThemeSettings['fontSize']) => {
  switch (size) {
    case 'sm':
      return {
        body: 'text-[11px] leading-relaxed',
        sub: 'text-[10px] leading-snug',
        title: 'text-sm font-semibold',
        name: 'text-xl font-bold tracking-tight',
        header: 'text-xs font-bold uppercase tracking-wider',
      };
    case 'lg':
      return {
        body: 'text-[14px] leading-relaxed',
        sub: 'text-[12px] leading-snug',
        title: 'text-base font-bold',
        name: 'text-3xl font-extrabold tracking-tight',
        header: 'text-base font-bold uppercase tracking-wider',
      };
    case 'md':
    default:
      return {
        body: 'text-[12px] leading-relaxed',
        sub: 'text-[11px] leading-snug',
        title: 'text-sm font-bold',
        name: 'text-2xl font-bold tracking-tight',
        header: 'text-xs font-bold uppercase tracking-wider',
      };
  }
};

const getMarginClass = (margin: ThemeSettings['margins']) => {
  switch (margin) {
    case 'sm': return 'p-4 md:p-6 space-y-3';
    case 'lg': return 'p-10 md:p-14 space-y-7';
    case 'md':
    default:
      return 'p-8 md:p-10 space-y-5';
  }
};

const getRadiusClass = (radius: ThemeSettings['borderRadius']) => {
  switch (radius) {
    case 'none': return 'rounded-none';
    case 'sm': return 'rounded-sm';
    case 'lg': return 'rounded-xl';
    case 'full': return 'rounded-full';
    case 'md':
    default:
      return 'rounded-md';
  }
};

// Section Heading component that honors the ThemeSettings border/underlining style
const SectionHeading: React.FC<{
  title: string;
  theme: ThemeSettings;
  icon?: React.ReactNode;
}> = ({ title, theme, icon }) => {
  const sizeClasses = getFontSizeClasses(theme.fontSize);
  const color = theme.accentColor;

  switch (theme.headingStyle) {
    case 'underline':
      return (
        <div className="mb-2">
          <h3 className={`${sizeClasses.header} flex items-center gap-2`} style={{ color }}>
            {theme.showSocialIcons && icon}
            {title}
          </h3>
          <div className="h-0.5 w-full mt-1 bg-gray-200 dark:bg-gray-700">
            <div className="h-0.5 w-16" style={{ backgroundColor: color }}></div>
          </div>
        </div>
      );
    case 'border-bottom':
      return (
        <div className="mb-2 border-b-2 pb-1 flex items-center gap-2" style={{ borderBottomColor: color }}>
          <h3 className={`${sizeClasses.header} flex items-center gap-2`} style={{ color }}>
            {theme.showSocialIcons && icon}
            {title}
          </h3>
        </div>
      );
    case 'colored-bg':
      return (
        <div className="mb-2 px-3 py-1.5 rounded flex items-center gap-2" style={{ backgroundColor: `${color}15`, borderLeft: `3px solid ${color}` }}>
          <h3 className={`${sizeClasses.header} flex items-center gap-2`} style={{ color }}>
            {theme.showSocialIcons && icon}
            {title}
          </h3>
        </div>
      );
    case 'default':
    default:
      return (
        <div className="mb-2 flex items-center gap-2">
          <h3 className={`${sizeClasses.header} tracking-widest font-bold uppercase`} style={{ color }}>
            {theme.showSocialIcons && icon}
            {title}
          </h3>
        </div>
      );
  }
};

// Rating component for skills
const StarRating: React.FC<{ rating: number; color: string }> = ({ rating, color }) => {
  return (
    <span className="inline-flex gap-0.5 ml-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className="text-xs"
          style={{ color: i < rating ? color : '#d1d5db' }}
        >
          ★
        </span>
      ))}
    </span>
  );
};

// Layout for experience and education lists to avoid text overflow
const DateRange: React.FC<{ start: string; end: string; current?: boolean; style?: any }> = ({ start, end, current, style }) => {
  return (
    <span className="text-[10px] md:text-xs font-medium text-gray-500 whitespace-nowrap" style={style}>
      {start} – {current ? 'Present' : end}
    </span>
  );
};

// ----------------------------------------------------
// 1. HARVARD ATS TEMPLATE (Strictly standard)
// ----------------------------------------------------
export const HarvardATS: React.FC<TemplateProps> = ({ data, theme }) => {
  const fontClass = getFontClass(theme.fontFamily);
  const size = getFontSizeClasses(theme.fontSize);
  const paddingClass = getMarginClass(theme.margins);

  return (
    <div className={`w-full bg-white text-black text-left ${fontClass} ${paddingClass} max-w-4xl mx-auto`} id="resume-document">
      {/* Header */}
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-serif font-bold uppercase tracking-wide">{data.personalInfo.fullName || 'Full Name'}</h1>
        <p className="text-sm font-serif italic text-gray-700">{data.personalInfo.professionalTitle}</p>
        <div className="text-xs font-serif text-gray-600 flex flex-wrap justify-center gap-x-2 gap-y-1">
          <span>{data.personalInfo.email}</span> | 
          <span>{data.personalInfo.phone}</span> | 
          <span>{data.personalInfo.address}</span>
          {data.personalInfo.linkedin && <span> | {data.personalInfo.linkedin}</span>}
          {data.personalInfo.github && <span> | {data.personalInfo.github}</span>}
        </div>
      </div>

      {/* Summary */}
      {data.summary && (
        <div className="space-y-1">
          <SectionHeading title="Professional Summary" theme={{ ...theme, accentColor: '#000000', headingStyle: 'underline' }} icon={<Users size={14} />} />
          <p className={`${size.body} font-serif leading-relaxed text-justify`}>{data.summary}</p>
        </div>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <div className="space-y-3">
          <SectionHeading title="Work Experience" theme={{ ...theme, accentColor: '#000000', headingStyle: 'underline' }} icon={<Briefcase size={14} />} />
          {data.experience.map((exp) => (
            <div key={exp.id} className="space-y-1">
              <div className="flex justify-between items-baseline font-bold font-serif">
                <span className={size.title}>{exp.role}, <span className="font-normal font-sans text-gray-700">{exp.company}</span></span>
                <DateRange start={exp.startDate} end={exp.endDate} current={exp.current} style={{ color: '#000000', fontFamily: 'serif' }} />
              </div>
              {exp.location && <p className={`${size.sub} text-gray-500 font-serif italic`}>{exp.location}</p>}
              <ul className="list-disc pl-5 space-y-0.5">
                {exp.responsibilities.split('\n').map((line, idx) => line.trim() && (
                  <li key={idx} className={`${size.body} font-serif text-justify`}>{line.replace(/^•\s*/, '')}</li>
                ))}
                {exp.achievements && (
                  <li className={`${size.body} font-serif text-justify`}><strong>Key Achievement:</strong> {exp.achievements}</li>
                )}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <div className="space-y-3">
          <SectionHeading title="Education" theme={{ ...theme, accentColor: '#000000', headingStyle: 'underline' }} icon={<GraduationCap size={14} />} />
          {data.education.map((edu) => (
            <div key={edu.id} className="space-y-1">
              <div className="flex justify-between items-baseline font-serif font-bold">
                <span className={size.title}>{edu.degree}</span>
                <span className="text-xs font-normal">{edu.startYear} – {edu.endYear}</span>
              </div>
              <p className={`${size.body} font-serif`}>{edu.school} {edu.city ? `, ${edu.city}` : ''} {edu.cgpaOrPercentage ? `| Grade: ${edu.cgpaOrPercentage}` : ''}</p>
              {edu.description && <p className={`${size.sub} font-serif italic text-gray-600`}>{edu.description}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <div className="space-y-2">
          <SectionHeading title="Skills" theme={{ ...theme, accentColor: '#000000', headingStyle: 'underline' }} icon={<Cpu size={14} />} />
          <div className={`${size.body} font-serif space-y-1`}>
            {data.skills.filter(s => s.type === 'technical').length > 0 && (
              <p><strong>Technical:</strong> {data.skills.filter(s => s.type === 'technical').map(s => s.name).join(', ')}</p>
            )}
            {data.skills.filter(s => s.type === 'soft').length > 0 && (
              <p><strong>Professional Skills:</strong> {data.skills.filter(s => s.type === 'soft').map(s => s.name).join(', ')}</p>
            )}
          </div>
        </div>
      )}

      {/* Projects */}
      {data.projects.length > 0 && (
        <div className="space-y-3">
          <SectionHeading title="Academic Projects" theme={{ ...theme, accentColor: '#000000', headingStyle: 'underline' }} icon={<Folder size={14} />} />
          {data.projects.map((p) => (
            <div key={p.id} className="space-y-0.5 font-serif">
              <div className="flex justify-between items-baseline font-bold">
                <span className={size.title}>{p.name}</span>
                {p.githubLink && <span className="text-[10px] font-mono select-all">{p.githubLink}</span>}
              </div>
              <p className={`${size.body} text-justify`}>{p.description}</p>
              <p className={`${size.sub} text-gray-600`}><strong>Technologies:</strong> {p.technologies.join(', ')}</p>
            </div>
          ))}
        </div>
      )}

      {/* Certifications */}
      {data.certifications.length > 0 && (
        <div className="space-y-2">
          <SectionHeading title="Certifications" theme={{ ...theme, accentColor: '#000000', headingStyle: 'underline' }} icon={<Award size={14} />} />
          <ul className="list-disc pl-5 space-y-0.5">
            {data.certifications.map((c) => (
              <li key={c.id} className={`${size.body} font-serif`}>
                <strong>{c.name}</strong> – {c.issuer} ({c.date})
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Internships */}
      {data.internships.length > 0 && (
        <div className="space-y-2">
          <SectionHeading title="Internships" theme={{ ...theme, accentColor: '#000000', headingStyle: 'underline' }} icon={<Briefcase size={14} />} />
          {data.internships.map((intern) => (
            <div key={intern.id} className="space-y-0.5">
              <div className="flex justify-between items-baseline font-bold font-serif">
                <span className={size.title}>{intern.role}, <span className="font-normal font-sans text-gray-700">{intern.company}</span></span>
                <span className="text-xs font-normal font-serif text-gray-600">{intern.duration}</span>
              </div>
              <p className={`${size.body} font-serif text-justify`}>{intern.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Achievements */}
      {data.achievements.filter(a => a.trim()).length > 0 && (
        <div className="space-y-1">
          <SectionHeading title="Achievements" theme={{ ...theme, accentColor: '#000000', headingStyle: 'underline' }} icon={<Trophy size={14} />} />
          <ul className="list-disc pl-5 space-y-0.5">
            {data.achievements.filter(a => a.trim()).map((ach, idx) => (
              <li key={idx} className={`${size.body} font-serif text-justify`}>{ach}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Languages */}
      {data.languages.length > 0 && (
        <div className="space-y-1">
          <SectionHeading title="Languages" theme={{ ...theme, accentColor: '#000000', headingStyle: 'underline' }} icon={<Languages size={14} />} />
          <p className={`${size.body} font-serif`}>{data.languages.map(l => `${l.name} (${l.speaking})`).join(' • ')}</p>
        </div>
      )}

      {/* Interests */}
      {data.interests.filter(i => i.trim()).length > 0 && (
        <div className="space-y-1">
          <SectionHeading title="Interests" theme={{ ...theme, accentColor: '#000000', headingStyle: 'underline' }} icon={<Heart size={14} />} />
          <p className={`${size.body} font-serif`}>{data.interests.filter(i => i.trim()).join(', ')}</p>
        </div>
      )}

      {/* References */}
      {data.references.length > 0 && (
        <div className="space-y-2">
          <SectionHeading title="References" theme={{ ...theme, accentColor: '#000000', headingStyle: 'underline' }} icon={<Users size={14} />} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {data.references.map((ref) => (
              <div key={ref.id} className="space-y-0.5 font-serif">
                <p className={`${size.title} font-bold`}>{ref.name}</p>
                <p className={`${size.sub} text-gray-600 italic`}>{ref.role}{ref.company ? `, ${ref.company}` : ''}</p>
                {ref.phone && <p className={`${size.sub} text-gray-500`}>{ref.phone}</p>}
                {ref.email && <p className={`${size.sub} text-gray-500`}>{ref.email}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ----------------------------------------------------
// 2. GOOGLE STYLE TEMPLATE (Minimal, clean, black/grey)
// ----------------------------------------------------
export const GoogleStyle: React.FC<TemplateProps> = ({ data, theme }) => {
  const fontClass = getFontClass(theme.fontFamily);
  const size = getFontSizeClasses(theme.fontSize);
  const paddingClass = getMarginClass(theme.margins);

  return (
    <div className={`w-full bg-white text-[#202124] text-left ${fontClass} ${paddingClass} max-w-4xl mx-auto`} id="resume-document">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-light tracking-tight text-[#1a0dab] font-sans">{data.personalInfo.fullName || 'Candidate Name'}</h1>
        <p className="text-sm font-medium text-gray-600 mt-1">{data.personalInfo.professionalTitle}</p>
        <div className="text-xs text-gray-500 mt-2 flex flex-wrap gap-x-4 gap-y-1">
          {data.personalInfo.email && <span className="flex items-center gap-1"><Mail size={10} /> {data.personalInfo.email}</span>}
          {data.personalInfo.phone && <span className="flex items-center gap-1"><Phone size={10} /> {data.personalInfo.phone}</span>}
          {data.personalInfo.address && <span className="flex items-center gap-1"><MapPin size={10} /> {data.personalInfo.address}</span>}
          {data.personalInfo.portfolio && <span className="flex items-center gap-1"><Globe size={10} /> {data.personalInfo.portfolio}</span>}
        </div>
      </div>

      <div className="h-[1px] bg-gray-200 my-4" />

      {/* Summary */}
      {data.summary && (
        <div className="space-y-1">
          <SectionHeading title="Summary" theme={{ ...theme, accentColor: '#1a0dab', headingStyle: 'default' }} icon={<Users size={14} />} />
          <p className={`${size.body} text-justify text-gray-700`}>{data.summary}</p>
        </div>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <div className="space-y-4 mt-4">
          <SectionHeading title="Experience" theme={{ ...theme, accentColor: '#1a0dab', headingStyle: 'default' }} icon={<Briefcase size={14} />} />
          {data.experience.map((exp) => (
            <div key={exp.id} className="group">
              <div className="flex justify-between items-baseline font-semibold">
                <span className={size.title}>{exp.role} <span className="font-normal text-gray-500">at</span> {exp.company}</span>
                <DateRange start={exp.startDate} end={exp.endDate} current={exp.current} />
              </div>
              {exp.location && <p className={`${size.sub} text-gray-400`}>{exp.location}</p>}
              <ul className="list-disc pl-5 mt-1 space-y-0.5">
                {exp.responsibilities.split('\n').map((line, idx) => line.trim() && (
                  <li key={idx} className={`${size.body} text-gray-700 text-justify`}>{line.replace(/^•\s*/, '')}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <div className="space-y-3 mt-4">
          <SectionHeading title="Education" theme={{ ...theme, accentColor: '#1a0dab', headingStyle: 'default' }} icon={<GraduationCap size={14} />} />
          {data.education.map((edu) => (
            <div key={edu.id}>
              <div className="flex justify-between items-baseline font-semibold">
                <span className={size.title}>{edu.degree}</span>
                <span className="text-xs text-gray-500">{edu.startYear} – {edu.endYear}</span>
              </div>
              <p className={`${size.body} text-gray-600`}>{edu.school} {edu.city ? `| ${edu.city}` : ''} {edu.cgpaOrPercentage ? `| GPA: ${edu.cgpaOrPercentage}` : ''}</p>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <div className="space-y-2 mt-4">
          <SectionHeading title="Technical & Soft Skills" theme={{ ...theme, accentColor: '#1a0dab', headingStyle: 'default' }} icon={<Cpu size={14} />} />
          <div className={`${size.body} text-gray-700 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1`}>
            {data.skills.map((skill) => (
              <div key={skill.id} className="flex justify-between items-center py-0.5 border-b border-gray-50">
                <span>{skill.name}</span>
                {theme.showSocialIcons && <StarRating rating={skill.rating} color="#1a0dab" />}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {data.projects.length > 0 && (
        <div className="space-y-3 mt-4">
          <SectionHeading title="Projects" theme={{ ...theme, accentColor: '#1a0dab', headingStyle: 'default' }} icon={<Folder size={14} />} />
          {data.projects.map((p) => (
            <div key={p.id} className="space-y-0.5">
              <div className="flex justify-between items-baseline font-bold">
                <span className={size.title}>{p.name}</span>
                {p.githubLink && <span className="text-[10px] font-mono text-gray-400 select-all">{p.githubLink}</span>}
              </div>
              <p className={`${size.body} text-gray-600 text-justify`}>{p.description}</p>
              {p.technologies.length > 0 && (
                <p className={`${size.sub} text-gray-400`}><strong>Tech:</strong> {p.technologies.join(', ')}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Certifications */}
      {data.certifications.length > 0 && (
        <div className="space-y-2 mt-4">
          <SectionHeading title="Certifications" theme={{ ...theme, accentColor: '#1a0dab', headingStyle: 'default' }} icon={<Award size={14} />} />
          <ul className="space-y-1">
            {data.certifications.map((c) => (
              <li key={c.id} className={`${size.body} text-gray-700`}>
                <strong>{c.name}</strong> — {c.issuer} {c.date && `(${c.date})`}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Internships */}
      {data.internships.length > 0 && (
        <div className="space-y-3 mt-4">
          <SectionHeading title="Internships" theme={{ ...theme, accentColor: '#1a0dab', headingStyle: 'default' }} icon={<Briefcase size={14} />} />
          {data.internships.map((intern) => (
            <div key={intern.id} className="space-y-0.5">
              <div className="flex justify-between items-baseline font-bold">
                <span className={size.title}>{intern.role} at {intern.company}</span>
                <span className={`${size.sub} text-gray-400`}>{intern.duration}</span>
              </div>
              <p className={`${size.body} text-gray-600 text-justify`}>{intern.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Achievements */}
      {data.achievements.filter(a => a.trim()).length > 0 && (
        <div className="space-y-2 mt-4">
          <SectionHeading title="Achievements" theme={{ ...theme, accentColor: '#1a0dab', headingStyle: 'default' }} icon={<Trophy size={14} />} />
          <ul className="list-disc pl-5 space-y-0.5">
            {data.achievements.filter(a => a.trim()).map((ach, idx) => (
              <li key={idx} className={`${size.body} text-gray-700`}>{ach}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Languages */}
      {data.languages.length > 0 && (
        <div className="space-y-2 mt-4">
          <SectionHeading title="Languages" theme={{ ...theme, accentColor: '#1a0dab', headingStyle: 'default' }} icon={<Languages size={14} />} />
          <div className="flex flex-wrap gap-2">
            {data.languages.map((lang) => (
              <span key={lang.id} className={`${size.sub} px-2.5 py-1 bg-gray-50 border border-gray-100 text-gray-600`}>
                <strong>{lang.name}</strong> · {lang.speaking}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Interests */}
      {data.interests.filter(i => i.trim()).length > 0 && (
        <div className="mt-4">
          <SectionHeading title="Interests" theme={{ ...theme, accentColor: '#1a0dab', headingStyle: 'default' }} icon={<Heart size={14} />} />
          <p className={`${size.body} text-gray-600 pt-1`}>{data.interests.filter(i => i.trim()).join(' · ')}</p>
        </div>
      )}

      {/* References */}
      {data.references.length > 0 && (
        <div className="space-y-3 mt-4">
          <SectionHeading title="References" theme={{ ...theme, accentColor: '#1a0dab', headingStyle: 'default' }} icon={<Users size={14} />} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {data.references.map((ref) => (
              <div key={ref.id} className="space-y-0.5">
                <p className={`${size.title} font-bold text-gray-900`}>{ref.name}</p>
                <p className={`${size.sub} text-gray-500`}>{ref.role}{ref.company ? `, ${ref.company}` : ''}</p>
                {ref.phone && <p className={`${size.sub} text-gray-400`}>📱 {ref.phone}</p>}
                {ref.email && <p className={`${size.sub} text-gray-400`}>✉️ {ref.email}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ----------------------------------------------------
// 3. MICROSOFT PROFESSIONAL TEMPLATE (Classic corporate)
// ----------------------------------------------------
export const MicrosoftProfessional: React.FC<TemplateProps> = ({ data, theme }) => {
  const fontClass = getFontClass(theme.fontFamily);
  const size = getFontSizeClasses(theme.fontSize);
  const paddingClass = getMarginClass(theme.margins);
  const color = theme.accentColor;

  return (
    <div className={`w-full bg-white text-gray-800 text-left ${fontClass} ${paddingClass} max-w-4xl mx-auto`} id="resume-document">
      {/* Top Banner Accent */}
      <div className="h-2 -mx-8 md:-mx-10 -mt-8 md:-mt-10 rounded-t-md" style={{ backgroundColor: color }} />

      {/* Header Info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-4 pt-4">
        <div>
          <h1 className={`${size.name} font-sans uppercase`} style={{ color }}>{data.personalInfo.fullName}</h1>
          <p className="text-sm font-medium text-gray-500">{data.personalInfo.professionalTitle}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-600">
          <span className="flex items-center gap-1.5"><Mail size={12} style={{ color }} /> {data.personalInfo.email}</span>
          <span className="flex items-center gap-1.5"><Phone size={12} style={{ color }} /> {data.personalInfo.phone}</span>
          <span className="flex items-center gap-1.5"><MapPin size={12} style={{ color }} /> {data.personalInfo.address}</span>
          {data.personalInfo.portfolio && <span className="flex items-center gap-1.5"><Globe size={12} style={{ color }} /> {data.personalInfo.portfolio}</span>}
        </div>
      </div>

      {/* Summary */}
      {data.summary && (
        <div className="pt-2">
          <SectionHeading title="Objective Summary" theme={theme} icon={<Users size={14} />} />
          <p className={`${size.body} text-justify text-gray-600 leading-relaxed`}>{data.summary}</p>
        </div>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <div className="space-y-4">
          <SectionHeading title="Professional Experience" theme={theme} icon={<Briefcase size={14} />} />
          {data.experience.map((exp) => (
            <div key={exp.id} className="space-y-1">
              <div className="flex justify-between items-baseline">
                <span className={`${size.title} font-bold text-gray-900`}>{exp.role}</span>
                <DateRange start={exp.startDate} end={exp.endDate} current={exp.current} />
              </div>
              <div className="flex justify-between items-center text-xs text-gray-500 font-semibold italic">
                <span>{exp.company}</span>
                {exp.location && <span>{exp.location}</span>}
              </div>
              <ul className="list-disc pl-5 mt-1 space-y-0.5">
                {exp.responsibilities.split('\n').map((line, idx) => line.trim() && (
                  <li key={idx} className={`${size.body} text-gray-600 text-justify`}>{line.replace(/^•\s*/, '')}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <div className="space-y-3">
          <SectionHeading title="Education History" theme={theme} icon={<GraduationCap size={14} />} />
          {data.education.map((edu) => (
            <div key={edu.id} className="space-y-0.5">
              <div className="flex justify-between items-baseline font-bold">
                <span className={size.title}>{edu.degree}</span>
                <span className="text-xs font-normal text-gray-500">{edu.startYear} – {edu.endYear}</span>
              </div>
              <div className="text-xs text-gray-500">{edu.school} {edu.city ? `| ${edu.city}` : ''} {edu.cgpaOrPercentage ? `| GPA: ${edu.cgpaOrPercentage}` : ''}</div>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <div>
          <SectionHeading title="Skills Profile" theme={theme} icon={<Cpu size={14} />} />
          <div className={`${size.body} flex flex-wrap gap-2 pt-1`}>
            {data.skills.map((skill) => (
              <span 
                key={skill.id} 
                className="px-2.5 py-1 text-xs font-medium border border-gray-200 text-gray-700 bg-gray-50"
                style={{ borderRadius: getRadiusClass(theme.borderRadius) }}
              >
                {skill.name} {theme.showSocialIcons && <StarRating rating={skill.rating} color={color} />}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {data.projects.length > 0 && (
        <div className="space-y-3">
          <SectionHeading title="Projects" theme={theme} icon={<Folder size={14} />} />
          {data.projects.map((p) => (
            <div key={p.id} className="space-y-1">
              <div className="flex justify-between items-baseline font-bold">
                <span className={size.title}>{p.name}</span>
                {p.githubLink && <span className="text-[10px] font-mono select-all text-gray-400">{p.githubLink}</span>}
              </div>
              <p className={`${size.body} text-gray-600 text-justify`}>{p.description}</p>
              {p.technologies.length > 0 && (
                <p className={`${size.sub} text-gray-400`}><strong>Technologies:</strong> {p.technologies.join(', ')}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Certifications */}
      {data.certifications.length > 0 && (
        <div className="space-y-2">
          <SectionHeading title="Certifications" theme={theme} icon={<Award size={14} />} />
          <ul className="list-disc pl-5 space-y-0.5">
            {data.certifications.map((c) => (
              <li key={c.id} className={`${size.body} text-gray-700`}>
                <strong>{c.name}</strong> – {c.issuer} ({c.date})
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Internships */}
      {data.internships.length > 0 && (
        <div className="space-y-3">
          <SectionHeading title="Internships" theme={theme} icon={<Briefcase size={14} />} />
          {data.internships.map((intern) => (
            <div key={intern.id} className="space-y-0.5">
              <div className="flex justify-between items-baseline font-bold">
                <span className={size.title}>{intern.role} at {intern.company}</span>
                <span className="text-xs font-normal text-gray-500">{intern.duration}</span>
              </div>
              <p className={`${size.body} text-gray-600 text-justify`}>{intern.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Achievements */}
      {data.achievements.filter(a => a.trim()).length > 0 && (
        <div className="space-y-2">
          <SectionHeading title="Achievements" theme={theme} icon={<Trophy size={14} />} />
          <ul className="list-disc pl-5 space-y-0.5">
            {data.achievements.filter(a => a.trim()).map((ach, idx) => (
              <li key={idx} className={`${size.body} text-gray-700`}>{ach}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Languages */}
      {data.languages.length > 0 && (
        <div className="space-y-2">
          <SectionHeading title="Languages" theme={theme} icon={<Languages size={14} />} />
          <p className={`${size.body} text-gray-600`}>{data.languages.map(l => `${l.name} (${l.speaking})`).join(' • ')}</p>
        </div>
      )}

      {/* Interests */}
      {data.interests.filter(i => i.trim()).length > 0 && (
        <div className="space-y-2">
          <SectionHeading title="Interests" theme={theme} icon={<Heart size={14} />} />
          <p className={`${size.body} text-gray-600`}>{data.interests.filter(i => i.trim()).join(', ')}</p>
        </div>
      )}

      {/* References */}
      {data.references.length > 0 && (
        <div className="space-y-2">
          <SectionHeading title="References" theme={theme} icon={<Users size={14} />} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {data.references.map((ref) => (
              <div key={ref.id} className="space-y-0.5">
                <p className={`${size.title} font-bold text-gray-900`}>{ref.name}</p>
                <p className={`${size.sub} text-gray-500`}>{ref.role}{ref.company ? `, ${ref.company}` : ''}</p>
                {ref.phone && <p className={`${size.sub} text-gray-400`}>{ref.phone}</p>}
                {ref.email && <p className={`${size.sub} text-gray-400`}>{ref.email}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ----------------------------------------------------
// 4. EXECUTIVE TEMPLATE (Navy/Centered refined)
// ----------------------------------------------------
export const Executive: React.FC<TemplateProps> = ({ data, theme }) => {
  const fontClass = getFontClass(theme.fontFamily);
  const size = getFontSizeClasses(theme.fontSize);
  const paddingClass = getMarginClass(theme.margins);
  const color = theme.accentColor;

  return (
    <div className={`w-full bg-[#fcfcfc] text-[#2d3748] text-left ${fontClass} ${paddingClass} max-w-4xl mx-auto`} id="resume-document">
      {/* Header Info centered */}
      <div className="text-center space-y-2 border-b-4 border-double pb-6" style={{ borderBottomColor: color }}>
        <h1 className="text-3xl font-serif font-extrabold uppercase tracking-widest text-[#1a202c]">{data.personalInfo.fullName}</h1>
        <p className="text-sm font-serif italic text-gray-500 tracking-wider" style={{ color }}>{data.personalInfo.professionalTitle}</p>
        <div className="text-xs text-gray-600 flex flex-wrap justify-center gap-x-3 gap-y-1 mt-3 max-w-2xl mx-auto">
          <span>{data.personalInfo.email}</span> • 
          <span>{data.personalInfo.phone}</span> • 
          <span>{data.personalInfo.address}</span>
          {data.personalInfo.linkedin && <span> • {data.personalInfo.linkedin}</span>}
          {data.personalInfo.github && <span> • {data.personalInfo.github}</span>}
        </div>
      </div>

      {/* Summary */}
      {data.summary && (
        <div className="pt-2">
          <SectionHeading title="Executive Summary" theme={theme} icon={<Users size={14} />} />
          <p className={`${size.body} font-serif leading-relaxed text-justify italic px-4 border-l-2`} style={{ borderLeftColor: color }}>
            {data.summary}
          </p>
        </div>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <div className="space-y-4">
          <SectionHeading title="Career History" theme={theme} icon={<Briefcase size={14} />} />
          {data.experience.map((exp) => (
            <div key={exp.id} className="space-y-1">
              <div className="flex justify-between items-baseline font-serif">
                <span className={`${size.title} font-bold text-gray-900`}>{exp.role}</span>
                <DateRange start={exp.startDate} end={exp.endDate} current={exp.current} />
              </div>
              <div className="flex justify-between items-baseline text-xs font-serif text-gray-500 italic">
                <span>{exp.company}</span>
                {exp.location && <span>{exp.location}</span>}
              </div>
              <ul className="list-disc pl-5 mt-1 space-y-0.5 font-serif">
                {exp.responsibilities.split('\n').map((line, idx) => line.trim() && (
                  <li key={idx} className={`${size.body} text-justify`}>{line.replace(/^•\s*/, '')}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <div className="space-y-3">
          <SectionHeading title="Academic Credentials" theme={theme} icon={<GraduationCap size={14} />} />
          {data.education.map((edu) => (
            <div key={edu.id} className="font-serif">
              <div className="flex justify-between items-baseline font-bold">
                <span className={size.title}>{edu.degree}</span>
                <span className="text-xs font-normal text-gray-500">{edu.startYear} – {edu.endYear}</span>
              </div>
              <p className={`${size.body}`}>{edu.school} {edu.city ? `, ${edu.city}` : ''} {edu.cgpaOrPercentage ? `| GPA: ${edu.cgpaOrPercentage}` : ''}</p>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <div>
          <SectionHeading title="Areas of Expertise" theme={theme} icon={<Cpu size={14} />} />
          <div className={`${size.body} grid grid-cols-2 md:grid-cols-3 gap-2 font-serif`}>
            {data.skills.map((skill) => (
              <div key={skill.id} className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
                <span>{skill.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {data.projects.length > 0 && (
        <div className="space-y-3">
          <SectionHeading title="Notable Projects" theme={theme} icon={<Folder size={14} />} />
          {data.projects.map((p) => (
            <div key={p.id} className="space-y-0.5 font-serif">
              <div className="flex justify-between items-baseline font-bold">
                <span className={size.title}>{p.name}</span>
                {p.githubLink && <span className="text-[10px] font-mono select-all text-gray-400">{p.githubLink}</span>}
              </div>
              <p className={`${size.body} text-gray-600 text-justify`}>{p.description}</p>
              {p.technologies.length > 0 && (
                <p className={`${size.sub} text-gray-400`}><strong>Technologies:</strong> {p.technologies.join(', ')}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Certifications */}
      {data.certifications.length > 0 && (
        <div className="space-y-2">
          <SectionHeading title="Certifications & Credentials" theme={theme} icon={<Award size={14} />} />
          <ul className="list-disc pl-5 space-y-0.5 font-serif">
            {data.certifications.map((c) => (
              <li key={c.id} className={`${size.body} text-gray-700`}>
                <strong>{c.name}</strong> – {c.issuer} ({c.date})
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Internships */}
      {data.internships.length > 0 && (
        <div className="space-y-3">
          <SectionHeading title="Internship Experience" theme={theme} icon={<Briefcase size={14} />} />
          {data.internships.map((intern) => (
            <div key={intern.id} className="space-y-0.5 font-serif">
              <div className="flex justify-between items-baseline font-bold">
                <span className={size.title}>{intern.role} at {intern.company}</span>
                <span className="text-xs font-normal text-gray-500">{intern.duration}</span>
              </div>
              <p className={`${size.body} text-gray-600 text-justify`}>{intern.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Achievements */}
      {data.achievements.filter(a => a.trim()).length > 0 && (
        <div className="space-y-2">
          <SectionHeading title="Key Achievements" theme={theme} icon={<Trophy size={14} />} />
          <ul className="list-disc pl-5 space-y-0.5 font-serif">
            {data.achievements.filter(a => a.trim()).map((ach, idx) => (
              <li key={idx} className={`${size.body} text-gray-700 text-justify`}>{ach}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Languages */}
      {data.languages.length > 0 && (
        <div className="space-y-1">
          <SectionHeading title="Languages" theme={theme} icon={<Languages size={14} />} />
          <p className={`${size.body} font-serif`}>{data.languages.map(l => `${l.name} (${l.speaking})`).join(' • ')}</p>
        </div>
      )}

      {/* Interests */}
      {data.interests.filter(i => i.trim()).length > 0 && (
        <div className="space-y-1">
          <SectionHeading title="Personal Interests" theme={theme} icon={<Heart size={14} />} />
          <p className={`${size.body} font-serif`}>{data.interests.filter(i => i.trim()).join(', ')}</p>
        </div>
      )}

      {/* References */}
      {data.references.length > 0 && (
        <div className="space-y-2">
          <SectionHeading title="Professional References" theme={theme} icon={<Users size={14} />} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {data.references.map((ref) => (
              <div key={ref.id} className="space-y-0.5 font-serif">
                <p className={`${size.title} font-bold text-gray-900`}>{ref.name}</p>
                <p className={`${size.sub} text-gray-500 italic`}>{ref.role}{ref.company ? `, ${ref.company}` : ''}</p>
                {ref.phone && <p className={`${size.sub} text-gray-500`}>{ref.phone}</p>}
                {ref.email && <p className={`${size.sub} text-gray-500`}>{ref.email}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ----------------------------------------------------
// 5. MODERN MINIMAL TEMPLATE (Sleek layout)
// ----------------------------------------------------
export const ModernMinimal: React.FC<TemplateProps> = ({ data, theme }) => {
  const fontClass = getFontClass(theme.fontFamily);
  const size = getFontSizeClasses(theme.fontSize);
  const paddingClass = getMarginClass(theme.margins);
  const color = theme.accentColor;

  return (
    <div className={`w-full bg-white text-gray-900 text-left ${fontClass} ${paddingClass} max-w-4xl mx-auto`} id="resume-document">
      {/* Simple Clean Header */}
      <div className="flex flex-col md:flex-row justify-between items-start border-b border-gray-100 pb-5">
        <div>
          <h1 className={`${size.name} tracking-tight font-extrabold text-gray-900`}>{data.personalInfo.fullName}</h1>
          <p className="text-sm font-semibold tracking-wider uppercase mt-0.5" style={{ color }}>{data.personalInfo.professionalTitle}</p>
        </div>
        <div className="mt-3 md:mt-0 flex flex-col items-start gap-1 text-xs text-gray-500 font-medium">
          <span className="flex items-center gap-2"><Mail size={12} /> {data.personalInfo.email}</span>
          <span className="flex items-center gap-2"><Phone size={12} /> {data.personalInfo.phone}</span>
          <span className="flex items-center gap-2"><MapPin size={12} /> {data.personalInfo.address}</span>
        </div>
      </div>

      {/* Summary */}
      {data.summary && (
        <div className="space-y-1 mt-4">
          <SectionHeading title="Summary" theme={theme} icon={<Users size={14} />} />
          <p className={`${size.body} text-gray-600 text-justify font-light`}>{data.summary}</p>
        </div>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <div className="space-y-4 mt-4">
          <SectionHeading title="Experience" theme={theme} icon={<Briefcase size={14} />} />
          {data.experience.map((exp) => (
            <div key={exp.id} className="space-y-1">
              <div className="flex justify-between items-baseline font-bold">
                <span className={size.title}>{exp.role} <span className="font-light text-gray-400">/</span> {exp.company}</span>
                <DateRange start={exp.startDate} end={exp.endDate} current={exp.current} />
              </div>
              <ul className="space-y-1 mt-1.5 pl-3 border-l border-gray-200">
                {exp.responsibilities.split('\n').map((line, idx) => line.trim() && (
                  <li key={idx} className={`${size.body} text-gray-600 text-justify relative pl-3`}>
                    <span className="absolute left-0 top-2 w-1.5 h-1.5 bg-gray-300 rounded-full" />
                    {line.replace(/^•\s*/, '')}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <div className="space-y-3 mt-4">
          <SectionHeading title="Education" theme={theme} icon={<GraduationCap size={14} />} />
          {data.education.map((edu) => (
            <div key={edu.id} className="space-y-0.5">
              <div className="flex justify-between items-baseline font-bold">
                <span className={size.title}>{edu.degree}</span>
                <span className="text-xs font-normal text-gray-400">{edu.startYear} – {edu.endYear}</span>
              </div>
              <div className="text-xs text-gray-500 font-medium">{edu.school} {edu.city ? `| ${edu.city}` : ''} {edu.cgpaOrPercentage ? `| GPA: ${edu.cgpaOrPercentage}` : ''}</div>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <div className="mt-4">
          <SectionHeading title="Skills" theme={theme} icon={<Cpu size={14} />} />
          <div className="flex flex-wrap gap-1.5 pt-1">
            {data.skills.map((skill) => (
              <span 
                key={skill.id} 
                className="px-2.5 py-1 text-[11px] font-medium bg-gray-50 border border-gray-200 text-gray-600 hover:border-gray-300"
                style={{ borderRadius: getRadiusClass(theme.borderRadius) }}
              >
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {data.projects.length > 0 && (
        <div className="space-y-3 mt-4">
          <SectionHeading title="Projects" theme={theme} icon={<Folder size={14} />} />
          {data.projects.map((p) => (
            <div key={p.id} className="space-y-0.5">
              <div className="flex justify-between items-baseline font-bold">
                <span className={size.title}>{p.name}</span>
                {p.githubLink && <span className="text-[10px] font-mono text-gray-400 select-all">{p.githubLink}</span>}
              </div>
              <p className={`${size.body} text-gray-600 text-justify`}>{p.description}</p>
              {p.technologies.length > 0 && (
                <p className={`${size.sub} text-gray-400`}><strong>Tech:</strong> {p.technologies.join(', ')}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Certifications */}
      {data.certifications.length > 0 && (
        <div className="space-y-2 mt-4">
          <SectionHeading title="Certifications" theme={theme} icon={<Award size={14} />} />
          <ul className="space-y-1">
            {data.certifications.map((c) => (
              <li key={c.id} className={`${size.body} text-gray-700`}>
                <strong>{c.name}</strong> — {c.issuer} {c.date && `(${c.date})`}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Internships */}
      {data.internships.length > 0 && (
        <div className="space-y-3 mt-4">
          <SectionHeading title="Internships" theme={theme} icon={<Briefcase size={14} />} />
          {data.internships.map((intern) => (
            <div key={intern.id} className="space-y-0.5">
              <div className="flex justify-between items-baseline font-bold">
                <span className={size.title}>{intern.role} at {intern.company}</span>
                <span className={`${size.sub} text-gray-400`}>{intern.duration}</span>
              </div>
              <p className={`${size.body} text-gray-600 text-justify`}>{intern.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Achievements */}
      {data.achievements.length > 0 && (
        <div className="space-y-2 mt-4">
          <SectionHeading title="Achievements" theme={theme} icon={<Trophy size={14} />} />
          <ul className="list-disc pl-5 space-y-0.5">
            {data.achievements.filter(a => a.trim()).map((ach, idx) => (
              <li key={idx} className={`${size.body} text-gray-700`}>{ach}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Languages */}
      {data.languages.length > 0 && (
        <div className="space-y-2 mt-4">
          <SectionHeading title="Languages" theme={theme} icon={<Languages size={14} />} />
          <div className="flex flex-wrap gap-2">
            {data.languages.map((lang) => (
              <span key={lang.id} className={`${size.sub} px-2.5 py-1 bg-gray-50 border border-gray-100 text-gray-600`}
                style={{ borderRadius: getRadiusClass(theme.borderRadius) }}>
                <strong>{lang.name}</strong> · {lang.speaking}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Interests */}
      {data.interests.filter(i => i.trim()).length > 0 && (
        <div className="mt-4">
          <SectionHeading title="Interests" theme={theme} icon={<Heart size={14} />} />
          <p className={`${size.body} text-gray-600 pt-1`}>{data.interests.filter(i => i.trim()).join(' · ')}</p>
        </div>
      )}

      {/* References */}
      {data.references.length > 0 && (
        <div className="space-y-3 mt-4">
          <SectionHeading title="References" theme={theme} icon={<Users size={14} />} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {data.references.map((ref) => (
              <div key={ref.id} className="space-y-0.5 border border-gray-100 p-3 rounded-lg">
                <p className={`${size.title} font-bold text-gray-900`}>{ref.name}</p>
                <p className={`${size.sub} text-gray-500`}>{ref.role}{ref.company ? `, ${ref.company}` : ''}</p>
                {ref.phone && <p className={`${size.sub} text-gray-400`}>📱 {ref.phone}</p>}
                {ref.email && <p className={`${size.sub} text-gray-400`}>✉️ {ref.email}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ----------------------------------------------------
// 6. ELEGANT TEMPLATE (Ivory Luxury serif style)
// ----------------------------------------------------
export const Elegant: React.FC<TemplateProps> = ({ data, theme }) => {
  const fontClass = getFontClass(theme.fontFamily);
  const size = getFontSizeClasses(theme.fontSize);
  const paddingClass = getMarginClass(theme.margins);
  const color = theme.accentColor;

  return (
    <div className={`w-full bg-[#fbfbfa] text-gray-800 text-left ${fontClass} ${paddingClass} max-w-4xl mx-auto border-t-4`} style={{ borderTopColor: color }} id="resume-document">
      {/* Warm layout Header */}
      <div className="text-center space-y-2 border-b border-yellow-800/10 pb-5">
        <h1 className={`${size.name} font-serif tracking-wide italic font-bold`}>{data.personalInfo.fullName}</h1>
        <p className="text-xs font-serif uppercase tracking-widest text-amber-900">{data.personalInfo.professionalTitle}</p>
        <div className="text-[11px] font-serif text-gray-500 flex flex-wrap justify-center gap-x-4 gap-y-1">
          <span>{data.personalInfo.email}</span>
          <span>{data.personalInfo.phone}</span>
          <span>{data.personalInfo.address}</span>
        </div>
      </div>

      {/* Summary */}
      {data.summary && (
        <div className="space-y-1 mt-4">
          <SectionHeading title="About Me" theme={{ ...theme, headingStyle: 'default' }} icon={<Users size={14} />} />
          <p className={`${size.body} font-serif text-justify leading-relaxed italic text-gray-600`}>
            {data.summary}
          </p>
        </div>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <div className="space-y-4 mt-4">
          <SectionHeading title="Professional Path" theme={{ ...theme, headingStyle: 'default' }} icon={<Briefcase size={14} />} />
          {data.experience.map((exp) => (
            <div key={exp.id} className="space-y-1 font-serif">
              <div className="flex justify-between items-baseline font-bold italic">
                <span className={size.title}>{exp.role} at {exp.company}</span>
                <DateRange start={exp.startDate} end={exp.endDate} current={exp.current} />
              </div>
              {exp.location && <p className={`${size.sub} text-gray-400 italic`}>{exp.location}</p>}
              <ul className="list-disc pl-5 mt-1.5 space-y-1">
                {exp.responsibilities.split('\n').map((line, idx) => line.trim() && (
                  <li key={idx} className={`${size.body} text-gray-600 text-justify`}>{line.replace(/^•\s*/, '')}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <div className="space-y-3 mt-4">
          <SectionHeading title="Education History" theme={{ ...theme, headingStyle: 'default' }} icon={<GraduationCap size={14} />} />
          {data.education.map((edu) => (
            <div key={edu.id} className="font-serif">
              <div className="flex justify-between items-baseline font-bold italic">
                <span className={size.title}>{edu.degree}</span>
                <span className="text-xs font-normal text-gray-400">{edu.startYear} – {edu.endYear}</span>
              </div>
              <p className={`${size.body} text-gray-500`}>{edu.school} {edu.city ? `| ${edu.city}` : ''} {edu.cgpaOrPercentage ? `| GPA: ${edu.cgpaOrPercentage}` : ''}</p>
              {edu.description && <p className={`${size.sub} text-gray-500 italic`}>{edu.description}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <div className="space-y-2 mt-4 font-serif">
          <SectionHeading title="Skills Profile" theme={{ ...theme, headingStyle: 'default' }} icon={<Cpu size={14} />} />
          <p className={`${size.body} text-gray-600`}>{data.skills.map(s => s.name).join(' • ')}</p>
        </div>
      )}

      {/* Projects */}
      {data.projects.length > 0 && (
        <div className="space-y-3 mt-4">
          <SectionHeading title="Projects" theme={{ ...theme, headingStyle: 'default' }} icon={<Folder size={14} />} />
          {data.projects.map((p) => (
            <div key={p.id} className="space-y-0.5 font-serif">
              <div className="flex justify-between items-baseline font-bold italic">
                <span className={size.title}>{p.name}</span>
                {p.githubLink && <span className="text-[10px] font-mono text-gray-400">{p.githubLink}</span>}
              </div>
              <p className={`${size.body} text-gray-600 text-justify`}>{p.description}</p>
              {p.technologies.length > 0 && (
                <p className={`${size.sub} text-gray-400`}><strong>Technologies:</strong> {p.technologies.join(', ')}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Certifications */}
      {data.certifications.length > 0 && (
        <div className="space-y-2 mt-4">
          <SectionHeading title="Certifications" theme={{ ...theme, headingStyle: 'default' }} icon={<Award size={14} />} />
          <ul className="list-disc pl-5 space-y-0.5 font-serif">
            {data.certifications.map((c) => (
              <li key={c.id} className={`${size.body} text-gray-600`}>
                <strong>{c.name}</strong> – {c.issuer} ({c.date})
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Internships */}
      {data.internships.length > 0 && (
        <div className="space-y-3 mt-4">
          <SectionHeading title="Internships" theme={{ ...theme, headingStyle: 'default' }} icon={<Briefcase size={14} />} />
          {data.internships.map((intern) => (
            <div key={intern.id} className="space-y-0.5 font-serif">
              <div className="flex justify-between items-baseline font-bold italic">
                <span className={size.title}>{intern.role} at {intern.company}</span>
                <span className="text-xs font-normal text-gray-400">{intern.duration}</span>
              </div>
              <p className={`${size.body} text-gray-600 text-justify`}>{intern.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Achievements */}
      {data.achievements.filter(a => a.trim()).length > 0 && (
        <div className="space-y-2 mt-4">
          <SectionHeading title="Achievements" theme={{ ...theme, headingStyle: 'default' }} icon={<Trophy size={14} />} />
          <ul className="list-disc pl-5 space-y-0.5 font-serif">
            {data.achievements.filter(a => a.trim()).map((ach, idx) => (
              <li key={idx} className={`${size.body} text-gray-600 text-justify`}>{ach}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Languages */}
      {data.languages.length > 0 && (
        <div className="space-y-1 mt-4">
          <SectionHeading title="Languages" theme={{ ...theme, headingStyle: 'default' }} icon={<Languages size={14} />} />
          <p className={`${size.body} font-serif`}>{data.languages.map(l => `${l.name} (${l.speaking})`).join(' • ')}</p>
        </div>
      )}

      {/* Interests */}
      {data.interests.filter(i => i.trim()).length > 0 && (
        <div className="space-y-1 mt-4">
          <SectionHeading title="Interests" theme={{ ...theme, headingStyle: 'default' }} icon={<Heart size={14} />} />
          <p className={`${size.body} font-serif`}>{data.interests.filter(i => i.trim()).join(', ')}</p>
        </div>
      )}

      {/* References */}
      {data.references.length > 0 && (
        <div className="space-y-2 mt-4">
          <SectionHeading title="References" theme={{ ...theme, headingStyle: 'default' }} icon={<Users size={14} />} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {data.references.map((ref) => (
              <div key={ref.id} className="space-y-0.5 font-serif">
                <p className={`${size.title} font-bold text-gray-900`}>{ref.name}</p>
                <p className={`${size.sub} text-gray-500 italic`}>{ref.role}{ref.company ? `, ${ref.company}` : ''}</p>
                {ref.phone && <p className={`${size.sub} text-gray-500`}>{ref.phone}</p>}
                {ref.email && <p className={`${size.sub} text-gray-500`}>{ref.email}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ----------------------------------------------------
// 7. CREATIVE TEMPLATE (Accented Banner & photo tags)
// ----------------------------------------------------
export const Creative: React.FC<TemplateProps> = ({ data, theme }) => {
  const fontClass = getFontClass(theme.fontFamily);
  const size = getFontSizeClasses(theme.fontSize);
  const paddingClass = getMarginClass(theme.margins);
  const color = theme.accentColor;

  return (
    <div className={`w-full bg-white text-gray-800 text-left ${fontClass} max-w-4xl mx-auto overflow-hidden`} style={{ borderRadius: getRadiusClass(theme.borderRadius) }} id="resume-document">
      {/* Colorful Header Banner */}
      <div className="p-6 md:p-8 text-white flex flex-col md:flex-row justify-between items-center gap-6" style={{ backgroundColor: color }}>
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight uppercase">{data.personalInfo.fullName}</h1>
          <p className="text-sm font-semibold tracking-wider opacity-90">{data.personalInfo.professionalTitle}</p>
        </div>
        <div className="flex flex-col md:items-end text-xs space-y-1 opacity-90">
          <span>{data.personalInfo.email}</span>
          <span>{data.personalInfo.phone}</span>
          <span>{data.personalInfo.address}</span>
        </div>
      </div>

      <div className={paddingClass}>
        {/* Summary */}
        {data.summary && (
          <div className="space-y-1">
            <SectionHeading title="The Story" theme={theme} icon={<Users size={14} />} />
            <p className={`${size.body} text-justify text-gray-600`}>{data.summary}</p>
          </div>
        )}

        {/* Experience */}
        {data.experience.length > 0 && (
          <div className="space-y-4">
            <SectionHeading title="Work Chronicles" theme={theme} icon={<Briefcase size={14} />} />
            {data.experience.map((exp) => (
              <div key={exp.id} className="relative pl-4 border-l-2" style={{ borderLeftColor: `${color}40` }}>
                <span className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                <div className="flex justify-between items-baseline font-bold text-gray-900">
                  <span className={size.title}>{exp.role} <span className="text-gray-400 font-normal">at</span> {exp.company}</span>
                  <DateRange start={exp.startDate} end={exp.endDate} current={exp.current} />
                </div>
                <ul className="list-disc pl-5 mt-1 space-y-0.5 text-gray-600">
                  {exp.responsibilities.split('\n').map((line, idx) => line.trim() && (
                    <li key={idx} className={`${size.body}`}>{line.replace(/^•\s*/, '')}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* Skills */}
        {data.skills.length > 0 && (
          <div>
            <SectionHeading title="Superpowers" theme={theme} icon={<Cpu size={14} />} />
            <div className="flex flex-wrap gap-2 pt-1">
              {data.skills.map((skill) => (
                <span 
                  key={skill.id} 
                  className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white" 
                  style={{ backgroundColor: color, borderRadius: getRadiusClass(theme.borderRadius) }}
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {data.education.length > 0 && (
          <div className="space-y-3 mt-4">
            <SectionHeading title="Education" theme={theme} icon={<GraduationCap size={14} />} />
            {data.education.map((edu) => (
              <div key={edu.id} className="space-y-1">
                <div className="flex justify-between items-baseline font-bold text-gray-900">
                  <span className={size.title}>{edu.degree}</span>
                  <span className="text-xs font-normal text-gray-500">{edu.startYear} – {edu.endYear}</span>
                </div>
                <p className={`${size.body} text-gray-600`}>{edu.school} {edu.city ? `, ${edu.city}` : ''} {edu.cgpaOrPercentage ? `| GPA: ${edu.cgpaOrPercentage}` : ''}</p>
                {edu.description && <p className={`${size.sub} text-gray-550 italic`}>{edu.description}</p>}
              </div>
            ))}
          </div>
        )}

        {/* Projects */}
        {data.projects.length > 0 && (
          <div className="space-y-3 mt-4">
            <SectionHeading title="Projects" theme={theme} icon={<Folder size={14} />} />
            {data.projects.map((p) => (
              <div key={p.id} className="space-y-1">
                <div className="flex justify-between items-baseline font-bold text-gray-900">
                  <span className={size.title}>{p.name}</span>
                  {p.githubLink && <span className="text-[10px] font-mono text-gray-400 select-all">{p.githubLink}</span>}
                </div>
                <p className={`${size.body} text-gray-650 text-justify`}>{p.description}</p>
                {p.technologies.length > 0 && (
                  <p className={`${size.sub} text-gray-400`}><strong>Technologies:</strong> {p.technologies.join(', ')}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Certifications */}
        {data.certifications.length > 0 && (
          <div className="space-y-2 mt-4">
            <SectionHeading title="Certifications" theme={theme} icon={<Award size={14} />} />
            <ul className="list-disc pl-5 space-y-0.5">
              {data.certifications.map((c) => (
                <li key={c.id} className={`${size.body} text-gray-600`}>
                  <strong>{c.name}</strong> – {c.issuer} ({c.date})
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Internships */}
        {data.internships.length > 0 && (
          <div className="space-y-3 mt-4">
            <SectionHeading title="Internships" theme={theme} icon={<Briefcase size={14} />} />
            {data.internships.map((intern) => (
              <div key={intern.id} className="space-y-1">
                <div className="flex justify-between items-baseline font-bold">
                  <span className={size.title}>{intern.role} at {intern.company}</span>
                  <span className="text-xs font-normal text-gray-500">{intern.duration}</span>
                </div>
                <p className={`${size.body} text-gray-650 text-justify`}>{intern.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* Achievements */}
        {data.achievements.filter(a => a.trim()).length > 0 && (
          <div className="space-y-2 mt-4">
            <SectionHeading title="Achievements" theme={theme} icon={<Trophy size={14} />} />
            <ul className="list-disc pl-5 space-y-0.5 text-gray-650">
              {data.achievements.filter(a => a.trim()).map((ach, idx) => (
                <li key={idx} className={`${size.body}`}>{ach}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Languages */}
        {data.languages.length > 0 && (
          <div className="space-y-2 mt-4">
            <SectionHeading title="Languages" theme={theme} icon={<Languages size={14} />} />
            <p className={`${size.body} text-gray-650`}>{data.languages.map(l => `${l.name} (${l.speaking})`).join(' • ')}</p>
          </div>
        )}

        {/* Interests */}
        {data.interests.filter(i => i.trim()).length > 0 && (
          <div className="space-y-2 mt-4">
            <SectionHeading title="Interests" theme={theme} icon={<Heart size={14} />} />
            <p className={`${size.body} text-gray-650`}>{data.interests.filter(i => i.trim()).join(', ')}</p>
          </div>
        )}

        {/* References */}
        {data.references.length > 0 && (
          <div className="space-y-3 mt-4">
            <SectionHeading title="References" theme={theme} icon={<Users size={14} />} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {data.references.map((ref) => (
                <div key={ref.id} className="space-y-0.5">
                  <p className={`${size.title} font-bold text-gray-900`}>{ref.name}</p>
                  <p className={`${size.sub} text-gray-500 italic`}>{ref.role}{ref.company ? `, ${ref.company}` : ''}</p>
                  {ref.phone && <p className={`${size.sub} text-gray-550`}>{ref.phone}</p>}
                  {ref.email && <p className={`${size.sub} text-gray-550`}>{ref.email}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ----------------------------------------------------
// 8. DARK PROFESSIONAL TEMPLATE (Slate/glow style)
// ----------------------------------------------------
export const DarkProfessional: React.FC<TemplateProps> = ({ data, theme }) => {
  const fontClass = getFontClass(theme.fontFamily);
  const size = getFontSizeClasses(theme.fontSize);
  const paddingClass = getMarginClass(theme.margins);
  const color = theme.accentColor;

  return (
    <div className={`w-full bg-[#111827] text-gray-200 text-left ${fontClass} ${paddingClass} max-w-4xl mx-auto`} id="resume-document">
      {/* Profile info */}
      <div className="flex flex-col md:flex-row justify-between items-start border-b border-gray-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-wide">{data.personalInfo.fullName}</h1>
          <p className="text-sm font-semibold tracking-widest uppercase mt-1" style={{ color }}>{data.personalInfo.professionalTitle}</p>
        </div>
        <div className="mt-4 md:mt-0 flex flex-col gap-1.5 text-xs text-gray-400 font-mono">
          <span>📧 {data.personalInfo.email}</span>
          <span>📱 {data.personalInfo.phone}</span>
          <span>📍 {data.personalInfo.address}</span>
        </div>
      </div>

      {/* Summary */}
      {data.summary && (
        <div className="space-y-1">
          <SectionHeading title="About" theme={theme} icon={<Users size={14} />} />
          <p className={`${size.body} text-justify text-gray-300 leading-relaxed font-light`}>{data.summary}</p>
        </div>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <div className="space-y-4">
          <SectionHeading title="Experience History" theme={theme} icon={<Briefcase size={14} />} />
          {data.experience.map((exp) => (
            <div key={exp.id} className="space-y-1 bg-[#1f2937] p-4 rounded-lg border border-gray-800">
              <div className="flex justify-between items-baseline font-bold">
                <span className={`${size.title} text-white`}>{exp.role} <span className="text-gray-400 font-normal">at</span> {exp.company}</span>
                <DateRange start={exp.startDate} end={exp.endDate} current={exp.current} style={{ color: '#9ca3af' }} />
              </div>
              <ul className="list-disc pl-5 mt-2 space-y-1.5 text-gray-300">
                {exp.responsibilities.split('\n').map((line, idx) => line.trim() && (
                  <li key={idx} className={`${size.body} text-justify`}>{line.replace(/^•\s*/, '')}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <div>
          <SectionHeading title="Hard & Soft Skills" theme={theme} icon={<Cpu size={14} />} />
          <div className="flex flex-wrap gap-2 pt-1">
            {data.skills.map((skill) => (
              <span 
                key={skill.id} 
                className="px-2.5 py-1 text-xs bg-[#1f2937] border border-gray-800 text-gray-300 rounded font-mono"
              >
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <div className="space-y-3 mt-4">
          <SectionHeading title="Education" theme={theme} icon={<GraduationCap size={14} />} />
          {data.education.map((edu) => (
            <div key={edu.id} className="space-y-1 bg-[#1f2937] p-4 rounded-lg border border-gray-800">
              <div className="flex justify-between items-baseline font-bold">
                <span className={`${size.title} text-white`}>{edu.degree}</span>
                <span className="text-xs text-gray-400">{edu.startYear} – {edu.endYear}</span>
              </div>
              <p className={`${size.body} text-gray-300`}>{edu.school} {edu.city ? `, ${edu.city}` : ''} {edu.cgpaOrPercentage ? `| GPA: ${edu.cgpaOrPercentage}` : ''}</p>
              {edu.description && <p className={`${size.sub} text-gray-400 italic`}>{edu.description}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {data.projects.length > 0 && (
        <div className="space-y-3 mt-4">
          <SectionHeading title="Projects" theme={theme} icon={<Folder size={14} />} />
          {data.projects.map((p) => (
            <div key={p.id} className="space-y-1 bg-[#1f2937] p-4 rounded-lg border border-gray-800">
              <div className="flex justify-between items-baseline font-bold">
                <span className={`${size.title} text-white`}>{p.name}</span>
                {p.githubLink && <span className="text-[10px] font-mono text-gray-400 select-all">{p.githubLink}</span>}
              </div>
              <p className={`${size.body} text-gray-300 text-justify`}>{p.description}</p>
              {p.technologies.length > 0 && (
                <p className={`${size.sub} text-gray-400`}><strong>Technologies:</strong> {p.technologies.join(', ')}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Certifications */}
      {data.certifications.length > 0 && (
        <div className="space-y-2 mt-4">
          <SectionHeading title="Certifications" theme={theme} icon={<Award size={14} />} />
          <ul className="list-disc pl-5 space-y-1 text-gray-300">
            {data.certifications.map((c) => (
              <li key={c.id} className={`${size.body} text-gray-300`}>
                <strong>{c.name}</strong> – {c.issuer} ({c.date})
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Internships */}
      {data.internships.length > 0 && (
        <div className="space-y-3 mt-4">
          <SectionHeading title="Internships" theme={theme} icon={<Briefcase size={14} />} />
          {data.internships.map((intern) => (
            <div key={intern.id} className="space-y-1 bg-[#1f2937] p-4 rounded-lg border border-gray-800">
              <div className="flex justify-between items-baseline font-bold">
                <span className={`${size.title} text-white`}>{intern.role} at {intern.company}</span>
                <span className="text-xs text-gray-400">{intern.duration}</span>
              </div>
              <p className={`${size.body} text-gray-300 text-justify`}>{intern.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Achievements */}
      {data.achievements.filter(a => a.trim()).length > 0 && (
        <div className="space-y-2 mt-4">
          <SectionHeading title="Achievements" theme={theme} icon={<Trophy size={14} />} />
          <ul className="list-disc pl-5 space-y-1 text-gray-300">
            {data.achievements.filter(a => a.trim()).map((ach, idx) => (
              <li key={idx} className={`${size.body}`}>{ach}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Languages */}
      {data.languages.length > 0 && (
        <div className="space-y-2 mt-4">
          <SectionHeading title="Languages" theme={theme} icon={<Languages size={14} />} />
          <p className={`${size.body} text-gray-300`}>{data.languages.map(l => `${l.name} (${l.speaking})`).join(' • ')}</p>
        </div>
      )}

      {/* Interests */}
      {data.interests.filter(i => i.trim()).length > 0 && (
        <div className="space-y-2 mt-4">
          <SectionHeading title="Interests" theme={theme} icon={<Heart size={14} />} />
          <p className={`${size.body} text-gray-300`}>{data.interests.filter(i => i.trim()).join(', ')}</p>
        </div>
      )}

      {/* References */}
      {data.references.length > 0 && (
        <div className="space-y-3 mt-4">
          <SectionHeading title="References" theme={theme} icon={<Users size={14} />} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {data.references.map((ref) => (
              <div key={ref.id} className="space-y-1 bg-[#1f2937] p-4 rounded-lg border border-gray-800">
                <p className={`${size.title} font-bold text-white`}>{ref.name}</p>
                <p className={`${size.sub} text-gray-400 italic`}>{ref.role}{ref.company ? `, ${ref.company}` : ''}</p>
                {ref.phone && <p className={`${size.sub} text-gray-400`}>{ref.phone}</p>}
                {ref.email && <p className={`${size.sub} text-gray-400`}>{ref.email}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ----------------------------------------------------
// 9. SIDEBAR RESUME TEMPLATE (2-column layout)
// ----------------------------------------------------
export const SidebarResume: React.FC<TemplateProps> = ({ data, theme }) => {
  const fontClass = getFontClass(theme.fontFamily);
  const size = getFontSizeClasses(theme.fontSize);
  const color = theme.accentColor;

  return (
    <div className={`w-full bg-white text-gray-800 text-left ${fontClass} flex flex-col md:flex-row max-w-4xl mx-auto border`} id="resume-document">
      
      {/* LEFT COLUMN: Sidebar (Colored background, 1/3 width) */}
      <div className="w-full md:w-1/3 p-6 md:p-8 space-y-6 text-white" style={{ backgroundColor: color }}>
        {/* Photo optionally */}
        {theme.showPhoto && data.personalInfo.photo && (
          <div className="flex justify-center mb-4">
            <img 
              src={data.personalInfo.photo} 
              alt="Avatar" 
              className="w-24 h-24 object-cover border-2 border-white shadow-md"
              style={{ borderRadius: getRadiusClass(theme.borderRadius) }}
            />
          </div>
        )}

        {/* Title/Name */}
        <div className="text-center md:text-left space-y-1">
          <h2 className="text-xl font-bold uppercase tracking-tight">{data.personalInfo.fullName}</h2>
          <p className="text-xs opacity-90 font-medium tracking-wide uppercase">{data.personalInfo.professionalTitle}</p>
        </div>

        {/* Contact Info */}
        <div className="space-y-2 text-xs opacity-95">
          <div className="font-bold border-b border-white/20 pb-1 uppercase tracking-wider">Contact</div>
          <p className="flex items-center gap-2"><Mail size={12} /> {data.personalInfo.email}</p>
          <p className="flex items-center gap-2"><Phone size={12} /> {data.personalInfo.phone}</p>
          <p className="flex items-center gap-2"><MapPin size={12} /> {data.personalInfo.address}</p>
          {data.personalInfo.linkedin && <p className="flex items-center gap-2"><Globe size={12} /> {data.personalInfo.linkedin}</p>}
        </div>

        {/* Skills */}
        {data.skills.length > 0 && (
          <div className="space-y-2 text-xs">
            <div className="font-bold border-b border-white/20 pb-1 uppercase tracking-wider">Skills</div>
            <div className="flex flex-wrap gap-1 pt-1">
              {data.skills.map((skill) => (
                <span 
                  key={skill.id} 
                  className="px-2 py-0.5 bg-white/10 hover:bg-white/20 text-[10px] uppercase font-bold rounded"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {data.languages.length > 0 && (
          <div className="space-y-2 text-xs">
            <div className="font-bold border-b border-white/20 pb-1 uppercase tracking-wider">Languages</div>
            <p className="opacity-95">{data.languages.map(l => `${l.name} (${l.speaking})`).join(' • ')}</p>
          </div>
        )}

        {/* Interests */}
        {data.interests.filter(i => i.trim()).length > 0 && (
          <div className="space-y-2 text-xs">
            <div className="font-bold border-b border-white/20 pb-1 uppercase tracking-wider">Interests</div>
            <p className="opacity-95">{data.interests.filter(i => i.trim()).join(', ')}</p>
          </div>
        )}
      </div>

      {/* RIGHT COLUMN: Core Content (White, 2/3 width) */}
      <div className="w-full md:w-2/3 p-6 md:p-8 space-y-6">
        {/* Summary */}
        {data.summary && (
          <div className="space-y-1">
            <SectionHeading title="About Me" theme={theme} icon={<Users size={14} />} />
            <p className={`${size.body} text-justify text-gray-600 font-light`}>{data.summary}</p>
          </div>
        )}

        {/* Experience */}
        {data.experience.length > 0 && (
          <div className="space-y-4">
            <SectionHeading title="Experience" theme={theme} icon={<Briefcase size={14} />} />
            {data.experience.map((exp) => (
              <div key={exp.id} className="space-y-0.5">
                <div className="flex justify-between items-baseline font-bold text-gray-900">
                  <span className={size.title}>{exp.role}</span>
                  <DateRange start={exp.startDate} end={exp.endDate} current={exp.current} />
                </div>
                <div className="text-xs text-gray-500 font-medium italic">{exp.company} {exp.location ? `| ${exp.location}` : ''}</div>
                <ul className="list-disc pl-5 mt-1.5 space-y-0.5 text-gray-600">
                  {exp.responsibilities.split('\n').map((line, idx) => line.trim() && (
                    <li key={idx} className={`${size.body} text-justify`}>{line.replace(/^•\s*/, '')}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {data.education.length > 0 && (
          <div className="space-y-3">
            <SectionHeading title="Education" theme={theme} icon={<GraduationCap size={14} />} />
            {data.education.map((edu) => (
              <div key={edu.id} className="space-y-0.5">
                <div className="flex justify-between items-baseline font-bold text-gray-950">
                  <span className={size.title}>{edu.degree}</span>
                  <span className="text-xs font-normal text-gray-500">{edu.startYear} – {edu.endYear}</span>
                </div>
                <div className="text-xs text-gray-500">{edu.school} {edu.cgpaOrPercentage ? `| GPA: ${edu.cgpaOrPercentage}` : ''}</div>
              </div>
            ))}
          </div>
        )}

        {/* Projects */}
        {data.projects.length > 0 && (
          <div className="space-y-3">
            <SectionHeading title="Projects" theme={theme} icon={<Folder size={14} />} />
            {data.projects.map((p) => (
              <div key={p.id} className="space-y-0.5">
                <div className="flex justify-between items-baseline font-bold text-gray-950">
                  <span className={size.title}>{p.name}</span>
                  {p.githubLink && <span className="text-[10px] font-mono text-gray-400 select-all">{p.githubLink}</span>}
                </div>
                <p className={`${size.body} text-gray-600 text-justify`}>{p.description}</p>
                {p.technologies.length > 0 && (
                  <p className={`${size.sub} text-gray-400`}><strong>Technologies:</strong> {p.technologies.join(', ')}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Certifications */}
        {data.certifications.length > 0 && (
          <div className="space-y-2">
            <SectionHeading title="Certifications" theme={theme} icon={<Award size={14} />} />
            <ul className="list-disc pl-5 space-y-0.5 text-gray-600">
              {data.certifications.map((c) => (
                <li key={c.id} className={`${size.body}`}>
                  <strong>{c.name}</strong> – {c.issuer} ({c.date})
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Internships */}
        {data.internships.length > 0 && (
          <div className="space-y-3">
            <SectionHeading title="Internships" theme={theme} icon={<Briefcase size={14} />} />
            {data.internships.map((intern) => (
              <div key={intern.id} className="space-y-0.5">
                <div className="flex justify-between items-baseline font-bold">
                  <span className={size.title}>{intern.role} at {intern.company}</span>
                  <span className="text-xs font-normal text-gray-500">{intern.duration}</span>
                </div>
                <p className={`${size.body} text-gray-600 text-justify`}>{intern.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* Achievements */}
        {data.achievements.filter(a => a.trim()).length > 0 && (
          <div className="space-y-2">
            <SectionHeading title="Achievements" theme={theme} icon={<Trophy size={14} />} />
            <ul className="list-disc pl-5 space-y-0.5 text-gray-650">
              {data.achievements.filter(a => a.trim()).map((ach, idx) => (
                <li key={idx} className={`${size.body}`}>{ach}</li>
              ))}
            </ul>
          </div>
        )}

        {/* References */}
        {data.references.length > 0 && (
          <div className="space-y-2">
            <SectionHeading title="References" theme={theme} icon={<Users size={14} />} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {data.references.map((ref) => (
                <div key={ref.id} className="space-y-0.5 font-serif">
                  <p className={`${size.title} font-bold text-gray-900`}>{ref.name}</p>
                  <p className={`${size.sub} text-gray-500 italic`}>{ref.role}{ref.company ? `, ${ref.company}` : ''}</p>
                  {ref.phone && <p className={`${size.sub} text-gray-500`}>{ref.phone}</p>}
                  {ref.email && <p className={`${size.sub} text-gray-500`}>{ref.email}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

// ----------------------------------------------------
// 10. CORPORATE BLUE TEMPLATE (Navy/Divided clean)
// ----------------------------------------------------
export const CorporateBlue: React.FC<TemplateProps> = ({ data, theme }) => {
  const fontClass = getFontClass(theme.fontFamily);
  const size = getFontSizeClasses(theme.fontSize);
  const paddingClass = getMarginClass(theme.margins);
  const color = '#1e3a8a'; // Bold Corporate Navy Blue

  return (
    <div className={`w-full bg-white text-gray-800 text-left ${fontClass} ${paddingClass} max-w-4xl mx-auto`} id="resume-document">
      {/* Centered Profile info */}
      <div className="text-center space-y-1">
        <h1 className="text-3xl font-extrabold uppercase tracking-tight text-[#1e3a8a]">{data.personalInfo.fullName}</h1>
        <p className="text-sm font-semibold tracking-wider text-gray-600 uppercase">{data.personalInfo.professionalTitle}</p>
        <div className="text-xs text-gray-500 flex flex-wrap justify-center gap-x-3 mt-2">
          <span>📧 {data.personalInfo.email}</span> | 
          <span>📱 {data.personalInfo.phone}</span> | 
          <span>📍 {data.personalInfo.address}</span>
        </div>
      </div>

      <div className="h-1 w-full bg-[#1e3a8a] my-4" />

      {/* Summary */}
      {data.summary && (
        <div className="space-y-1">
          <SectionHeading title="Summary" theme={{ ...theme, accentColor: color }} icon={<Users size={14} />} />
          <p className={`${size.body} text-justify text-gray-600 leading-relaxed`}>{data.summary}</p>
        </div>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <div className="space-y-4">
          <SectionHeading title="Work Experience" theme={{ ...theme, accentColor: color }} icon={<Briefcase size={14} />} />
          {data.experience.map((exp) => (
            <div key={exp.id} className="space-y-0.5">
              <div className="flex justify-between items-baseline font-bold text-[#1e3a8a]">
                <span className={size.title}>{exp.role}</span>
                <DateRange start={exp.startDate} end={exp.endDate} current={exp.current} />
              </div>
              <div className="text-xs text-gray-500 font-semibold italic">{exp.company} {exp.location ? `| ${exp.location}` : ''}</div>
              <ul className="list-disc pl-5 mt-1.5 space-y-0.5 text-gray-600">
                {exp.responsibilities.split('\n').map((line, idx) => line.trim() && (
                  <li key={idx} className={`${size.body} text-justify`}>{line.replace(/^•\s*/, '')}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <div className="space-y-3">
          <SectionHeading title="Education" theme={{ ...theme, accentColor: color }} icon={<GraduationCap size={14} />} />
          {data.education.map((edu) => (
            <div key={edu.id} className="space-y-0.5">
              <div className="flex justify-between items-baseline font-bold">
                <span className={size.title}>{edu.degree}</span>
                <span className="text-xs font-normal text-gray-500">{edu.startYear} – {edu.endYear}</span>
              </div>
              <div className="text-xs text-gray-500">{edu.school} {edu.cgpaOrPercentage ? `| GPA: ${edu.cgpaOrPercentage}` : ''}</div>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <div className="space-y-2">
          <SectionHeading title="Skills Profile" theme={{ ...theme, accentColor: color }} icon={<Cpu size={14} />} />
          <div className={`${size.body} flex flex-wrap gap-2 pt-1`}>
            {data.skills.map((skill) => (
              <span key={skill.id} className="px-2.5 py-1 text-xs border border-gray-200 text-gray-700 bg-gray-50">
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {data.projects.length > 0 && (
        <div className="space-y-3">
          <SectionHeading title="Projects" theme={{ ...theme, accentColor: color }} icon={<Folder size={14} />} />
          {data.projects.map((p) => (
            <div key={p.id} className="space-y-0.5">
              <div className="flex justify-between items-baseline font-bold text-[#1e3a8a]">
                <span className={size.title}>{p.name}</span>
                {p.githubLink && <span className="text-[10px] font-mono text-gray-400 select-all">{p.githubLink}</span>}
              </div>
              <p className={`${size.body} text-gray-600 text-justify`}>{p.description}</p>
              {p.technologies.length > 0 && (
                <p className={`${size.sub} text-gray-400`}><strong>Technologies:</strong> {p.technologies.join(', ')}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Certifications */}
      {data.certifications.length > 0 && (
        <div className="space-y-2">
          <SectionHeading title="Certifications" theme={{ ...theme, accentColor: color }} icon={<Award size={14} />} />
          <ul className="list-disc pl-5 space-y-0.5 text-gray-650">
            {data.certifications.map((c) => (
              <li key={c.id} className={`${size.body}`}>
                <strong>{c.name}</strong> – {c.issuer} ({c.date})
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Internships */}
      {data.internships.length > 0 && (
        <div className="space-y-3">
          <SectionHeading title="Internships" theme={{ ...theme, accentColor: color }} icon={<Briefcase size={14} />} />
          {data.internships.map((intern) => (
            <div key={intern.id} className="space-y-0.5">
              <div className="flex justify-between items-baseline font-bold">
                <span className={size.title}>{intern.role} at {intern.company}</span>
                <span className="text-xs font-normal text-gray-500">{intern.duration}</span>
              </div>
              <p className={`${size.body} text-gray-600 text-justify`}>{intern.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Achievements */}
      {data.achievements.filter(a => a.trim()).length > 0 && (
        <div className="space-y-2">
          <SectionHeading title="Achievements" theme={{ ...theme, accentColor: color }} icon={<Trophy size={14} />} />
          <ul className="list-disc pl-5 space-y-0.5 text-gray-650">
            {data.achievements.filter(a => a.trim()).map((ach, idx) => (
              <li key={idx} className={`${size.body}`}>{ach}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Languages */}
      {data.languages.length > 0 && (
        <div className="space-y-2">
          <SectionHeading title="Languages" theme={{ ...theme, accentColor: color }} icon={<Languages size={14} />} />
          <p className={`${size.body} text-gray-600`}>{data.languages.map(l => `${l.name} (${l.speaking})`).join(' • ')}</p>
        </div>
      )}

      {/* Interests */}
      {data.interests.filter(i => i.trim()).length > 0 && (
        <div className="space-y-2">
          <SectionHeading title="Interests" theme={{ ...theme, accentColor: color }} icon={<Heart size={14} />} />
          <p className={`${size.body} text-gray-600`}>{data.interests.filter(i => i.trim()).join(', ')}</p>
        </div>
      )}

      {/* References */}
      {data.references.length > 0 && (
        <div className="space-y-2">
          <SectionHeading title="References" theme={{ ...theme, accentColor: color }} icon={<Users size={14} />} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {data.references.map((ref) => (
              <div key={ref.id} className="space-y-0.5">
                <p className={`${size.title} font-bold text-gray-900`}>{ref.name}</p>
                <p className={`${size.sub} text-gray-500 italic`}>{ref.role}{ref.company ? `, ${ref.company}` : ''}</p>
                {ref.phone && <p className={`${size.sub} text-gray-500`}>{ref.phone}</p>}
                {ref.email && <p className={`${size.sub} text-gray-500`}>{ref.email}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ----------------------------------------------------
// 11. TWO COLUMN TEMPLATE (1/3 Left, 2/3 Right)
// ----------------------------------------------------
export const TwoColumn: React.FC<TemplateProps> = ({ data, theme }) => {
  const fontClass = getFontClass(theme.fontFamily);
  const size = getFontSizeClasses(theme.fontSize);
  const paddingClass = getMarginClass(theme.margins);
  const color = theme.accentColor;

  return (
    <div className={`w-full bg-white text-gray-800 text-left ${fontClass} ${paddingClass} max-w-4xl mx-auto flex flex-col md:flex-row gap-8`} id="resume-document">
      
      {/* LEFT COLUMN: Static Info (1/3 width) */}
      <div className="w-full md:w-1/3 space-y-6 border-r pr-4 border-gray-100">
        <div>
          <h1 className={`${size.name} leading-tight text-gray-900`}>{data.personalInfo.fullName}</h1>
          <p className="text-xs font-bold uppercase tracking-wider mt-1" style={{ color }}>{data.personalInfo.professionalTitle}</p>
        </div>

        <div className="space-y-2 text-xs text-gray-600">
          <p className="font-bold uppercase tracking-wider text-gray-900 border-b pb-1">Contact Info</p>
          <p className="flex items-center gap-2"><Mail size={12} /> {data.personalInfo.email}</p>
          <p className="flex items-center gap-2"><Phone size={12} /> {data.personalInfo.phone}</p>
          <p className="flex items-center gap-2"><MapPin size={12} /> {data.personalInfo.address}</p>
        </div>

        {data.skills.length > 0 && (
          <div className="space-y-2">
            <p className="font-bold uppercase tracking-wider text-gray-900 border-b pb-1 text-xs">Skills Profile</p>
            <div className="flex flex-wrap gap-1.5">
              {data.skills.map((skill) => (
                <span 
                  key={skill.id} 
                  className="px-2 py-1 bg-gray-50 border text-[10px] font-semibold text-gray-600"
                  style={{ borderRadius: getRadiusClass(theme.borderRadius) }}
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {data.languages.length > 0 && (
          <div className="space-y-2">
            <p className="font-bold uppercase tracking-wider text-gray-900 border-b pb-1 text-xs">Languages</p>
            <p className="text-xs text-gray-600">{data.languages.map(l => `${l.name} (${l.speaking})`).join(' • ')}</p>
          </div>
        )}

        {data.interests.filter(i => i.trim()).length > 0 && (
          <div className="space-y-2">
            <p className="font-bold uppercase tracking-wider text-gray-900 border-b pb-1 text-xs">Interests</p>
            <p className="text-xs text-gray-600">{data.interests.filter(i => i.trim()).join(', ')}</p>
          </div>
        )}
      </div>

      {/* RIGHT COLUMN: Timeline (2/3 width) */}
      <div className="w-full md:w-2/3 space-y-6">
        {data.summary && (
          <div className="space-y-1">
            <SectionHeading title="Career Summary" theme={theme} icon={<Users size={14} />} />
            <p className={`${size.body} text-justify text-gray-600`}>{data.summary}</p>
          </div>
        )}

        {data.experience.length > 0 && (
          <div className="space-y-4">
            <SectionHeading title="Work History" theme={theme} icon={<Briefcase size={14} />} />
            {data.experience.map((exp) => (
              <div key={exp.id} className="space-y-1">
                <div className="flex justify-between items-baseline font-bold text-gray-900">
                  <span className={size.title}>{exp.role}</span>
                  <DateRange start={exp.startDate} end={exp.endDate} current={exp.current} />
                </div>
                <div className="text-xs text-gray-500 font-medium italic">{exp.company}{exp.location ? ` | ${exp.location}` : ''}</div>
                <ul className="list-disc pl-5 space-y-0.5 text-gray-600">
                  {exp.responsibilities.split('\n').map((line, idx) => line.trim() && (
                    <li key={idx} className={`${size.body} text-justify`}>{line.replace(/^•\s*/, '')}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {data.education.length > 0 && (
          <div className="space-y-3">
            <SectionHeading title="Education" theme={theme} icon={<GraduationCap size={14} />} />
            {data.education.map((edu) => (
              <div key={edu.id} className="space-y-0.5">
                <div className="flex justify-between items-baseline font-bold">
                  <span className={size.title}>{edu.degree}</span>
                  <span className="text-xs font-normal text-gray-400">{edu.startYear} – {edu.endYear}</span>
                </div>
                <div className="text-xs text-gray-500">{edu.school} {edu.cgpaOrPercentage ? `| GPA: ${edu.cgpaOrPercentage}` : ''}</div>
              </div>
            ))}
          </div>
        )}

        {/* Projects */}
        {data.projects.length > 0 && (
          <div className="space-y-3">
            <SectionHeading title="Projects" theme={theme} icon={<Folder size={14} />} />
            {data.projects.map((p) => (
              <div key={p.id} className="space-y-0.5">
                <div className="flex justify-between items-baseline font-bold text-gray-900">
                  <span className={size.title}>{p.name}</span>
                  {p.githubLink && <span className="text-[10px] font-mono text-gray-400 select-all">{p.githubLink}</span>}
                </div>
                <p className={`${size.body} text-gray-650 text-justify`}>{p.description}</p>
                {p.technologies.length > 0 && (
                  <p className={`${size.sub} text-gray-400`}><strong>Technologies:</strong> {p.technologies.join(', ')}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Certifications */}
        {data.certifications.length > 0 && (
          <div className="space-y-2">
            <SectionHeading title="Certifications" theme={theme} icon={<Award size={14} />} />
            <ul className="list-disc pl-5 space-y-0.5 text-gray-650 font-light">
              {data.certifications.map((c) => (
                <li key={c.id} className={`${size.body}`}>
                  <strong>{c.name}</strong> – {c.issuer} ({c.date})
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Internships */}
        {data.internships.length > 0 && (
          <div className="space-y-3">
            <SectionHeading title="Internships" theme={theme} icon={<Briefcase size={14} />} />
            {data.internships.map((intern) => (
              <div key={intern.id} className="space-y-0.5">
                <div className="flex justify-between items-baseline font-bold">
                  <span className={size.title}>{intern.role} at {intern.company}</span>
                  <span className="text-xs font-normal text-gray-500">{intern.duration}</span>
                </div>
                <p className={`${size.body} text-gray-655 text-justify`}>{intern.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* Achievements */}
        {data.achievements.filter(a => a.trim()).length > 0 && (
          <div className="space-y-2">
            <SectionHeading title="Achievements" theme={theme} icon={<Trophy size={14} />} />
            <ul className="list-disc pl-5 space-y-0.5 text-gray-650">
              {data.achievements.filter(a => a.trim()).map((ach, idx) => (
                <li key={idx} className={`${size.body}`}>{ach}</li>
              ))}
            </ul>
          </div>
        )}

        {/* References */}
        {data.references.length > 0 && (
          <div className="space-y-2">
            <SectionHeading title="References" theme={theme} icon={<Users size={14} />} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {data.references.map((ref) => (
                <div key={ref.id} className="space-y-0.5">
                  <p className={`${size.title} font-bold text-gray-900`}>{ref.name}</p>
                  <p className={`${size.sub} text-gray-500 italic`}>{ref.role}{ref.company ? `, ${ref.company}` : ''}</p>
                  {ref.phone && <p className={`${size.sub} text-gray-550`}>{ref.phone}</p>}
                  {ref.email && <p className={`${size.sub} text-gray-550`}>{ref.email}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

// ----------------------------------------------------
// 12. FRESHER RESUME TEMPLATE (Highlight Education/Projects first)
// ----------------------------------------------------
export const Fresher: React.FC<TemplateProps> = ({ data, theme }) => {
  const fontClass = getFontClass(theme.fontFamily);
  const size = getFontSizeClasses(theme.fontSize);
  const paddingClass = getMarginClass(theme.margins);
  const color = theme.accentColor;

  return (
    <div className={`w-full bg-white text-gray-800 text-left ${fontClass} ${paddingClass} max-w-4xl mx-auto`} id="resume-document">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-4 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold uppercase tracking-tight text-gray-900">{data.personalInfo.fullName || 'Candidate Name'}</h1>
          <p className="text-sm font-semibold tracking-widest uppercase mt-0.5" style={{ color }}>{data.personalInfo.professionalTitle || 'Graduate / Entry Level'}</p>
        </div>
        <div className="text-xs text-gray-600 space-y-1">
          <p>📧 {data.personalInfo.email}</p>
          <p>📱 {data.personalInfo.phone}</p>
          <p>📍 {data.personalInfo.address}</p>
        </div>
      </div>

      {/* Summary */}
      {data.summary && (
        <div className="pt-2">
          <SectionHeading title="Career Objective" theme={theme} icon={<Users size={14} />} />
          <p className={`${size.body} text-justify text-gray-600`}>{data.summary}</p>
        </div>
      )}

      {/* Education (Placed First for Freshers!) */}
      {data.education.length > 0 && (
        <div className="space-y-3">
          <SectionHeading title="Education History" theme={theme} icon={<GraduationCap size={14} />} />
          {data.education.map((edu) => (
            <div key={edu.id} className="space-y-1">
              <div className="flex justify-between items-baseline font-bold text-gray-900">
                <span className={size.title}>{edu.degree}</span>
                <span className="text-xs font-normal text-gray-500">{edu.startYear} – {edu.endYear}</span>
              </div>
              <p className={`${size.body} text-gray-600 font-semibold`}>{edu.school} {edu.city ? `, ${edu.city}` : ''}</p>
              {edu.cgpaOrPercentage && <p className={`${size.sub} text-gray-500 font-medium`}>Cumulative Grade: {edu.cgpaOrPercentage}</p>}
              {edu.description && <p className={`${size.sub} text-gray-500 italic`}>{edu.description}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Projects (Placed Second to validate technical capabilities) */}
      {data.projects.length > 0 && (
        <div className="space-y-3">
          <SectionHeading title="Technical Projects" theme={theme} icon={<Folder size={14} />} />
          {data.projects.map((p) => (
            <div key={p.id} className="space-y-1">
              <div className="flex justify-between items-baseline font-bold text-gray-900">
                <span className={size.title}>{p.name}</span>
                {p.githubLink && <span className="text-[10px] font-mono select-all text-blue-600">{p.githubLink}</span>}
              </div>
              <p className={`${size.body} text-gray-600 text-justify`}>{p.description}</p>
              <p className={`${size.sub} text-gray-500`}><strong>Technologies:</strong> {p.technologies.join(', ')}</p>
            </div>
          ))}
        </div>
      )}

      {/* Experience (Placed near bottom) */}
      {data.experience.length > 0 && (
        <div className="space-y-4">
          <SectionHeading title="Experience & Internships" theme={theme} icon={<Briefcase size={14} />} />
          {data.experience.map((exp) => (
            <div key={exp.id} className="space-y-0.5">
              <div className="flex justify-between items-baseline font-bold text-gray-900">
                <span className={size.title}>{exp.role} at {exp.company}</span>
                <DateRange start={exp.startDate} end={exp.endDate} current={exp.current} />
              </div>
              <ul className="list-disc pl-5 mt-1.5 space-y-0.5 text-gray-600">
                {exp.responsibilities.split('\n').map((line, idx) => line.trim() && (
                  <li key={idx} className={`${size.body} text-justify`}>{line.replace(/^•\s*/, '')}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <div className="mt-4">
          <SectionHeading title="Skills" theme={theme} icon={<Cpu size={14} />} />
          <div className="flex flex-wrap gap-1.5 pt-1">
            {data.skills.map((skill) => (
              <span key={skill.id} className="px-2.5 py-1 text-[11px] font-medium bg-gray-50 border border-gray-200 text-gray-600">
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {data.certifications.length > 0 && (
        <div className="space-y-2 mt-4">
          <SectionHeading title="Certifications" theme={theme} icon={<Award size={14} />} />
          <ul className="list-disc pl-5 space-y-0.5">
            {data.certifications.map((c) => (
              <li key={c.id} className={`${size.body} text-gray-600`}>
                <strong>{c.name}</strong> – {c.issuer} ({c.date})
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Internships */}
      {data.internships.length > 0 && (
        <div className="space-y-3 mt-4">
          <SectionHeading title="Internships" theme={theme} icon={<Briefcase size={14} />} />
          {data.internships.map((intern) => (
            <div key={intern.id} className="space-y-1">
              <div className="flex justify-between items-baseline font-bold text-gray-900">
                <span className={size.title}>{intern.role} at {intern.company}</span>
                <span className="text-xs font-normal text-gray-500">{intern.duration}</span>
              </div>
              <p className={`${size.body} text-gray-600 text-justify`}>{intern.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Achievements */}
      {data.achievements.filter(a => a.trim()).length > 0 && (
        <div className="space-y-2 mt-4">
          <SectionHeading title="Achievements" theme={theme} icon={<Trophy size={14} />} />
          <ul className="list-disc pl-5 space-y-0.5">
            {data.achievements.filter(a => a.trim()).map((ach, idx) => (
              <li key={idx} className={`${size.body} text-gray-600`}>{ach}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Languages */}
      {data.languages.length > 0 && (
        <div className="space-y-2 mt-4">
          <SectionHeading title="Languages" theme={theme} icon={<Languages size={14} />} />
          <p className={`${size.body} text-gray-600`}>{data.languages.map(l => `${l.name} (${l.speaking})`).join(' • ')}</p>
        </div>
      )}

      {/* Interests */}
      {data.interests.filter(i => i.trim()).length > 0 && (
        <div className="space-y-2 mt-4">
          <SectionHeading title="Interests" theme={theme} icon={<Heart size={14} />} />
          <p className={`${size.body} text-gray-600`}>{data.interests.filter(i => i.trim()).join(', ')}</p>
        </div>
      )}

      {/* References */}
      {data.references.length > 0 && (
        <div className="space-y-2 mt-4">
          <SectionHeading title="References" theme={theme} icon={<Users size={14} />} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {data.references.map((ref) => (
              <div key={ref.id} className="space-y-0.5">
                <p className={`${size.title} font-bold text-gray-900`}>{ref.name}</p>
                <p className={`${size.sub} text-gray-500 italic`}>{ref.role}{ref.company ? `, ${ref.company}` : ''}</p>
                {ref.phone && <p className={`${size.sub} text-gray-550`}>{ref.phone}</p>}
                {ref.email && <p className={`${size.sub} text-gray-550`}>{ref.email}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Map of Template IDs to their render components
export const TEMPLATE_MAP: Record<string, React.FC<TemplateProps>> = {
  'harvard-ats': HarvardATS,
  'google-style': GoogleStyle,
  'microsoft-professional': MicrosoftProfessional,
  'executive': Executive,
  'modern-minimal': ModernMinimal,
  'elegant': Elegant,
  'creative': Creative,
  'dark-professional': DarkProfessional,
  'sidebar-resume': SidebarResume,
  'corporate-blue': CorporateBlue,
  'two-column': TwoColumn,
  'fresher-style': Fresher
};

// Metadata describing each template for lists/dropdowns
export const TEMPLATES_LIST = [
  { id: 'modern-minimal', name: 'Modern Minimal', description: 'Clean layout, light divider lines, modern look.' },
  { id: 'harvard-ats', name: 'Harvard ATS', description: 'Plain black & white, standard serif, highly ATS compliant.' },
  { id: 'google-style', name: 'Google Style', description: 'Blue headers, sans-serif fonts, clean structure.' },
  { id: 'microsoft-professional', name: 'Microsoft Professional', description: 'Top blue accent stripe, standard corporate design.' },
  { id: 'executive', name: 'Executive', description: 'Serif fonts, double underlines, formal and elegant.' },
  { id: 'elegant', name: 'Elegant Ivory', description: 'Warm page color, Playfair serif, italic headings.' },
  { id: 'creative', name: 'Creative Banner', description: 'Solid accent-colored header banner, highly engaging.' },
  { id: 'dark-professional', name: 'Dark Professional', description: 'Charcoal gray background, glowing accents for digital files.' },
  { id: 'sidebar-resume', name: 'Sidebar Layout', description: 'Accent-colored left column for personal info, right column for content.' },
  { id: 'corporate-blue', name: 'Corporate Blue', description: 'Navy accents and bold styling lines, highly structured.' },
  { id: 'two-column', name: 'Two Column', description: 'Double column white background to pack information cleanly.' },
  { id: 'fresher-style', name: 'Fresher style', description: 'Displays education and projects first to highlight student achievements.' }
];

export const TemplateRenderer: React.FC<TemplateProps & { templateId: string }> = ({ templateId, data, theme }) => {
  const Component = TEMPLATE_MAP[templateId] || ModernMinimal;
  return (
    <div id="resume-document" className="w-full bg-white text-gray-900 overflow-hidden shadow-none print:shadow-none">
      <Component data={data} theme={theme} />
    </div>
  );
};
