import React, { useState } from "react";
import Toast from "../utilities/toast.jsx";
import BackgroundTypography from "../components/backgroundTypography.jsx";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("");
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate form submission with a timeout
    setTimeout(() => {
      setIsLoading(false);
      setToastMessage("Message sent successfully! We'll get back to you soon.");
      setToastType("success");
      setShowToast(true);
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
    }, 1500);
  };
  
  const closeToast = () => setShowToast(false);

  return (
    <div className="min-h-screen relative flex items-center justify-center py-12 px-4">
      {/* Background container with lower z-index */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <BackgroundTypography />
      </div>
      {showToast && (
          <Toast message={toastMessage} type={toastType} onClose={closeToast} />
        )}
      
      {/* Form container with higher z-index */}
      <div className="relative z-10 max-w-md w-full mx-auto bg-white rounded-xl shadow-lg p-8 border border-gray-100">
        <h2 className="text-2xl font-semibold mb-6 text-center">Send Us a Message</h2>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/50 text-sm"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/50 text-sm"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subject
            </label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/50 text-sm"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="5"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/50 text-sm"
              required
            ></textarea>
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-900 transition-colors flex items-center justify-center"
          >
            {isLoading && <span className="animate-spin mr-2">⟳</span>}
            {isLoading ? "Sending..." : "Send Message"}
          </button>
        </form>
        
        {/* Toast notification */}
        
      </div>
    </div>
  );
}