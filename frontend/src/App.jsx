import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/authContext';
import ProtectedRoutes from './components/protectedRoutes';
import Login from './pages/loginPage';
import Feed from './pages/feedPage';
import AboutUs from './pages/aboutUs.jsx';
import ContactForm from './pages/contactUs.jsx';
import HowItWorks from './pages/howItWorks.jsx';
import Register from './pages/registerPage';
import { Toaster } from 'react-hot-toast';
import ProfilePage from './pages/profilePage';
import CreatePost from './pages/createPost.jsx';
import AdminPage from './pages/adminPage.jsx'
import CreatePostPage from './pages/createPost.jsx';
import "nprogress/nprogress.css";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/createPost" element={<CreatePost />} />
          <Route path="/register" element={<Register />} />
          <Route path='/createPost' element={<CreatePostPage/>} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/contact" element={<ContactForm />} />
          <Route path="/howitworks" element={<HowItWorks />} />
          <Route path="/admin/:password" element={<AdminPage />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoutes />}>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/feed" element={<Feed />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;