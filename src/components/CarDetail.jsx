import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

const CarDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cars } = useAuth();
  
  const car = cars.find(c => c.id === parseInt(id));

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
      <button 
        onClick={() => navigate(-1)} 
        className="mb-6 flex items-center gap-2 text-amber-500 hover:text-amber-400 transition"
      >
        ← Back to Gallery
      </button>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-3xl overflow-hidden border border-amber-500/30 p-6 md:p-10 flex flex-col md:flex-row gap-10"
      >
        <div className="md:w-1/2">
          <img 
            src={car.image} 
            alt={car.name} 
            className="rounded-2xl w-full h-auto object-cover shadow-2xl border border-amber-400/30"
          />
        </div>
        
        <div className="md:w-1/2 space-y-4">
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
          
          <p className="text-gray-300 leading-relaxed mt-4">{car.details}</p>
        </div>
      </motion.div>
    </div>
  );
};

export default CarDetail;