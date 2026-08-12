import React, { useEffect, useRef, useState } from 'react';

const Car3DViewer = ({ modelUrl, imageUrl, className, posterUrl, exposure = 1, shadowIntensity = 1, environmentImage, cameraOrbit = '0deg 75deg 4m' }) => {
  const wrapperRef = useRef(null);
  const viewerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [autoRotateSpeed, setAutoRotateSpeed] = useState(60);
  const [currentOrbit, setCurrentOrbit] = useState(cameraOrbit);

  useEffect(() => {
    // Immediately mark visible when a model URL is available so the viewer mounts
    if (modelUrl) setIsVisible(true);
    else {
      const el = wrapperRef.current;
      if (!el) return undefined;
      const obs = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setIsVisible(true);
        });
      }, { threshold: 0.25 });
      obs.observe(el);
      return () => obs.disconnect();
    }
    return undefined;
  }, [modelUrl]);

  useEffect(() => {
    const mv = viewerRef.current;
    if (!mv) return;
    // Keep attributes in sync
    if (autoRotate) mv.setAttribute('auto-rotate', '');
    else mv.removeAttribute('auto-rotate');
    try { mv.setAttribute('exposure', String(exposure)); } catch {}
    try { mv.setAttribute('shadow-intensity', String(shadowIntensity)); } catch {}
    try { mv.setAttribute('auto-rotate-speed', String(autoRotateSpeed)); } catch {}
    if (environmentImage) mv.setAttribute('environment-image', environmentImage);
    try { mv.setAttribute('camera-orbit', currentOrbit || cameraOrbit); } catch {}
  }, [autoRotate, exposure, shadowIntensity, environmentImage, autoRotateSpeed, cameraOrbit]);

  const toggleRotate = () => setAutoRotate((v) => !v);

  const resetCamera = () => {
    const mv = viewerRef.current;
    if (mv && typeof mv.resetCamera === 'function') {
      try { mv.resetCamera(); } catch (e) { /* ignore */ }
    }
  };

  const applyPreset = (presetOrbit) => {
    setCurrentOrbit(presetOrbit);
    const mv = viewerRef.current;
    if (mv) {
      try { mv.setAttribute('camera-orbit', presetOrbit); } catch {}
    }
  };

  // Accessibility: provide aria-label and a simple image fallback.
  return (
    <div ref={wrapperRef} className={className} style={{ width: '100%', height: '420px', position: 'relative' }}>
      {modelUrl && isVisible ? (
        <model-viewer
          ref={viewerRef}
          src={modelUrl}
          poster={posterUrl || imageUrl}
          alt="3D car model"
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
      <div style={{ position: 'absolute', right: 10, bottom: 10, display: 'flex', gap: 8, zIndex: 30, alignItems: 'center' }}>
        <button aria-pressed={autoRotate} onClick={toggleRotate} className="bg-amber-500 text-slate-900 px-3 py-1 rounded-md shadow">{autoRotate ? 'Stop' : 'Rotate'}</button>
        <button onClick={resetCamera} className="bg-slate-800 text-white px-3 py-1 rounded-md shadow">Reset</button>
        <div className="px-2 py-1 bg-slate-900 rounded-md text-white" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <label className="text-xs">Speed</label>
          <input type="range" min="5" max="180" value={autoRotateSpeed} onChange={(e) => setAutoRotateSpeed(Number(e.target.value))} />
        </div>
      </div>

      {/* Preset buttons */}
      <div style={{ position: 'absolute', left: 10, bottom: 10, display: 'flex', gap: 8, zIndex: 30 }}>
        <button onClick={() => applyPreset('0deg 10deg 4m')} title="Front view" aria-label="Front view" className="group bg-slate-800 text-white px-3 py-1 rounded-md relative flex items-center gap-2">
          <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <rect x="1" y="3" width="14" height="6" rx="1" fill="currentColor" />
            <circle cx="4" cy="9" r="1" fill="currentColor" />
            <circle cx="12" cy="9" r="1" fill="currentColor" />
          </svg>
          <span className="sr-only">Front</span>
          <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">Front</span>
        </button>

        <button onClick={() => applyPreset('45deg 30deg 4m')} title="Three-quarter view" aria-label="Three quarter view" className="group bg-slate-800 text-white px-3 py-1 rounded-md relative flex items-center gap-2">
          <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <path d="M1 6h10l3 3V3L11 6H1z" fill="currentColor" />
            <circle cx="5" cy="9" r="1" fill="currentColor" />
          </svg>
          <span className="sr-only">3/4</span>
          <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">3/4</span>
        </button>

        <button onClick={() => applyPreset('0deg 85deg 2.5m')} title="Top view" aria-label="Top view" className="group bg-slate-800 text-white px-3 py-1 rounded-md relative flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <rect x="2" y="4" width="10" height="6" rx="2" fill="currentColor" />
            <rect x="4" y="2" width="6" height="10" rx="1" fill="currentColor" opacity="0.6" />
          </svg>
          <span className="sr-only">Top</span>
          <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">Top</span>
        </button>
      </div>
    </div>
  );
};

export default Car3DViewer;
