import { ResumeData } from '../types/resume';

// Real API Integration Helpers
export async function callOpenAI(prompt: string, apiKey: string, systemPrompt = 'You are an expert resume writer and career coach.'): Promise<string> {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error?.message || 'OpenAI API Error');
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error: any) {
    console.error('OpenAI API fetch error:', error);
    throw new Error(error.message || 'Failed to connect to OpenAI. Verify your API key.');
  }
}

export async function callGemini(prompt: string, apiKey: string, systemPrompt = 'You are an expert resume writer and career coach.'): Promise<string> {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: `${systemPrompt}\n\nUser Request: ${prompt}` }]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1000
          }
        })
      }
    );

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error?.message || 'Gemini API Error');
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text.trim();
  } catch (error: any) {
    console.error('Gemini API fetch error:', error);
    throw new Error(error.message || 'Failed to connect to Gemini. Verify your API key.');
  }
}

// Local mock prompts data based on popular tech roles
const MOCK_SUMMARIES: Record<string, string[]> = {
  software: [
    'Results-driven Software Engineer with 4+ years of hands-on experience designing, developing, and deploying robust web applications. Expertise in React, TypeScript, and Node.js. Skilled in optimizing cloud architectures (AWS/Docker) and implementing automated testing. Passionate about writing scalable, clean code and collaborating in agile teams.',
    'Detail-oriented Full Stack Developer with a strong foundation in modern JavaScript frameworks and relational database design. Proven track record of reducing page response times by 30% and migrating legacy products to responsive Next.js architectures. Excellent problem-solver who thrives in high-velocity startup environments.'
  ],
  product: [
    'Strategic Product Manager with 3+ years of experience directing cross-functional squads to ship successful B2B software products. Experienced in constructing clear product roadmaps, translating customer research into PRDs, and monitoring key metrics (A/B testing, churn, DAU). Expert in Agile/Scrum methodologies and stakeholders alignment.',
    'Data-informed Associate Product Manager skilled in wireframing, market research, and agile sprint planning. Experienced in analyzing user journeys to drive feature optimization, leading to a 15% boost in user acquisition. Adept at bridging engineering and design teams.'
  ],
  data: [
    'Analytical Data Scientist with a passion for converting complex datasets into actionable business intelligence. Proficient in Python, SQL, and data visualization tools (Tableau/PowerBI). Strong background in statistical modeling, machine learning algorithms, and automating ETL pipelines. Capable of communicating findings to non-technical leaders.',
    'Data Analyst with 2+ years of experience writing optimized SQL queries, cleaning messy datasets, and building interactive client dashboards. Reduced reporting turnaround times by 40% using automated Pandas and Python scripts.'
  ],
  design: [
    'Creative UI/UX Designer with a strong portfolio of intuitive, user-centered web and mobile interfaces. Expert in Figma, wireframing, rapid prototyping, and building accessible design systems. Skilled at conducting usability testing and collaborating closely with developers to deliver visually stunning and highly functional products.',
    'Visual Designer and Graphic Designer specializing in brand identity, high-fidelity mockups, and layout design. Proficient in Adobe Creative Suite and Figma. Proven ability to create responsive layouts that maintain strict design system integrity.'
  ],
  marketing: [
    'Dynamic Growth Marketer with a track record of driving user acquisition and search visibility through SEO, paid PPC campaigns, and content marketing. Proficient in Google Analytics, HubSpot, and SEMrush. Skilled in conducting conversion rate optimization (CRO) audits, increasing landing page conversions by 25%.'
  ]
};

const MOCK_BULLET_REWRITES: Record<string, string[]> = {
  weak: [
    'Worked on a React application with a team of developers.',
    'Responsible for fixing bugs in the database.',
    'Helped write blog posts and optimized SEO.',
    'Managed the product backlog and ran standups.'
  ],
  strong: [
    'Collaborated with a cross-functional team of 6 engineers to build a responsive React web application, improving page speed by 35% using lazy loading and code splitting.',
    'Diagnosed and resolved critical PostgreSQL query bottlenecks, reducing database latency by 45% and optimizing connection pools.',
    'Spearheaded organic SEO growth strategy, writing 15+ high-ranking articles and boosting search traffic by 50% in 6 months.',
    'Managed the product backlog, prioritized 100+ feature tickets in Jira, and facilitated daily Scrum standups to accelerate shipping velocity by 20%.'
  ]
};

