import React from "react";
import BackgroundTypography from "../components/backgroundTypography.jsx";
import { useNavigate } from "react-router-dom";
import Footer from "../utilities/footer.jsx";
export default function AboutUs() {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen bg-gray-50">
      {/* Background Typography */}
      <BackgroundTypography />
      
      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-16 relative z-10" >
        <h1 className="text-4xl font-bold mb-8 text-center">About Us</h1>
        
        <div className="bg-white rounded-xl shadow-sm p-8 mb-10">
          <div style={{ background: "white", marginBottom: "3vh", border: "1px solid black", borderRadius: "20px", color: "black", paddingLeft: "2vw", paddingTop: "2vh" }}>
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="text-black-700 mb-6">
              The FAST NUCES Lost & Found platform was created with a simple mission: to reunite students with their lost items and provide a streamlined way for good Samaritans to return found belongings to their rightful owners.
            </p>
          </div>
          
          <div style={{ background: "white", marginBottom: "3vh", border: "1px solid black", borderRadius: "20px", color: "black", paddingLeft: "2vw", paddingTop: "2vh" }}>
            <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
            <p className="text-black mb-4">
              As students of FAST NUCES, we experienced firsthand the frustration of losing items on campus and the inefficient process of trying to recover them. The existing solutions were fragmented - lost items were reported on different WhatsApp groups, Facebook pages, and notice boards around campus.
            </p>
            <p className="text-black mb-6">
              In 2025, we decided to solve this problem by creating a centralized digital platform specifically designed for our campus community. Our platform makes it easy to report lost items, post found items, and connect the two parties quickly and securely.
            </p>
          </div>

          <div style={{ background: "white", marginBottom: "3vh", border: "1px solid black", borderRadius: "20px" }}>
            <b><h2 style={{ margin: "10px", color: "black", fontSize: "1.5rem", paddingLeft: "2vw", paddingTop: "2vh" }}>Our Team</h2></b>
            <div style={{
              display: "flex",
            }}>
              {/* Team Member 1 */}
              <div style={{ background: "black", border: "1px solid black", marginLeft: "10px", marginRight: "10px", borderRadius: "20px", color: "white", width: "30vw", height: "15vh", paddingTop: "3.5vh" }} className="text-center">
                <h3 className="font-medium">Abd Ur Rehman</h3>
                <p className="text-sm ">Lead Developer</p>
              </div>
              
              {/* Team Member 2 */}
              <div style={{ background: "black", border: "1px solid black", marginRight: "10px", borderRadius: "20px", color: "white", width: "30vw", height: "15vh", paddingTop: "3.5vh" }} className="text-center">
                <h3 className="font-medium">Ahmed Butt</h3>
                <p className="text-sm ">UI/UX Designer</p>
              </div>
              
              {/* Team Member 3 */}
              <div style={{ background: "black", border: "1px solid black", marginBottom: "2vh", marginRight: "10px", borderRadius: "20px", color: "white", width: "30vw", height: "15vh", paddingTop: "3.5vh" }} className="text-center">
                <h3 className="font-medium">Muhammad Armgan</h3>
                <p className="text-sm">Database Manager</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10" style={{ marginTop: "-5vh", marginBottom: "3vh", marginLeft: "2.5vw", marginRight: "2.5vw" }}>
          <div style={{ background: "black", border: "1px solid black", borderRadius: "20px", color: "white" }} className="bg-white p-6 rounded-xl shadow-sm text-center">
            <div className="text-4xl font-bold mb-2">500+</div>
            <div>Items Recovered</div>
          </div>
          <div style={{ background: "black", border: "1px solid black", borderRadius: "20px", color: "white" }} className="bg-white p-6 rounded-xl shadow-sm text-center">
            <div className="text-4xl font-bold mb-2">2,000+</div>
            <div>Active Users</div>
          </div>
          <div style={{ background: "black", border: "1px solid black", borderRadius: "20px", color: "white" }} className="p-6 rounded-xl shadow-sm text-center">
            <div className="text-4xl font-bold mb-2">85%</div>
            <div>Recovery Rate</div>
          </div>
        </div>
        
        <div style={{ background: "black", border: "1px solid black", borderRadius: "20px", color: "white" }} className="rounded-xl p-8 mb-3 text-center">
          <h2 className="text-2xl font-semibold mb-4">Join Our Community</h2>
          <p className="mb-6">Help us build a more connected and responsible campus community.</p>
          <button className="bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          onClick={() => navigate("/register")}
          >
            Register Now
          </button>
        </div>
      </div>
      <Footer/>
    </div>
  );
}
