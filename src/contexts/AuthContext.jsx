import React, { createContext, useState, useContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { initialCars } from '../data/initialCars';

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

  const addCar = (carData) => {
    const newId = cars.length > 0 ? Math.max(...cars.map(c => c.id)) + 1 : 7;
    const newCar = { id: newId, ...carData };
    setCars([newCar, ...cars]);
  };

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

  const value = { currentUser, cars, reviews, login, signup, logout, addCar, addReview };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};