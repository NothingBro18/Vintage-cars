import React, { useEffect, useMemo, useRef, useState } from 'react';
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
  const [soundOn, setSoundOn] = useState(false);
  const audioRef = useRef(null);

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

  useEffect(() => () => {
    const audio = audioRef.current;
    if (audio) {
      audio.stop();
      audioRef.current = null;
    }
  }, []);

  const toggleEngineSound = () => {
    if (soundOn) {
      const audio = audioRef.current;
      if (audio) {
        audio.stop();
        audioRef.current = null;
      }
      setSoundOn(false);
      return;
    }

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const context = new AudioContext();
    const master = context.createGain();
    const filter = context.createBiquadFilter();
    const nodes = [];
    filter.type = 'lowpass';
    filter.frequency.value = 1250;
    filter.Q.value = 1.4;
    master.gain.setValueAtTime(0.0001, context.currentTime);
    master.gain.exponentialRampToValueAtTime(0.065, context.currentTime + 0.35);
    filter.connect(master).connect(context.destination);

    // Layered, procedural V8 rumble: a low crankshaft fundamental, harmonics,
    // and a modulated pulse layer approximating a classic big-block idle.
    const rumble = context.createOscillator();
    const harmonic = context.createOscillator();
    const pulse = context.createOscillator();
    const rumbleGain = context.createGain();
    const harmonicGain = context.createGain();
    const pulseGain = context.createGain();
    rumble.type = 'sawtooth';
    rumble.frequency.value = 43;
    harmonic.type = 'triangle';
    harmonic.frequency.value = 86;
    pulse.type = 'square';
    pulse.frequency.value = 21.5;
    rumbleGain.gain.value = 0.55;
    harmonicGain.gain.value = 0.12;
    pulseGain.gain.value = 0.07;
    rumble.connect(rumbleGain).connect(filter);
    harmonic.connect(harmonicGain).connect(filter);
    pulse.connect(pulseGain).connect(filter);

    const rev = context.createOscillator();
    const revGain = context.createGain();
    rev.type = 'sine';
    rev.frequency.value = 4.2;
    revGain.gain.value = 7;
    rev.connect(revGain).connect(rumble.frequency);

    const exhaustBuffer = context.createBuffer(1, context.sampleRate * 1.5, context.sampleRate);
    const exhaustData = exhaustBuffer.getChannelData(0);
    for (let index = 0; index < exhaustData.length; index += 1) {
      exhaustData[index] = (Math.random() * 2 - 1) * Math.pow(1 - (index % 3300) / 3300, 2);
    }
    const exhaust = context.createBufferSource();
    const exhaustFilter = context.createBiquadFilter();
    const exhaustGain = context.createGain();
    exhaust.buffer = exhaustBuffer;
    exhaust.loop = true;
    exhaustFilter.type = 'bandpass';
    exhaustFilter.frequency.value = 180;
    exhaustFilter.Q.value = 0.7;
    exhaustGain.gain.value = 0.09;
    exhaust.connect(exhaustFilter).connect(exhaustGain).connect(filter);

    [rumble, harmonic, pulse, rev, exhaust].forEach((node) => {
      node.start();
      nodes.push(node);
    });
    audioRef.current = {
      context,
      stop: () => {
        nodes.forEach((node) => {
          try { node.stop(); } catch { /* already stopped */ }
        });
        context.close();
      },
    };
    setSoundOn(true);
  };

  useEffect(() => {
    // Browsers may suspend audio until the visitor interacts with the page.
    // Start immediately where autoplay is allowed, then unlock on the first
    // pointer/keyboard gesture everywhere else.
    toggleEngineSound();
    const unlockAudio = () => {
      audioRef.current?.context.resume();
      window.removeEventListener('pointerdown', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
    };
    window.addEventListener('pointerdown', unlockAudio, { once: true });
    window.addEventListener('keydown', unlockAudio, { once: true });
    const soundTimer = window.setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.stop();
        audioRef.current = null;
        setSoundOn(false);
      }
    }, 8200);
    return () => {
      window.clearTimeout(soundTimer);
      window.removeEventListener('pointerdown', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
      if (audioRef.current) {
        audioRef.current.stop();
        audioRef.current = null;
      }
    };
    // The sound should be initialized once when this page enters.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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