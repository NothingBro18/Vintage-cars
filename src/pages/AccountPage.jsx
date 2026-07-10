import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

const AccountPage = () => {
  const { login, signup, currentUser } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (currentUser) navigate("/");
  }, [currentUser, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      const success = login(email, password);
      if (success) {
        navigate("/");
        setMsg("");
      } else {
        setMsg("Invalid credentials");
      }
    } else {
      if (!username) return setMsg("Username required");
      const success = signup(email, password, username);
      if (success) {
        navigate("/");
      } else {
        setMsg("Email already exists");
      }
    }
  };

  if (currentUser) {
    return <div className="text-center py-32">Redirecting...</div>;
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-20">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        className="glass-card w-full max-w-md p-8 rounded-2xl border border-red-400/40"
      >
        <h2 className="font-display text-3xl text-center text-red-400 mb-6">
          {isLogin ? "Welcome Back" : "Join The Drive"}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <input 
              type="text" 
              placeholder="Username" 
              value={username} 
              onChange={e => setUsername(e.target.value)} 
              className="w-full p-3 rounded-xl bg-black/60 border border-gray-700 focus:border-red-500 outline-none text-white"
            />
          )}
          <input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            className="w-full p-3 rounded-xl bg-black/60 border border-gray-700 focus:border-red-500 outline-none text-white"
            required
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            className="w-full p-3 rounded-xl bg-black/60 border border-gray-700 focus:border-red-500 outline-none text-white"
            required
          />
          
          {msg && <p className="text-red-400 text-sm">{msg}</p>}
          
          <button 
            type="submit" 
            className="w-full bg-red-600 hover:bg-red-700 py-3 rounded-xl font-bold transition"
          >
            {isLogin ? "LOGIN" : "CREATE ACCOUNT"}
          </button>
        </form>
        
        <p 
          className="text-center mt-6 text-gray-400 cursor-pointer hover:text-red-300 transition"
          onClick={() => { setIsLogin(!isLogin); setMsg(""); }}
        >
          {isLogin ? "No account? Sign up" : "Already have an account? Login"}
        </p>
        
        {isLogin && (
          <p className="text-center mt-4 text-xs text-gray-500">
            Demo: demo@vintage.com / demo123
          </p>
        )}
      </motion.div>
    </div>
  );
};

export default AccountPage;