import React, { useRef, useState, useEffect } from 'react';

/**
 * ResponsiveCertificateViewer
 * 
 * Scales fixed-dimension certificate layout (950px x 672px A4 Landscape)
 * smoothly down to match any screen/container width, acting like a responsive image.
 * Guarantees zero horizontal scroll, zero vertical clipping, and 100% visibility of all certificate elements on mobile devices.
 */
export function ResponsiveCertificateViewer({ children, baseWidth = 950, baseHeight = 672, className = '' }) {
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const updateScale = () => {
      if (!containerRef.current) return;
      const availableWidth = containerRef.current.clientWidth;
      if (availableWidth > 0) {
        const newScale = Math.min(availableWidth / baseWidth, 1);
        setScale(newScale);
      }
    };

    updateScale();

    const observer = new ResizeObserver(() => {
      updateScale();
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [baseWidth]);

  return (
    <div ref={containerRef} className={`w-full flex justify-center items-center ${className}`}>
      <div
        style={{
          width: `${baseWidth * scale}px`,
          height: `${baseHeight * scale}px`,
          position: 'relative',
          overflow: 'hidden',
          transition: 'width 0.1s ease-out, height 0.1s ease-out',
        }}
        className="rounded-xl shadow-2xl border border-slate-200/90 bg-white shrink-0"
      >
        <div
          style={{
            width: `${baseWidth}px`,
            height: `${baseHeight}px`,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            position: 'absolute',
            top: 0,
            left: 0,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
