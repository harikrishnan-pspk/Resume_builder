import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
// @ts-ignore
import html2pdf from 'html2pdf.js';
import { ResumeData } from '../types/resume';

// 1. Export PDF using html2pdf.js with fallback to direct html2canvas + jsPDF
export async function exportToPDF(elementId: string, filename: string, pageSize: 'A4' | 'Letter' = 'A4'): Promise<boolean> {
  // Find element by requested ID, or fallback to standard resume element IDs
  let element = document.getElementById(elementId) || document.getElementById('resume-document') || document.getElementById('resume-preview-container');

  if (!element) {
    console.error('PDF Export Error: Element not found with ID:', elementId);
    return false;
  }

  // Format & sanitize filename
  const rawName = filename && filename.trim() ? filename.trim() : 'Resume';
  const cleanName = rawName.replace(/[/\\?%*:|"<>]/g, '').replace(/\s+/g, '_');
  const pdfFilename = cleanName.endsWith('.pdf') ? cleanName : `${cleanName}.pdf`;

  console.log('Initiating PDF export for target element:', element.id || 'unnamed', '->', pdfFilename);

  // Safely resolve html2pdf module function in ESM / CJS bundles
  const html2pdfLib = typeof html2pdf === 'function' ? html2pdf : (html2pdf as any)?.default;

  if (typeof html2pdfLib === 'function') {
    try {
      const options = {
        margin: [14, 14, 14, 14] as [number, number, number, number], // 14mm top, left, bottom, right
        filename: pdfFilename,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          allowTaint: false, // Must be false so toDataURL does NOT throw SecurityError
          logging: false,
          backgroundColor: '#ffffff',
          scrollX: 0,
          scrollY: 0,
        },
        jsPDF: {
          unit: 'mm',
          format: pageSize.toLowerCase() === 'letter' ? 'letter' : 'a4',
          orientation: 'portrait' as const,
        },
        pagebreak: {
          mode: ['avoid-all', 'css', 'legacy'],
          before: '.print-page-break',
          avoid: ['.break-inside-avoid', '.section-block', '.entry-block', 'tr', 'li', 'h1', 'h2', 'h3'],
        },
      };

      await html2pdfLib().set(options).from(element).save();
      console.log('PDF exported successfully via html2pdf:', pdfFilename);
      return true;
    } catch (error) {
      console.warn('html2pdf export encountered an error, falling back to direct jsPDF engine:', error);
    }
  }

  // Direct jsPDF + html2canvas fallback engine with 14mm margins
  return await exportToPDDFallback(element, pdfFilename, pageSize);
}

// Fallback PDF exporter using direct html2canvas + jsPDF with 14mm margins
async function exportToPDDFallback(
  element: HTMLElement,
  pdfFilename: string,
  pageSize: 'A4' | 'Letter' = 'A4'
): Promise<boolean> {
  try {
    const pageW = pageSize === 'Letter' ? 215.9 : 210;
    const pageH = pageSize === 'Letter' ? 279.4 : 297;
    const margin = 14; // 14mm margins
    const contentW = pageW - margin * 2;
    const contentH = pageH - margin * 2;

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: false, // Must be false to allow canvas.toDataURL() export
      logging: false,
      backgroundColor: '#ffffff',
      scrollX: 0,
      scrollY: 0,
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.98);
    const imgW = contentW;
    const imgH = (canvas.height * contentW) / canvas.width;

    const pdf = new jsPDF({
      unit: 'mm',
      format: pageSize === 'Letter' ? 'letter' : 'a4',
      orientation: 'portrait',
    });

    if (imgH <= contentH) {
      pdf.addImage(imgData, 'JPEG', margin, margin, imgW, imgH);
    } else {
      let heightLeft = imgH;
      let position = 0;
      let pageCount = 0;

      while (heightLeft > 0) {
        if (pageCount > 0) pdf.addPage();
        pdf.addImage(imgData, 'JPEG', margin, margin - position, imgW, imgH);
        heightLeft -= contentH;
        position += contentH;
        pageCount++;
      }
    }

    pdf.save(pdfFilename);
    console.log('Fallback PDF exported successfully:', pdfFilename);
    return true;
  } catch (err) {
    console.error('Fallback PDF Export Error:', err);
    return false;
  }
}