const MOCK_COVER_LETTERS = `Dear Hiring Team,

I am writing to express my strong interest in the open position at your company. With my background as a [Title] and hands-on experience in building scalable solutions, I am confident that I can make an immediate and positive impact on your product engineering efforts.

Throughout my career, I have focused on writing clean, maintainable code, optimizing performance, and collaborating effectively across disciplines. I have worked extensively with modern tools like [Skills], and I enjoy solving complex challenges that directly benefit the user experience.

Your team's focus on innovation and high engineering standards aligns perfectly with my professional goals. I would welcome the opportunity to discuss how my skill set and experiences align with your technical and cultural needs. Thank you for your time and consideration.

Sincerely,
[Name]`;

const MOCK_THANK_YOU = `Subject: Thank you - [Name] for [Title] Interview

Dear Hiring Team,

Thank you so much for taking the time to speak with me today about the [Title] position. I thoroughly enjoyed our conversation, particularly learning more about your team's upcoming plans to transition to microservices and scale your application.

Our discussion further confirmed my excitement about joining the team. I believe my expertise in [Skills] and my passion for clean web experiences make me a strong fit for this role.

Please let me know if you need any additional references or portfolio samples from my end. I look forward to hearing about the next steps in the process.

Best regards,

[Name]
[Phone]
[Email]`;

const MOCK_INTERVIEW_INTRO = `Here is a 30-second elevator pitch to introduce yourself during an interview:

"Hi, I'm [Name]. I am a [Title] with a strong focus on building responsive, high-performance web applications. 

Over the last few years, I've worked heavily with technologies like [Skills]. In my last role at my company, I spearheaded a core rebuild that improved dashboard speed by 40% and mentored junior developers on clean coding practices. 

I'm really passionate about combining clean software architecture with great user experiences, which is what drew me to this role. I'm excited to learn more about how I can bring my technical expertise to your team today!"`;

// Main entry point for local text generation fallback
export function generateMockContentLocal(action: string, title = 'Software Engineer', name = 'Candidate', currentText = ''): string {
  const normalizedTitle = title.toLowerCase();
  let category = 'software';
  if (normalizedTitle.includes('front')) category = 'frontend';
  else if (normalizedTitle.includes('back')) category = 'backend';
  else if (normalizedTitle.includes('data')) category = 'data';
  else if (normalizedTitle.includes('product') || normalizedTitle.includes('project')) category = 'product';
  else if (normalizedTitle.includes('design') || normalizedTitle.includes('ux') || normalizedTitle.includes('ui')) category = 'design';
  else if (normalizedTitle.includes('market')) category = 'marketing';

  switch (action) {
    case 'generate-summary': {
      const summaries = MOCK_SUMMARIES[category] || MOCK_SUMMARIES.software;
      return summaries[Math.floor(Math.random() * summaries.length)];
    }
    
    case 'improve-summary': {
      if (!currentText || currentText.trim().length < 10) {
        const summaries = MOCK_SUMMARIES[category] || MOCK_SUMMARIES.software;
        return summaries[0];
      }
      return `[Optimized] ${currentText}\n\n*Updated with industry keywords, active verbs, and recruiter-focused formatting to ensure ATS compliance.*`;
    }
    
    case 'rewrite-bullet': {
      if (!currentText || currentText.trim().length < 5) {
        return MOCK_BULLET_REWRITES.strong[0];
      }
      // Check if it's one of our predefined weak ones
      const idx = MOCK_BULLET_REWRITES.weak.findIndex(w => currentText.toLowerCase().includes(w.substring(0, 15).toLowerCase()));
      if (idx !== -1) {
        return MOCK_BULLET_REWRITES.strong[idx];
      }
      // General rewrite
      return `Spearheaded execution of "${currentText}", optimizing operations and driving a 25% improvement in process efficiency using industry best practices.`;
    }
    
    case 'generate-project': {
      return `Collaborated with developers to design and implement a high-performance web project utilizing React and Node.js. Configured secure user authentication (JWT), integrated real-time responsive updates via WebSockets, and deployed the bundle onto cloud environments (AWS). Resulted in a fully operational web service hosting 500+ active sessions.`;
    }

    case 'generate-experience': {
      return `• Engineered and maintained core software components for the main product suite.\n• Collaborated with product designers to map out responsive layout updates, increasing conversion rate by 15%.\n• Optimized database scripts and automated API testing pipelines to ensure 99.9% uptime.`;
    }
    
    case 'generate-cover-letter': {
      return MOCK_COVER_LETTERS
        .replace('[Title]', title)
        .replace('[Name]', name)
        .replace('[Skills]', category === 'software' || category === 'frontend' ? 'React, TypeScript, and Node.js' : 'industry standard tools');
    }
    
    case 'generate-thank-you': {
      return MOCK_THANK_YOU
        .replace('[Name]', name)
        .replace(/\[Title\]/g, title)
        .replace('[Skills]', category === 'software' || category === 'frontend' ? 'React and TypeScript' : 'relevant tools')
        .replace('[Phone]', '+1 (555) 123-4567')
        .replace('[Email]', 'your.email@domain.com');
    }
    
    case 'generate-interview-intro': {
      return MOCK_INTERVIEW_INTRO
        .replace('[Name]', name)
        .replace('[Title]', title)
        .replace('[Skills]', category === 'software' || category === 'frontend' ? 'React, Next.js, and Tailwind CSS' : 'relevant analytical software');
    }
    
    default:
      return 'Generated professional response based on your career title.';
  }
}

