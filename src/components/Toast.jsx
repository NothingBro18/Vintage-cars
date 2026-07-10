import React from 'react';

const Toast = ({ message, type = 'success', onClose }) => {
  if (!message) return null;

  const bgClass = type === 'error' ? 'bg-rose-600' : 'bg-emerald-600';

  return (
    <div className="fixed bottom-6 left-1/2 z-50 w-[min(90vw,28rem)] -translate-x-1/2 rounded-3xl px-5 py-4 text-white shadow-2xl border border-white/10">
      <div className={`${bgClass} rounded-3xl p-4 flex items-start justify-between gap-4`}>
        <div>
          <p className="font-semibold">{type === 'error' ? 'Error' : 'Success'}</p>
          <p className="mt-1 text-sm leading-relaxed text-slate-100">{message}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-slate-100/80 hover:text-white"
          aria-label="Close notification"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default Toast;
