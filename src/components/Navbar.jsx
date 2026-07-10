import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-50 glass-card mx-4 mt-4 px-6 py-3 flex flex-wrap justify-between items-center backdrop-blur-xl border-b border-amber-500/30">
      <div 
        className="flex items-center gap-2 cursor-pointer" 
        onClick={() => navigate("/")}
      >
        <div className="w-8 h-8 bg-amber-600 rounded-full shadow-lg animate-pulse"></div>
        <span className="font-display text-xl font-bold tracking-wider bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
          VINTAGE VELOCITY
        </span>
      </div>
      
      <div className="flex gap-4 flex-wrap items-center text-sm md:text-base">
        <Link to="/" className="hover:text-amber-400 transition px-2">HOME</Link>
        <Link to="/favorites" className="hover:text-amber-400 transition px-2">FAVORITES</Link>
        <Link to="/reviews" className="hover:text-amber-400 transition px-2">REVIEWS</Link>
        <Link to="/about" className="hover:text-amber-400 transition px-2">ABOUT</Link>
        <Link to="/upload" className="hover:text-amber-400 transition px-2">UPLOAD</Link>
        
        {currentUser ? (
          <div className="flex items-center gap-3">
            <Link to="/profile" className="text-amber-300 text-sm hover:text-white transition">
              👤 {currentUser.username}
            </Link>
            <button 
              onClick={() => { logout(); navigate("/"); }} 
              className="bg-amber-700 px-3 py-1 rounded-full text-sm hover:bg-amber-800 transition"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link 
            to="/account" 
            className="bg-amber-600 px-4 py-1.5 rounded-full text-sm font-semibold shadow-lg hover:bg-amber-700 transition"
          >
            LOGIN / SIGNUP
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;