import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import CarForm from '../components/CarForm';
import Toast from '../components/Toast';

const EditCarPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cars, currentUser, editCar, loadingCars } = useAuth();
  const car = cars.find((item) => item.id === parseInt(id, 10));

  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    model: '',
    year: '',
    details: '',
    imageFile: null,
    imagePreview: '',
  });
  const [status, setStatus] = useState('');
  const [toast, setToast] = useState('');

  useEffect(() => {
    if (!currentUser) {
      setStatus('Login required to edit a car');
      const timer = setTimeout(() => navigate('/account'), 1800);
      return () => clearTimeout(timer);
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    if (car) {
      setFormData({
        name: car.name || '',
        brand: car.brand || '',
        model: car.model || '',
        year: car.year || '',
        details: car.details || '',
        imageFile: null,
        imagePreview: car.image || '',
      });
    }
  }, [car]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.brand || !formData.imagePreview) {
      return setStatus('Name, Brand, and Image are required');
    }

    const updatedCar = {
      name: formData.name,
      brand: formData.brand,
      model: formData.model,
      year: parseInt(formData.year, 10) || new Date().getFullYear(),
      details: formData.details,
      image: formData.imagePreview,
    };

    try {
      await editCar(car.id, updatedCar);
      setStatus('✅ Car updated successfully');
      setToast('Car updated successfully');
      setTimeout(() => navigate(`/car/${car.id}`), 900);
    } catch (error) {
      setStatus('Failed to update the car. Please try again.');
      setToast('Could not save changes');
    }
  };

  if (loadingCars) {
    return (
      <div className="text-center py-24 text-gray-300">
        Loading car details...
      </div>
    );
  }

  if (!car) {
    return (
      <div className="text-center py-24">
        <p className="text-amber-400 text-xl">Car not found</p>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="mt-5 rounded-3xl bg-amber-500 px-6 py-3 font-semibold text-slate-950 hover:bg-amber-400 transition"
        >
          Back to Gallery
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl relative z-10">
      <CarForm
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        status={status}
        heading="Edit Car Details"
        buttonLabel="Save Changes"
      />
      <Toast message={toast} type={status.includes('✅') ? 'success' : 'error'} onClose={() => setToast('')} />
    </div>
  );
};

export default EditCarPage;
