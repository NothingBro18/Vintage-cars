import React from 'react';

const Modal = ({ open, title, message, confirmLabel = 'Confirm', cancelLabel = 'Cancel', onConfirm, onCancel }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-md rounded-3xl border border-amber-500/30 bg-slate-950 p-6 shadow-2xl">
        <h2 className="text-xl font-bold text-amber-400 mb-3">{title}</h2>
        <p className="text-gray-300 leading-relaxed mb-6">{message}</p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="w-full rounded-2xl border border-gray-700 bg-slate-900 px-4 py-3 text-sm font-semibold text-gray-200 hover:bg-slate-800 transition sm:w-auto"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="w-full rounded-2xl bg-amber-500 px-4 py-3 text-sm font-semibold text-slate-950 hover:bg-amber-400 transition sm:w-auto"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
