const API_BASE = '/api/cars';

export const fetchCars = async () => {
  const response = await fetch(API_BASE);
  if (!response.ok) throw new Error('Failed to load cars');
  return response.json();
};

export const fetchCarById = async (id) => {
  const response = await fetch(`${API_BASE}/${id}`);
  if (!response.ok) throw new Error('Car not found');
  return response.json();
};

export const createCar = async (carData) => {
  const isFormData = carData instanceof FormData;
  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: isFormData ? undefined : { 'Content-Type': 'application/json' },
    body: isFormData ? carData : JSON.stringify(carData),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to create car' }));
    throw new Error(error.error || 'Failed to create car');
  }
  return response.json();
};

export const updateCar = async (id, updatedCar) => {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedCar),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to update car' }));
    throw new Error(error.error || 'Failed to update car');
  }
  return response.json();
};

export const deleteCar = async (id) => {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to delete car' }));
    throw new Error(error.error || 'Failed to delete car');
  }
  return response.json();
};
