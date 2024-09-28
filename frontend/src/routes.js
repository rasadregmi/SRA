// src/routes.js
import React from 'react';
import { Route, Routes } from 'react-router-dom'; // Only import Route and Routes
import Home from './pages/Home';              // Import the Home page
import Report from './pages/Report';          // Import the Report page
import Review from './pages/Review';          // Import the Review page
import Profile from './pages/Profile';             // Import the Profile Us page
import Authform from './pages/Authform';      // Import the Login/Signup page

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />            {/* Home page */}
      <Route path="/report" element={<Report />} />    {/* Report page */}
      <Route path="/review" element={<Review />} />    {/* Review page */}
      <Route path="/profile" element={<Profile />} />  {/* Profile Us page */}
      <Route path="/login" element={<Authform />} />   {/* Login/Signup page */}
    </Routes>
  );
};

export default AppRoutes;
