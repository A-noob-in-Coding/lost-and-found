import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/authContext';
import ProtectedRoute from './components/protectedRoute';
import Login from './pages/loginPage';
import Feed from './pages/feedPage';
import AboutUs from './pages/aboutUs.jsx';
import ContactForm from './pages/contactUs.jsx';
import HowItWorks from './pages/howItWorks.jsx';
import Register from './pages/registerPage';
import { Toaster } from 'react-hot-toast';
import ProfilePage from './pages/profilePage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/contact" element={<ContactForm />} />
          <Route path="/howitworks" element={<HowItWorks />} />


          <Route 
            path="/feed" 
            element={
              <ProtectedRoute>
                <Feed />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;