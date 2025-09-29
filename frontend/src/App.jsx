import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/authContext';
import ProtectedRoutes from './components/protectedRoutes';
import Login from './pages/loginPage';
import Feed from './pages/feedPage';
import AboutUs from './pages/aboutUs.jsx';
import ContactForm from './pages/contactUs.jsx';
import HowItWorks from './pages/howItWorks.jsx';
import Register from './pages/registerPage';
import PreviewPage from './pages/previewPage.jsx';
import { Toaster } from 'react-hot-toast';
import ProfilePage from './pages/profilePage';
import CreatePost from './pages/createPost.jsx';
import AdminPage from './pages/adminPage.jsx'
import { UtilProvider } from './context/utilContext.jsx';
import CreatePostPage from './pages/createPost.jsx';
import "nprogress/nprogress.css";

function App() {
  return (
    <AuthProvider>
      <UtilProvider>  {/* Wrap at app level */}
        <BrowserRouter>
          <Toaster position="top-right" />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<PreviewPage />} />
            <Route path="/preview" element={<PreviewPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/aboutus" element={<AboutUs />} />
            <Route path="/contact" element={<ContactForm />} />
            <Route path="/howitworks" element={<HowItWorks />} />
            <Route path="/admin/:password" element={<AdminPage />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoutes />}>
              <Route path="/feed" element={<Feed />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/createPost" element={<CreatePostPage />} />
              <Route path="/register" element={<Register />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </UtilProvider>
    </AuthProvider>);
}

export default App;
