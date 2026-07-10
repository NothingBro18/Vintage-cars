import React, { createContext, useEffect, useState, useContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { initialCars } from '../data/initialCars';
import { createCar, deleteCar, fetchCars, updateCar } from '../api/cars';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [cars, setCars] = useLocalStorage('vintage_cars', initialCars);
  const [users, setUsers] = useLocalStorage('vintage_users', [
    { email: "demo@vintage.com", password: "demo123", username: "VintageFan" }
  ]);
  const [reviews, setReviews] = useLocalStorage('vintage_reviews', [
    { id: 1, user: "Alex R.", text: "Amazing gallery!", rating: 5, date: "2024-02-10" }
  ]);
  const [favorites, setFavorites] = useLocalStorage('vintage_favorites', []);
  const [loadingCars, setLoadingCars] = useState(true);
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = sessionStorage.getItem("vintage_user");
    return saved ? JSON.parse(saved) : null;
  });

  const login = (email, password) => {
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      const userData = { email: user.email, username: user.username };
      setCurrentUser(userData);
      sessionStorage.setItem("vintage_user", JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const signup = (email, password, username) => {
    if (users.find(u => u.email === email)) return false;
    const newUser = { email, password, username };
    setUsers([...users, newUser]);
    const userData = { email, username };
    setCurrentUser(userData);
    sessionStorage.setItem("vintage_user", JSON.stringify(userData));
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem("vintage_user");
  };

  const guestLogin = () => {
    const guest = { email: 'guest@vintage.com', username: 'Guest' };
    setCurrentUser(guest);
    sessionStorage.setItem('vintage_user', JSON.stringify(guest));
    return true;
  };

  const addCar = async (carData, fallbackData = null) => {
    const buildFallback = () => {
      const raw = fallbackData || (carData instanceof FormData ? Object.fromEntries(carData.entries()) : carData);
      const newId = cars.length > 0 ? Math.max(...cars.map((c) => c.id)) + 1 : 7;
      const result = {
        id: newId,
        model: raw.model || '',
        engine: raw.engine || '',
        horsepower: raw.horsepower || '',
        topSpeed: raw.topSpeed || '',
        year: raw.year || new Date().getFullYear(),
        details: raw.details || '',
        price: raw.price || '',
        address: raw.address || '',
        name: raw.name || '',
        brand: raw.brand || '',
        image: raw.image || (raw.images?.[0] || ''),
        images: raw.images || [],
        ...raw,
      };
      return result;
    };

    try {
      const car = await createCar(carData);
      setCars((prevCars) => [car, ...prevCars]);
      return car;
    } catch (error) {
      console.error('Failed to save car to backend:', error);
      const newCar = buildFallback();
      setCars((prevCars) => [newCar, ...prevCars]);
      return newCar;
    }
  };

  const editCar = async (carId, updatedFields) => {
    try {
      const updatedCar = await updateCar(carId, updatedFields);
      setCars((prevCars) => prevCars.map((car) => (car.id === carId ? updatedCar : car)));
      return updatedCar;
    } catch (error) {
      console.error('Failed to update car on backend:', error);
      setCars((prevCars) => prevCars.map((car) => (car.id === carId ? { ...car, ...updatedFields } : car)));
      return cars.find((car) => car.id === carId);
    }
  };

  const removeCar = async (carId) => {
    try {
      await deleteCar(carId);
    } catch (error) {
      console.error('Failed to delete car from backend:', error);
    }
    setCars((prevCars) => prevCars.filter((car) => car.id !== carId));
  };

  useEffect(() => {
    const loadCars = async () => {
      try {
        const apiCars = await fetchCars();
        if (Array.isArray(apiCars) && apiCars.length > 0) {
          setCars(apiCars);
        }
      } catch (error) {
        console.warn('Backend unavailable, using local car data.');
      } finally {
        setLoadingCars(false);
      }
    };

    loadCars();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addReview = (text, rating) => {
    if (!currentUser) return false;
    const newReview = {
      id: Date.now(),
      user: currentUser.username,
      text,
      rating,
      date: new Date().toISOString().slice(0, 10)
    };
    setReviews([newReview, ...reviews]);
    return true;
  };

  const toggleFavorite = (carId) => {
    setFavorites((prev) => {
      if (prev.includes(carId)) {
        return prev.filter((id) => id !== carId);
      }
      return [...prev, carId];
    });
  };

  const isFavorite = (carId) => favorites.includes(carId);

  const value = { currentUser, cars, reviews, favorites, loadingCars, login, signup, logout, guestLogin, addCar, editCar, removeCar, addReview, toggleFavorite, isFavorite };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};