import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } from 'docx';

// 2. Export DOCX via Native Word binary structure
export async function exportToDOCX(data: ResumeData): Promise<boolean> {
  try {
    const rawName = data.personalInfo.fullName ? data.personalInfo.fullName.trim() : '';
    const cleanName = rawName ? rawName.replace(/[/\\?%*:|"<>]/g, '').replace(/\s+/g, '_') : 'Resume';
    const filename = `${cleanName}_Resume.docx`;

    const children: Paragraph[] = [];

    // Header: Name
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 60 },
        children: [
          new TextRun({
            text: data.personalInfo.fullName || 'Candidate Name',
            bold: true,
            size: 32, // 16pt font
            color: '1E3A8A'
          })
        ]
      })
    );

    // Title
    if (data.personalInfo.professionalTitle) {
      children.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 120 },
          children: [
            new TextRun({
              text: data.personalInfo.professionalTitle,
              italics: true,
              size: 24, // 12pt
              color: '4B5563'
            })
          ]
        })
      );
    }

    // Contact Line
    const contactParts = [
      data.personalInfo.email,
      data.personalInfo.phone,
      data.personalInfo.address,
      data.personalInfo.linkedin,
      data.personalInfo.github,
      data.personalInfo.portfolio
    ].filter(Boolean);

    if (contactParts.length > 0) {
      children.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
          children: [
            new TextRun({
              text: contactParts.join('  |  '),
              size: 19, // 9.5pt
              color: '4B5563'
            })
          ],
          border: {
            bottom: { color: 'E5E7EB', space: 6, style: BorderStyle.SINGLE, size: 6 }
          }
        })
      );
    }

    // Helper for Section Headings
    const addSectionHeading = (title: string) => {
      children.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 240, after: 120 },
          children: [
            new TextRun({
              text: title.toUpperCase(),
              bold: true,
              size: 24, // 12pt
              color: '1E3A8A'
            })
          ],
          border: {
            bottom: { color: '1E3A8A', space: 2, style: BorderStyle.SINGLE, size: 8 }
          }
        })
      );
    };

    // Summary
    if (data.summary && data.summary.trim()) {
      addSectionHeading('Professional Summary');
      children.push(
        new Paragraph({
          spacing: { after: 120 },
          children: [
            new TextRun({
              text: data.summary,
              size: 21 // 10.5pt
            })
          ]
        })
      );
    }

    // Experience
    if (data.experience && data.experience.length > 0) {
      addSectionHeading('Work Experience');
      data.experience.forEach((exp) => {
        children.push(
          new Paragraph({
            spacing: { before: 120, after: 40 },
            children: [
              new TextRun({ text: exp.role || '', bold: true, size: 22 }),
              new TextRun({ text: ` at ${exp.company || ''}`, bold: true, size: 22 }),
              new TextRun({
                text: `    ${exp.startDate || ''} – ${exp.current ? 'Present' : exp.endDate || ''}`,
                bold: false,
                size: 20,
                color: '6B7280'
              })
            ]
          })
        );

        if (exp.location) {
          children.push(
            new Paragraph({
              spacing: { after: 40 },
              children: [
                new TextRun({ text: exp.location, italics: true, size: 19, color: '6B7280' })
              ]
            })
          );
        }

        if (exp.responsibilities) {
          const lines = exp.responsibilities.split('\n').map((l) => l.replace(/^•\s*/, '').trim()).filter(Boolean);
          lines.forEach((line) => {
            children.push(
              new Paragraph({
                bullet: { level: 0 },
                spacing: { after: 40 },
                children: [new TextRun({ text: line, size: 21 })]
              })
            );
          });
        }

        if (exp.achievements) {
          children.push(
            new Paragraph({
              bullet: { level: 0 },
              spacing: { after: 80 },
              children: [
                new TextRun({ text: 'Key Achievement: ', bold: true, size: 21 }),
                new TextRun({ text: exp.achievements, size: 21 })
              ]
            })
          );
        }
      });
    }

    // Education
    if (data.education && data.education.length > 0) {
      addSectionHeading('Education');
      data.education.forEach((edu) => {
        children.push(
          new Paragraph({
            spacing: { before: 120, after: 40 },
            children: [
              new TextRun({ text: edu.degree || '', bold: true, size: 22 }),
              new TextRun({
                text: `    ${edu.startYear || ''} – ${edu.endYear || ''}`,
                size: 20,
                color: '6B7280'
              })
            ]
          })
        );
        children.push(
          new Paragraph({
            spacing: { after: 80 },
            children: [
              new TextRun({
                text: `${edu.school || ''}${edu.city ? `, ${edu.city}` : ''}${edu.cgpaOrPercentage ? ` | Grade: ${edu.cgpaOrPercentage}` : ''}`,
                italics: true,
                size: 20,
                color: '4B5563'
              })
            ]
          })
        );
        if (edu.description) {
          children.push(
            new Paragraph({
              spacing: { after: 80 },
              children: [new TextRun({ text: edu.description, size: 20, italics: true })]
            })
          );
        }
      });
    }

    // Skills
    if (data.skills && data.skills.length > 0) {
      addSectionHeading('Skills');
      const tech = data.skills.filter((s) => s.type === 'technical').map((s) => s.name);
      const soft = data.skills.filter((s) => s.type === 'soft').map((s) => s.name);

      if (tech.length > 0) {
        children.push(
          new Paragraph({
            spacing: { after: 60 },
            children: [
              new TextRun({ text: 'Technical Skills: ', bold: true, size: 21 }),
              new TextRun({ text: tech.join(', '), size: 21 })
            ]
          })
        );
      }
      if (soft.length > 0) {
        children.push(
          new Paragraph({
            spacing: { after: 80 },
            children: [
              new TextRun({ text: 'Soft Skills: ', bold: true, size: 21 }),
              new TextRun({ text: soft.join(', '), size: 21 })
            ]
          })
        );
      }
    }

    // Projects
    if (data.projects && data.projects.length > 0) {
      addSectionHeading('Projects');
      data.projects.forEach((proj) => {
        children.push(
          new Paragraph({
            spacing: { before: 120, after: 40 },
            children: [
              new TextRun({ text: proj.name || '', bold: true, size: 22 }),
              ...(proj.githubLink
                ? [new TextRun({ text: ` (${proj.githubLink})`, size: 18, color: '2563EB' })]
                : [])
            ]
          })
        );
        children.push(
          new Paragraph({
            spacing: { after: 40 },
            children: [new TextRun({ text: proj.description || '', size: 21 })]
          })
        );
        if (proj.technologies && proj.technologies.length > 0) {
          children.push(
            new Paragraph({
              spacing: { after: 80 },
              children: [
                new TextRun({ text: 'Technologies: ', bold: true, size: 19, color: '4B5563' }),
                new TextRun({ text: proj.technologies.join(', '), size: 19, color: '4B5563' })
              ]
            })
          );
        }
      });
    }

    // Certifications
    if (data.certifications && data.certifications.length > 0) {
      addSectionHeading('Certifications');
      data.certifications.forEach((c) => {
        children.push(
          new Paragraph({
            bullet: { level: 0 },
            spacing: { after: 40 },
            children: [
              new TextRun({ text: c.name || '', bold: true, size: 21 }),
              new TextRun({ text: ` – ${c.issuer || ''} (${c.date || ''})`, size: 21 })
            ]
          })
        );
      });
    }

    // Internships
    if (data.internships && data.internships.length > 0) {
      addSectionHeading('Internships');
      data.internships.forEach((intern) => {
        children.push(
          new Paragraph({
            spacing: { before: 100, after: 40 },
            children: [
              new TextRun({ text: intern.role || '', bold: true, size: 21 }),
              new TextRun({ text: ` at ${intern.company || ''}`, bold: true, size: 21 }),
              new TextRun({ text: ` (${intern.duration || ''})`, size: 19, color: '6B7280' })
            ]
          })
        );
        children.push(
          new Paragraph({
            spacing: { after: 60 },
            children: [new TextRun({ text: intern.description || '', size: 20 })]
          })
        );
      });
    }

    // Achievements
    if (data.achievements && data.achievements.filter((a) => a.trim()).length > 0) {
      addSectionHeading('Achievements');
      data.achievements.filter((a) => a.trim()).forEach((ach) => {
        children.push(
          new Paragraph({
            bullet: { level: 0 },
            spacing: { after: 40 },
            children: [new TextRun({ text: ach, size: 21 })]
          })
        );
      });
    }

    // Languages
    if (data.languages && data.languages.length > 0) {
      addSectionHeading('Languages');
      children.push(
        new Paragraph({
          spacing: { after: 80 },
          children: [
            new TextRun({
              text: data.languages.map((l) => `${l.name} (${l.speaking})`).join('  •  '),
              size: 21
            })
          ]
        })
      );
    }

    // Interests
    if (data.interests && data.interests.filter((i) => i.trim()).length > 0) {
      addSectionHeading('Interests');
      children.push(
        new Paragraph({
          spacing: { after: 80 },
          children: [
            new TextRun({
              text: data.interests.filter((i) => i.trim()).join(', '),
              size: 21
            })
          ]
        })
      );
    }

    // References
    if (data.references && data.references.length > 0) {
      addSectionHeading('References');
      data.references.forEach((ref) => {
        children.push(
          new Paragraph({
            spacing: { before: 80, after: 40 },
            children: [
              new TextRun({ text: ref.name || '', bold: true, size: 21 }),
              new TextRun({ text: ` – ${ref.role || ''}${ref.company ? `, ${ref.company}` : ''}`, italics: true, size: 20 })
            ]
          })
        );
        if (ref.email || ref.phone) {
          children.push(
            new Paragraph({
              spacing: { after: 60 },
              children: [
                new TextRun({
                  text: [ref.email ? `Email: ${ref.email}` : '', ref.phone ? `Phone: ${ref.phone}` : ''].filter(Boolean).join(' | '),
                  size: 19,
                  color: '6B7280'
                })
              ]
            })
          );
        }
      });
    }

    // Construct Document
    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } // 1 inch margins (1440 twips)
            }
          },
          children
        }
      ]
    });

    // Generate blob and download
    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    console.error('DOCX Export Error:', error);
    return false;
  }
}

