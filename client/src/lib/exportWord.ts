import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';

interface ProposalSection {
  title: string;
  content: string;
}

interface ProposalData {
  title: string;
  sections: ProposalSection[];
  projectInfo?: {
    studyType?: string;
    createdAt?: Date;
  };
}

export async function exportProposalToWord(data: ProposalData) {
  const children: Paragraph[] = [];

  // Title
  children.push(
    new Paragraph({
      text: data.title || 'Research Proposal',
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
    })
  );

  // Project Info
  if (data.projectInfo) {
    if (data.projectInfo.studyType) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `Study Type: ${data.projectInfo.studyType}`,
              bold: true,
            }),
          ],
          spacing: { after: 200 },
        })
      );
    }
    if (data.projectInfo.createdAt) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `Created: ${new Date(data.projectInfo.createdAt).toLocaleDateString()}`,
            }),
          ],
          spacing: { after: 400 },
        })
      );
    }
  }

  // Sections
  data.sections.forEach((section) => {
    // Section Title
    children.push(
      new Paragraph({
        text: section.title,
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 200 },
      })
    );

    // Section Content - split by paragraphs
    const paragraphs = section.content.split('\n').filter(p => p.trim());
    paragraphs.forEach((para) => {
      children.push(
        new Paragraph({
          text: para,
          spacing: { after: 200 },
        })
      );
    });
  });

  const doc = new Document({
    sections: [
      {
        properties: {},
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${data.title || 'proposal'}.docx`);
}
