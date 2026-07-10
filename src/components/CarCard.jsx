import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import Modal from './Modal';
import FavoriteButton from './FavoriteButton';

const CarCard = ({ car, onClick, index }) => {
  const { removeCar } = useAuth();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setShowConfirm(true);
  };

  const confirmDelete = () => {
    removeCar(car.id);
    setShowConfirm(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onClick={() => {
        console.log('Card clicked:', car.id, car.name);
        onClick(car.id);
      }}
      className="car-card group glass-card overflow-hidden rounded-2xl bg-black/50 border border-white/10 hover:border-amber-500/50 cursor-pointer relative"
    >
      <button
        onClick={handleDeleteClick}
        className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/70 text-white opacity-0 group-hover:opacity-100 hover:bg-red-600 transition"
        aria-label={`Delete ${car.name}`}
      >
        ×
      </button>
      <div className="overflow-hidden h-[220px] relative">
        <img 
          src={car.image} 
          alt={car.name} 
          className="image-fixed w-full h-full object-cover group-hover:scale-105 transition duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
      </div>
      
      <div className="p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-display text-xl font-bold tracking-wide text-amber-400 line-clamp-1">
            {car.name}
          </h3>
          <FavoriteButton carId={car.id} />
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <span className="text-gray-300 text-sm">
            {car.brand} • {car.year}
          </span>
          <span className="text-xs bg-amber-800/50 px-2 py-1 rounded-full group-hover:bg-amber-700 transition">
            View Details →
          </span>
        </div>
      </div>
      <Modal
        open={showConfirm}
        title="Delete car"
        message={`Are you sure you want to delete ${car.name} from the gallery?`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={confirmDelete}
        onCancel={() => setShowConfirm(false)}
      />
    </motion.div>
  );
};

export default CarCard;