import { useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();
  
  return (
    <footer className="bg-black text-white w-full mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Lost & Found</h3>
            <p className="text-gray-300 text-sm">
              Helping our community reconnect with their lost belongings since
              2023.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <a href="/feed" className="hover:text-white">
                  Home
                </a>
              </li>
              <li>
                <a href="/aboutUs" className="hover:text-white">
                  About Us
                </a>
              </li>
              <li>
                <a href="/howItWorks" className="hover:text-white">
                  How It Works
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-white">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div>            <h4 className="font-semibold mb-4">Connect With Us</h4>
            <ul className="text-sm text-gray-300 space-y-2">
              <li><a href="mailto:l233059@lhr.nu.edu.pk" className="hover:text-white">l233059@lhr.nu.edu.pk</a> - Muhammad Ahmad Butt</li>
              <li><a href="mailto:l233105@lhr.nu.edu.pk" className="hover:text-white">l233105@lhr.nu.edu.pk</a> - Abd ur Rehman</li>
              <li><a href="mailto:l233076@lhr.nu.edu.pk" className="hover:text-white">l233076@lhr.nu.edu.pk</a> - Muhammad Armgan</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-6 text-sm text-gray-400 flex flex-col md:flex-row justify-between items-center">
          <p>© 2025 Lost & Found. All rights reserved.</p>
        
        </div>
      </div>
    </footer>
  );
}