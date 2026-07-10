import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

const UploadPage = () => {
  const { addCar, currentUser } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    model: "",
    engine: "",
    year: "",
    imageUrl: "",
    details: "",
    horsepower: "",
    topSpeed: ""
  });
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (!currentUser) {
      setStatus("Please login to upload images");
      setTimeout(() => navigate("/account"), 2000);
    }
  }, [currentUser, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentUser) return setStatus("Login required");
    if (!formData.name || !formData.imageUrl || !formData.brand) {
      return setStatus("Name, Brand and Image URL are required");
    }

    const newCar = {
      name: formData.name,
      brand: formData.brand,
      model: formData.model || "Classic",
      engine: formData.engine || "Vintage Spec",
      horsepower: formData.horsepower || "N/A",
      topSpeed: formData.topSpeed || "N/A",
      year: parseInt(formData.year) || 1970,
      details: formData.details || "User uploaded vintage gem from the community",
      image: formData.imageUrl,
      price: "Contact owner for price"
    };

    addCar(newCar);
    setStatus("✅ Car added successfully to the gallery!");
    setFormData({
      name: "", brand: "", model: "", engine: "", year: "", imageUrl: "", details: "", horsepower: "", topSpeed: ""
    });
    setTimeout(() => setStatus(""), 3000);
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
          Share your classic car with NAME and DETAILS
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Car Name * (e.g., 1965 Ford Mustang)"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 rounded-xl bg-black/60 border border-gray-600 text-white focus:border-red-500 outline-none"
            required
          />
          
          <input
            type="text"
            name="brand"
            placeholder="Brand * (e.g., Ford, Porsche)"
            value={formData.brand}
            onChange={handleChange}
            className="w-full p-3 rounded-xl bg-black/60 border border-gray-600 text-white focus:border-red-500 outline-none"
            required
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="engine"
              placeholder="Engine Specs"
              value={formData.engine}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-black/60 border border-gray-600 text-white focus:border-red-500 outline-none"
            />
            
            <input
              type="text"
              name="horsepower"
              placeholder="Horsepower"
              value={formData.horsepower}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-black/60 border border-gray-600 text-white focus:border-red-500 outline-none"
            />
          </div>
          
          <input
            type="text"
            name="topSpeed"
            placeholder="Top Speed"
            value={formData.topSpeed}
            onChange={handleChange}
            className="w-full p-3 rounded-xl bg-black/60 border border-gray-600 text-white focus:border-red-500 outline-none"
          />
          
          <input
            type="url"
            name="imageUrl"
            placeholder="Image URL * (use any valid image link)"
            value={formData.imageUrl}
            onChange={handleChange}
            className="w-full p-3 rounded-xl bg-black/60 border border-gray-600 text-white focus:border-red-500 outline-none"
            required
          />
          
          <textarea
            name="details"
            placeholder="Details / Story about this vintage car..."
            rows="4"
            value={formData.details}
            onChange={handleChange}
            className="w-full p-3 rounded-xl bg-black/60 border border-gray-600 text-white focus:border-red-500 outline-none"
          ></textarea>
          
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
    </div>
  );
};

export default UploadPage;