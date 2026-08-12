import React, { useEffect, useRef, useState } from 'react';

const Car3DViewer = ({ modelUrl, imageUrl, className }) => {
  const wrapperRef = useRef(null);
  const viewerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return undefined;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setIsVisible(true);
      });
    }, { threshold: 0.25 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const mv = viewerRef.current;
    if (!mv) return;
    // Keep attribute in sync
    if (autoRotate) mv.setAttribute('auto-rotate', '');
    else mv.removeAttribute('auto-rotate');
  }, [autoRotate]);

  const toggleRotate = () => setAutoRotate((v) => !v);

  const resetCamera = () => {
    const mv = viewerRef.current;
    if (mv && typeof mv.resetCamera === 'function') {
      try { mv.resetCamera(); } catch (e) { /* ignore */ }
    }
  };

  // Accessibility: provide aria-label and a simple image fallback.
  return (
    <div ref={wrapperRef} className={className} style={{ width: '100%', height: '420px', position: 'relative' }}>
      {modelUrl && isVisible ? (
        <model-viewer
          ref={viewerRef}
          src={modelUrl}
          poster={imageUrl}
          alt="3D car model"
          exposure="1"
          camera-controls
          ar
          loading="lazy"
          style={{ width: '100%', height: '420px', background: 'transparent' }}
          aria-label="3D model viewer showing the car. Use keyboard or mouse to rotate and zoom."
        />
      ) : (
        <div style={{ width: '100%', height: '420px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#071024' }}>
          <img src={imageUrl} alt="car" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'cover' }} />
        </div>
      )}

      {/* Controls overlay */}
      <div style={{ position: 'absolute', right: 10, bottom: 10, display: 'flex', gap: 8, zIndex: 30 }}>
        <button aria-pressed={autoRotate} onClick={toggleRotate} className="bg-amber-500 text-slate-900 px-3 py-1 rounded-md shadow">{autoRotate ? 'Stop' : 'Rotate'}</button>
        <button onClick={resetCamera} className="bg-slate-800 text-white px-3 py-1 rounded-md shadow">Reset</button>
      </div>
    </div>
  );
};

export default Car3DViewer;
