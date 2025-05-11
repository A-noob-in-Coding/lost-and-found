import React, { useState } from "react";
import Toast from "../utilities/toast.jsx";
import BackgroundTypography from "../components/backgroundTypography.jsx";
import Footer from "../utilities/footer.jsx";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
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
    const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:5000/utility/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (response.ok) {
        setToastMessage("Message sent successfully! We'll get back to you soon.");
        setToastType("success");
        
        // Reset form
        setFormData({
          name: "",
          email: "",
          message: ""
        });
      } else {
        setToastMessage(data.message || "Failed to send message. Please try again.");
        setToastType("error");
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setToastMessage("An error occurred. Please try again later.");
      setToastType("error");
    } finally {
      setIsLoading(false);
      setShowToast(true);
    }
  };
  
  const closeToast = () => setShowToast(false);

  return (
    <>
      {/* Toast notification positioned fixed */}
      {showToast && (
        <Toast message={toastMessage} type={toastType} onClose={closeToast} />
      )}
      
      {/* Root container with min-h-screen and flex to ensure footer at bottom */}
      <div  className="flex flex-col min-h-screen relative">
        {/* Background typography with absolute positioning */}
        <div className="absolute inset-0 overflow-hidden z-0">
          <BackgroundTypography />
        </div>
        
        {/* Main content area - with flex-grow to push footer down */}
        <main style={{marginBottom: '7vh' , marginTop:'7vh' }} className="flex-grow flex items-center justify-center pt-12 px-4 relative z-10">
          {/* Form container */}
          <div style={{ border: '1.5px solid black'}} className="max-w-md w-full mx-auto bg-white rounded-xl shadow-lg p-8 border border-gray-100">
            <h2 className="text-2xl font-semibold mb-6 text-center">Send Us a Message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div style={{ marginBottom: '1rem' }}>
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
              
              <div style={{ marginBottom: '1rem' }}>
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
          </div>
        </main>
        
        {/* Footer with z-index, clearly in the flex flow */}
        <footer className="relative z-10">
          <Footer />
        </footer>
      </div>
    </>
  );
}