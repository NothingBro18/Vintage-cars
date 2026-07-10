import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const FavoriteButton = ({ carId }) => {
  const { isFavorite, toggleFavorite } = useAuth();
  const favorited = isFavorite(carId);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        toggleFavorite(carId);
      }}
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${favorited ? 'bg-red-600 text-white shadow-lg shadow-red-500/30' : 'bg-white/10 text-white hover:bg-amber-500/90 hover:text-black shadow-lg shadow-black/20'}`}
      aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
    >
      {favorited ? '❤️ Saved' : '🤍 Save'}
    </button>
  );
};

export default FavoriteButton;
