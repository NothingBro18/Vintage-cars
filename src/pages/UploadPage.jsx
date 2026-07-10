import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { generateDetails, generateSpecs } from '../utils/carHelpers';
import Toast from '../components/Toast';

const UploadPage = () => {
  const { addCar, currentUser } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    model: "",
    year: "",
    details: "",
    imageFiles: [],
    imagePreviews: []
  });
  const [status, setStatus] = useState("");
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (!currentUser) {
      setStatus("Please login to upload a car");
      setTimeout(() => navigate("/account"), 2000);
    }
  }, [currentUser, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  useEffect(() => {
    if (!formData.details && (formData.name || formData.model)) {
      setFormData((prev) => ({
        ...prev,
        details: generateDetails(prev.name, prev.model)
      }));
    }
  }, [formData.name, formData.model]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const previews = [];
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        previews.push(reader.result);
        if (previews.length === files.length) {
          setFormData((prev) => ({
            ...prev,
            imageFiles: files,
            imagePreviews: previews,
          }));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return setStatus('Login required');
    if (!formData.name || !formData.brand || formData.imagePreviews.length === 0) {
      setToast('Name, Brand and Image file are required');
      return setStatus('Name, Brand and Image file are required');
    }

    const specs = generateSpecs({
      brand: formData.brand,
      model: formData.model,
      name: formData.name,
    });

    const newCar = {
      name: formData.name,
      brand: formData.brand,
      model: formData.model,
      year: parseInt(formData.year, 10) || new Date().getFullYear(),
      details: formData.details || generateDetails(formData.name, formData.model),
      image: formData.imagePreviews[0] || '',
      images: formData.imagePreviews,
      ...specs,
    };

    const payload = new FormData();
    payload.append('name', newCar.name);
    payload.append('brand', newCar.brand);
    payload.append('model', newCar.model);
    payload.append('year', newCar.year);
    payload.append('details', newCar.details);
    payload.append('price', newCar.price);
    payload.append('address', newCar.address);
    if (formData.imageFiles.length === 0) {
      payload.append('images', JSON.stringify(newCar.images));
    }
    formData.imageFiles.forEach((file) => payload.append('images', file));

    await addCar(payload, newCar);
    setStatus('✅ Car added successfully to the gallery!');
    setToast('Car uploaded successfully');
    setFormData({
      name: '',
      brand: '',
      model: '',
      year: '',
      details: '',
      imageFiles: [],
      imagePreviews: [],
    });
    setTimeout(() => setStatus(''), 3000);
    setTimeout(() => setToast(''), 3000);
  };

  if (!currentUser) {
    return (
      <div className="text-center py-20">
        <p className="text-red-400">{status}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8 rounded-2xl"
      >
        <h2 className="font-display text-3xl text-red-400 text-center mb-4">
          📤 Upload Vintage Beauty
        </h2>
        <p className="text-gray-400 text-center mb-6">
          Enter the name and model to auto-generate a car description, then attach an image from your PC.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Car Name *"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 rounded-xl bg-black/60 border border-gray-600 text-white focus:border-red-500 outline-none"
            required
          />

          <input
            type="text"
            name="brand"
            placeholder="Brand *"
            value={formData.brand}
            onChange={handleChange}
            className="w-full p-3 rounded-xl bg-black/60 border border-gray-600 text-white focus:border-red-500 outline-none"
            required
          />

          <input
            type="text"
            name="model"
            placeholder="Model"
            value={formData.model}
            onChange={handleChange}
            className="w-full p-3 rounded-xl bg-black/60 border border-gray-600 text-white focus:border-red-500 outline-none"
          />

          <input
            type="number"
            name="year"
            placeholder="Year"
            value={formData.year}
            onChange={handleChange}
            className="w-full p-3 rounded-xl bg-black/60 border border-gray-600 text-white focus:border-red-500 outline-none"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-200 border border-gray-700 rounded-2xl p-4 bg-black/40">
            <div>
              <p className="text-sm text-gray-400 mb-1">Engine</p>
              <p className="font-semibold text-white">{generateSpecs({ brand: formData.brand, model: formData.model, name: formData.name }).engine}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Horsepower</p>
              <p className="font-semibold text-white">{generateSpecs({ brand: formData.brand, model: formData.model, name: formData.name }).horsepower}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Top Speed</p>
              <p className="font-semibold text-white">{generateSpecs({ brand: formData.brand, model: formData.model, name: formData.name }).topSpeed}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Est. Value</p>
              <p className="font-semibold text-white">{generateSpecs({ brand: formData.brand, model: formData.model, name: formData.name }).price}</p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-sm text-gray-400 mb-1">Location</p>
              <p className="font-semibold text-white">{generateSpecs({ brand: formData.brand, model: formData.model, name: formData.name }).address}</p>
            </div>
          </div>

          <label className="block text-gray-300">
            Attach images from your PC *
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="mt-2 w-full text-sm text-white file:bg-amber-600 file:text-black file:px-4 file:py-2 file:rounded-xl bg-black/50 border border-gray-600"
              required
            />
          </label>

          {formData.imagePreviews.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2">
              {formData.imagePreviews.map((preview, previewIndex) => (
                <div key={previewIndex} className="rounded-2xl overflow-hidden border border-gray-700 bg-black/50">
                  <img
                    src={preview}
                    alt={`Preview ${previewIndex + 1}`}
                    className="w-full h-64 object-contain"
                  />
                </div>
              ))}
            </div>
          )}

          <textarea
            name="details"
            placeholder="Short details about the car"
            rows="4"
            value={formData.details}
            onChange={handleChange}
            className="w-full p-3 rounded-xl bg-black/60 border border-gray-600 text-white focus:border-red-500 outline-none"
          />

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-red-700 to-red-600 py-3 rounded-xl font-bold text-lg hover:from-red-600 hover:to-red-500 transition"
          >
            ✨ Add to Gallery
          </button>

          {status && (
            <p className={`text-center ${status.includes("✅") ? "text-green-400" : "text-red-400"}`}>
              {status}
            </p>
          )}
        </form>
      </motion.div>
      <Toast message={toast || status} type={status.includes('✅') ? 'success' : 'error'} onClose={() => setToast('')} />
    </div>
  );
};

export default UploadPage;