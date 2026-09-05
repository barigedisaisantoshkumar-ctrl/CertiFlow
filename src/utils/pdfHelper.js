import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/**
 * downloadCertificatePdf
 * 
 * Captures the exact rendered CertificateTemplate DOM element directly,
 * using html2canvas `onclone` callback to reset parent scale transforms
 * and outputs a standard A4 Landscape PDF (297mm x 210mm).
 */
export async function downloadCertificatePdf(sourceElement, fileName = 'HPS_Verified_Certificate.pdf') {
  if (!sourceElement) return;

  const canvas = await html2canvas(sourceElement, {
    scale: 3,
    useCORS: true,
    logging: false,
    backgroundColor: '#FFFFFF',
    onclone: (clonedDoc) => {
      const certNode = clonedDoc.getElementById('certificate-print-container');
      if (certNode) {
        let parent = certNode.parentElement;
        while (parent && parent !== clonedDoc.body) {
          parent.style.transform = 'none';
          parent.style.width = 'auto';
          parent.style.height = 'auto';
          parent.style.overflow = 'visible';
          parent = parent.parentElement;
        }

        // Set to exact 950px x 672px (1.414 A4 Landscape Proportions)
        certNode.style.width = '950px';
        certNode.style.height = '672px';
        certNode.style.transform = 'none';
      }
    },
  });

  const imgData = canvas.toDataURL('image/png');

  // Standard Official A4 Landscape PDF document (297mm x 210mm)
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  // Fit image to full 297mm x 210mm A4 Landscape page
  pdf.addImage(imgData, 'PNG', 0, 0, 297, 210);
  pdf.save(fileName);
}
