import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Toast from "../utilities/toast.jsx";
import Footer from "../utilities/footer.jsx";

export default function ContactUs() {
  const navigate = useNavigate();
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

  const contactMethods = [
    {
      title: "Email Support",
      description: "Get in touch with our support team",
      contact: "support@fastlostfound.com",
      icon: "fa-envelope"
    },
    {
      title: "Campus Office",
      description: "Visit us during business hours",
      contact: "Student Services Center, FAST NUCES",
      icon: "fa-map-marker-alt"
    },
    {
      title: "Emergency Contact",
      description: "For urgent lost item reports",
      contact: "+92-XXX-XXXXXXX",
      icon: "fa-phone"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Toast notification */}
      {showToast && (
        <Toast message={toastMessage} type={toastType} onClose={closeToast} />
      )}

      {/* Header with Logo and Navigation */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between w-full">
          <div className="flex items-center space-x-3 ml-4">
            <img 
              src="/lf_logo.png" 
              alt="Lost & Found Logo" 
              className="h-10 w-10 rounded-full"
            />
            <h1 className="text-2xl font-bold text-black">FAST Lost & Found</h1>
          </div>
          <div className="flex-shrink-0 ml-auto mr-0">
            <button
              onClick={() => navigate("/")}
              className="bg-black text-white px-10 py-2 rounded-full text-sm font-medium hover:bg-white hover:text-black border-2 border-black transition-all duration-300 hover:scale-110 transform"
            >
              Home
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
            Contact Us
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
            Have questions, feedback, or need assistance? We're here to help you make the most of our Lost & Found platform.
          </p>
        </div>
      </section>

      {/* Contact Methods Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12 text-black">Get In Touch</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {contactMethods.map((method, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center">
                    <i className={`fas ${method.icon} text-lg`}></i>
                  </div>
                </div>
                <h4 className="text-xl font-semibold text-black mb-2">{method.title}</h4>
                <p className="text-gray-600 text-sm mb-3">{method.description}</p>
                <p className="text-black font-medium text-sm">{method.contact}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Form Info */}
            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-black">Send Us a Message</h3>
              <p className="text-gray-600 leading-relaxed">
                Fill out the form and we'll get back to you as soon as possible. Whether you have a suggestion, 
                found a bug, or need help with the platform, we'd love to hear from you.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center">
                    <i className="fas fa-clock text-sm"></i>
                  </div>
                  <span className="text-gray-600">Response time: 24-48 hours</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center">
                    <i className="fas fa-shield-alt text-sm"></i>
                  </div>
                  <span className="text-gray-600">Your information is secure</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center">
                    <i className="fas fa-users text-sm"></i>
                  </div>
                  <span className="text-gray-600">Community-focused support</span>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/50 transition-all"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/50 transition-all"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="5"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/50 transition-all resize-none"
                    required
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-900 transition-all duration-300 hover:scale-105 transform flex items-center justify-center"
                >
                  {isLoading && <span className="animate-spin mr-2">⟳</span>}
                  {isLoading ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold text-black mb-8">Quick Answers</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-50 rounded-2xl p-6 border-l-4 border-black">
              <h4 className="text-lg font-semibold text-black mb-3">How quickly do you respond?</h4>
              <p className="text-gray-600 text-sm">We typically respond to all inquiries within 24-48 hours during business days.</p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6 border-l-4 border-black">
              <h4 className="text-lg font-semibold text-black mb-3">Can I suggest new features?</h4>
              <p className="text-gray-600 text-sm">Absolutely! We welcome feature suggestions and feedback to improve our platform.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}