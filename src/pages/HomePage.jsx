import React from 'react';
import { motion } from 'framer-motion';
import CarCard from '../components/CarCard';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const HomePage = () => {
  const navigate = useNavigate();
  const { cars } = useAuth();

  const handleCarClick = (carId) => {
    navigate(`/car/${carId}`);
  };

  return (
    <div className="container mx-auto px-4 py-12 relative z-10">
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="text-center mb-16"
      >
        <h1 className="font-display text-5xl md:text-7xl font-bold tracking-wider">
          <span className="text-amber-500 vintage-glow">TIMELESS</span> LEGENDS
        </h1>
        <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
          Click any classic icon to unveil its full story, specs, and soul.
        </p>
      </motion.div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {cars.map((car, idx) => (
          <CarCard 
            key={car.id} 
            car={car} 
            index={idx} 
            onClick={handleCarClick}
          />
        ))}
      </div>
    </div>
  );
};

export default HomePage;