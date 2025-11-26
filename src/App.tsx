import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import Register from './pages/Register';
import Birthday from './pages/Birthday';
import 'primereact/resources/themes/lara-dark-purple/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-background pb-20 md:pb-0 md:pt-24">
        <BottomNav />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/birthdays" element={<Birthday />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
