import React from 'react';

const Car3DViewer = ({ modelUrl, imageUrl, className }) => {
  // `model-viewer` script is loaded from index.html. If a GLB URL is
  // provided we render the model-viewer element; otherwise show the image.
  if (modelUrl) {
    return (
      <div className={className} style={{ width: '100%', height: '420px' }}>
        <model-viewer
          src={modelUrl}
          poster={imageUrl}
          alt="3D car model"
          exposure="1"
          camera-controls
          ar
          style={{ width: '100%', height: '420px', background: 'transparent' }}
        />
      </div>
    );
  }

  return (
    <div className={className} style={{ width: '100%', height: '420px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a' }}>
      <img src={imageUrl} alt="car" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'cover' }} />
    </div>
  );
};

export default Car3DViewer;
