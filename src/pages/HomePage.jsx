import React, { useMemo, useState } from 'react';
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
      <div className="mb-8">
        <SearchBar search={search} onSearchChange={handleSearchChange} />
      </div>

      <div className="grid gap-8 lg:grid-cols-4">
        <aside className="lg:col-span-1 lg:sticky lg:top-24">
          <SearchFilters filters={filters} onFilterChange={handleFilterChange} onReset={resetFilters} />
        </aside>

        <main className="lg:col-span-3">
          <div className="mb-6 rounded-3xl border border-gray-800 bg-slate-950/50 p-6 text-gray-300 shadow-lg">
            Showing <span className="font-semibold text-white">{filteredCars.length}</span> of <span className="font-semibold text-white">{cars.length}</span> cars
          </div>
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