import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, NavLink } from 'react-router-dom';

// Import page components
import HomePage from './pages/HomePage';
import HelicopterToursPage from './pages/HelicopterToursPage';
import ValleaLuminaPage from './pages/ValleaLuminaPage';
import ChatPage from './pages/ChatPage';
import ParkingPage from './pages/ParkingPage';
import TransitPage from './pages/TransitPage';
import GettingHerePage from './pages/GettingHerePage';
import FamilyPage from './pages/FamilyPage';
import HoursPage from './pages/HoursPage';
import LiftTicketsPage from './pages/LiftTicketsPage';
import ScandinaveSpaPage from './pages/ScandinaveSpaPage';

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="navigation">
          <div className="nav-container">
            <h2 className="nav-title">Whistler Test Pages - DMGo Recommendations</h2>
            <ul className="nav-links">
              <li><NavLink to="/" end>Home</NavLink></li>
              <li><NavLink to="/activities/helicopter-tours">Helicopter Tours</NavLink></li>
              <li><NavLink to="/activities/vallea-lumina">Vallea Lumina</NavLink></li>
              <li><NavLink to="/chat">Chat</NavLink></li>
              <li><NavLink to="/getting-around/parking">Parking</NavLink></li>
              <li><NavLink to="/getting-around/transit">Transit</NavLink></li>
              <li><NavLink to="/getting-here">Getting Here</NavLink></li>
              <li><NavLink to="/family">Family</NavLink></li>
              <li><NavLink to="/hours-of-operation">Hours</NavLink></li>
              <li><NavLink to="/skiing/lift-tickets/passes">Lift Tickets</NavLink></li>
              <li><NavLink to="/wellness/scandinave-spa">Scandinave Spa</NavLink></li>
            </ul>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/activities/helicopter-tours" element={<HelicopterToursPage />} />
          <Route path="/activities/vallea-lumina" element={<ValleaLuminaPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/getting-around/parking" element={<ParkingPage />} />
          <Route path="/getting-around/transit" element={<TransitPage />} />
          <Route path="/getting-here" element={<GettingHerePage />} />
          <Route path="/family" element={<FamilyPage />} />
          <Route path="/hours-of-operation" element={<HoursPage />} />
          <Route path="/skiing/lift-tickets/passes" element={<LiftTicketsPage />} />
          <Route path="/wellness/scandinave-spa" element={<ScandinaveSpaPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
