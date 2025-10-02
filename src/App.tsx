import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/AuthProvider';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import DefiRose from './pages/DefiRose';
import RowingCareCup from './pages/RowingCareCup';
import ParticipantSpace from './pages/ParticipantSpace';
import AdminPage from './pages/AdminPage';
import LeaderboardView from './components/LeaderboardView';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-white">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/defi-rose" element={<DefiRose />} />
              <Route path="/rowing-care-cup" element={<RowingCareCup />} />
              <Route path="/espace-participant" element={<ParticipantSpace />} />
              <Route path="/admin" element={<AdminPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;