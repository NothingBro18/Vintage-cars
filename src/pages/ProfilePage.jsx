import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

const ProfilePage = () => {
  const { currentUser, favorites, reviews, cars, logout } = useAuth();
  const navigate = useNavigate();

  if (!currentUser) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-20">
        <div className="glass-card rounded-3xl border border-red-400/30 bg-black/60 p-10 text-center shadow-xl">
          <h2 className="text-3xl font-semibold text-white mb-4">Profile required</h2>
          <p className="text-gray-400 mb-6">Please login or sign up to access your profile.</p>
          <button
            onClick={() => navigate('/account')}
            className="rounded-3xl bg-amber-600 px-6 py-3 text-black font-semibold hover:bg-amber-500 transition"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card mx-auto max-w-5xl rounded-3xl border border-amber-500/20 bg-black/60 p-8 shadow-xl"
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white">Your Profile</h1>
            <p className="mt-2 text-gray-400">Manage your account and view gallery stats.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate('/upload')}
              className="rounded-3xl bg-amber-500 px-5 py-3 text-sm font-semibold text-black hover:bg-amber-400 transition"
            >
              Upload a Car
            </button>
            <button
              onClick={() => navigate('/favorites')}
              className="rounded-3xl border border-amber-500 px-5 py-3 text-sm text-amber-200 hover:bg-white/5 transition"
            >
              My Favorites
            </button>
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_0.9fr]">
          <div className="rounded-3xl border border-gray-800 bg-slate-950/70 p-6">
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-amber-500 text-black text-2xl font-bold">
                {currentUser.username?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-white">{currentUser.username}</h2>
                <p className="text-sm text-gray-400">{currentUser.email}</p>
              </div>
            </div>

            <div className="space-y-4 text-sm text-gray-300">
              <div className="rounded-3xl bg-black/60 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-amber-300">Joined</p>
                <p className="mt-2 text-white">Since your first visit</p>
              </div>
              <div className="rounded-3xl bg-black/60 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-amber-300">Account</p>
                <p className="mt-2 text-white">Logged in as a demo vintage fan</p>
              </div>
            </div>

            <button
              onClick={() => { logout(); navigate('/'); }}
              className="mt-8 w-full rounded-3xl border border-red-500 bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>

          <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-gray-800 bg-slate-950/70 p-5 text-center">
                <p className="text-sm uppercase tracking-[0.2em] text-amber-300">Gallery cars</p>
                <p className="mt-3 text-3xl font-bold text-white">{cars.length}</p>
              </div>
              <div className="rounded-3xl border border-gray-800 bg-slate-950/70 p-5 text-center">
                <p className="text-sm uppercase tracking-[0.2em] text-amber-300">Favorites</p>
                <p className="mt-3 text-3xl font-bold text-white">{favorites.length}</p>
              </div>
              <div className="rounded-3xl border border-gray-800 bg-slate-950/70 p-5 text-center">
                <p className="text-sm uppercase tracking-[0.2em] text-amber-300">Reviews</p>
                <p className="mt-3 text-3xl font-bold text-white">{reviews.length}</p>
              </div>
            </div>

            <div className="rounded-3xl border border-gray-800 bg-slate-950/70 p-6">
              <h2 className="text-xl font-semibold text-white">Quick Actions</h2>
              <div className="mt-4 flex flex-col gap-3">
                <button
                  onClick={() => navigate('/upload')}
                  className="rounded-3xl bg-amber-500 px-5 py-3 text-sm font-semibold text-black hover:bg-amber-400 transition"
                >
                  Add another car
                </button>
                <button
                  onClick={() => navigate('/favorites')}
                  className="rounded-3xl border border-amber-500 px-5 py-3 text-sm text-amber-200 hover:bg-white/5 transition"
                >
                  Browse saved cars
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfilePage;
