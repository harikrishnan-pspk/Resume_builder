import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { ResumeData, ThemeSettings } from '../types/resume';

// 1. High-Performance, Non-Freezing Asynchronous PDF Exporter
export async function exportToPDF(elementId: string, filename: string, pageSize: 'A4' | 'Letter' = 'A4'): Promise<boolean> {
  // Yield execution to allow React state / UI spinner to paint before heavy operations
  await new Promise((resolve) => setTimeout(resolve, 60));

  const sourceElement = document.getElementById(elementId) || 
    document.getElementById('resume-document') || 
    document.getElementById('resume-preview-container');

  if (!sourceElement) {
    console.error('PDF Export Error: Resume element not found');
    return false;
  }

  // Format & sanitize filename safely
  const rawName = filename && filename.trim() ? filename.trim() : 'Resume';
  const cleanName = rawName.replace(/[/\\?%*:|"<>]/g, '').replace(/\s+/g, '_') || 'Resume';
  const pdfFilename = cleanName.endsWith('.pdf') ? cleanName : `${cleanName}.pdf`;

  // Standard dimensions (in mm and px at 96 DPI standard A4 width ~794px)
  const isLetter = pageSize.toLowerCase() === 'letter';
  const pageWidthMm = isLetter ? 215.9 : 210;
  const pageHeightMm = isLetter ? 279.4 : 297;
  
  // Clone element into an isolated, off-screen rendering sandbox to prevent dark mode bleed & UI lock
  const cloneWrapper = document.createElement('div');
  cloneWrapper.setAttribute('id', 'pdf-export-sandbox');
  cloneWrapper.style.position = 'fixed';
  cloneWrapper.style.left = '-99999px';
  cloneWrapper.style.top = '0';
  cloneWrapper.style.width = '794px';
  cloneWrapper.style.minHeight = '1123px';
  cloneWrapper.style.zIndex = '-9999';
  cloneWrapper.style.background = '#ffffff';
  cloneWrapper.style.color = '#111827';
  cloneWrapper.style.margin = '0';
  cloneWrapper.style.padding = '0';
  cloneWrapper.style.boxSizing = 'border-box';
  cloneWrapper.style.overflow = 'visible';

  // Clone source DOM tree
  const clone = sourceElement.cloneNode(true) as HTMLElement;
  clone.style.width = '794px';
  clone.style.maxWidth = '794px';
  clone.style.minHeight = '1123px';
  clone.style.margin = '0';
  clone.style.boxShadow = 'none';
  clone.style.border = 'none';
  clone.style.borderRadius = '0';

  // Strip application dark mode class if inherited
  clone.classList.remove('dark');
  cloneWrapper.appendChild(clone);
  document.body.appendChild(cloneWrapper);

  try {
    // 1. Ensure fonts are loaded
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }

    // 2. Wait for all images in clone to be decoded and loaded
    const images = Array.from(clone.querySelectorAll('img'));
    if (images.length > 0) {
      await Promise.all(
        images.map((img) => {
          if (img.complete && img.naturalHeight !== 0) return Promise.resolve();
          return new Promise<void>((res) => {
            img.onload = () => res();
            img.onerror = () => res();
            setTimeout(res, 2000); // 2s safety timeout per image
          });
        })
      );
    }

    // 3. Smart Multi-Page Break Adjustment:
    // A4 page height at 794px width is ~1123px
    const pagePxHeight = isLetter ? Math.round(794 * (279.4 / 215.9)) : 1123;
    const totalHeight = clone.scrollHeight || clone.offsetHeight;

    if (totalHeight > pagePxHeight) {
      // Small atomic elements only (never whole sections or large entry blocks)
      // Only adjust if the push-down distance is small (<= 40px) to prevent large blank gaps
      const MAX_PUSH_DOWN_PX = 40;
      const MAX_BLOCK_HEIGHT_PX = 90;
      const blocks = Array.from(clone.querySelectorAll('h1, h2, h3, h4, h5, h6, li, tr, .break-inside-avoid')) as HTMLElement[];
      const cloneRect = clone.getBoundingClientRect();

      let accumulatedOffset = 0;
      let currentPage = 1;

      for (const block of blocks) {
        const blockRect = block.getBoundingClientRect();
        if (blockRect.height === 0 || blockRect.height > MAX_BLOCK_HEIGHT_PX) continue;

        const blockTopRelativeToClone = (blockRect.top - cloneRect.top) + accumulatedOffset;
        const blockBottomRelativeToClone = blockTopRelativeToClone + blockRect.height;
        let targetPageBoundary = currentPage * pagePxHeight;

        while (blockTopRelativeToClone >= targetPageBoundary) {
          currentPage++;
          targetPageBoundary = currentPage * pagePxHeight;
        }

        // If the block crosses the boundary and only requires a small adjustment
        if (blockTopRelativeToClone < targetPageBoundary && blockBottomRelativeToClone > targetPageBoundary) {
          const pushDownAmount = targetPageBoundary - blockTopRelativeToClone;
          if (pushDownAmount > 0 && pushDownAmount <= MAX_PUSH_DOWN_PX) {
            const spacer = document.createElement('div');
            spacer.style.height = `${pushDownAmount + 4}px`;
            spacer.style.width = '100%';
            spacer.style.display = 'block';
            spacer.className = 'pdf-page-spacer';
            block.parentNode?.insertBefore(spacer, block);
            accumulatedOffset += pushDownAmount + 4;
            currentPage++;
          }
        }
      }
    }

    // Yield to allow DOM adjustments to settle
    await new Promise((resolve) => setTimeout(resolve, 30));

    // 4. Capture clone via high-DPI canvas
    const canvas = await html2canvas(clone, {
      scale: 2,
      useCORS: true,
      allowTaint: false,
      logging: false,
      backgroundColor: '#ffffff',
      width: 794,
      windowWidth: 794,
      scrollX: 0,
      scrollY: 0,
    });

    // 5. Generate Multi-page PDF via jsPDF
    const pdf = new jsPDF({
      unit: 'mm',
      format: isLetter ? 'letter' : 'a4',
      orientation: 'portrait',
      compress: true,
    });

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    
    // Total physical height in mm corresponding to canvas
    const imgHeightMm = (canvasHeight * pageWidthMm) / canvasWidth;
    let heightLeftMm = imgHeightMm;
    let pageIndex = 0;

    // Canvas slicing per A4 page to prevent distortion
    const pageCanvasHeight = Math.round((pageHeightMm * canvasWidth) / pageWidthMm);

    while (heightLeftMm > 0) {
      if (pageIndex > 0) {
        pdf.addPage();
      }

      // Create a slice canvas for this specific page
      const pageCanvas = document.createElement('canvas');
      pageCanvas.width = canvasWidth;
      pageCanvas.height = Math.min(pageCanvasHeight, canvasHeight - pageIndex * pageCanvasHeight);
      
      const ctx = pageCanvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
        ctx.drawImage(
          canvas,
          0,
          pageIndex * pageCanvasHeight,
          canvasWidth,
          pageCanvas.height,
          0,
          0,
          canvasWidth,
          pageCanvas.height
        );

        const pageImgData = pageCanvas.toDataURL('image/jpeg', 0.98);
        const sliceHeightMm = (pageCanvas.height * pageWidthMm) / canvasWidth;
        pdf.addImage(pageImgData, 'JPEG', 0, 0, pageWidthMm, sliceHeightMm);
      }

      heightLeftMm -= pageHeightMm;
      pageIndex++;
    }

    pdf.save(pdfFilename);
    console.log('PDF successfully generated & downloaded:', pdfFilename);
    return true;
  } catch (error) {
    console.error('PDF Generation Error:', error);
    return false;
  } finally {
    // Always clean up off-screen clone sandbox from DOM
    if (cloneWrapper && cloneWrapper.parentNode) {
      cloneWrapper.parentNode.removeChild(cloneWrapper);
    }
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
        const nameLine: import('docx').IRunOptions[] = [
          { text: proj.name || '', bold: true, size: 22 }
        ];
        children.push(
          new Paragraph({
            spacing: { before: 120, after: 40 },
            children: nameLine.map((r) => new TextRun(r))
          })
        );
        // Live Demo link
        if (proj.liveLink) {
          children.push(
            new Paragraph({
              spacing: { after: 20 },
              children: [
                new TextRun({ text: 'Live Demo: ', bold: true, size: 19, color: '2563EB' }),
                new TextRun({ text: proj.liveLink.replace(/^https?:\/\//, ''), size: 19, color: '2563EB' })
              ]
            })
          );
        }
        // GitHub link
        if (proj.githubLink) {
          children.push(
            new Paragraph({
              spacing: { after: 20 },
              children: [
                new TextRun({ text: 'GitHub: ', bold: true, size: 19, color: '374151' }),
                new TextRun({ text: proj.githubLink.replace(/^https?:\/\//, ''), size: 19, color: '374151' })
              ]
            })
          );
        }
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
export function exportToJSON(data: ResumeData, theme: ThemeSettings, templateId: string) {
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
