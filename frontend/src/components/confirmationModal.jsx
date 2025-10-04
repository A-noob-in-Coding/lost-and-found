import React from 'react';

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirm Action", 
  message = "Are you sure you want to proceed?", 
  confirmText = "Confirm", 
  cancelText = "Cancel",
  type = "danger" // danger, warning, info
}) => {
  if (!isOpen) return null;

  const getIconAndColor = () => {
    switch (type) {
      case 'danger':
        return {
          icon: 'fas fa-exclamation-triangle',
          iconColor: 'text-red-600',
          confirmButtonColor: 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
        };
      case 'warning':
        return {
          icon: 'fas fa-exclamation-circle',
          iconColor: 'text-yellow-600',
          confirmButtonColor: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500'
        };
      case 'info':
        return {
          icon: 'fas fa-info-circle',
          iconColor: 'text-blue-600',
          confirmButtonColor: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
        };
      default:
        return {
          icon: 'fas fa-exclamation-triangle',
          iconColor: 'text-red-600',
          confirmButtonColor: 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
        };
    }
  };

  const { icon, iconColor, confirmButtonColor } = getIconAndColor();

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      {/* Backdrop with enhanced blur effect */}
      <div 
       className="absolute inset-0 bg-white/20 backdrop-blur-md"
        style={{ backdropFilter: 'blur(20px)' }}
      ></div>
      
      {/* Modal Content */}
      <div 
        className="relative bg-white bg-opacity-95 backdrop-blur-sm rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 scale-100"
        style={{ backdropFilter: 'blur(10px)' }}
      >
        {/* Modal Header */}
        <div className="flex flex-col items-center justify-center pt-8 px-6">
          {/* Icon */}
          <div className={`w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4`}>
            <i className={`${icon} ${iconColor} text-2xl`}></i>
          </div>
          
          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
            {title}
          </h3>
          
          {/* Message */}
          <p className="text-gray-600 text-center text-sm leading-relaxed">
            {message}
          </p>
        </div>

        {/* Modal Actions */}
        <div className="flex flex-col sm:flex-row gap-3 p-6 pt-8">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 px-4 py-3 text-white ${confirmButtonColor} rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;