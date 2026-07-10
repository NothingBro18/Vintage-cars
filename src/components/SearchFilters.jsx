import React from 'react';

const SearchFilters = ({ filters, onFilterChange, onReset }) => {
  return (
    <div className="glass-card rounded-3xl border border-amber-500/20 bg-black/60 p-6 shadow-xl">
      <div className="mb-6 flex items-center justify-between border-b border-gray-700 pb-4">
        <div>
          <h2 className="text-xl font-semibold text-white">Refine</h2>
          <p className="text-sm text-gray-400">Filter like a shopper on Flipkart.</p>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="rounded-full border border-amber-500 px-4 py-2 text-sm text-amber-300 hover:bg-amber-500/10 transition"
        >
          Clear
        </button>
      </div>

      <div className="space-y-5">
        <div>
          <h3 className="mb-3 text-sm uppercase tracking-[0.2em] text-amber-300">Year</h3>
          <input
            type="number"
            name="year"
            value={filters.year}
            onChange={onFilterChange}
            placeholder="e.g. 1967"
            className="w-full rounded-3xl border border-gray-700 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-amber-400"
          />
        </div>

        <div>
          <h3 className="mb-3 text-sm uppercase tracking-[0.2em] text-amber-300">Price range</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              type="number"
              name="minPrice"
              value={filters.minPrice}
              onChange={onFilterChange}
              placeholder="Min INR"
              className="w-full rounded-3xl border border-gray-700 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-amber-400"
            />
            <input
              type="number"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={onFilterChange}
              placeholder="Max INR"
              className="w-full rounded-3xl border border-gray-700 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-amber-400"
            />
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-sm uppercase tracking-[0.2em] text-amber-300">Performance</h3>
          <input
            type="number"
            name="horsepower"
            value={filters.horsepower}
            onChange={onFilterChange}
            placeholder="Min HP"
            className="w-full rounded-3xl border border-gray-700 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-amber-400"
          />
        </div>

        <div>
          <h3 className="mb-3 text-sm uppercase tracking-[0.2em] text-amber-300">Location</h3>
          <input
            type="text"
            name="location"
            value={filters.location}
            onChange={onFilterChange}
            placeholder="City or showroom"
            className="w-full rounded-3xl border border-gray-700 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-amber-400"
          />
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;
