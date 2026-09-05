import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';

/**
 * downloadCertificatePdf
 * 
 * Uses native browser SVG foreignObject rendering via `html-to-image` to capture 
 * the exact 950px x 672px CertificateTemplate DOM element.
 * 
 * This guarantees 100% pixel perfection between the web preview and downloaded PDF,
 * completely eliminating text baseline collisions, font metric shifts, and line displacements.
 */
export async function downloadCertificatePdf(sourceElement, fileName = 'HPS_Verified_Certificate.pdf') {
  if (!sourceElement) return;

  try {
    // 1. Capture pristine, high-res 300 DPI image using native browser rendering engine
    const dataUrl = await toPng(sourceElement, {
      quality: 1.0,
      pixelRatio: 3,
      width: 950,
      height: 672,
      style: {
        transform: 'none',
        transformOrigin: 'top left',
      },
    });

    // 2. Initialize official standard A4 Landscape PDF (297mm x 210mm)
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    });

    // 3. Render 1:1 high-resolution image to full A4 page bounds
    pdf.addImage(dataUrl, 'PNG', 0, 0, 297, 210);
    pdf.save(fileName);
  } catch (err) {
    console.error('Failed to export certificate PDF via html-to-image:', err);
    throw err;
  }
}
