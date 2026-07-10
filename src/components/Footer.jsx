import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="mt-24 border-t border-red-900/30 bg-black/80 py-10 text-slate-300">
      <div className="container mx-auto px-4 grid gap-8 md:grid-cols-3 items-start">
        <div>
          <h2 className="font-display text-xl text-amber-400">Vintage Velocity</h2>
          <p className="mt-2 text-sm text-gray-400 max-w-sm">
            Explore the finest vintage cars, save your favorites, and stay connected to automotive legends.
          </p>
        </div>

        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-amber-300 mb-3">Quick links</p>
          <div className="grid gap-2">
            <Link to="/" className="text-sm text-gray-300 hover:text-white transition">Home</Link>
            <Link to="/favorites" className="text-sm text-gray-300 hover:text-white transition">Favorites</Link>
            <Link to="/upload" className="text-sm text-gray-300 hover:text-white transition">Upload</Link>
            <Link to="/profile" className="text-sm text-gray-300 hover:text-white transition">Profile</Link>
          </div>
        </div>

        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-amber-300 mb-3">Connect</p>
          <div className="grid gap-2">
            <a href="mailto:hello@vintagevelocity.com" className="text-sm text-gray-300 hover:text-white transition">hello@vintagevelocity.com</a>
            <Link to="/about" className="text-sm text-gray-300 hover:text-white transition">About</Link>
            <Link to="/reviews" className="text-sm text-gray-300 hover:text-white transition">Reviews</Link>
          </div>
        </div>
      </div>

      <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-gray-500">
        <p>© 2025 Vintage Velocity — Where Legends Never Die.</p>
        <p className="mt-1">Built with ❤️ for classic car enthusiasts.</p>
      </div>
    </footer>
  );
};

export default Footer;