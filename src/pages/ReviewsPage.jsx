import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import ReviewCard from '../components/ReviewCard';

const ReviewsPage = () => {
  const { reviews, currentUser, addReview } = useAuth();
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);
  const [msg, setMsg] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentUser) return setMsg("Please login to leave a review");
    if (reviewText.trim() === "") return setMsg("Write something meaningful");
    
    addReview(reviewText, rating);
    setReviewText("");
    setRating(5);
    setMsg("Review added successfully!");
    setTimeout(() => setMsg(""), 3000);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h2 className="font-display text-4xl text-center text-red-400 mb-8">
        Community Reviews
      </h2>
      
      <div className="max-w-2xl mx-auto glass-card p-6 rounded-2xl mb-12">
        <h3 className="text-xl font-bold text-white">Share your vintage passion</h3>
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <textarea 
            rows="3" 
            className="w-full p-3 rounded-xl bg-black/60 border border-gray-600 text-white focus:border-red-500 outline-none" 
            placeholder="Your thoughts about our vintage collection..." 
            value={reviewText} 
            onChange={e => setReviewText(e.target.value)}
          />
          
          <div className="flex gap-4 items-center">
            <select 
              value={rating} 
              onChange={e => setRating(parseInt(e.target.value))} 
              className="bg-black/60 border border-gray-600 rounded-lg p-2 text-white"
            >
              <option value="5">5 - Masterpiece</option>
              <option value="4">4 - Great</option>
              <option value="3">3 - Good</option>
              <option value="2">2 - Okay</option>
              <option value="1">1 - Needs improvement</option>
            </select>
            
            <button 
              type="submit" 
              className="bg-red-600 px-6 py-2 rounded-full hover:bg-red-700 transition"
            >
              Post Review
            </button>
          </div>
          
          {msg && (
            <p className={msg.includes("success") ? "text-green-400" : "text-red-400"}>
              {msg}
            </p>
          )}
        </form>
      </div>
      
      <div className="grid gap-5 md:grid-cols-2">
        {reviews.length === 0 ? (
          <p className="text-gray-400 text-center col-span-2">No reviews yet. Be the first!</p>
        ) : (
          reviews.map(review => (
            <ReviewCard key={review.id} review={review} />
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewsPage;