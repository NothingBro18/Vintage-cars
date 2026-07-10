import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { generateDetails, generateSpecs } from '../utils/carHelpers';
import Modal from './Modal';
import Toast from './Toast';
import FavoriteButton from './FavoriteButton';

const CarDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cars, removeCar } = useAuth();
  
  const car = cars.find((c) => c.id === parseInt(id, 10));
  const currentIndex = cars.findIndex((c) => c.id === parseInt(id, 10));
  const nextCar = currentIndex >= 0 && cars.length > 0 ? cars[(currentIndex + 1) % cars.length] : null;

  const specs = car ? generateSpecs(car) : {};
  const details = car ? (car.details || generateDetails(car.name, car.model)) : '';
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [toast, setToast] = useState('');

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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-3xl overflow-hidden border border-amber-500/30 p-6 md:p-10 flex flex-col md:flex-row gap-10"
      >
        <div className="md:w-5/12 space-y-4">
          {car.images?.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {car.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`${car.name} ${idx + 1}`}
                  className="rounded-2xl w-full h-44 object-cover shadow-2xl border border-amber-400/30"
                />
              ))}
            </div>
          ) : (
            <img
              src={car.image}
              alt={car.name}
              className="rounded-2xl w-full max-h-[380px] object-cover shadow-2xl border border-amber-400/30"
            />
          )}
        </div>
        
        <div className="md:w-7/12 space-y-4">
          <h1 className="font-display text-4xl md:text-5xl text-amber-500">{car.name}</h1>
          
          <div className="grid grid-cols-2 gap-3 text-gray-200 border-l-4 border-amber-500 pl-4">
            <p><span className="font-bold text-amber-400">Brand:</span> {car.brand}</p>
            <p><span className="font-bold text-amber-400">Model:</span> {car.model}</p>
            <p><span className="font-bold text-amber-400">Engine:</span> {car.engine}</p>
            <p><span className="font-bold text-amber-400">Horsepower:</span> {car.horsepower}</p>
            <p><span className="font-bold text-amber-400">Year:</span> {car.year}</p>
            <p><span className="font-bold text-amber-400">Top Speed:</span> {car.topSpeed}</p>
            <p><span className="font-bold text-amber-400">Est. Value:</span> {car.price || "Collector's item"}</p>
            <p><span className="font-bold text-amber-400">Location:</span> {car.address || "Various Locations"}</p>
          </div>
          
          <p className="text-gray-300 leading-relaxed mt-4">{details}</p>
        </div>
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