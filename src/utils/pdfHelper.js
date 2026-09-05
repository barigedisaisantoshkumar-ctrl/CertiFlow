import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/**
 * downloadCertificatePdf
 * 
 * Clones the certificate element into an off-screen unscaled container 
 * (850px x 601px) to prevent CSS transform scaling artifact text collisions 
 * in html2canvas, generating a crisp, professional 300 DPI PDF.
 */
export async function downloadCertificatePdf(sourceElement, fileName = 'HPS_Verified_Certificate.pdf') {
  if (!sourceElement) return;

  // 1. Create temporary off-screen container with 1:1 unscaled dimensions
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '-9999px';
  container.style.top = '-9999px';
  container.style.width = '850px';
  container.style.height = '601px';
  container.style.zIndex = '-9999';

  // 2. Clone certificate element and force reset transforms
  const clone = sourceElement.cloneNode(true);
  clone.style.width = '850px';
  clone.style.height = '601px';
  clone.style.transform = 'none';

  container.appendChild(clone);
  document.body.appendChild(container);

  try {
    // 3. Small pause to allow layout & canvas assets to settle in clone
    await new Promise((resolve) => setTimeout(resolve, 150));

    // 4. Render high-resolution canvas
    const canvas = await html2canvas(clone, {
      scale: 3,
      useCORS: true,
      logging: false,
      backgroundColor: '#FFFFFF',
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [canvas.width, canvas.height],
    });

    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save(fileName);
  } finally {
    // 5. Clean up temporary DOM node
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
  }
}
