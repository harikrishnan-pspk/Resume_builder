import { ResumeData } from '../types/resume';

export interface ATSAnalysis {
  score: number;
  strength: 'Beginner' | 'Good' | 'Excellent' | 'Professional' | 'Outstanding';
  suggestions: {
    id: string;
    type: 'warning' | 'success' | 'info';
    message: string;
    category: 'Contact' | 'Summary' | 'Experience' | 'Education' | 'Skills' | 'Formatting' | 'Keywords';
  }[];
  keywordMatchPercent: number;
  matchedKeywords: string[];
  missingKeywords: string[];
}

const KEYWORD_DICTIONARY: Record<string, string[]> = {
  software: ['React', 'JavaScript', 'TypeScript', 'Node.js', 'SQL', 'Git', 'REST API', 'Redux', 'AWS', 'Docker', 'CI/CD', 'Unit Testing', 'Python', 'Java', 'NoSQL', 'Agile'],
  frontend: ['React', 'JavaScript', 'TypeScript', 'CSS', 'HTML', 'Tailwind CSS', 'Redux', 'Git', 'REST API', 'Webpack', 'Sass', 'Responsive Design', 'Next.js', 'Figma', 'UI/UX'],
  backend: ['Node.js', 'Express', 'SQL', 'NoSQL', 'PostgreSQL', 'MongoDB', 'Python', 'Java', 'REST API', 'GraphQL', 'Docker', 'AWS', 'Microservices', 'Redis', 'CI/CD', 'Git'],
  product: ['Agile', 'Scrum', 'Roadmap', 'User Research', 'Product Lifecycle', 'A/B Testing', 'SQL', 'KPIs', 'Market Analysis', 'Wireframing', 'Jira', 'Stakeholder Management'],
  data: ['Python', 'SQL', 'Tableau', 'PowerBI', 'R', 'Machine Learning', 'Data Visualization', 'Pandas', 'NumPy', 'Statistics', 'Excel', 'Data Cleaning', 'Data Modeling', 'ETL'],
  marketing: ['SEO', 'SEM', 'Google Analytics', 'Social Media', 'Content Strategy', 'Email Marketing', 'PPC', 'Copywriting', 'CRM', 'A/B Testing', 'Growth Hacking', 'Campaigns'],
  design: ['Figma', 'Photoshop', 'Illustrator', 'UI/UX', 'Wireframing', 'Prototyping', 'Adobe XD', 'Typography', 'Design Systems', 'User Research', 'Branding', 'Interaction Design'],
  finance: ['Financial Modeling', 'Excel', 'Accounting', 'Valuation', 'Risk Analysis', 'Budgeting', 'SQL', 'Data Analysis', 'Forecasting', 'Reporting', 'Auditing', 'Portfolio Management']
};

