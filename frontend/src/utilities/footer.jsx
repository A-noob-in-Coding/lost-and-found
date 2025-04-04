import { useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();
  return (
    <footer className="bg-black text-white py-10 mt-10">
      <div className="max-w-7xl mx-auto px-4">
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
          <div>
            <h4 className="font-semibold mb-4">Connect With Us</h4>
            <div className="flex space-x-4 text-xl">
              <a href="#" className="hover:text-gray-300">
                <i className="fab fa-facebook"></i>
              </a>
              <a href="#" className="hover:text-gray-300">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="hover:text-gray-300">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="hover:text-gray-300">
                <i className="fab fa-linkedin"></i>
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-6 text-sm text-gray-400 flex flex-col md:flex-row justify-between items-center">
          <p>© 2025 Lost & Found. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-gray-300">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-gray-300">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
