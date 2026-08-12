import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { generateDetails } from '../utils/carHelpers';
import Modal from './Modal';
import Toast from './Toast';
import FavoriteButton from './FavoriteButton';
import Car3DViewer from './Car3DViewer';

const CarDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cars, removeCar } = useAuth();
  
  const car = cars.find((c) => c.id === parseInt(id, 10));
  const currentIndex = cars.findIndex((c) => c.id === parseInt(id, 10));
  const nextCar = currentIndex >= 0 && cars.length > 0 ? cars[(currentIndex + 1) % cars.length] : null;

  const details = car ? (car.details || generateDetails(car.name, car.model)) : '';
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [toast, setToast] = useState('');
  const [savedModel, setSavedModel] = useState('');
  const [modelInput, setModelInput] = useState('');

  useEffect(() => {
    if (!car) return;
    const key = `car_model_${car.id}`;
    const existing = localStorage.getItem(key) || '';
    setSavedModel(existing);
    setModelInput(existing || car.model3d || '');
  }, [car]);

  const saveModelUrl = () => {
    if (!car) return;
    const key = `car_model_${car.id}`;
    if (modelInput) {
      localStorage.setItem(key, modelInput);
      setSavedModel(modelInput);
      setToast('Model URL saved locally');
      setTimeout(() => setToast(''), 2500);
    } else {
      localStorage.removeItem(key);
      setSavedModel('');
      setToast('Model URL removed');
      setTimeout(() => setToast(''), 2500);
    }
  };

  const detailVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
  };

  const specVariants = {
    hidden: { opacity: 0, x: 18 },
    visible: (index) => ({ opacity: 1, x: 0, transition: { delay: 0.25 + index * 0.06, duration: 0.45 } }),
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    removeCar(car.id);
    setToast('Car deleted successfully');
    setShowDeleteModal(false);
    setTimeout(() => navigate('/'), 500);
  };

  if (!car) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl text-amber-500">Car not found</h2>
        <button 
          onClick={() => navigate('/')} 
          className="mt-4 bg-amber-700 px-6 py-2 rounded-lg hover:bg-amber-800 transition"
        >
          Back to Gallery
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 relative z-10">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-amber-500 hover:text-amber-400 transition"
        >
          ← Back to Gallery
        </button>
        <div className="flex flex-wrap gap-3 items-center">
          <FavoriteButton carId={car.id} />
          {nextCar && (
            <button
              onClick={() => navigate(`/car/${nextCar.id}`)}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-5 py-3 rounded-full shadow-lg transition"
            >
              Next Car
            </button>
          )}
          <button
            onClick={() => navigate(`/edit/${car.id}`)}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-5 py-3 rounded-full shadow-lg transition"
          >
            Edit Car
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-full shadow-lg transition"
          >
            Delete Car
          </button>
        </div>
      </div>
      {toast && <Toast message={toast} type="success" onClose={() => setToast('')} />}
      
      <motion.div 
        variants={detailVariants}
        initial="hidden"
        animate="visible"
        className="detail-shell glass-card rounded-3xl overflow-hidden border border-amber-500/30 p-6 md:p-10 flex flex-col md:flex-row gap-10"
      >
        <motion.div initial={{ opacity: 0, x: -35 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="md:w-5/12 space-y-4">
          {/* 3D viewer: uses a GLTF model URL if provided on the car object (e.g., `model3d`), otherwise falls back to the image texture */}
          <div className="rounded-2xl overflow-hidden shadow-2xl border border-amber-400/30">
            <Car3DViewer modelUrl={savedModel || car.model3d || car.modelUrl || car.model} imageUrl={car.image} />
          </div>
          <div className="mt-4 px-2">
            <label className="block text-sm text-gray-300 mb-2">GLB/GLTF model URL (optional)</label>
            <div className="flex gap-2">
              <input value={modelInput} onChange={(e) => setModelInput(e.target.value)} placeholder="https://example.com/model.glb" className="flex-1 px-3 py-2 rounded-lg bg-slate-900 border border-gray-700 text-white" />
              <button onClick={saveModelUrl} className="bg-amber-500 hover:bg-amber-400 text-slate-900 px-4 py-2 rounded-lg">Save</button>
            </div>
            <p className="text-xs text-gray-500 mt-2">Saved locally in your browser. Use a public URL or place files under <code>public/models/</code> and reference via <code>/models/your.glb</code>.</p>
          </div>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, x: 35 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15, duration: 0.75 }} className="md:w-7/12 space-y-4">
          <motion.div initial={{ width: 0 }} animate={{ width: '4rem' }} transition={{ delay: 0.45, duration: 0.5 }} className="h-1 bg-amber-500 rounded-full" />
          <h1 className="font-display text-4xl md:text-5xl text-amber-500 detail-title">{car.name}</h1>
          
          <div className="grid grid-cols-2 gap-3 text-gray-200 border-l-4 border-amber-500 pl-4">
            {[['Brand', car.brand], ['Model', car.model], ['Engine', car.engine], ['Horsepower', car.horsepower], ['Year', car.year], ['Top Speed', car.topSpeed], ['Est. Value', car.price || "Collector's item"], ['Location', car.address || "Various Locations"]].map(([label, value], index) => (
              <motion.p key={label} custom={index} variants={specVariants} initial="hidden" animate="visible" className="spec-row"><span className="font-bold text-amber-400">{label}:</span> {value}</motion.p>
            ))}
          </div>
          
          <p className="text-gray-300 leading-relaxed mt-4">{details}</p>
        </motion.div>
      </motion.div>
      <Modal
        open={showDeleteModal}
        title="Delete car"
        message={`Delete ${car?.name} from the gallery? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
};

export default CarDetail;