import React from 'react';
import { ResumeData, ThemeSettings } from '../types/resume';
import {
  Mail, Phone, MapPin, Globe, Briefcase, GraduationCap,
  Cpu, Folder, Award, Languages, Heart, Users, ExternalLink, Code
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
    case 'lg': return 'p-8 md:p-12 space-y-6';
    case 'md':
    default:
      return 'p-6 md:p-8 space-y-4';
  }
};

const getRadiusClass = (radius: ThemeSettings['borderRadius']) => {
  switch (radius) {
    case 'none': return '0px';
    case 'sm': return '2px';
    case 'lg': return '12px';
    case 'full': return '9999px';
    case 'md':
    default:
      return '6px';
  }
};

// Section Heading component
const SectionHeading: React.FC<{
  title: string;
  theme: ThemeSettings;
  icon?: React.ReactNode;
}> = ({ title, theme, icon }) => {
  const sizeClasses = getFontSizeClasses(theme.fontSize);
  const color = theme.accentColor || '#2563eb';

  switch (theme.headingStyle) {
    case 'underline':
      return (
        <div className="mb-2">
          <h3 className={`${sizeClasses.header} flex items-center gap-2`} style={{ color }}>
            {theme.showSocialIcons && icon}
            {title}
          </h3>
          <div className="h-0.5 w-full mt-1 bg-gray-200">
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

// Skill Star Rating
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

// Date Range
const DateRange: React.FC<{ start: string; end: string; current?: boolean; style?: React.CSSProperties }> = ({ start, end, current, style }) => {
  return (
    <span className="text-[10px] md:text-xs font-medium text-gray-600 whitespace-nowrap" style={style}>
      {start} – {current ? 'Present' : end}
    </span>
  );
};

// Profile Photo
const ProfilePhoto: React.FC<{
  photo?: string;
  name: string;
  theme: ThemeSettings;
  sizeClass?: string;
}> = ({ photo, name, theme, sizeClass = 'w-20 h-20 md:w-24 md:h-24' }) => {
  if (!theme.showPhoto || !photo) return null;
  return (
    <div
      className={`relative shrink-0 overflow-hidden shadow-sm border border-gray-200 ${sizeClass}`}
      style={{ borderRadius: getRadiusClass(theme.borderRadius) }}
    >
      <img
        src={photo}
        alt={name || 'Profile'}
        className="w-full h-full object-cover"
        crossOrigin="anonymous"
      />
    </div>
  );
};

// Helper for clickable Project Links (Live Demo & GitHub)
const ProjectLinks: React.FC<{ liveLink?: string; githubLink?: string; isDark?: boolean }> = ({ liveLink, githubLink, isDark = false }) => {
  if (!liveLink && !githubLink) return null;
  const linkTextColor = isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800';
  const ghTextColor = isDark ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-black';

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-mono mt-0.5">
      {liveLink && (
        <a
          href={liveLink.startsWith('http') ? liveLink : `https://${liveLink}`}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-1 font-semibold underline underline-offset-2 ${linkTextColor}`}
        >
          <ExternalLink size={11} /> Live Demo: {liveLink.replace(/^https?:\/\//, '')}
        </a>
      )}
      {githubLink && (
        <a
          href={githubLink.startsWith('http') ? githubLink : `https://${githubLink}`}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-1 font-semibold underline underline-offset-2 ${ghTextColor}`}
        >
          <Code size={11} /> GitHub: {githubLink.replace(/^https?:\/\//, '')}
        </a>
      )}
    </div>
  );
};

// Helper for References Grid
const ReferencesSection: React.FC<{ references: ResumeData['references']; theme: ThemeSettings; isDark?: boolean }> = ({ references, theme, isDark = false }) => {
  if (!references || references.length === 0) return null;
  const size = getFontSizeClasses(theme.fontSize);
  const textColor = isDark ? 'text-gray-100' : 'text-gray-900';
  const subColor = isDark ? 'text-gray-300' : 'text-gray-700';
  const metaColor = isDark ? 'text-gray-400' : 'text-gray-600';

  return (
    <div className="section-block space-y-2 mt-4">
      <SectionHeading title="References" theme={theme} icon={<Users size={14} />} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        {references.map((ref) => (
          <div key={ref.id} className="entry-block p-2.5 rounded border border-gray-200 bg-gray-50/50 space-y-0.5">
            <p className={`${size.title} font-bold ${textColor}`}>{ref.name}</p>
            <p className={`${size.sub} font-medium ${subColor}`}>
              {ref.role}{ref.company ? `, ${ref.company}` : ''}
            </p>
            {ref.phone && <p className={`${size.sub} ${metaColor}`}>Phone: {ref.phone}</p>}
            {ref.email && <p className={`${size.sub} ${metaColor}`}>Email: {ref.email}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

// Helper for Languages List with High Contrast
const LanguagesSection: React.FC<{ languages: ResumeData['languages']; theme: ThemeSettings; isDark?: boolean }> = ({ languages, theme, isDark = false }) => {
  if (!languages || languages.length === 0) return null;
  const size = getFontSizeClasses(theme.fontSize);
  const nameColor = isDark ? 'text-white font-bold' : 'text-gray-900 font-bold';
  const levelColor = isDark ? 'text-gray-200 font-semibold' : 'text-gray-800 font-semibold';

  return (
    <div className="section-block space-y-1 mt-4">
      <SectionHeading title="Languages" theme={theme} icon={<Languages size={14} />} />
      <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1">
        {languages.map((l) => (
          <span key={l.id} className={`${size.body} inline-flex items-center gap-1.5`}>
            <span className={nameColor}>{l.name}</span>
            <span className="text-gray-400">—</span>
            <span className={levelColor}>{l.speaking || 'Fluent'}</span>
          </span>
        ))}
      </div>
    </div>
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
    <div className={`w-full bg-white text-black text-left ${fontClass} ${paddingClass} max-w-4xl mx-auto overflow-visible`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div className="flex-1 text-center space-y-1">
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
        {theme.showPhoto && data.personalInfo.photo && (
          <ProfilePhoto photo={data.personalInfo.photo} name={data.personalInfo.fullName} theme={theme} />
        )}
      </div>

      {/* Summary */}
      {data.summary && (
        <div className="section-block space-y-1">
          <SectionHeading title="Professional Summary" theme={{ ...theme, accentColor: '#000000', headingStyle: 'underline' }} icon={<Users size={14} />} />
          <p className={`${size.body} font-serif leading-relaxed text-justify text-black`}>{data.summary}</p>
        </div>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <div className="section-block space-y-3">
          <SectionHeading title="Work Experience" theme={{ ...theme, accentColor: '#000000', headingStyle: 'underline' }} icon={<Briefcase size={14} />} />
          {data.experience.map((exp) => (
            <div key={exp.id} className="entry-block space-y-1">
              <div className="flex justify-between items-baseline font-bold font-serif">
                <span className={size.title}>{exp.role}, <span className="font-normal font-sans text-gray-700">{exp.company}</span></span>
                <DateRange start={exp.startDate} end={exp.endDate} current={exp.current} style={{ color: '#000000', fontFamily: 'serif' }} />
              </div>
              {exp.location && <p className={`${size.sub} text-gray-600 font-serif italic`}>{exp.location}</p>}
              <ul className="list-disc pl-5 space-y-0.5">
                {exp.responsibilities.split('\n').map((line, idx) => line.trim() && (
                  <li key={idx} className={`${size.body} font-serif text-justify text-black`}>{line.replace(/^•\s*/, '')}</li>
                ))}
                {exp.achievements && (
                  <li className={`${size.body} font-serif text-justify text-black`}><strong>Key Achievement:</strong> {exp.achievements}</li>
                )}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <div className="section-block space-y-3">
          <SectionHeading title="Education" theme={{ ...theme, accentColor: '#000000', headingStyle: 'underline' }} icon={<GraduationCap size={14} />} />
          {data.education.map((edu) => (
            <div key={edu.id} className="entry-block space-y-1">
              <div className="flex justify-between items-baseline font-serif font-bold">
                <span className={size.title}>{edu.degree}</span>
                <span className="text-xs font-normal">{edu.startYear} – {edu.endYear}</span>
              </div>
              <p className={`${size.body} font-serif text-black`}>{edu.school} {edu.city ? `, ${edu.city}` : ''} {edu.cgpaOrPercentage ? `| Grade: ${edu.cgpaOrPercentage}` : ''}</p>
              {edu.description && <p className={`${size.sub} font-serif italic text-gray-700`}>{edu.description}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <div className="section-block space-y-2">
          <SectionHeading title="Skills" theme={{ ...theme, accentColor: '#000000', headingStyle: 'underline' }} icon={<Cpu size={14} />} />
          <div className={`${size.body} font-serif space-y-1 text-black`}>
            {data.skills.filter(s => s.type === 'technical').length > 0 && (
              <p><strong>Technical:</strong> {data.skills.filter(s => s.type === 'technical').map(s => s.name).join(', ')}</p>
            )}
            {data.skills.filter(s => s.type === 'soft').length > 0 && (
              <p><strong>Professional Skills:</strong> {data.skills.filter(s => s.type === 'soft').map(s => s.name).join(', ')}</p>
            )}
          </div>
        </div>
      )}

      {/* Projects with Live Links */}
      {data.projects.length > 0 && (
        <div className="section-block space-y-3">
          <SectionHeading title="Projects" theme={{ ...theme, accentColor: '#000000', headingStyle: 'underline' }} icon={<Folder size={14} />} />
          {data.projects.map((p) => (
            <div key={p.id} className="entry-block space-y-1">
              <div className="flex justify-between items-baseline font-bold font-serif">
                <span className={size.title}>{p.name}</span>
              </div>
              <ProjectLinks liveLink={p.liveLink} githubLink={p.githubLink} />
              <p className={`${size.body} font-serif text-justify text-black`}>{p.description}</p>
              {p.technologies.length > 0 && (
                <p className={`${size.sub} font-serif text-gray-700`}>Technologies: {p.technologies.join(', ')}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Internships */}
      {data.internships && data.internships.length > 0 && (
        <div className="section-block space-y-3">
          <SectionHeading title="Internships" theme={{ ...theme, accentColor: '#000000', headingStyle: 'underline' }} icon={<Briefcase size={14} />} />
          {data.internships.map((intern) => (
            <div key={intern.id} className="entry-block space-y-1">
              <div className="flex justify-between items-baseline font-bold font-serif">
                <span className={size.title}>{intern.role} – {intern.company}</span>
                <span className="text-xs font-normal font-serif">{intern.duration}</span>
              </div>
              <p className={`${size.body} font-serif text-black`}>{intern.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Certifications */}
      {data.certifications.length > 0 && (
        <div className="section-block space-y-2">
          <SectionHeading title="Certifications" theme={{ ...theme, accentColor: '#000000', headingStyle: 'underline' }} icon={<Award size={14} />} />
          <ul className="list-disc pl-5 space-y-0.5">
            {data.certifications.map((c) => (
              <li key={c.id} className={`${size.body} font-serif text-black`}>
                <strong>{c.name}</strong> – {c.issuer} ({c.date})
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Achievements */}
      {data.achievements.filter(a => a.trim()).length > 0 && (
        <div className="section-block space-y-2">
          <SectionHeading title="Achievements & Honors" theme={{ ...theme, accentColor: '#000000', headingStyle: 'underline' }} icon={<Award size={14} />} />
          <ul className="list-disc pl-5 space-y-0.5">
            {data.achievements.filter(a => a.trim()).map((ach, idx) => (
              <li key={idx} className={`${size.body} font-serif text-black`}>{ach}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Languages */}
      <LanguagesSection languages={data.languages} theme={theme} />

      {/* References */}
      <ReferencesSection references={data.references} theme={theme} />

      {/* Interests */}
      {data.interests.filter(i => i.trim()).length > 0 && (
        <div className="section-block space-y-1 mt-4">
          <SectionHeading title="Interests" theme={{ ...theme, accentColor: '#000000', headingStyle: 'underline' }} icon={<Heart size={14} />} />
          <p className={`${size.body} font-serif text-black`}>{data.interests.filter(i => i.trim()).join(', ')}</p>
        </div>
      )}
    </div>
  );
};

// ----------------------------------------------------
// 2. GOOGLE STYLE TEMPLATE
// ----------------------------------------------------
export const GoogleStyle: React.FC<TemplateProps> = ({ data, theme }) => {
  const fontClass = getFontClass(theme.fontFamily);
  const size = getFontSizeClasses(theme.fontSize);
  const paddingClass = getMarginClass(theme.margins);
  const color = theme.accentColor || '#1a0dab';

  return (
    <div className={`w-full bg-white text-[#202124] text-left ${fontClass} ${paddingClass} max-w-4xl mx-auto overflow-visible`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div className="flex-1">
          <h1 className="text-3xl font-light tracking-tight font-sans" style={{ color }}>{data.personalInfo.fullName || 'Candidate Name'}</h1>
          <p className="text-sm font-medium text-gray-700 mt-1">{data.personalInfo.professionalTitle}</p>
          <div className="text-xs text-gray-600 mt-2 flex flex-wrap gap-x-4 gap-y-1">
            {data.personalInfo.email && <span className="flex items-center gap-1"><Mail size={10} /> {data.personalInfo.email}</span>}
            {data.personalInfo.phone && <span className="flex items-center gap-1"><Phone size={10} /> {data.personalInfo.phone}</span>}
            {data.personalInfo.address && <span className="flex items-center gap-1"><MapPin size={10} /> {data.personalInfo.address}</span>}
            {data.personalInfo.portfolio && <span className="flex items-center gap-1"><Globe size={10} /> {data.personalInfo.portfolio}</span>}
            {data.personalInfo.linkedin && <span className="flex items-center gap-1"><Globe size={10} /> {data.personalInfo.linkedin}</span>}
          </div>
        </div>
        {theme.showPhoto && data.personalInfo.photo && (
          <ProfilePhoto photo={data.personalInfo.photo} name={data.personalInfo.fullName} theme={theme} />
        )}
      </div>

      <div className="h-[1px] bg-gray-200 my-4" />

      {/* Summary */}
      {data.summary && (
        <div className="section-block space-y-1">
          <SectionHeading title="Summary" theme={{ ...theme, accentColor: color, headingStyle: 'default' }} icon={<Users size={14} />} />
          <p className={`${size.body} text-justify text-gray-800`}>{data.summary}</p>
        </div>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <div className="section-block space-y-4 mt-4">
          <SectionHeading title="Experience" theme={{ ...theme, accentColor: color, headingStyle: 'default' }} icon={<Briefcase size={14} />} />
          {data.experience.map((exp) => (
            <div key={exp.id} className="entry-block group">
              <div className="flex justify-between items-baseline font-semibold">
                <span className={size.title}>{exp.role} <span className="font-normal text-gray-600">at</span> {exp.company}</span>
                <DateRange start={exp.startDate} end={exp.endDate} current={exp.current} />
              </div>
              {exp.location && <p className={`${size.sub} text-gray-500`}>{exp.location}</p>}
              <ul className="list-disc pl-5 mt-1 space-y-0.5">
                {exp.responsibilities.split('\n').map((line, idx) => line.trim() && (
                  <li key={idx} className={`${size.body} text-gray-800 text-justify`}>{line.replace(/^•\s*/, '')}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <div className="section-block space-y-3 mt-4">
          <SectionHeading title="Education" theme={{ ...theme, accentColor: color, headingStyle: 'default' }} icon={<GraduationCap size={14} />} />
          {data.education.map((edu) => (
            <div key={edu.id} className="entry-block">
              <div className="flex justify-between items-baseline font-semibold">
                <span className={size.title}>{edu.degree}</span>
                <span className="text-xs text-gray-600">{edu.startYear} – {edu.endYear}</span>
              </div>
              <p className={`${size.body} text-gray-700`}>{edu.school} {edu.city ? `| ${edu.city}` : ''} {edu.cgpaOrPercentage ? `| GPA: ${edu.cgpaOrPercentage}` : ''}</p>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <div className="section-block space-y-2 mt-4">
          <SectionHeading title="Technical & Soft Skills" theme={{ ...theme, accentColor: color, headingStyle: 'default' }} icon={<Cpu size={14} />} />
          <div className={`${size.body} text-gray-800 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1`}>
            {data.skills.map((skill) => (
              <div key={skill.id} className="flex justify-between items-center py-0.5 border-b border-gray-100">
                <span>{skill.name}</span>
                {theme.showSocialIcons && <StarRating rating={skill.rating} color={color} />}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects with Live Links */}
      {data.projects.length > 0 && (
        <div className="section-block space-y-3 mt-4">
          <SectionHeading title="Projects" theme={{ ...theme, accentColor: color, headingStyle: 'default' }} icon={<Folder size={14} />} />
          {data.projects.map((p) => (
            <div key={p.id} className="entry-block space-y-1">
              <div className="flex justify-between items-baseline font-bold">
                <span className={size.title}>{p.name}</span>
              </div>
              <ProjectLinks liveLink={p.liveLink} githubLink={p.githubLink} />
              <p className={`${size.body} text-gray-800 text-justify`}>{p.description}</p>
              {p.technologies.length > 0 && (
                <p className={`${size.sub} text-gray-600`}><strong>Tech:</strong> {p.technologies.join(', ')}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Internships */}
      {data.internships && data.internships.length > 0 && (
        <div className="section-block space-y-3 mt-4">
          <SectionHeading title="Internships" theme={{ ...theme, accentColor: color, headingStyle: 'default' }} icon={<Briefcase size={14} />} />
          {data.internships.map((intern) => (
            <div key={intern.id} className="entry-block space-y-0.5">
              <div className="flex justify-between items-baseline font-semibold">
                <span className={size.title}>{intern.role} – {intern.company}</span>
                <span className="text-xs text-gray-600">{intern.duration}</span>
              </div>
              <p className={`${size.body} text-gray-700`}>{intern.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Certifications */}
      {data.certifications.length > 0 && (
        <div className="section-block space-y-2 mt-4">
          <SectionHeading title="Certifications" theme={{ ...theme, accentColor: color, headingStyle: 'default' }} icon={<Award size={14} />} />
          <ul className="space-y-1">
            {data.certifications.map((c) => (
              <li key={c.id} className={`${size.body} text-gray-800 flex justify-between`}>
                <span><strong>{c.name}</strong> – {c.issuer}</span>
                <span className="text-xs text-gray-500">{c.date}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Achievements */}
      {data.achievements.filter(a => a.trim()).length > 0 && (
        <div className="section-block space-y-2 mt-4">
          <SectionHeading title="Achievements" theme={{ ...theme, accentColor: color, headingStyle: 'default' }} icon={<Award size={14} />} />
          <ul className="list-disc pl-5 space-y-1">
            {data.achievements.filter(a => a.trim()).map((ach, idx) => (
              <li key={idx} className={`${size.body} text-gray-800`}>{ach}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Languages */}
      <LanguagesSection languages={data.languages} theme={theme} />

      {/* References */}
      <ReferencesSection references={data.references} theme={theme} />

      {/* Interests */}
      {data.interests.filter(i => i.trim()).length > 0 && (
        <div className="section-block space-y-1 mt-4">
          <SectionHeading title="Interests" theme={{ ...theme, accentColor: color, headingStyle: 'default' }} icon={<Heart size={14} />} />
          <p className={`${size.body} text-gray-700`}>{data.interests.filter(i => i.trim()).join(', ')}</p>
        </div>
      )}
    </div>
  );
};

// ----------------------------------------------------
// 3. MICROSOFT PROFESSIONAL TEMPLATE
// ----------------------------------------------------
export const MicrosoftProfessional: React.FC<TemplateProps> = ({ data, theme }) => {
  const fontClass = getFontClass(theme.fontFamily);
  const size = getFontSizeClasses(theme.fontSize);
  const paddingClass = getMarginClass(theme.margins);
  const color = theme.accentColor || '#0078d4';

  return (
    <div className={`w-full bg-white text-gray-800 text-left ${fontClass} ${paddingClass} max-w-4xl mx-auto border-t-8 overflow-visible`} style={{ borderTopColor: color }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-4 border-b border-gray-200">
        <div className="flex-1">
          <h1 className={`${size.name} tracking-tight font-bold text-gray-900`}>{data.personalInfo.fullName || 'Candidate Name'}</h1>
          <p className="text-base font-semibold mt-0.5" style={{ color }}>{data.personalInfo.professionalTitle}</p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-gray-600">
            {data.personalInfo.email && <span className="flex items-center gap-1"><Mail size={12} /> {data.personalInfo.email}</span>}
            {data.personalInfo.phone && <span className="flex items-center gap-1"><Phone size={12} /> {data.personalInfo.phone}</span>}
            {data.personalInfo.address && <span className="flex items-center gap-1"><MapPin size={12} /> {data.personalInfo.address}</span>}
            {data.personalInfo.linkedin && <span className="flex items-center gap-1"><Globe size={12} /> {data.personalInfo.linkedin}</span>}
          </div>
        </div>
        {theme.showPhoto && data.personalInfo.photo && (
          <ProfilePhoto photo={data.personalInfo.photo} name={data.personalInfo.fullName} theme={theme} />
        )}
      </div>

      {/* Summary */}
      {data.summary && (
        <div className="section-block space-y-1 mt-4">
          <SectionHeading title="Professional Summary" theme={{ ...theme, accentColor: color, headingStyle: 'colored-bg' }} icon={<Users size={14} />} />
          <p className={`${size.body} text-justify text-gray-800 leading-relaxed`}>{data.summary}</p>
        </div>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <div className="section-block space-y-3 mt-4">
          <SectionHeading title="Work Experience" theme={{ ...theme, accentColor: color, headingStyle: 'colored-bg' }} icon={<Briefcase size={14} />} />
          {data.experience.map((exp) => (
            <div key={exp.id} className="entry-block border-l-2 pl-3 py-1 space-y-1" style={{ borderLeftColor: color }}>
              <div className="flex justify-between items-baseline">
                <span className={`${size.title} text-gray-900`}>{exp.role}</span>
                <DateRange start={exp.startDate} end={exp.endDate} current={exp.current} />
              </div>
              <p className="text-xs font-semibold text-gray-700">{exp.company} {exp.location ? `| ${exp.location}` : ''}</p>
              <ul className="list-disc pl-5 mt-1 space-y-0.5">
                {exp.responsibilities.split('\n').map((line, idx) => line.trim() && (
                  <li key={idx} className={`${size.body} text-gray-800 text-justify`}>{line.replace(/^•\s*/, '')}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <div className="section-block space-y-3 mt-4">
          <SectionHeading title="Education" theme={{ ...theme, accentColor: color, headingStyle: 'colored-bg' }} icon={<GraduationCap size={14} />} />
          {data.education.map((edu) => (
            <div key={edu.id} className="entry-block border-l-2 pl-3 py-0.5" style={{ borderLeftColor: color }}>
              <div className="flex justify-between items-baseline font-semibold">
                <span className={size.title}>{edu.degree}</span>
                <span className="text-xs text-gray-600">{edu.startYear} – {edu.endYear}</span>
              </div>
              <p className={`${size.body} text-gray-700`}>{edu.school} {edu.city ? `| ${edu.city}` : ''} {edu.cgpaOrPercentage ? `| Grade: ${edu.cgpaOrPercentage}` : ''}</p>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <div className="section-block space-y-2 mt-4">
          <SectionHeading title="Core Competencies" theme={{ ...theme, accentColor: color, headingStyle: 'colored-bg' }} icon={<Cpu size={14} />} />
          <div className="flex flex-wrap gap-2 pt-1">
            {data.skills.map((skill) => (
              <span
                key={skill.id}
                className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-900 rounded border border-gray-200"
              >
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Projects with Live Links */}
      {data.projects.length > 0 && (
        <div className="section-block space-y-3 mt-4">
          <SectionHeading title="Key Projects" theme={{ ...theme, accentColor: color, headingStyle: 'colored-bg' }} icon={<Folder size={14} />} />
          {data.projects.map((p) => (
            <div key={p.id} className="entry-block space-y-1">
              <div className="flex justify-between items-baseline font-bold">
                <span className={size.title}>{p.name}</span>
              </div>
              <ProjectLinks liveLink={p.liveLink} githubLink={p.githubLink} />
              <p className={`${size.body} text-gray-800 text-justify`}>{p.description}</p>
              {p.technologies.length > 0 && (
                <p className={`${size.sub} text-gray-600`}><strong>Technologies:</strong> {p.technologies.join(', ')}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Internships */}
      {data.internships && data.internships.length > 0 && (
        <div className="section-block space-y-3 mt-4">
          <SectionHeading title="Internships" theme={{ ...theme, accentColor: color, headingStyle: 'colored-bg' }} icon={<Briefcase size={14} />} />
          {data.internships.map((intern) => (
            <div key={intern.id} className="entry-block border-l-2 pl-3 py-0.5" style={{ borderLeftColor: color }}>
              <div className="flex justify-between items-baseline font-semibold">
                <span className={size.title}>{intern.role} – {intern.company}</span>
                <span className="text-xs text-gray-600">{intern.duration}</span>
              </div>
              <p className={`${size.body} text-gray-700`}>{intern.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Certifications */}
      {data.certifications.length > 0 && (
        <div className="section-block space-y-2 mt-4">
          <SectionHeading title="Certifications" theme={{ ...theme, accentColor: color, headingStyle: 'colored-bg' }} icon={<Award size={14} />} />
          <ul className="space-y-1">
            {data.certifications.map((c) => (
              <li key={c.id} className={`${size.body} text-gray-800 flex justify-between`}>
                <span><strong>{c.name}</strong> – {c.issuer}</span>
                <span className="text-xs text-gray-600">{c.date}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Achievements */}
      {data.achievements.filter(a => a.trim()).length > 0 && (
        <div className="section-block space-y-2 mt-4">
          <SectionHeading title="Key Achievements" theme={{ ...theme, accentColor: color, headingStyle: 'colored-bg' }} icon={<Award size={14} />} />
          <ul className="list-disc pl-5 space-y-1">
            {data.achievements.filter(a => a.trim()).map((ach, idx) => (
              <li key={idx} className={`${size.body} text-gray-800`}>{ach}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Languages */}
      <LanguagesSection languages={data.languages} theme={theme} />

      {/* References */}
      <ReferencesSection references={data.references} theme={theme} />

      {/* Interests */}
      {data.interests.filter(i => i.trim()).length > 0 && (
        <div className="section-block space-y-1 mt-4">
          <SectionHeading title="Interests" theme={{ ...theme, accentColor: color, headingStyle: 'colored-bg' }} icon={<Heart size={14} />} />
          <p className={`${size.body} text-gray-700`}>{data.interests.filter(i => i.trim()).join(', ')}</p>
        </div>
      )}
    </div>
  );
};

// ----------------------------------------------------
// 4. EXECUTIVE TEMPLATE
// ----------------------------------------------------
export const Executive: React.FC<TemplateProps> = ({ data, theme }) => {
  const fontClass = getFontClass(theme.fontFamily);
  const size = getFontSizeClasses(theme.fontSize);
  const paddingClass = getMarginClass(theme.margins);
  const color = theme.accentColor || '#1e3a8a';

  return (
    <div className={`w-full bg-[#fcfcfc] text-[#2d3748] text-left ${fontClass} ${paddingClass} max-w-4xl mx-auto overflow-visible`}>
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pb-4 border-b-2 border-double border-gray-300">
        <div className="flex-1 text-center sm:text-left">
          <h1 className={`${size.name} font-serif tracking-widest uppercase font-bold text-gray-900`}>{data.personalInfo.fullName}</h1>
          <p className="text-sm font-serif italic text-gray-700 mt-1">{data.personalInfo.professionalTitle}</p>
          <div className="flex flex-wrap justify-center sm:justify-start gap-x-4 gap-y-1 mt-2 text-xs text-gray-600 font-serif">
            {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
            {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
            {data.personalInfo.address && <span>{data.personalInfo.address}</span>}
          </div>
        </div>
        {theme.showPhoto && data.personalInfo.photo && (
          <ProfilePhoto photo={data.personalInfo.photo} name={data.personalInfo.fullName} theme={theme} />
        )}
      </div>

      {/* Summary */}
      {data.summary && (
        <div className="section-block space-y-1 mt-4">
          <SectionHeading title="Executive Summary" theme={{ ...theme, accentColor: color, headingStyle: 'border-bottom' }} icon={<Users size={14} />} />
          <p className={`${size.body} font-serif text-justify leading-relaxed text-gray-900`}>{data.summary}</p>
        </div>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <div className="section-block space-y-4 mt-4">
          <SectionHeading title="Executive Experience" theme={{ ...theme, accentColor: color, headingStyle: 'border-bottom' }} icon={<Briefcase size={14} />} />
          {data.experience.map((exp) => (
            <div key={exp.id} className="entry-block space-y-1">
              <div className="flex justify-between items-baseline font-serif font-bold">
                <span className={size.title}>{exp.role} <span className="font-normal text-gray-700">| {exp.company}</span></span>
                <DateRange start={exp.startDate} end={exp.endDate} current={exp.current} />
              </div>
              <ul className="list-disc pl-5 mt-1 space-y-0.5 font-serif text-gray-900">
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
        <div className="section-block space-y-3 mt-4">
          <SectionHeading title="Academic Credentials" theme={{ ...theme, accentColor: color, headingStyle: 'border-bottom' }} icon={<GraduationCap size={14} />} />
          {data.education.map((edu) => (
            <div key={edu.id} className="entry-block font-serif">
              <div className="flex justify-between items-baseline font-bold">
                <span className={size.title}>{edu.degree}</span>
                <span className="text-xs text-gray-600">{edu.startYear} – {edu.endYear}</span>
              </div>
              <p className={`${size.body} text-gray-700 italic`}>{edu.school} {edu.city ? `, ${edu.city}` : ''}</p>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <div className="section-block space-y-2 mt-4">
          <SectionHeading title="Executive Competencies" theme={{ ...theme, accentColor: color, headingStyle: 'border-bottom' }} icon={<Cpu size={14} />} />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 pt-1 font-serif text-xs font-semibold text-gray-800">
            {data.skills.map((skill) => (
              <div key={skill.id} className="border-b border-gray-200 py-1">
                • {skill.name}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects with Live Links */}
      {data.projects.length > 0 && (
        <div className="section-block space-y-3 mt-4">
          <SectionHeading title="Key Initiatives & Projects" theme={{ ...theme, accentColor: color, headingStyle: 'border-bottom' }} icon={<Folder size={14} />} />
          {data.projects.map((p) => (
            <div key={p.id} className="entry-block font-serif space-y-1">
              <div className="flex justify-between items-baseline font-bold">
                <span className={size.title}>{p.name}</span>
              </div>
              <ProjectLinks liveLink={p.liveLink} githubLink={p.githubLink} />
              <p className={`${size.body} text-gray-800 text-justify`}>{p.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Internships */}
      {data.internships && data.internships.length > 0 && (
        <div className="section-block space-y-3 mt-4 font-serif">
          <SectionHeading title="Executive Training & Internships" theme={{ ...theme, accentColor: color, headingStyle: 'border-bottom' }} icon={<Briefcase size={14} />} />
          {data.internships.map((intern) => (
            <div key={intern.id} className="entry-block space-y-0.5">
              <div className="flex justify-between items-baseline font-bold">
                <span className={size.title}>{intern.role} – {intern.company}</span>
                <span className="text-xs font-normal text-gray-600">{intern.duration}</span>
              </div>
              <p className={`${size.body} text-gray-800`}>{intern.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Certifications */}
      {data.certifications.length > 0 && (
        <div className="section-block space-y-2 mt-4 font-serif">
          <SectionHeading title="Board & Executive Certifications" theme={{ ...theme, accentColor: color, headingStyle: 'border-bottom' }} icon={<Award size={14} />} />
          <ul className="list-disc pl-5 space-y-1">
            {data.certifications.map((c) => (
              <li key={c.id} className={`${size.body} text-gray-800`}>
                <strong>{c.name}</strong> – {c.issuer} ({c.date})
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Achievements */}
      {data.achievements.filter(a => a.trim()).length > 0 && (
        <div className="section-block space-y-2 mt-4 font-serif">
          <SectionHeading title="Honors & Achievements" theme={{ ...theme, accentColor: color, headingStyle: 'border-bottom' }} icon={<Award size={14} />} />
          <ul className="list-disc pl-5 space-y-1">
            {data.achievements.filter(a => a.trim()).map((ach, idx) => (
              <li key={idx} className={`${size.body} text-gray-800`}>{ach}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Languages */}
      <LanguagesSection languages={data.languages} theme={theme} />

      {/* References */}
      <ReferencesSection references={data.references} theme={theme} />
    </div>
  );
};

// ----------------------------------------------------
// 5. MODERN MINIMAL TEMPLATE
// ----------------------------------------------------
export const ModernMinimal: React.FC<TemplateProps> = ({ data, theme }) => {
  const fontClass = getFontClass(theme.fontFamily);
  const size = getFontSizeClasses(theme.fontSize);
  const paddingClass = getMarginClass(theme.margins);
  const color = theme.accentColor || '#3b82f6';

  return (
    <div className={`w-full bg-white text-gray-900 text-left ${fontClass} ${paddingClass} max-w-4xl mx-auto overflow-visible`}>
      {/* Simple Clean Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-gray-100 pb-5">
        <div className="flex-1">
          <h1 className={`${size.name} tracking-tight font-extrabold text-gray-900`}>{data.personalInfo.fullName}</h1>
          <p className="text-sm font-semibold tracking-wider uppercase mt-0.5" style={{ color }}>{data.personalInfo.professionalTitle}</p>
          <div className="mt-3 flex flex-col items-start gap-1 text-xs text-gray-600 font-medium">
            {data.personalInfo.email && <span className="flex items-center gap-2"><Mail size={12} /> {data.personalInfo.email}</span>}
            {data.personalInfo.phone && <span className="flex items-center gap-2"><Phone size={12} /> {data.personalInfo.phone}</span>}
            {data.personalInfo.address && <span className="flex items-center gap-2"><MapPin size={12} /> {data.personalInfo.address}</span>}
            {data.personalInfo.linkedin && <span className="flex items-center gap-2"><Globe size={12} /> {data.personalInfo.linkedin}</span>}
            {data.personalInfo.github && <span className="flex items-center gap-2"><Globe size={12} /> {data.personalInfo.github}</span>}
          </div>
        </div>
        {theme.showPhoto && data.personalInfo.photo && (
          <ProfilePhoto photo={data.personalInfo.photo} name={data.personalInfo.fullName} theme={theme} />
        )}
      </div>

      {/* Summary */}
      {data.summary && (
        <div className="section-block space-y-1 mt-4">
          <SectionHeading title="Summary" theme={theme} icon={<Users size={14} />} />
          <p className={`${size.body} text-gray-700 text-justify leading-relaxed`}>{data.summary}</p>
        </div>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <div className="section-block space-y-4 mt-4">
          <SectionHeading title="Experience" theme={theme} icon={<Briefcase size={14} />} />
          {data.experience.map((exp) => (
            <div key={exp.id} className="entry-block space-y-1">
              <div className="flex justify-between items-baseline font-bold">
                <span className={size.title}>{exp.role} <span className="font-light text-gray-500">/</span> {exp.company}</span>
                <DateRange start={exp.startDate} end={exp.endDate} current={exp.current} />
              </div>
              <ul className="space-y-1 mt-1.5 pl-3 border-l border-gray-200">
                {exp.responsibilities.split('\n').map((line, idx) => line.trim() && (
                  <li key={idx} className={`${size.body} text-gray-700 text-justify relative pl-3`}>
                    <span className="absolute left-0 top-2 w-1.5 h-1.5 bg-gray-400 rounded-full" />
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
        <div className="section-block space-y-3 mt-4">
          <SectionHeading title="Education" theme={theme} icon={<GraduationCap size={14} />} />
          {data.education.map((edu) => (
            <div key={edu.id} className="entry-block space-y-0.5">
              <div className="flex justify-between items-baseline font-bold">
                <span className={size.title}>{edu.degree}</span>
                <span className="text-xs font-normal text-gray-500">{edu.startYear} – {edu.endYear}</span>
              </div>
              <div className="text-xs text-gray-600 font-medium">{edu.school} {edu.city ? `| ${edu.city}` : ''} {edu.cgpaOrPercentage ? `| GPA: ${edu.cgpaOrPercentage}` : ''}</div>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <div className="section-block mt-4">
          <SectionHeading title="Skills" theme={theme} icon={<Cpu size={14} />} />
          <div className="flex flex-wrap gap-1.5 pt-1">
            {data.skills.map((skill) => (
              <span
                key={skill.id}
                className="px-2.5 py-1 text-[11px] font-semibold bg-gray-50 border border-gray-200 text-gray-800"
                style={{ borderRadius: getRadiusClass(theme.borderRadius) }}
              >
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Projects with Live Links */}
      {data.projects.length > 0 && (
        <div className="section-block space-y-3 mt-4">
          <SectionHeading title="Projects" theme={theme} icon={<Folder size={14} />} />
          {data.projects.map((p) => (
            <div key={p.id} className="entry-block space-y-1">
              <div className="flex justify-between items-baseline font-bold">
                <span className={size.title}>{p.name}</span>
              </div>
              <ProjectLinks liveLink={p.liveLink} githubLink={p.githubLink} />
              <p className={`${size.body} text-gray-700 text-justify`}>{p.description}</p>
              {p.technologies.length > 0 && (
                <p className={`${size.sub} text-gray-500`}><strong>Tech:</strong> {p.technologies.join(', ')}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Internships */}
      {data.internships && data.internships.length > 0 && (
        <div className="section-block space-y-3 mt-4">
          <SectionHeading title="Internships" theme={theme} icon={<Briefcase size={14} />} />
          {data.internships.map((intern) => (
            <div key={intern.id} className="entry-block space-y-0.5">
              <div className="flex justify-between items-baseline font-bold">
                <span className={size.title}>{intern.role} – {intern.company}</span>
                <span className="text-xs text-gray-500 font-normal">{intern.duration}</span>
              </div>
              <p className={`${size.body} text-gray-700`}>{intern.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Certifications */}
      {data.certifications.length > 0 && (
        <div className="section-block space-y-2 mt-4">
          <SectionHeading title="Certifications" theme={theme} icon={<Award size={14} />} />
          <ul className="space-y-1">
            {data.certifications.map((c) => (
              <li key={c.id} className={`${size.body} text-gray-800 flex justify-between`}>
                <span><strong>{c.name}</strong> – {c.issuer}</span>
                <span className="text-xs text-gray-500">{c.date}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Achievements */}
      {data.achievements.filter(a => a.trim()).length > 0 && (
        <div className="section-block space-y-2 mt-4">
          <SectionHeading title="Achievements" theme={theme} icon={<Award size={14} />} />
          <ul className="list-disc pl-5 space-y-1">
            {data.achievements.filter(a => a.trim()).map((ach, idx) => (
              <li key={idx} className={`${size.body} text-gray-800`}>{ach}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Languages */}
      <LanguagesSection languages={data.languages} theme={theme} />

      {/* References */}
      <ReferencesSection references={data.references} theme={theme} />

      {/* Interests */}
      {data.interests.filter(i => i.trim()).length > 0 && (
        <div className="section-block space-y-1 mt-4">
          <SectionHeading title="Interests" theme={theme} icon={<Heart size={14} />} />
          <p className={`${size.body} text-gray-700`}>{data.interests.filter(i => i.trim()).join(', ')}</p>
        </div>
      )}
    </div>
  );
};

// ----------------------------------------------------
// 6. ELEGANT IVORY TEMPLATE
// ----------------------------------------------------
export const Elegant: React.FC<TemplateProps> = ({ data, theme }) => {
  const fontClass = getFontClass(theme.fontFamily);
  const size = getFontSizeClasses(theme.fontSize);
  const paddingClass = getMarginClass(theme.margins);
  const color = theme.accentColor || '#854d0e';

  return (
    <div className={`w-full bg-[#fbfbfa] text-gray-800 text-left ${fontClass} ${paddingClass} max-w-4xl mx-auto border-t-4 overflow-visible`} style={{ borderTopColor: color }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left pb-4 border-b border-gray-200">
        <div className="flex-1 space-y-1">
          <h1 className={`${size.name} font-serif italic text-gray-900`}>{data.personalInfo.fullName}</h1>
          <p className="text-xs uppercase tracking-widest text-gray-600 font-sans">{data.personalInfo.professionalTitle}</p>
          <div className="text-xs text-gray-600 flex flex-wrap justify-center sm:justify-start gap-x-3 gap-y-1 font-sans">
            {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
            {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
            {data.personalInfo.address && <span>{data.personalInfo.address}</span>}
          </div>
        </div>
        {theme.showPhoto && data.personalInfo.photo && (
          <ProfilePhoto photo={data.personalInfo.photo} name={data.personalInfo.fullName} theme={theme} />
        )}
      </div>

      {/* Summary */}
      {data.summary && (
        <div className="section-block space-y-1 mt-4">
          <SectionHeading title="Introduction" theme={{ ...theme, accentColor: color, headingStyle: 'border-bottom' }} icon={<Users size={14} />} />
          <p className={`${size.body} font-serif leading-relaxed text-gray-800 text-justify`}>{data.summary}</p>
        </div>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <div className="section-block space-y-3 mt-4">
          <SectionHeading title="Experience" theme={{ ...theme, accentColor: color, headingStyle: 'border-bottom' }} icon={<Briefcase size={14} />} />
          {data.experience.map((exp) => (
            <div key={exp.id} className="entry-block space-y-1">
              <div className="flex justify-between items-baseline">
                <span className={`${size.title} font-serif text-gray-900`}>{exp.role} <span className="font-sans text-xs font-normal text-gray-600">at {exp.company}</span></span>
                <DateRange start={exp.startDate} end={exp.endDate} current={exp.current} />
              </div>
              <ul className="list-disc pl-5 mt-1 space-y-0.5 font-serif text-gray-800">
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
        <div className="section-block space-y-3 mt-4">
          <SectionHeading title="Education" theme={{ ...theme, accentColor: color, headingStyle: 'border-bottom' }} icon={<GraduationCap size={14} />} />
          {data.education.map((edu) => (
            <div key={edu.id} className="entry-block">
              <div className="flex justify-between items-baseline font-serif">
                <span className={size.title}>{edu.degree}</span>
                <span className="text-xs text-gray-600 font-sans">{edu.startYear} – {edu.endYear}</span>
              </div>
              <p className={`${size.body} font-serif text-gray-700 italic`}>{edu.school} {edu.city ? `, ${edu.city}` : ''}</p>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <div className="section-block space-y-2 mt-4">
          <SectionHeading title="Skills & Proficiencies" theme={{ ...theme, accentColor: color, headingStyle: 'border-bottom' }} icon={<Cpu size={14} />} />
          <div className="flex flex-wrap gap-2 pt-1">
            {data.skills.map((skill) => (
              <span key={skill.id} className="px-3 py-1 text-xs font-serif bg-amber-50 text-amber-900 border border-amber-200 rounded font-semibold">
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Projects with Live Links */}
      {data.projects.length > 0 && (
        <div className="section-block space-y-3 mt-4">
          <SectionHeading title="Projects" theme={{ ...theme, accentColor: color, headingStyle: 'border-bottom' }} icon={<Folder size={14} />} />
          {data.projects.map((p) => (
            <div key={p.id} className="entry-block space-y-1">
              <div className="flex justify-between items-baseline font-serif font-bold">
                <span className={size.title}>{p.name}</span>
              </div>
              <ProjectLinks liveLink={p.liveLink} githubLink={p.githubLink} />
              <p className={`${size.body} font-serif text-gray-800 text-justify`}>{p.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Internships */}
      {data.internships && data.internships.length > 0 && (
        <div className="section-block space-y-3 mt-4 font-serif">
          <SectionHeading title="Internships" theme={{ ...theme, accentColor: color, headingStyle: 'border-bottom' }} icon={<Briefcase size={14} />} />
          {data.internships.map((intern) => (
            <div key={intern.id} className="entry-block space-y-0.5">
              <div className="flex justify-between items-baseline font-bold">
                <span className={size.title}>{intern.role} – {intern.company}</span>
                <span className="text-xs font-sans text-gray-600">{intern.duration}</span>
              </div>
              <p className={`${size.body} font-serif text-gray-800`}>{intern.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Certifications */}
      {data.certifications.length > 0 && (
        <div className="section-block space-y-2 mt-4">
          <SectionHeading title="Certifications" theme={{ ...theme, accentColor: color, headingStyle: 'border-bottom' }} icon={<Award size={14} />} />
          <ul className="space-y-1 font-serif">
            {data.certifications.map((c) => (
              <li key={c.id} className={`${size.body} text-gray-800 flex justify-between`}>
                <span>{c.name} – {c.issuer}</span>
                <span className="text-xs font-sans text-gray-600">{c.date}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Achievements */}
      {data.achievements.filter(a => a.trim()).length > 0 && (
        <div className="section-block space-y-2 mt-4 font-serif">
          <SectionHeading title="Achievements" theme={{ ...theme, accentColor: color, headingStyle: 'border-bottom' }} icon={<Award size={14} />} />
          <ul className="list-disc pl-5 space-y-1">
            {data.achievements.filter(a => a.trim()).map((ach, idx) => (
              <li key={idx} className={`${size.body} text-gray-800`}>{ach}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Languages */}
      <LanguagesSection languages={data.languages} theme={theme} />

      {/* References */}
      <ReferencesSection references={data.references} theme={theme} />
    </div>
  );
};

// ----------------------------------------------------
// 7. CREATIVE BANNER TEMPLATE
// ----------------------------------------------------
export const Creative: React.FC<TemplateProps> = ({ data, theme }) => {
  const fontClass = getFontClass(theme.fontFamily);
  const size = getFontSizeClasses(theme.fontSize);
  const paddingClass = getMarginClass(theme.margins);
  const color = theme.accentColor || '#ec4899';

  return (
    <div className={`w-full bg-white text-gray-800 text-left ${fontClass} max-w-4xl mx-auto overflow-visible shadow-none`}>
      {/* Top Accent Banner */}
      <div className="p-6 md:p-8 text-white flex flex-col sm:flex-row justify-between items-center gap-4" style={{ backgroundColor: color }}>
        <div className="flex-1 text-center sm:text-left space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight">{data.personalInfo.fullName || 'Candidate Name'}</h1>
          <p className="text-sm font-medium tracking-wide uppercase opacity-95">{data.personalInfo.professionalTitle}</p>
          <div className="flex flex-wrap justify-center sm:justify-start gap-x-4 gap-y-1 text-xs opacity-90 pt-2">
            {data.personalInfo.email && <span className="flex items-center gap-1"><Mail size={12} /> {data.personalInfo.email}</span>}
            {data.personalInfo.phone && <span className="flex items-center gap-1"><Phone size={12} /> {data.personalInfo.phone}</span>}
            {data.personalInfo.address && <span className="flex items-center gap-1"><MapPin size={12} /> {data.personalInfo.address}</span>}
          </div>
        </div>
        {theme.showPhoto && data.personalInfo.photo && (
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shrink-0 shadow-md">
            <img src={data.personalInfo.photo} alt={data.personalInfo.fullName} className="w-full h-full object-cover" crossOrigin="anonymous" />
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className={`${paddingClass} space-y-5`}>
        {/* Summary */}
        {data.summary && (
          <div className="section-block space-y-1">
            <SectionHeading title="About Me" theme={{ ...theme, accentColor: color, headingStyle: 'colored-bg' }} icon={<Users size={14} />} />
            <p className={`${size.body} text-gray-800 text-justify leading-relaxed`}>{data.summary}</p>
          </div>
        )}

        {/* Experience */}
        {data.experience.length > 0 && (
          <div className="section-block space-y-3">
            <SectionHeading title="Experience" theme={{ ...theme, accentColor: color, headingStyle: 'colored-bg' }} icon={<Briefcase size={14} />} />
            {data.experience.map((exp) => (
              <div key={exp.id} className="entry-block space-y-1">
                <div className="flex justify-between items-baseline font-bold">
                  <span className={size.title}>{exp.role} <span className="font-normal text-gray-600">at {exp.company}</span></span>
                  <DateRange start={exp.startDate} end={exp.endDate} current={exp.current} />
                </div>
                <ul className="list-disc pl-5 mt-1 space-y-0.5">
                  {exp.responsibilities.split('\n').map((line, idx) => line.trim() && (
                    <li key={idx} className={`${size.body} text-gray-800 text-justify`}>{line.replace(/^•\s*/, '')}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {data.education.length > 0 && (
          <div className="section-block space-y-3">
            <SectionHeading title="Education" theme={{ ...theme, accentColor: color, headingStyle: 'colored-bg' }} icon={<GraduationCap size={14} />} />
            {data.education.map((edu) => (
              <div key={edu.id} className="entry-block">
                <div className="flex justify-between items-baseline font-bold">
                  <span className={size.title}>{edu.degree}</span>
                  <span className="text-xs text-gray-600">{edu.startYear} – {edu.endYear}</span>
                </div>
                <p className={`${size.body} text-gray-700`}>{edu.school} {edu.city ? `| ${edu.city}` : ''}</p>
              </div>
            ))}
          </div>
        )}

        {/* Skills */}
        {data.skills.length > 0 && (
          <div className="section-block space-y-2">
            <SectionHeading title="Skills & Talents" theme={{ ...theme, accentColor: color, headingStyle: 'colored-bg' }} icon={<Cpu size={14} />} />
            <div className="flex flex-wrap gap-2 pt-1">
              {data.skills.map((skill) => (
                <span
                  key={skill.id}
                  className="px-3 py-1 text-xs font-bold text-white rounded-full shadow-2xs"
                  style={{ backgroundColor: color }}
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Projects with Live Links */}
        {data.projects.length > 0 && (
          <div className="section-block space-y-3">
            <SectionHeading title="Featured Projects" theme={{ ...theme, accentColor: color, headingStyle: 'colored-bg' }} icon={<Folder size={14} />} />
            {data.projects.map((p) => (
              <div key={p.id} className="entry-block space-y-1">
                <div className="flex justify-between items-baseline font-bold">
                  <span className={size.title}>{p.name}</span>
                </div>
                <ProjectLinks liveLink={p.liveLink} githubLink={p.githubLink} />
                <p className={`${size.body} text-gray-800 text-justify`}>{p.description}</p>
                {p.technologies.length > 0 && (
                  <p className={`${size.sub} text-gray-600`}><strong>Technologies:</strong> {p.technologies.join(', ')}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Internships */}
        {data.internships && data.internships.length > 0 && (
          <div className="section-block space-y-3">
            <SectionHeading title="Internships" theme={{ ...theme, accentColor: color, headingStyle: 'colored-bg' }} icon={<Briefcase size={14} />} />
            {data.internships.map((intern) => (
              <div key={intern.id} className="entry-block space-y-0.5">
                <div className="flex justify-between items-baseline font-bold">
                  <span className={size.title}>{intern.role} – {intern.company}</span>
                  <span className="text-xs text-gray-600">{intern.duration}</span>
                </div>
                <p className={`${size.body} text-gray-800`}>{intern.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* Certifications */}
        {data.certifications.length > 0 && (
          <div className="section-block space-y-2">
            <SectionHeading title="Certifications" theme={{ ...theme, accentColor: color, headingStyle: 'colored-bg' }} icon={<Award size={14} />} />
            <ul className="space-y-1">
              {data.certifications.map((c) => (
                <li key={c.id} className={`${size.body} text-gray-800 flex justify-between`}>
                  <span><strong>{c.name}</strong> – {c.issuer}</span>
                  <span className="text-xs text-gray-500">{c.date}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Achievements */}
        {data.achievements.filter(a => a.trim()).length > 0 && (
          <div className="section-block space-y-2">
            <SectionHeading title="Achievements" theme={{ ...theme, accentColor: color, headingStyle: 'colored-bg' }} icon={<Award size={14} />} />
            <ul className="list-disc pl-5 space-y-1">
              {data.achievements.filter(a => a.trim()).map((ach, idx) => (
                <li key={idx} className={`${size.body} text-gray-800`}>{ach}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Languages */}
        <LanguagesSection languages={data.languages} theme={theme} />

        {/* References */}
        <ReferencesSection references={data.references} theme={theme} />
      </div>
    </div>
  );
};

// ----------------------------------------------------
// 8. DARK PROFESSIONAL TEMPLATE
// ----------------------------------------------------
export const DarkProfessional: React.FC<TemplateProps> = ({ data, theme }) => {
  const fontClass = getFontClass(theme.fontFamily);
  const size = getFontSizeClasses(theme.fontSize);
  const paddingClass = getMarginClass(theme.margins);
  const color = theme.accentColor || '#60a5fa';

  return (
    <div className={`w-full bg-[#111827] text-gray-200 text-left ${fontClass} ${paddingClass} max-w-4xl mx-auto overflow-visible`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-4 border-b border-gray-800">
        <div className="flex-1">
          <h1 className={`${size.name} font-bold tracking-tight text-white`}>{data.personalInfo.fullName}</h1>
          <p className="text-sm font-semibold tracking-wide uppercase mt-1" style={{ color }}>{data.personalInfo.professionalTitle}</p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-gray-300">
            {data.personalInfo.email && <span className="flex items-center gap-1"><Mail size={12} /> {data.personalInfo.email}</span>}
            {data.personalInfo.phone && <span className="flex items-center gap-1"><Phone size={12} /> {data.personalInfo.phone}</span>}
            {data.personalInfo.address && <span className="flex items-center gap-1"><MapPin size={12} /> {data.personalInfo.address}</span>}
            {data.personalInfo.linkedin && <span className="flex items-center gap-1"><Globe size={12} /> {data.personalInfo.linkedin}</span>}
          </div>
        </div>
        {theme.showPhoto && data.personalInfo.photo && (
          <ProfilePhoto photo={data.personalInfo.photo} name={data.personalInfo.fullName} theme={theme} />
        )}
      </div>

      {/* Summary */}
      {data.summary && (
        <div className="section-block space-y-1 mt-4">
          <SectionHeading title="Summary" theme={{ ...theme, accentColor: color }} icon={<Users size={14} />} />
          <p className={`${size.body} text-gray-200 text-justify leading-relaxed`}>{data.summary}</p>
        </div>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <div className="section-block space-y-3 mt-4">
          <SectionHeading title="Experience" theme={{ ...theme, accentColor: color }} icon={<Briefcase size={14} />} />
          {data.experience.map((exp) => (
            <div key={exp.id} className="entry-block space-y-1">
              <div className="flex justify-between items-baseline font-semibold">
                <span className={`${size.title} text-white`}>{exp.role} <span className="text-gray-300 font-normal">at {exp.company}</span></span>
                <DateRange start={exp.startDate} end={exp.endDate} current={exp.current} style={{ color: '#9ca3af' }} />
              </div>
              <ul className="list-disc pl-5 mt-1 space-y-0.5 text-gray-200">
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
        <div className="section-block space-y-3 mt-4">
          <SectionHeading title="Education" theme={{ ...theme, accentColor: color }} icon={<GraduationCap size={14} />} />
          {data.education.map((edu) => (
            <div key={edu.id} className="entry-block">
              <div className="flex justify-between items-baseline font-semibold text-white">
                <span className={size.title}>{edu.degree}</span>
                <span className="text-xs text-gray-300">{edu.startYear} – {edu.endYear}</span>
              </div>
              <p className={`${size.body} text-gray-300`}>{edu.school} {edu.city ? `| ${edu.city}` : ''}</p>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <div className="section-block space-y-2 mt-4">
          <SectionHeading title="Technical Stack" theme={{ ...theme, accentColor: color }} icon={<Cpu size={14} />} />
          <div className="flex flex-wrap gap-2 pt-1">
            {data.skills.map((skill) => (
              <span key={skill.id} className="px-3 py-1 text-xs bg-gray-800 text-white font-semibold border border-gray-700 rounded">
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Projects with Live Links */}
      {data.projects.length > 0 && (
        <div className="section-block space-y-3 mt-4">
          <SectionHeading title="Key Projects" theme={{ ...theme, accentColor: color }} icon={<Folder size={14} />} />
          {data.projects.map((p) => (
            <div key={p.id} className="entry-block space-y-1">
              <div className="flex justify-between items-baseline font-bold text-white">
                <span className={size.title}>{p.name}</span>
              </div>
              <ProjectLinks liveLink={p.liveLink} githubLink={p.githubLink} isDark={true} />
              <p className={`${size.body} text-gray-200 text-justify`}>{p.description}</p>
              {p.technologies.length > 0 && (
                <p className={`${size.sub} text-gray-400`}>Technologies: {p.technologies.join(', ')}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Internships */}
      {data.internships && data.internships.length > 0 && (
        <div className="section-block space-y-3 mt-4">
          <SectionHeading title="Internships" theme={{ ...theme, accentColor: color }} icon={<Briefcase size={14} />} />
          {data.internships.map((intern) => (
            <div key={intern.id} className="entry-block space-y-0.5">
              <div className="flex justify-between items-baseline font-semibold text-white">
                <span className={size.title}>{intern.role} – {intern.company}</span>
                <span className="text-xs text-gray-300">{intern.duration}</span>
              </div>
              <p className={`${size.body} text-gray-200`}>{intern.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Certifications */}
      {data.certifications.length > 0 && (
        <div className="section-block space-y-2 mt-4">
          <SectionHeading title="Certifications" theme={{ ...theme, accentColor: color }} icon={<Award size={14} />} />
          <ul className="space-y-1 text-gray-200">
            {data.certifications.map((c) => (
              <li key={c.id} className={`${size.body} flex justify-between`}>
                <span>{c.name} – {c.issuer}</span>
                <span className="text-xs text-gray-400">{c.date}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Achievements */}
      {data.achievements.filter(a => a.trim()).length > 0 && (
        <div className="section-block space-y-2 mt-4">
          <SectionHeading title="Achievements" theme={{ ...theme, accentColor: color }} icon={<Award size={14} />} />
          <ul className="list-disc pl-5 space-y-1 text-gray-200">
            {data.achievements.filter(a => a.trim()).map((ach, idx) => (
              <li key={idx} className={`${size.body}`}>{ach}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Languages */}
      <LanguagesSection languages={data.languages} theme={theme} isDark={true} />

      {/* References */}
      <ReferencesSection references={data.references} theme={theme} isDark={true} />
    </div>
  );
};

// ----------------------------------------------------
// 9. SIDEBAR LAYOUT TEMPLATE
// ----------------------------------------------------
export const SidebarResume: React.FC<TemplateProps> = ({ data, theme }) => {
  const fontClass = getFontClass(theme.fontFamily);
  const size = getFontSizeClasses(theme.fontSize);
  const color = theme.accentColor || '#1e40af';

  return (
    <div className={`w-full bg-white text-gray-800 text-left ${fontClass} flex flex-row max-w-4xl mx-auto border border-gray-200 min-h-full overflow-visible`}>
      {/* Left Accent Sidebar (35% Width) */}
      <div className="w-[35%] min-w-[220px] p-6 text-white space-y-6 shrink-0" style={{ backgroundColor: color }}>
        {/* Photo & Name */}
        <div className="text-center space-y-3">
          {theme.showPhoto && data.personalInfo.photo && (
            <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-2 border-white/80 shadow-md">
              <img src={data.personalInfo.photo} alt={data.personalInfo.fullName} className="w-full h-full object-cover" crossOrigin="anonymous" />
            </div>
          )}
          <div>
            <h1 className="text-xl font-bold tracking-tight">{data.personalInfo.fullName}</h1>
            <p className="text-xs uppercase tracking-wider opacity-95 font-semibold mt-0.5">{data.personalInfo.professionalTitle}</p>
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-2 text-xs opacity-95 border-t border-white/20 pt-4">
          <h3 className="text-xs font-bold uppercase tracking-wider mb-2">Contact</h3>
          {data.personalInfo.email && <div className="flex items-center gap-2"><Mail size={12} className="shrink-0" /> <span className="break-all">{data.personalInfo.email}</span></div>}
          {data.personalInfo.phone && <div className="flex items-center gap-2"><Phone size={12} className="shrink-0" /> <span>{data.personalInfo.phone}</span></div>}
          {data.personalInfo.address && <div className="flex items-center gap-2"><MapPin size={12} className="shrink-0" /> <span>{data.personalInfo.address}</span></div>}
          {data.personalInfo.linkedin && <div className="flex items-center gap-2"><Globe size={12} className="shrink-0" /> <span className="break-all">{data.personalInfo.linkedin}</span></div>}
        </div>

        {/* Skills in Sidebar */}
        {data.skills.length > 0 && (
          <div className="space-y-2 border-t border-white/20 pt-4">
            <h3 className="text-xs font-bold uppercase tracking-wider mb-2">Skills</h3>
            <div className="flex flex-wrap gap-1.5">
              {data.skills.map((skill) => (
                <span key={skill.id} className="px-2 py-0.5 text-[10px] bg-white/20 rounded text-white font-semibold">
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Education in Sidebar */}
        {data.education.length > 0 && (
          <div className="space-y-3 border-t border-white/20 pt-4">
            <h3 className="text-xs font-bold uppercase tracking-wider mb-2">Education</h3>
            {data.education.map((edu) => (
              <div key={edu.id} className="text-xs space-y-0.5">
                <p className="font-bold">{edu.degree}</p>
                <p className="opacity-90">{edu.school}</p>
                <p className="text-[10px] opacity-80">{edu.startYear} – {edu.endYear}</p>
              </div>
            ))}
          </div>
        )}

        {/* Languages in Sidebar with High Contrast */}
        {data.languages.length > 0 && (
          <div className="space-y-1 border-t border-white/20 pt-4">
            <h3 className="text-xs font-bold uppercase tracking-wider mb-2">Languages</h3>
            {data.languages.map(l => (
              <p key={l.id} className="text-xs font-semibold text-white">
                {l.name} — <span className="opacity-90 font-normal">{l.speaking || 'Fluent'}</span>
              </p>
            ))}
          </div>
        )}
      </div>

      {/* Right Main Content (65% Width) */}
      <div className="flex-1 p-6 md:p-8 space-y-5">
        {/* Summary */}
        {data.summary && (
          <div className="section-block space-y-1">
            <SectionHeading title="Profile Summary" theme={{ ...theme, accentColor: color, headingStyle: 'border-bottom' }} icon={<Users size={14} />} />
            <p className={`${size.body} text-gray-800 text-justify leading-relaxed`}>{data.summary}</p>
          </div>
        )}

        {/* Experience */}
        {data.experience.length > 0 && (
          <div className="section-block space-y-4">
            <SectionHeading title="Experience" theme={{ ...theme, accentColor: color, headingStyle: 'border-bottom' }} icon={<Briefcase size={14} />} />
            {data.experience.map((exp) => (
              <div key={exp.id} className="entry-block space-y-1">
                <div className="flex justify-between items-baseline font-bold">
                  <span className={size.title}>{exp.role} <span className="font-normal text-gray-600">at {exp.company}</span></span>
                  <DateRange start={exp.startDate} end={exp.endDate} current={exp.current} />
                </div>
                <ul className="list-disc pl-5 mt-1 space-y-0.5">
                  {exp.responsibilities.split('\n').map((line, idx) => line.trim() && (
                    <li key={idx} className={`${size.body} text-gray-800 text-justify`}>{line.replace(/^•\s*/, '')}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* Projects with Live Links */}
        {data.projects.length > 0 && (
          <div className="section-block space-y-3">
            <SectionHeading title="Key Projects" theme={{ ...theme, accentColor: color, headingStyle: 'border-bottom' }} icon={<Folder size={14} />} />
            {data.projects.map((p) => (
              <div key={p.id} className="entry-block space-y-1">
                <div className="flex justify-between items-baseline font-bold">
                  <span className={size.title}>{p.name}</span>
                </div>
                <ProjectLinks liveLink={p.liveLink} githubLink={p.githubLink} />
                <p className={`${size.body} text-gray-800 text-justify`}>{p.description}</p>
                {p.technologies.length > 0 && (
                  <p className={`${size.sub} text-gray-600`}>Tech: {p.technologies.join(', ')}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Internships */}
        {data.internships && data.internships.length > 0 && (
          <div className="section-block space-y-3">
            <SectionHeading title="Internships" theme={{ ...theme, accentColor: color, headingStyle: 'border-bottom' }} icon={<Briefcase size={14} />} />
            {data.internships.map((intern) => (
              <div key={intern.id} className="entry-block space-y-0.5">
                <div className="flex justify-between items-baseline font-bold">
                  <span className={size.title}>{intern.role} – {intern.company}</span>
                  <span className="text-xs text-gray-600">{intern.duration}</span>
                </div>
                <p className={`${size.body} text-gray-800`}>{intern.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* Certifications */}
        {data.certifications.length > 0 && (
          <div className="section-block space-y-2">
            <SectionHeading title="Certifications" theme={{ ...theme, accentColor: color, headingStyle: 'border-bottom' }} icon={<Award size={14} />} />
            <ul className="space-y-1">
              {data.certifications.map((c) => (
                <li key={c.id} className={`${size.body} text-gray-800 flex justify-between`}>
                  <span><strong>{c.name}</strong> – {c.issuer}</span>
                  <span className="text-xs text-gray-500">{c.date}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Achievements */}
        {data.achievements.filter(a => a.trim()).length > 0 && (
          <div className="section-block space-y-2">
            <SectionHeading title="Achievements" theme={{ ...theme, accentColor: color, headingStyle: 'border-bottom' }} icon={<Award size={14} />} />
            <ul className="list-disc pl-5 space-y-1">
              {data.achievements.filter(a => a.trim()).map((ach, idx) => (
                <li key={idx} className={`${size.body} text-gray-800`}>{ach}</li>
              ))}
            </ul>
          </div>
        )}

        {/* References */}
        <ReferencesSection references={data.references} theme={theme} />
      </div>
    </div>
  );
};

// ----------------------------------------------------
// 10. CORPORATE BLUE TEMPLATE
// ----------------------------------------------------
export const CorporateBlue: React.FC<TemplateProps> = ({ data, theme }) => {
  const fontClass = getFontClass(theme.fontFamily);
  const size = getFontSizeClasses(theme.fontSize);
  const paddingClass = getMarginClass(theme.margins);
  const color = theme.accentColor || '#1e3a8a';

  return (
    <div className={`w-full bg-white text-gray-800 text-left ${fontClass} ${paddingClass} max-w-4xl mx-auto overflow-visible`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-4 border-b-2" style={{ borderBottomColor: color }}>
        <div className="flex-1">
          <h1 className={`${size.name} font-bold tracking-tight text-gray-900`}>{data.personalInfo.fullName}</h1>
          <p className="text-sm font-semibold tracking-wider uppercase mt-0.5" style={{ color }}>{data.personalInfo.professionalTitle}</p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-gray-600">
            {data.personalInfo.email && <span className="flex items-center gap-1"><Mail size={12} /> {data.personalInfo.email}</span>}
            {data.personalInfo.phone && <span className="flex items-center gap-1"><Phone size={12} /> {data.personalInfo.phone}</span>}
            {data.personalInfo.address && <span className="flex items-center gap-1"><MapPin size={12} /> {data.personalInfo.address}</span>}
            {data.personalInfo.linkedin && <span className="flex items-center gap-1"><Globe size={12} /> {data.personalInfo.linkedin}</span>}
          </div>
        </div>
        {theme.showPhoto && data.personalInfo.photo && (
          <ProfilePhoto photo={data.personalInfo.photo} name={data.personalInfo.fullName} theme={theme} />
        )}
      </div>

      {/* Summary */}
      {data.summary && (
        <div className="section-block space-y-1 mt-4">
          <SectionHeading title="Executive Summary" theme={{ ...theme, accentColor: color, headingStyle: 'border-bottom' }} icon={<Users size={14} />} />
          <p className={`${size.body} text-gray-800 text-justify leading-relaxed`}>{data.summary}</p>
        </div>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <div className="section-block space-y-3 mt-4">
          <SectionHeading title="Professional Experience" theme={{ ...theme, accentColor: color, headingStyle: 'border-bottom' }} icon={<Briefcase size={14} />} />
          {data.experience.map((exp) => (
            <div key={exp.id} className="entry-block space-y-1">
              <div className="flex justify-between items-baseline font-bold">
                <span className={size.title}>{exp.role} <span className="font-normal text-gray-600">at {exp.company}</span></span>
                <DateRange start={exp.startDate} end={exp.endDate} current={exp.current} />
              </div>
              <ul className="list-disc pl-5 mt-1 space-y-0.5">
                {exp.responsibilities.split('\n').map((line, idx) => line.trim() && (
                  <li key={idx} className={`${size.body} text-gray-800 text-justify`}>{line.replace(/^•\s*/, '')}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <div className="section-block space-y-3 mt-4">
          <SectionHeading title="Education" theme={{ ...theme, accentColor: color, headingStyle: 'border-bottom' }} icon={<GraduationCap size={14} />} />
          {data.education.map((edu) => (
            <div key={edu.id} className="entry-block">
              <div className="flex justify-between items-baseline font-bold">
                <span className={size.title}>{edu.degree}</span>
                <span className="text-xs text-gray-600 font-normal">{edu.startYear} – {edu.endYear}</span>
              </div>
              <p className={`${size.body} text-gray-700`}>{edu.school} {edu.city ? `| ${edu.city}` : ''}</p>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <div className="section-block space-y-2 mt-4">
          <SectionHeading title="Skills & Competencies" theme={{ ...theme, accentColor: color, headingStyle: 'border-bottom' }} icon={<Cpu size={14} />} />
          <div className="flex flex-wrap gap-2 pt-1">
            {data.skills.map((skill) => (
              <span key={skill.id} className="px-3 py-1 text-xs font-semibold bg-blue-50 text-blue-900 border border-blue-200 rounded">
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Projects with Live Links */}
      {data.projects.length > 0 && (
        <div className="section-block space-y-3 mt-4">
          <SectionHeading title="Projects" theme={{ ...theme, accentColor: color, headingStyle: 'border-bottom' }} icon={<Folder size={14} />} />
          {data.projects.map((p) => (
            <div key={p.id} className="entry-block space-y-1">
              <div className="flex justify-between items-baseline font-bold">
                <span className={size.title}>{p.name}</span>
              </div>
              <ProjectLinks liveLink={p.liveLink} githubLink={p.githubLink} />
              <p className={`${size.body} text-gray-800 text-justify`}>{p.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Internships */}
      {data.internships && data.internships.length > 0 && (
        <div className="section-block space-y-3 mt-4">
          <SectionHeading title="Internships" theme={{ ...theme, accentColor: color, headingStyle: 'border-bottom' }} icon={<Briefcase size={14} />} />
          {data.internships.map((intern) => (
            <div key={intern.id} className="entry-block space-y-0.5">
              <div className="flex justify-between items-baseline font-bold">
                <span className={size.title}>{intern.role} – {intern.company}</span>
                <span className="text-xs text-gray-600 font-normal">{intern.duration}</span>
              </div>
              <p className={`${size.body} text-gray-800`}>{intern.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Certifications */}
      {data.certifications.length > 0 && (
        <div className="section-block space-y-2 mt-4">
          <SectionHeading title="Certifications" theme={{ ...theme, accentColor: color, headingStyle: 'border-bottom' }} icon={<Award size={14} />} />
          <ul className="space-y-1">
            {data.certifications.map((c) => (
              <li key={c.id} className={`${size.body} text-gray-800 flex justify-between`}>
                <span><strong>{c.name}</strong> – {c.issuer}</span>
                <span className="text-xs text-gray-500">{c.date}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Achievements */}
      {data.achievements.filter(a => a.trim()).length > 0 && (
        <div className="section-block space-y-2 mt-4">
          <SectionHeading title="Achievements" theme={{ ...theme, accentColor: color, headingStyle: 'border-bottom' }} icon={<Award size={14} />} />
          <ul className="list-disc pl-5 space-y-1">
            {data.achievements.filter(a => a.trim()).map((ach, idx) => (
              <li key={idx} className={`${size.body} text-gray-800`}>{ach}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Languages */}
      <LanguagesSection languages={data.languages} theme={theme} />

      {/* References */}
      <ReferencesSection references={data.references} theme={theme} />
    </div>
  );
};

// ----------------------------------------------------
// 11. TWO COLUMN TEMPLATE
// ----------------------------------------------------
export const TwoColumn: React.FC<TemplateProps> = ({ data, theme }) => {
  const fontClass = getFontClass(theme.fontFamily);
  const size = getFontSizeClasses(theme.fontSize);
  const paddingClass = getMarginClass(theme.margins);
  const color = theme.accentColor || '#4f46e5';

  return (
    <div className={`w-full bg-white text-gray-800 text-left ${fontClass} ${paddingClass} max-w-4xl mx-auto flex flex-row gap-8 overflow-visible`}>
      {/* Left Column (60% Width) */}
      <div className="w-[60%] space-y-5">
        <div>
          <h1 className={`${size.name} font-bold tracking-tight text-gray-900`}>{data.personalInfo.fullName}</h1>
          <p className="text-sm font-semibold uppercase mt-0.5" style={{ color }}>{data.personalInfo.professionalTitle}</p>
        </div>

        {/* Summary */}
        {data.summary && (
          <div className="section-block space-y-1">
            <SectionHeading title="Profile" theme={{ ...theme, accentColor: color }} icon={<Users size={14} />} />
            <p className={`${size.body} text-gray-800 text-justify leading-relaxed`}>{data.summary}</p>
          </div>
        )}

        {/* Experience */}
        {data.experience.length > 0 && (
          <div className="section-block space-y-3">
            <SectionHeading title="Experience" theme={{ ...theme, accentColor: color }} icon={<Briefcase size={14} />} />
            {data.experience.map((exp) => (
              <div key={exp.id} className="entry-block space-y-1">
                <div className="flex justify-between items-baseline font-bold">
                  <span className={size.title}>{exp.role}</span>
                  <DateRange start={exp.startDate} end={exp.endDate} current={exp.current} />
                </div>
                <p className="text-xs font-semibold text-gray-700">{exp.company}</p>
                <ul className="list-disc pl-5 mt-1 space-y-0.5">
                  {exp.responsibilities.split('\n').map((line, idx) => line.trim() && (
                    <li key={idx} className={`${size.body} text-gray-800 text-justify`}>{line.replace(/^•\s*/, '')}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* Projects with Live Links */}
        {data.projects.length > 0 && (
          <div className="section-block space-y-3">
            <SectionHeading title="Projects" theme={{ ...theme, accentColor: color }} icon={<Folder size={14} />} />
            {data.projects.map((p) => (
              <div key={p.id} className="entry-block space-y-1">
                <div className="flex justify-between items-baseline font-bold">
                  <span className={size.title}>{p.name}</span>
                </div>
                <ProjectLinks liveLink={p.liveLink} githubLink={p.githubLink} />
                <p className={`${size.body} text-gray-800 text-justify`}>{p.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* Internships in Main Column */}
        {data.internships && data.internships.length > 0 && (
          <div className="section-block space-y-3">
            <SectionHeading title="Internships" theme={{ ...theme, accentColor: color }} icon={<Briefcase size={14} />} />
            {data.internships.map((intern) => (
              <div key={intern.id} className="entry-block space-y-0.5">
                <div className="flex justify-between items-baseline font-bold">
                  <span className={size.title}>{intern.role} – {intern.company}</span>
                  <span className="text-xs text-gray-600 font-normal">{intern.duration}</span>
                </div>
                <p className={`${size.body} text-gray-800`}>{intern.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right Column (40% Width) */}
      <div className="w-[40%] space-y-5 border-l border-gray-200 pl-6">
        {/* Photo & Contact */}
        {theme.showPhoto && data.personalInfo.photo && (
          <div className="pb-2">
            <ProfilePhoto photo={data.personalInfo.photo} name={data.personalInfo.fullName} theme={theme} />
          </div>
        )}

        <div className="space-y-1.5 text-xs text-gray-700">
          <SectionHeading title="Contact" theme={{ ...theme, accentColor: color }} icon={<Phone size={14} />} />
          {data.personalInfo.email && <p className="flex items-center gap-1.5"><Mail size={12} /> {data.personalInfo.email}</p>}
          {data.personalInfo.phone && <p className="flex items-center gap-1.5"><Phone size={12} /> {data.personalInfo.phone}</p>}
          {data.personalInfo.address && <p className="flex items-center gap-1.5"><MapPin size={12} /> {data.personalInfo.address}</p>}
          {data.personalInfo.linkedin && <p className="flex items-center gap-1.5"><Globe size={12} /> {data.personalInfo.linkedin}</p>}
        </div>

        {/* Education */}
        {data.education.length > 0 && (
          <div className="section-block space-y-2">
            <SectionHeading title="Education" theme={{ ...theme, accentColor: color }} icon={<GraduationCap size={14} />} />
            {data.education.map((edu) => (
              <div key={edu.id} className="entry-block text-xs">
                <p className="font-bold text-gray-900">{edu.degree}</p>
                <p className="text-gray-700">{edu.school}</p>
                <p className="text-gray-500">{edu.startYear} – {edu.endYear}</p>
              </div>
            ))}
          </div>
        )}

        {/* Skills */}
        {data.skills.length > 0 && (
          <div className="section-block space-y-2">
            <SectionHeading title="Skills" theme={{ ...theme, accentColor: color }} icon={<Cpu size={14} />} />
            <div className="flex flex-wrap gap-1.5">
              {data.skills.map((skill) => (
                <span key={skill.id} className="px-2 py-0.5 text-xs bg-gray-100 rounded text-gray-800 font-semibold">
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {data.certifications.length > 0 && (
          <div className="section-block space-y-2">
            <SectionHeading title="Certifications" theme={{ ...theme, accentColor: color }} icon={<Award size={14} />} />
            <ul className="space-y-1 text-xs text-gray-800">
              {data.certifications.map((c) => (
                <li key={c.id}>
                  <strong>{c.name}</strong> – {c.issuer}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Languages */}
        <LanguagesSection languages={data.languages} theme={theme} />

        {/* References */}
        <ReferencesSection references={data.references} theme={theme} />

        {/* Interests */}
        {data.interests.filter(i => i.trim()).length > 0 && (
          <div className="section-block space-y-1">
            <SectionHeading title="Interests" theme={{ ...theme, accentColor: color }} icon={<Heart size={14} />} />
            <p className="text-xs text-gray-700">{data.interests.filter(i => i.trim()).join(', ')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

// ----------------------------------------------------
// 12. FRESHER STYLE TEMPLATE
// ----------------------------------------------------
export const Fresher: React.FC<TemplateProps> = ({ data, theme }) => {
  const fontClass = getFontClass(theme.fontFamily);
  const size = getFontSizeClasses(theme.fontSize);
  const paddingClass = getMarginClass(theme.margins);
  const color = theme.accentColor || '#059669';

  return (
    <div className={`w-full bg-white text-gray-800 text-left ${fontClass} ${paddingClass} max-w-4xl mx-auto overflow-visible`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-4 border-b-2" style={{ borderBottomColor: color }}>
        <div className="flex-1">
          <h1 className={`${size.name} font-bold tracking-tight text-gray-900`}>{data.personalInfo.fullName}</h1>
          <p className="text-sm font-semibold tracking-wide uppercase mt-0.5" style={{ color }}>{data.personalInfo.professionalTitle}</p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-gray-600">
            {data.personalInfo.email && <span className="flex items-center gap-1"><Mail size={12} /> {data.personalInfo.email}</span>}
            {data.personalInfo.phone && <span className="flex items-center gap-1"><Phone size={12} /> {data.personalInfo.phone}</span>}
            {data.personalInfo.address && <span className="flex items-center gap-1"><MapPin size={12} /> {data.personalInfo.address}</span>}
            {data.personalInfo.linkedin && <span className="flex items-center gap-1"><Globe size={12} /> {data.personalInfo.linkedin}</span>}
            {data.personalInfo.github && <span className="flex items-center gap-1"><Globe size={12} /> {data.personalInfo.github}</span>}
          </div>
        </div>
        {theme.showPhoto && data.personalInfo.photo && (
          <ProfilePhoto photo={data.personalInfo.photo} name={data.personalInfo.fullName} theme={theme} />
        )}
      </div>

      {/* Summary */}
      {data.summary && (
        <div className="section-block space-y-1 mt-4">
          <SectionHeading title="Career Objective" theme={{ ...theme, accentColor: color }} icon={<Users size={14} />} />
          <p className={`${size.body} text-gray-800 text-justify leading-relaxed`}>{data.summary}</p>
        </div>
      )}

      {/* Education First for Freshers */}
      {data.education.length > 0 && (
        <div className="section-block space-y-3 mt-4">
          <SectionHeading title="Education" theme={{ ...theme, accentColor: color }} icon={<GraduationCap size={14} />} />
          {data.education.map((edu) => (
            <div key={edu.id} className="entry-block space-y-0.5">
              <div className="flex justify-between items-baseline font-bold">
                <span className={size.title}>{edu.degree}</span>
                <span className="text-xs text-gray-600 font-normal">{edu.startYear} – {edu.endYear}</span>
              </div>
              <p className={`${size.body} text-gray-700`}>{edu.school} {edu.city ? `| ${edu.city}` : ''} {edu.cgpaOrPercentage ? `| CGPA: ${edu.cgpaOrPercentage}` : ''}</p>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <div className="section-block space-y-2 mt-4">
          <SectionHeading title="Technical & Key Skills" theme={{ ...theme, accentColor: color }} icon={<Cpu size={14} />} />
          <div className="flex flex-wrap gap-2 pt-1">
            {data.skills.map((skill) => (
              <span key={skill.id} className="px-3 py-1 text-xs font-bold bg-emerald-50 text-emerald-900 border border-emerald-200 rounded">
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Projects with Live Links */}
      {data.projects.length > 0 && (
        <div className="section-block space-y-3 mt-4">
          <SectionHeading title="Academic & Personal Projects" theme={{ ...theme, accentColor: color }} icon={<Folder size={14} />} />
          {data.projects.map((p) => (
            <div key={p.id} className="entry-block space-y-1">
              <div className="flex justify-between items-baseline font-bold">
                <span className={size.title}>{p.name}</span>
              </div>
              <ProjectLinks liveLink={p.liveLink} githubLink={p.githubLink} />
              <p className={`${size.body} text-gray-800 text-justify`}>{p.description}</p>
              {p.technologies.length > 0 && (
                <p className={`${size.sub} text-gray-600`}>Tech: {p.technologies.join(', ')}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Internships */}
      {data.internships && data.internships.length > 0 && (
        <div className="section-block space-y-3 mt-4">
          <SectionHeading title="Internships & Training" theme={{ ...theme, accentColor: color }} icon={<Briefcase size={14} />} />
          {data.internships.map((intern) => (
            <div key={intern.id} className="entry-block space-y-0.5">
              <div className="flex justify-between items-baseline font-bold">
                <span className={size.title}>{intern.role} <span className="font-normal text-gray-600">at {intern.company}</span></span>
                <span className="text-xs text-gray-600 font-normal">{intern.duration}</span>
              </div>
              <p className={`${size.body} text-gray-800 text-justify`}>{intern.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Experience if any */}
      {data.experience.length > 0 && (
        <div className="section-block space-y-3 mt-4">
          <SectionHeading title="Work Experience" theme={{ ...theme, accentColor: color }} icon={<Briefcase size={14} />} />
          {data.experience.map((exp) => (
            <div key={exp.id} className="entry-block space-y-1">
              <div className="flex justify-between items-baseline font-bold">
                <span className={size.title}>{exp.role} <span className="font-normal text-gray-600">at {exp.company}</span></span>
                <DateRange start={exp.startDate} end={exp.endDate} current={exp.current} />
              </div>
              <ul className="list-disc pl-5 mt-1 space-y-0.5">
                {exp.responsibilities.split('\n').map((line, idx) => line.trim() && (
                  <li key={idx} className={`${size.body} text-gray-800 text-justify`}>{line.replace(/^•\s*/, '')}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Certifications */}
      {data.certifications.length > 0 && (
        <div className="section-block space-y-2 mt-4">
          <SectionHeading title="Certifications" theme={{ ...theme, accentColor: color }} icon={<Award size={14} />} />
          <ul className="space-y-1">
            {data.certifications.map((c) => (
              <li key={c.id} className={`${size.body} text-gray-800 flex justify-between`}>
                <span><strong>{c.name}</strong> – {c.issuer}</span>
                <span className="text-xs text-gray-500">{c.date}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Achievements */}
      {data.achievements.filter(a => a.trim()).length > 0 && (
        <div className="section-block space-y-2 mt-4">
          <SectionHeading title="Achievements & Honors" theme={{ ...theme, accentColor: color }} icon={<Award size={14} />} />
          <ul className="list-disc pl-5 space-y-1">
            {data.achievements.filter(a => a.trim()).map((ach, idx) => (
              <li key={idx} className={`${size.body} text-gray-800`}>{ach}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Languages */}
      <LanguagesSection languages={data.languages} theme={theme} />

      {/* References */}
      <ReferencesSection references={data.references} theme={theme} />

      {/* Interests */}
      {data.interests.filter(i => i.trim()).length > 0 && (
        <div className="section-block space-y-1 mt-4">
          <SectionHeading title="Interests" theme={{ ...theme, accentColor: color }} icon={<Heart size={14} />} />
          <p className={`${size.body} text-gray-700`}>{data.interests.filter(i => i.trim()).join(', ')}</p>
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
    <div id="resume-document" className="w-full bg-white text-gray-900 shadow-none print:shadow-none overflow-visible">
      <Component data={data} theme={theme} />
    </div>
  );
};
