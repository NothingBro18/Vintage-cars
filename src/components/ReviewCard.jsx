import React from 'react';

const ReviewCard = ({ review }) => {
  return (
    <div className="bg-white/5 p-5 rounded-xl border-l-4 border-red-500 backdrop-blur-sm hover:bg-white/10 transition">
      <div className="flex justify-between items-start flex-wrap gap-2">
        <span className="font-bold text-red-300">{review.user}</span>
        <span className="text-xs text-gray-400">{review.date}</span>
      </div>
      <div className="flex text-yellow-400 text-sm mt-1">
        {"★".repeat(review.rating)}
        {"☆".repeat(5 - review.rating)}
      </div>
      <p className="mt-2 text-gray-300">{review.text}</p>
    </div>
  );
};

export default ReviewCard;