export function analyzeResume(data: ResumeData): ATSAnalysis {
  let score = 0;
  const suggestions: ATSAnalysis['suggestions'] = [];
  
  // 1. Personal / Contact Info (Max 20 pts)
  let contactPoints = 0;
  if (data.personalInfo.fullName.trim()) contactPoints += 5;
  else suggestions.push({ id: 'c1', type: 'warning', message: 'Full Name is missing.', category: 'Contact' });
  
  if (data.personalInfo.email.trim()) contactPoints += 5;
  else suggestions.push({ id: 'c2', type: 'warning', message: 'Email address is missing.', category: 'Contact' });
  
  if (data.personalInfo.phone.trim()) contactPoints += 5;
  else suggestions.push({ id: 'c3', type: 'warning', message: 'Phone number is missing.', category: 'Contact' });
  
  if (data.personalInfo.address.trim()) contactPoints += 3;
  else suggestions.push({ id: 'c4', type: 'info', message: 'Adding your physical location (City, State) helps local recruiters.', category: 'Contact' });
  
  if (data.personalInfo.linkedin?.trim() || data.personalInfo.github?.trim() || data.personalInfo.portfolio?.trim()) contactPoints += 2;
  else suggestions.push({ id: 'c5', type: 'info', message: 'Adding LinkedIn, GitHub, or Portfolio increases recruiter engagement.', category: 'Contact' });
  
  score += contactPoints;
  if (contactPoints === 20) {
    suggestions.push({ id: 'c-ok', type: 'success', message: 'Contact information is complete and well formatted.', category: 'Contact' });
  }

  // 2. Summary / About Me (Max 15 pts)
  let summaryPoints = 0;
  const summaryWordCount = data.summary.trim() ? data.summary.trim().split(/\s+/).length : 0;
  
  if (summaryWordCount > 0) {
    summaryPoints += 8;
    if (summaryWordCount >= 60 && summaryWordCount <= 150) {
      summaryPoints += 7;
      suggestions.push({ id: 's-ok', type: 'success', message: 'Resume summary is a perfect length (60-150 words).', category: 'Summary' });
    } else if (summaryWordCount < 60) {
      summaryPoints += 3;
      suggestions.push({ id: 's-short', type: 'warning', message: `Summary is too short (${summaryWordCount} words). Aim for 60-150 words.`, category: 'Summary' });
    } else {
      summaryPoints += 4;
      suggestions.push({ id: 's-long', type: 'warning', message: `Summary is too long (${summaryWordCount} words). Keep it under 150 words to maintain interest.`, category: 'Summary' });
    }
  } else {
    suggestions.push({ id: 's-none', type: 'warning', message: 'Career summary is missing. A strong pitch helps hook recruiters.', category: 'Summary' });
  }
  score += summaryPoints;

  // 3. Experience (Max 20 pts)
  let expPoints = 0;
  if (data.experience.length > 0) {
    expPoints += 10;
    
    // Check descriptions
    let hasShortDesc = false;
    let hasActionVerbs = false;
    const actionVerbs = ['led', 'spearheaded', 'managed', 'developed', 'built', 'created', 'optimized', 'reduced', 'increased', 'engineered', 'implemented', 'designed', 'collaborated'];
    
    data.experience.forEach((job) => {
      const charCount = job.responsibilities.trim().length;
      if (charCount < 50) hasShortDesc = true;
      
      const words = job.responsibilities.toLowerCase().split(/[\s,.]+/);
      if (actionVerbs.some(verb => words.includes(verb))) {
        hasActionVerbs = true;
      }
    });

    if (!hasShortDesc) {
      expPoints += 5;
    } else {
      suggestions.push({ id: 'e-short', type: 'warning', message: 'Some job descriptions are very short. Describe your impact and responsibilities.', category: 'Experience' });
    }

    if (hasActionVerbs) {
      expPoints += 5;
      suggestions.push({ id: 'e-verb-ok', type: 'success', message: 'Your experience bullets start with strong action verbs.', category: 'Experience' });
    } else {
      suggestions.push({ id: 'e-verb-warn', type: 'warning', message: 'Try to start bullet points with strong action verbs (e.g. "Spearheaded", "Optimized", "Designed").', category: 'Experience' });
    }
  } else {
    suggestions.push({ id: 'e-none', type: 'warning', message: 'Work experience section is missing. Add professional history, internships, or freelance work.', category: 'Experience' });
  }
  score += expPoints;

  // 4. Education (Max 15 pts)
  let eduPoints = 0;
  if (data.education.length > 0) {
    eduPoints += 10;
    const hasDegreeAndSchool = data.education.every(edu => edu.degree.trim() && edu.school.trim());
    if (hasDegreeAndSchool) {
      eduPoints += 5;
      suggestions.push({ id: 'ed-ok', type: 'success', message: 'Education section is complete with degree and institution name.', category: 'Education' });
    } else {
      suggestions.push({ id: 'ed-inc', type: 'warning', message: 'Some education entries are missing school names or degrees.', category: 'Education' });
    }
  } else {
    suggestions.push({ id: 'ed-none', type: 'warning', message: 'Education section is missing.', category: 'Education' });
  }
  score += eduPoints;

  // 5. Skills (Max 15 pts)
  let skillPoints = 0;
  if (data.skills.length > 0) {
    skillPoints += 8;
    if (data.skills.length >= 6) {
      skillPoints += 4;
    }
    
    const hasTech = data.skills.some(s => s.type === 'technical');
    const hasSoft = data.skills.some(s => s.type === 'soft');
    if (hasTech && hasSoft) {
      skillPoints += 3;
      suggestions.push({ id: 'sk-ok', type: 'success', message: 'Good balance of Technical and Soft skills.', category: 'Skills' });
    } else {
      suggestions.push({ id: 'sk-balance', type: 'info', message: 'Ensure you include a mix of both Technical and Soft skills.', category: 'Skills' });
    }
  } else {
    suggestions.push({ id: 'sk-none', type: 'warning', message: 'No skills added. Skills are the main keywords ATS systems scan for.', category: 'Skills' });
  }
  score += skillPoints;

  // 6. Projects / Certifications / Achievements (Max 15 pts)
  let extraPoints = 0;
  if (data.projects.length > 0) extraPoints += 7;
  if (data.certifications.length > 0) extraPoints += 5;
  if (data.achievements.length > 0 || data.internships.length > 0) extraPoints += 3;
  
  if (extraPoints > 0) {
    score += Math.min(15, extraPoints);
    suggestions.push({ id: 'ex-ok', type: 'success', message: 'Extra sections (Projects, Certifications, or Achievements) look strong.', category: 'Formatting' });
  } else {
    suggestions.push({ id: 'ex-none', type: 'info', message: 'Add Projects or Certifications to validate your skill set.', category: 'Formatting' });
  }

  // 7. Keyword Analysis
  const jobTitle = data.personalInfo.professionalTitle.toLowerCase();
  let matchedKeywords: string[] = [];
  let missingKeywords: string[] = [];
  let keywordMatchPercent = 0;
  
  // Find matching keyword set
  let selectedCategory = 'software'; // default
  if (jobTitle.includes('front')) selectedCategory = 'frontend';
  else if (jobTitle.includes('back')) selectedCategory = 'backend';
  else if (jobTitle.includes('data')) selectedCategory = 'data';
  else if (jobTitle.includes('product') || jobTitle.includes('project')) selectedCategory = 'product';
  else if (jobTitle.includes('market')) selectedCategory = 'marketing';
  else if (jobTitle.includes('design') || jobTitle.includes('creative') || jobTitle.includes('ux') || jobTitle.includes('ui')) selectedCategory = 'design';
  else if (jobTitle.includes('finance') || jobTitle.includes('accounting')) selectedCategory = 'finance';
  
  const keywordsToCheck = KEYWORD_DICTIONARY[selectedCategory] || KEYWORD_DICTIONARY.software;
  
  // Compile resume text for searching
  const fullResumeText = `
    ${data.summary}
    ${data.skills.map(s => s.name).join(' ')}
    ${data.experience.map(e => `${e.role} ${e.company} ${e.responsibilities} ${e.achievements || ''}`).join(' ')}
    ${data.projects.map(p => `${p.name} ${p.description} ${p.technologies.join(' ')} ${p.achievements || ''}`).join(' ')}
  `.toLowerCase();
  
  keywordsToCheck.forEach((keyword) => {
    // Escaping special characters for regex, like . and +
    const escapedKeyword = keyword.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`\\b${escapedKeyword}\\b`, 'i');
    
    // Some keywords like "Next.js" or "Node.js" might have issues with word boundary, let's do a simple check too
    if (regex.test(fullResumeText) || fullResumeText.includes(keyword.toLowerCase())) {
      matchedKeywords.push(keyword);
    } else {
      missingKeywords.push(keyword);
    }
  });
  
  if (keywordsToCheck.length > 0) {
    keywordMatchPercent = Math.round((matchedKeywords.length / keywordsToCheck.length) * 100);
  }
  
  if (keywordMatchPercent >= 60) {
    suggestions.push({
      id: 'kw-ok',
      type: 'success',
      message: `Excellent keyword match! You matched ${matchedKeywords.length}/${keywordsToCheck.length} skills for a ${selectedCategory} role.`,
      category: 'Keywords'
    });
  } else if (keywordMatchPercent > 20) {
    suggestions.push({
      id: 'kw-warn',
      type: 'info',
      message: `Improve your match rate (currently ${keywordMatchPercent}%). Try incorporating keywords like: ${missingKeywords.slice(0, 4).join(', ')}.`,
      category: 'Keywords'
    });
  } else {
    suggestions.push({
      id: 'kw-low',
      type: 'warning',
      message: `Low keyword optimization for ${selectedCategory} roles. Try adding skills like ${missingKeywords.slice(0, 6).join(', ')} to your skills list.`,
      category: 'Keywords'
    });
  }

  // Adjust score based on keyword match (let's deduct up to 10 points if match is extremely low, or add bonus)
  if (keywordMatchPercent < 20) {
    score = Math.max(10, score - 8);
  } else if (keywordMatchPercent > 70) {
    score = Math.min(100, score + 5);
  }

  // Formatting warnings
  if (data.personalInfo.photo) {
    suggestions.push({
      id: 'f-photo',
      type: 'info',
      message: 'Many corporate ATS systems in the US/UK reject resumes with photos. Keep it optional or toggle it off for compliance.',
      category: 'Formatting'
    });
  }

  // Cap score
  score = Math.max(0, Math.min(100, Math.round(score)));
  
  // Calculate Strength
  let strength: ATSAnalysis['strength'] = 'Beginner';
  if (score >= 91) strength = 'Outstanding';
  else if (score >= 81) strength = 'Professional';
  else if (score >= 66) strength = 'Excellent';
  else if (score >= 41) strength = 'Good';

  return {
    score,
    strength,
    suggestions,
    keywordMatchPercent,
    matchedKeywords,
    missingKeywords
  };
}

export function getKeywordSuggestionsForRole(title: string): string[] {
  const jobTitle = title.toLowerCase();
  if (jobTitle.includes('front')) return KEYWORD_DICTIONARY.frontend;
  if (jobTitle.includes('back')) return KEYWORD_DICTIONARY.backend;
  if (jobTitle.includes('data')) return KEYWORD_DICTIONARY.data;
  if (jobTitle.includes('product') || jobTitle.includes('project')) return KEYWORD_DICTIONARY.product;
  if (jobTitle.includes('market')) return KEYWORD_DICTIONARY.marketing;
  if (jobTitle.includes('design') || jobTitle.includes('creative') || jobTitle.includes('ux') || jobTitle.includes('ui')) return KEYWORD_DICTIONARY.design;
  if (jobTitle.includes('finance') || jobTitle.includes('accounting')) return KEYWORD_DICTIONARY.finance;
  if (jobTitle.includes('software') || jobTitle.includes('dev') || jobTitle.includes('engineer')) return KEYWORD_DICTIONARY.software;
  return KEYWORD_DICTIONARY.software; // Default suggestion
}
