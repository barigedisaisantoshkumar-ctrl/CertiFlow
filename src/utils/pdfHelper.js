import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/**
 * downloadCertificatePdf
 * 
 * Captures the exact rendered CertificateTemplate DOM element directly, 
 * using html2canvas `onclone` callback to reset parent scale transforms.
 * This guarantees all pre-loaded images (logo, signatures, corner shapes) 
 * and exact original layout typography remain 100% identical in the PDF.
 */
export async function downloadCertificatePdf(sourceElement, fileName = 'HPS_Verified_Certificate.pdf') {
  if (!sourceElement) return;

  const canvas = await html2canvas(sourceElement, {
    scale: 3,
    useCORS: true,
    logging: false,
    backgroundColor: '#FFFFFF',
    onclone: (clonedDoc) => {
      // Find the print container in the cloned document
      const certNode = clonedDoc.getElementById('certificate-print-container');
      if (certNode) {
        // Strip scale transforms from parent containers in clone so html2canvas measures standard unscaled desktop bounds
        let parent = certNode.parentElement;
        while (parent && parent !== clonedDoc.body) {
          parent.style.transform = 'none';
          parent.style.width = 'auto';
          parent.style.height = 'auto';
          parent.style.overflow = 'visible';
          parent = parent.parentElement;
        }

        // Force desktop width dimensions on the certificate node in cloned document
        certNode.style.width = '850px';
        certNode.style.height = '601px';
        certNode.style.transform = 'none';
      }
    },
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'px',
    format: [canvas.width, canvas.height],
  });

  pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
  pdf.save(fileName);
}
