import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import CarCard from '../components/CarCard';

const FavoritesPage = () => {
  const navigate = useNavigate();
  const { cars, favorites } = useAuth();
  const favoriteCars = cars.filter((car) => favorites.includes(car.id));

  return (
    <div className="container mx-auto px-4 py-12 relative z-10">
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="text-center mb-12"
      >
        <h1 className="font-display text-5xl md:text-7xl font-bold tracking-wider">
          FAVORITE RIDES
        </h1>
        <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
          Review the cars you have bookmarked for later.
        </p>
      </motion.div>

      {favoriteCars.length === 0 ? (
        <div className="text-center py-20 text-gray-300">
          <p className="text-2xl text-amber-400">No favorites yet.</p>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="mt-6 rounded-3xl bg-amber-500 px-5 py-3 text-slate-950 font-semibold hover:bg-amber-400 transition"
          >
            Browse cars
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {favoriteCars.map((car, idx) => (
            <CarCard key={car.id} car={car} index={idx} onClick={(id) => navigate(`/car/${id}`)} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
