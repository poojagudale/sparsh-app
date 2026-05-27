import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import Search from './pages/search/Search';
import Services from './pages/Services';
import Booking from './pages/Booking';
import Profile from './pages/Profile';
import FooterTabs from './components/FooterTabs';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/search" element={<Search />} />
        <Route path="/home" element={<Home />} />
        <Route path="/services/*" element={<Services />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      <FooterTabs />
    </Router>
  );
}

export default App;
