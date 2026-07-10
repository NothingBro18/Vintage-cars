import React from 'react';

const SearchBar = ({ search, onSearchChange }) => {
  return (
    <div className="glass-card rounded-3xl border border-amber-500/20 bg-black/50 p-5 shadow-lg mb-6">
      <input
        type="text"
        name="search"
        value={search}
        onChange={onSearchChange}
        placeholder="Search by name, brand, or model"
        className="w-full rounded-3xl border border-gray-700 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-amber-400"
      />
      <p className="mt-3 text-sm text-gray-400">Search across the gallery independently from advanced filters.</p>
    </div>
  );
};

export default SearchBar;
