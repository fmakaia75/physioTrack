import jsPDF from 'jspdf';
import { Session } from './page';

type GenerateWeeklyPlanPDFProps = {
  clientName: string;
  program: Session[];
};

export function generateWeeklyPlanPDF({ clientName, program }: GenerateWeeklyPlanPDFProps) {
  const doc = new jsPDF();

  // Set font
  doc.setFont('helvetica', 'bold');

  // Add title
  doc.setFontSize(20);
  doc.text(`7-Day Plan for ${clientName}`, 20, 20);

  // Reset font
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);

  let yPosition = 40;

  // Add each day's plan
  program.forEach((session, index) => {
    const sessionDate = new Date(session.date);
    const dayName = sessionDate.toLocaleDateString('en-US', { weekday: 'long' });
    const dateString = sessionDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    // Add day and date
    doc.setFont('helvetica', 'bold');
    doc.text(`${dayName} (${dateString}):`, 20, yPosition);
    yPosition += 10;

    // Reset font
    doc.setFont('helvetica', 'normal');

    // Add exercises
    session.exercises.forEach((exercise) => {
      doc.text(`- ${exercise.name}: ${exercise.description}`, 30, yPosition);
      yPosition += 7;
    });

    yPosition += 10;

    // Add a new page if we're running out of space
    if (yPosition > 280 && index < program.length - 1) {
      doc.addPage();
      yPosition = 20;
    }
  });

  // Generate Blob URL
  const pdfBlob = doc.output('blob');
  const pdfUrl = URL.createObjectURL(pdfBlob);

  // Open in new tab
  window.open(pdfUrl, '_blank');
}
