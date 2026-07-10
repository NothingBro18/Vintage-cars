import React, { useEffect } from 'react';
import { generateDetails, generateSpecs } from '../utils/carHelpers';

const CarForm = ({ formData, setFormData, onSubmit, status, heading, buttonLabel }) => {
  const specs = generateSpecs({ brand: formData.brand, model: formData.model, name: formData.name });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setFormData((prev) => ({
        ...prev,
        imageFile: file,
        imagePreview: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (!formData.details && (formData.name || formData.model)) {
      setFormData((prev) => ({
        ...prev,
        details: generateDetails(prev.name, prev.model),
      }));
    }
  }, [formData.name, formData.model, formData.details, setFormData]);

  return (
    <div className="glass-card rounded-3xl border border-amber-500/20 bg-black/50 p-6 shadow-2xl backdrop-blur-xl">
      <h2 className="font-display text-3xl font-bold text-amber-300 mb-4 text-center">{heading}</h2>
      <p className="text-center text-gray-400 mb-6">
        Fill in the essential details and attach a photo to bring the classic to life.
      </p>

      <form onSubmit={onSubmit} className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <input
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="Car Name *"
            className="w-full rounded-3xl border border-gray-700 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-amber-400"
            required
          />
          <input
            name="brand"
            type="text"
            value={formData.brand}
            onChange={handleChange}
            placeholder="Brand *"
            className="w-full rounded-3xl border border-gray-700 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-amber-400"
            required
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <input
            name="model"
            type="text"
            value={formData.model}
            onChange={handleChange}
            placeholder="Model"
            className="w-full rounded-3xl border border-gray-700 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-amber-400"
          />
          <input
            name="year"
            type="number"
            value={formData.year}
            onChange={handleChange}
            placeholder="Year"
            className="w-full rounded-3xl border border-gray-700 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-amber-400"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl border border-gray-700 bg-slate-950/80 p-4">
            <p className="text-sm text-gray-400 mb-2">Engine</p>
            <p className="text-white font-semibold">{specs.engine}</p>
          </div>
          <div className="rounded-3xl border border-gray-700 bg-slate-950/80 p-4">
            <p className="text-sm text-gray-400 mb-2">Horsepower</p>
            <p className="text-white font-semibold">{specs.horsepower}</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl border border-gray-700 bg-slate-950/80 p-4">
            <p className="text-sm text-gray-400 mb-2">Top Speed</p>
            <p className="text-white font-semibold">{specs.topSpeed}</p>
          </div>
          <div className="rounded-3xl border border-gray-700 bg-slate-950/80 p-4">
            <p className="text-sm text-gray-400 mb-2">Est. Value</p>
            <p className="text-white font-semibold">{specs.price}</p>
          </div>
        </div>

        <div className="rounded-3xl border border-gray-700 bg-slate-950/80 p-4">
          <p className="text-sm text-gray-400 mb-2">Location</p>
          <p className="text-white font-semibold">{specs.address}</p>
        </div>

        <label className="block text-gray-300">
          Attach image from your PC *
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mt-3 w-full rounded-3xl border border-gray-700 bg-slate-950/80 px-4 py-3 text-white file:rounded-2xl file:border-0 file:bg-amber-500 file:px-4 file:py-2 file:text-slate-950 file:font-semibold outline-none"
          />
        </label>

        {formData.imagePreview && (
          <div className="overflow-hidden rounded-3xl border border-gray-700 bg-slate-950/80">
            <img src={formData.imagePreview} alt="Preview" className="h-72 w-full object-contain" />
          </div>
        )}

        <textarea
          name="details"
          rows="5"
          value={formData.details}
          onChange={handleChange}
          placeholder="Short details about the car"
          className="w-full rounded-3xl border border-gray-700 bg-slate-950/80 px-4 py-4 text-white outline-none focus:border-amber-400"
        />

        <button
          type="submit"
          className="w-full rounded-3xl bg-gradient-to-r from-amber-500 to-orange-500 py-4 text-base font-semibold text-slate-950 shadow-lg shadow-amber-500/20 transition hover:from-amber-400 hover:to-orange-400"
        >
          {buttonLabel}
        </button>

        {status && (
          <p className={`text-center text-sm ${status.includes('✅') ? 'text-emerald-400' : 'text-rose-400'}`}>
            {status}
          </p>
        )}
      </form>
    </div>
  );
};

export default CarForm;
