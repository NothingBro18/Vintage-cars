import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ThreeDBackground from './components/ThreeDBackground';
import HomePage from './pages/HomePage';
import AccountPage from './pages/AccountPage';
import ReviewsPage from './pages/ReviewsPage';
import AboutPage from './pages/AboutPage';
import UploadPage from './pages/UploadPage';
import CarDetail from './components/CarDetail';

const AppContent = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <ThreeDBackground />
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/car/:id" element={<CarDetail />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/reviews" element={<ReviewsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/upload" element={<UploadPage />} />
      </Routes>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <BrowserRouter
      basename="/vintage-car-gallery"
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;