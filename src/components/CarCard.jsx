import React from 'react';
import { motion } from 'framer-motion';

const CarCard = ({ car, onClick, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onClick={() => {
        console.log('Card clicked:', car.id, car.name);
        onClick(car.id);
      }}
      className="car-card group glass-card overflow-hidden rounded-2xl bg-black/50 border border-white/10 hover:border-amber-500/50 cursor-pointer"
    >
      <div className="overflow-hidden h-[220px] relative">
        <img 
          src={car.image} 
          alt={car.name} 
          className="image-fixed w-full h-full object-cover group-hover:scale-105 transition duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
      </div>
      
      <div className="p-5">
        <h3 className="font-display text-xl font-bold tracking-wide text-amber-400 line-clamp-1">
          {car.name}
        </h3>
        <div className="mt-2 flex justify-between items-center">
          <span className="text-gray-300 text-sm">
            {car.brand} • {car.year}
          </span>
          <span className="text-xs bg-amber-800/50 px-2 py-1 rounded-full group-hover:bg-amber-700 transition">
            View Details →
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default CarCard;