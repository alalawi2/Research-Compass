import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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

interface BudgetCategory {
  category: string;
  amount: number;
  description?: string;
}

interface BudgetData {
  projectTitle: string;
  categories: BudgetCategory[];
  totalBudget: number;
}

interface Milestone {
  name: string;
  startDate: string;
  endDate: string;
  status: string;
  description: string;
}

interface TimelineData {
  projectTitle: string;
  projectStartDate?: string;
  projectEndDate?: string;
  milestones: Milestone[];
}

export function exportProposalToPDF(data: ProposalData) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let yPosition = 20;

  // Title
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(data.title || 'Research Proposal', margin, yPosition);
  yPosition += 15;

  // Project Info
  if (data.projectInfo) {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    if (data.projectInfo.studyType) {
      doc.text(`Study Type: ${data.projectInfo.studyType}`, margin, yPosition);
      yPosition += 7;
    }
    if (data.projectInfo.createdAt) {
      doc.text(`Created: ${new Date(data.projectInfo.createdAt).toLocaleDateString()}`, margin, yPosition);
      yPosition += 10;
    }
  }

  // Sections
  data.sections.forEach((section) => {
    // Check if we need a new page
    if (yPosition > 270) {
      doc.addPage();
      yPosition = 20;
    }

    // Section Title
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(section.title, margin, yPosition);
    yPosition += 8;

    // Section Content
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    const lines = doc.splitTextToSize(section.content || '', pageWidth - 2 * margin);
    
    lines.forEach((line: string) => {
      if (yPosition > 280) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(line, margin, yPosition);
      yPosition += 6;
    });

    yPosition += 5;
  });

  // Footer
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(
      `Page ${i} of ${totalPages}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }

  doc.save(`${data.title || 'proposal'}.pdf`);
}

export function exportBudgetToPDF(data: BudgetData) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;

  // Title
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Research Budget', margin, 20);

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(data.projectTitle, margin, 30);

  // Budget Table
  const tableData = data.categories.map(cat => [
    cat.category,
    cat.description || '',
    `$${cat.amount.toLocaleString()}`
  ]);

  autoTable(doc, {
    startY: 40,
    head: [['Category', 'Description', 'Amount']],
    body: tableData,
    foot: [['Total Budget', '', `$${data.totalBudget.toLocaleString()}`]],
    theme: 'grid',
    headStyles: { fillColor: [66, 139, 202], fontStyle: 'bold' },
    footStyles: { fillColor: [240, 240, 240], fontStyle: 'bold' },
    styles: { fontSize: 10 },
  });

  doc.save(`${data.projectTitle}_budget.pdf`);
}

export function exportTimelineToPDF(data: TimelineData) {
  const doc = new jsPDF();
  const margin = 20;

  // Title
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Research Timeline', margin, 20);

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(data.projectTitle, margin, 30);

  // Project Duration
  if (data.projectStartDate && data.projectEndDate) {
    doc.setFontSize(10);
    doc.text(
      `Project Duration: ${new Date(data.projectStartDate).toLocaleDateString()} - ${new Date(data.projectEndDate).toLocaleDateString()}`,
      margin,
      38
    );
  }

  // Timeline Table
  const tableData = data.milestones.map(milestone => [
    milestone.name,
    milestone.description,
    new Date(milestone.startDate).toLocaleDateString(),
    new Date(milestone.endDate).toLocaleDateString(),
    milestone.status.charAt(0).toUpperCase() + milestone.status.slice(1)
  ]);

  autoTable(doc, {
    startY: 45,
    head: [['Milestone', 'Description', 'Start Date', 'End Date', 'Status']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [66, 139, 202], fontStyle: 'bold' },
    styles: { fontSize: 9 },
    columnStyles: {
      0: { cellWidth: 35 },
      1: { cellWidth: 60 },
      2: { cellWidth: 25 },
      3: { cellWidth: 25 },
      4: { cellWidth: 25 },
    },
  });

  doc.save(`${data.projectTitle}_timeline.pdf`);
}