// 3. Export to Plain Text TXT
export function exportToTXT(data: ResumeData) {
  const divider = '\n' + '='.repeat(60) + '\n';
  const subDivider = '-'.repeat(40);
  
  let txt = '';
  txt += `${data.personalInfo.fullName.toUpperCase()}\n`;
  txt += `${data.personalInfo.professionalTitle}\n`;
  txt += `${data.personalInfo.email} | ${data.personalInfo.phone} | ${data.personalInfo.address}\n`;
  if (data.personalInfo.linkedin) txt += `LinkedIn: ${data.personalInfo.linkedin}\n`;
  if (data.personalInfo.github) txt += `GitHub: ${data.personalInfo.github}\n`;
  if (data.personalInfo.portfolio) txt += `Portfolio: ${data.personalInfo.portfolio}\n`;
  
  txt += divider;
  txt += 'PROFESSIONAL SUMMARY\n';
  txt += subDivider + '\n';
  txt += `${data.summary || 'N/A'}\n`;
  
  txt += divider;
  txt += 'EXPERIENCE\n';
  txt += subDivider + '\n';
  if (data.experience.length > 0) {
    data.experience.forEach(exp => {
      txt += `${exp.role.toUpperCase()} - ${exp.company}\n`;
      txt += `${exp.startDate} to ${exp.current ? 'Present' : exp.endDate} | ${exp.location || ''}\n`;
      txt += `Responsibilities:\n${exp.responsibilities}\n`;
      if (exp.achievements) txt += `Key Achievement: ${exp.achievements}\n`;
      txt += '\n';
    });
  } else {
    txt += 'N/A\n';
  }
  
  txt += divider;
  txt += 'EDUCATION\n';
  txt += subDivider + '\n';
  if (data.education.length > 0) {
    data.education.forEach(edu => {
      txt += `${edu.degree} | ${edu.school} (${edu.startYear} - ${edu.endYear})\n`;
      if (edu.cgpaOrPercentage) txt += `Grade: ${edu.cgpaOrPercentage}\n`;
      if (edu.description) txt += `${edu.description}\n`;
      txt += '\n';
    });
  } else {
    txt += 'N/A\n';
  }
  
  txt += divider;
  txt += 'SKILLS\n';
  txt += subDivider + '\n';
  const techSkills = data.skills.filter(s => s.type === 'technical').map(s => s.name);
  const softSkills = data.skills.filter(s => s.type === 'soft').map(s => s.name);
  txt += `Technical: ${techSkills.join(', ') || 'N/A'}\n`;
  txt += `Soft Skills: ${softSkills.join(', ') || 'N/A'}\n`;
  
  txt += divider;
  txt += 'PROJECTS\n';
  txt += subDivider + '\n';
  if (data.projects.length > 0) {
    data.projects.forEach(p => {
      txt += `${p.name.toUpperCase()}\n`;
      if (p.githubLink) txt += `Code: ${p.githubLink}\n`;
      if (p.liveLink) txt += `Demo: ${p.liveLink}\n`;
      txt += `Description: ${p.description}\n`;
      txt += `Technologies: ${p.technologies.join(', ')}\n`;
      if (p.achievements) txt += `Key Outcome: ${p.achievements}\n`;
      txt += '\n';
    });
  } else {
    txt += 'N/A\n';
  }

  txt += divider;
  txt += 'CERTIFICATIONS\n';
  txt += subDivider + '\n';
  if (data.certifications.length > 0) {
    data.certifications.forEach(c => {
      txt += `${c.name} - ${c.issuer} (${c.date})\n`;
      if (c.credentialId) txt += `ID: ${c.credentialId}\n`;
      txt += '\n';
    });
  } else {
    txt += 'N/A\n';
  }

  txt += divider;
  txt += 'INTERNSHIPS\n';
  txt += subDivider + '\n';
  if (data.internships.length > 0) {
    data.internships.forEach(intern => {
      txt += `${intern.role.toUpperCase()} - ${intern.company}\n`;
      txt += `${intern.duration}\n`;
      txt += `${intern.description}\n`;
      txt += '\n';
    });
  } else {
    txt += 'N/A\n';
  }

  txt += divider;
  txt += 'ACHIEVEMENTS\n';
  txt += subDivider + '\n';
  if (data.achievements.filter(a => a.trim()).length > 0) {
    data.achievements.filter(a => a.trim()).forEach(ach => {
      txt += `• ${ach}\n`;
    });
  } else {
    txt += 'N/A\n';
  }

  txt += divider;
  txt += 'LANGUAGES\n';
  txt += subDivider + '\n';
  if (data.languages.length > 0) {
    txt += data.languages.map(l => `${l.name}: ${l.speaking} (Speaking), ${l.reading} (Reading), ${l.writing} (Writing)`).join('\n');
    txt += '\n';
  } else {
    txt += 'N/A\n';
  }

  txt += divider;
  txt += 'INTERESTS\n';
  txt += subDivider + '\n';
  if (data.interests.filter(i => i.trim()).length > 0) {
    txt += data.interests.filter(i => i.trim()).join(', ');
    txt += '\n';
  } else {
    txt += 'N/A\n';
  }

  txt += divider;
  txt += 'REFERENCES\n';
  txt += subDivider + '\n';
  if (data.references.length > 0) {
    data.references.forEach(ref => {
      txt += `${ref.name.toUpperCase()}\n`;
      txt += `${ref.role}${ref.company ? ` at ${ref.company}` : ''}\n`;
      if (ref.phone) txt += `Phone: ${ref.phone}\n`;
      if (ref.email) txt += `Email: ${ref.email}\n`;
      txt += '\n';
    });
  } else {
    txt += 'N/A\n';
  }

  const blob = new Blob([txt], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${data.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// 4. Export to JSON Schema
export function exportToJSON(data: ResumeData, theme: any, templateId: string) {
  const bundle = {
    id: data.id,
    title: data.title,
    lastSaved: new Date().toISOString(),
    personalInfo: data.personalInfo,
    summary: data.summary,
    education: data.education,
    skills: data.skills,
    experience: data.experience,
    projects: data.projects,
    certifications: data.certifications,
    internships: data.internships,
    achievements: data.achievements,
    languages: data.languages,
    interests: data.interests,
    references: data.references,
    themeSettings: theme,
    templateId
  };

  const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${data.title.replace(/\s+/g, '_')}_backup.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// 5. Print only the resume preview (not the entire page)
export function printResume() {
  try {
    window.print();
  } catch (error) {
    console.error('Print Error:', error);
    alert('Failed to launch print dialog.');
  }
}
