import React, { useEffect } from "react";

export default function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(); // Auto-close toast after 5 seconds
    }, 5000);
    return () => clearTimeout(timer); // Clean up the timer on unmount
  }, [message, onClose]);

  const successClasses = "bg-green-500 text-white";
  const errorClasses = "bg-red-500 text-white";

  return (
    <div
      className={`fixed bottom-5 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-md z-50 min-w-64 max-w-md transition-all ${
        type === "success" ? successClasses : errorClasses
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        <span className="flex-grow text-center">{message}</span>
        <button 
          onClick={onClose} 
          className="text-white font-semibold flex-shrink-0 hover:opacity-75 transition-opacity"
          aria-label="Close"
        >
          ✕
        </button>
      </div>
    </div>
  );
}