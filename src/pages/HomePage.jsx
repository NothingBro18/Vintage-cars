import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import CarCard from '../components/CarCard';
import SearchBar from '../components/SearchBar';
import SearchFilters from '../components/SearchFilters';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { parsePriceNumber } from '../utils/carHelpers';

const HomePage = () => {
  const navigate = useNavigate();
  const { cars } = useAuth();
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    year: '',
    horsepower: '',
    minPrice: '',
    maxPrice: '',
    location: '',
  });
  

  const handleCarClick = (carId) => {
    navigate(`/car/${carId}`);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    setFilters({ year: '', horsepower: '', minPrice: '', maxPrice: '', location: '' });
  };

  

  

  

  const filteredCars = useMemo(() => {
    return cars.filter((car) => {
      const searchValue = search.trim().toLowerCase();
      const yearValue = filters.year.trim();
      const horsepowerValue = filters.horsepower.trim();
      const minPriceValue = Number(filters.minPrice || 0);
      const maxPriceValue = Number(filters.maxPrice || 0);
      const locationValue = filters.location.trim().toLowerCase();

      if (searchValue) {
        const target = `${car.name} ${car.brand} ${car.model}`.toLowerCase();
        if (!target.includes(searchValue)) return false;
      }
      if (yearValue && String(car.year) !== yearValue) return false;
      if (horsepowerValue) {
        const hp = Number(String(car.horsepower || '').replace(/[^0-9]/g, ''));
        if (!hp || hp < Number(horsepowerValue)) return false;
      }
      if (minPriceValue > 0 || maxPriceValue > 0) {
        const price = parsePriceNumber(car.price);
        if (minPriceValue > 0 && price < minPriceValue) return false;
        if (maxPriceValue > 0 && price > maxPriceValue) return false;
      }
      if (locationValue && !String(car.address || '').toLowerCase().includes(locationValue)) return false;
      return true;
    });
  }, [cars, filters, search]);

  const heroVariants = {
    hidden: { opacity: 0, y: 28 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1], staggerChildren: 0.12 },
    },
  };

  const heroItem = {
    hidden: { opacity: 0, y: 18 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.65 } },
  };

  return (
    <div className="container mx-auto px-4 py-12 relative z-10">
      <motion.div 
        variants={heroVariants}
        initial="hidden"
        animate="visible"
        className="hero-stage text-center mb-16"
      >
        <motion.div variants={heroItem} className="hero-kicker">EST. 1967 · THE GOLDEN ERA</motion.div>
        <motion.div className="hero-orbit orbit-one" animate={{ rotate: 360 }} transition={{ duration: 24, repeat: Infinity, ease: 'linear' }} />
        <motion.div className="hero-orbit orbit-two" animate={{ rotate: -360 }} transition={{ duration: 16, repeat: Infinity, ease: 'linear' }} />
        <motion.h1 variants={heroItem} className="font-display text-5xl md:text-7xl font-bold tracking-wider">
          <span className="text-amber-500 vintage-glow">TIMELESS</span> LEGENDS
        </motion.h1>
        <motion.p variants={heroItem} className="text-gray-400 mt-4 max-w-2xl mx-auto">
          Click any classic icon to unveil its full story, specs, and soul.
        </motion.p>
        <motion.div variants={heroItem} className="hero-scroll-cue" aria-hidden="true">
          <span /> SCROLL TO EXPLORE
        </motion.div>
      </motion.div>
      <div className="road-scene" aria-hidden="true">
        <div className="road-horizon" />
        <motion.div
          className="driving-car"
          animate={{ x: ['-32vw', '132vw'] }}
          transition={{ duration: 8, ease: 'linear' }}
        >
          <span className="exhaust exhaust-one" />
          <span className="exhaust exhaust-two" />
          <img src={cars[0]?.image} alt="" />
        </motion.div>
        <div className="road-lines" />
      </div>
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="mb-8">
        <SearchBar search={search} onSearchChange={handleSearchChange} />
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-4">
        <aside className="lg:col-span-1 lg:sticky lg:top-24">
          <SearchFilters filters={filters} onFilterChange={handleFilterChange} onReset={resetFilters} />
        </aside>

        <main className="lg:col-span-3">
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.8 }} className="mb-6 rounded-3xl border border-gray-800 bg-slate-950/50 p-6 text-gray-300 shadow-lg">
            Showing <span className="font-semibold text-white">{filteredCars.length}</span> of <span className="font-semibold text-white">{cars.length}</span> cars
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {filteredCars.map((car, idx) => (
              <CarCard 
                key={car.id} 
                car={car} 
                index={idx} 
                onClick={handleCarClick}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default HomePage;