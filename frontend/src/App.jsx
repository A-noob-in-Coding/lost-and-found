// import { useState } from 'react'
import './index.css';
// import Login from './login';
import Feed from './pages/feedPage';
import Login from './pages/loginPage';
import { Route, Routes } from 'react-router-dom';
import Register from './pages/registerPage';
import AboutUs from './pages/aboutUs';
import ContactUs from './pages/contactUs';
import HowItWorks from './pages/howItWorks';
function App() {
  
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/feed" element={<Feed />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register/>} />
      <Route path="*" element={<Login />} />
      <Route path='/aboutUs' element={<AboutUs/>}/>
      <Route path='/howItWorks' element={<HowItWorks/>}/>
      <Route path='/contact' element={<ContactUs/>}/>
    </Routes>
  );
}

export default App
