import React from "react";
import { useNavigate } from "react-router-dom";
import BackgroundTypography from "../components/backgroundTypography.jsx";

export default function HowItWorks() {
  const navigate = useNavigate();
  const steps = [
    {
      title: "Create an Account",
      description: "Sign up using your FAST NUCES email address and student ID to join our community.",
      icon: "fa-user-plus"
    },
    {
      title: "Report Lost Items",
      description: "Provide details and photo of your lost item, including when and where you last saw it.",
      icon: "fa-search"
    },
    {
      title: "Post Found Items",
      description: "Found something? Post details and a photo to help locate the owner quickly.",
      icon: "fa-hand-holding"
    },
    {
      title: "Connect Safely",
      description: "Use details provided by students to ensure a safe exchange.",
      icon: "fa-comments"
    },
    {
      title: "Close the Case",
      description: "Mark items as recovered and help us track successful reunions.",
      icon: "fa-check-circle"
    }
  ];

  return (
    <div className="relative min-h-screen bg-gray-50">
      {/* Background Typography */}
      <BackgroundTypography />
      
      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-16 relative z-10">
        <h1 className="text-4xl font-bold mb-8 text-center">How It Works</h1>
        
        {/* Process Steps */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-10">
          <div className="grid gap-8 md:grid-cols-2">
            {steps.map((step, index) => (
              <div key={index} className="flex">
                <div className="mr-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-black text-white">
                    <i className={`fas ${step.icon}`}></i>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* FAQ Section */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-10">
          <h2 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Who can use this platform?</h3>
              <p className="text-gray-600">The Lost & Found platform is exclusively for FAST NUCES students, faculty, and staff. You must register with your university email address.</p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Is there a fee for using the service?</h3>
              <p className="text-gray-600">No, our platform is completely free to use. It's our contribution to making campus life better.</p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">How do I ensure a safe meetup?</h3>
              <p className="text-gray-600">Always arrange to meet in public places on campus during daylight hours. The cafeteria, library, and main lobby are good options.</p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">What if someone claims my found item falsely?</h3>
              <p className="text-gray-600">We recommend asking for specific details about the item that only the true owner would know before handing it over.</p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">How long do posts stay active?</h3>
              <p className="text-gray-600">Posts remain active for 30 days by default, but you can manually close them earlier once the item is recovered or extend them if needed.</p>
            </div>
          </div>
        </div>
        
        {/* Testimonials */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-10">
          <h2 className="text-2xl font-semibold mb-6">Success Stories</h2>
          
          <div className="grid gap-6">
            <div className="border-l-4 border-black pl-4 py-2">
              <p className="text-gray-600 italic mb-2">"I lost my laptop in the CS lab and was panicking about my assignments. Within hours of posting on the platform, someone had found it and messaged me. The process was so simple!"</p>
              <p className="font-medium">— Aisha K., Computer Science</p>
            </div>
            
            <div className="border-l-4 border-black pl-4 py-2">
              <p className="text-gray-600 italic mb-2">"Found someone's wallet in the cafeteria and wasn't sure what to do. Posted it on Lost & Found and connected with the owner within minutes. They were so relieved!"</p>
              <p className="font-medium">— Hassan T., Electrical Engineering</p>
            </div>
          </div>
        </div>
        
        {/* CTA Section */}
        <div className="bg-black text-white rounded-xl p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">Ready to Get Started?</h2>
          <p className="mb-6">Join our community and help make FAST NUCES a more connected campus.</p>
          <div className="flex justify-center space-x-4">
            <button className="bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors" onClick={() => navigate("/register")}>
              Register Now
            </button>
            <button className="border border-white px-6 py-3 rounded-lg font-medium hover:bg-white/10 transition-colors" onClick={() => navigate("/aboutUs")}>
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}