// Controller that checks if API Key is available, otherwise calls local generator
export async function executeAITask(
  action: string,
  context: {
    title: string;
    name: string;
    currentText?: string;
    skills?: string[];
  },
  settings: {
    apiKey: string;
    provider: 'openai' | 'gemini';
  }
): Promise<string> {
  const { title, name, currentText, skills } = context;
  const { apiKey, provider } = settings;

  if (apiKey && apiKey.trim()) {
    // Construct prompt depending on the action
    let prompt = '';
    let systemPrompt = 'You are an expert ATS-friendly resume reviewer, writer, and professional career coach.';

    switch (action) {
      case 'generate-summary':
        prompt = `Generate a professional, ATS-friendly resume summary for a ${title} named ${name}. Include top skills and write in the third person. Keep it between 80 to 120 words. Do not output markdown, output only the paragraph.`;
        break;
      case 'improve-summary':
        prompt = `Improve the following resume summary to be more active, metric-driven, and recruiter-friendly. The user's role is ${title}.\n\nSummary:\n"${currentText}"\n\nEnsure it stays between 80-120 words. Return only the improved paragraph without quotes or extra text.`;
        break;
      case 'rewrite-bullet':
        prompt = `Rewrite the following resume experience bullet point to start with a strong active verb and include a quantifiable metric or outcome. The role is ${title}.\n\nBullet Point:\n"${currentText}"\n\nReturn only the single rewritten bullet point.`;
        break;
      case 'generate-project':
        prompt = `Generate a 2-3 sentence project description for a resume. Project Name: "${currentText}". Technologies used: ${skills?.join(', ') || 'React, TypeScript, Node.js'}. Highlight achievements and technologies. Return only the description text.`;
        break;
      case 'generate-experience':
        prompt = `Generate 3 strong, metric-driven bullet points describing responsibilities and achievements for a ${title} at a company. Return only the bullet points (starting with •).`;
        break;
      case 'generate-cover-letter':
        prompt = `Write a professional, 3-paragraph cover letter for a ${title} position named ${name}. Address the hiring manager. Return the text directly.`;
        break;
      case 'generate-thank-you':
        prompt = `Write a polite post-interview thank you letter/email for a ${title} position named ${name}. Keep it concise and professional.`;
        break;
      case 'generate-interview-intro':
        prompt = `Generate a 30-second "Tell me about yourself" elevator pitch for an interview. The candidate is ${name}, a ${title}. Highlight core skills: ${skills?.slice(0, 5).join(', ') || 'React, TypeScript, Node.js'}.`;
        break;
      default:
        prompt = `Write a professional resume content for a ${title}. Action request: ${action}. Context: ${currentText}`;
    }

    if (provider === 'openai') {
      return callOpenAI(prompt, apiKey, systemPrompt);
    } else {
      return callGemini(prompt, apiKey, systemPrompt);
    }
  }

  // Fallback to local template generator with a minor delay to simulate AI thinking
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(generateMockContentLocal(action, title, name, currentText));
    }, 800);
  });
}
