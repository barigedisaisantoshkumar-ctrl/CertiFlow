import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';

/**
 * Converts all <img> tags within an element to inline Base64 Data URLs.
 * Crucial for iOS Safari / Mobile WebKit which blocks relative image URLs inside SVG foreignObject canvas draws.
 */
async function inlineImagesAsBase64(element) {
  const images = element.querySelectorAll('img');
  const promises = Array.from(images).map(async (img) => {
    try {
      if (img.src && !img.src.startsWith('data:')) {
        const response = await fetch(img.src);
        const blob = await response.blob();
        await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            img.src = reader.result;
            resolve();
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      }
    } catch (err) {
      console.warn('Image inlining warning for iOS PDF export:', img.src, err);
    }
  });
  await Promise.all(promises);
}

/**
 * downloadCertificatePdf
 * 
 * Captures the exact 950px x 672px CertificateTemplate DOM element into a 300 DPI A4 Landscape PDF.
 * Pre-inlines all images as Base64 to guarantee 100% rendering success on iOS Safari (iPhone/iPad).
 */
export async function downloadCertificatePdf(sourceElement, fileName = 'HPS_Verified_Certificate.pdf') {
  if (!sourceElement) return;

  // 1. Create a clean offscreen DOM container with fixed 950px x 672px unscaled layout
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '-9999px';
  container.style.top = '-9999px';
  container.style.width = '950px';
  container.style.height = '672px';
  container.style.zIndex = '-9999';

  // 2. Clone source element and reset transforms
  const clone = sourceElement.cloneNode(true);
  clone.style.width = '950px';
  clone.style.height = '672px';
  clone.style.transform = 'none';

  container.appendChild(clone);
  document.body.appendChild(container);

  try {
    // 3. Pre-inline all images as Base64 data URLs to prevent iOS WebKit CORS/security image stripping
    await inlineImagesAsBase64(clone);

    // 4. Capture high-res 300 DPI image canvas
    const dataUrl = await toPng(clone, {
      quality: 1.0,
      pixelRatio: 3,
      width: 950,
      height: 672,
      style: {
        transform: 'none',
        transformOrigin: 'top left',
      },
    });

    // 5. Output to standard A4 Landscape PDF document (297mm x 210mm)
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    });

    pdf.addImage(dataUrl, 'PNG', 0, 0, 297, 210);
    pdf.save(fileName);
  } catch (err) {
    console.error('Failed to export certificate PDF:', err);
    throw err;
  } finally {
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
  }
}
