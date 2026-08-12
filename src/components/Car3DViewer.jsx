import React, { useEffect, useRef, useState } from 'react';

const Car3DViewer = ({ modelUrl, imageUrl, className, posterUrl, exposure = 1, shadowIntensity = 1, environmentImage, cameraOrbit = '0deg 75deg 4m' }) => {
  const wrapperRef = useRef(null);
  const viewerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [autoRotateSpeed, setAutoRotateSpeed] = useState(60);

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
    try { mv.setAttribute('camera-orbit', cameraOrbit); } catch {}
  }, [autoRotate, exposure, shadowIntensity, environmentImage, autoRotateSpeed, cameraOrbit]);

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
    </div>
  );
};

export default Car3DViewer;
