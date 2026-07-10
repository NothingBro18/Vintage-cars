import React from 'react';
import { motion } from 'framer-motion';

const AboutPage = () => {
  return (
    <div className="container mx-auto px-4 py-20 text-center max-w-3xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="font-display text-5xl text-red-400 mb-6">
          About Vintage Velocity
        </h2>
        
        <p className="text-gray-300 text-lg leading-relaxed">
          We celebrate the golden era of automotive design—where steel met soul. 
          Our gallery is a sanctuary for classic car lovers, showcasing rare muscle cars, 
          European icons, and timeless legends. Every upload tells a story of craftsmanship. 
          Join us, share your own restorations, and keep the legacy roaring.
        </p>
        
        <div className="mt-12 grid grid-cols-2 gap-4 text-red-300">
          <div className="glass-card p-4 rounded-2xl">
            <span className="text-3xl">🏁</span>
            <p className="mt-2 font-semibold">Curated Classics</p>
            <p className="text-xs text-gray-400">Handpicked vintage masterpieces</p>
          </div>
          <div className="glass-card p-4 rounded-2xl">
            <span className="text-3xl">📸</span>
            <p className="mt-2 font-semibold">Community Uploads</p>
            <p className="text-xs text-gray-400">Share your restoration projects</p>
          </div>
          <div className="glass-card p-4 rounded-2xl">
            <span className="text-3xl">🔧</span>
            <p className="mt-2 font-semibold">Restoration Tips</p>
            <p className="text-xs text-gray-400">Learn from fellow enthusiasts</p>
          </div>
          <div className="glass-card p-4 rounded-2xl">
            <span className="text-3xl">🏆</span>
            <p className="mt-2 font-semibold">Events & Meets</p>
            <p className="text-xs text-gray-400">Connect with the community</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AboutPage;