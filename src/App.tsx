import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { LandingPage } from './pages/LandingPage';
import { EditorPage } from './pages/EditorPage';
import { CardViewPage } from './pages/CardViewPage';

export default function App() {
  return (
    <HelmetProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/create" element={<EditorPage />} />
          <Route path="/view/:id" element={<CardViewPage />} />
          {/* Fallback for old style links ?id=... */}
          <Route path="*" element={<EditorPage />} />
        </Routes>
      </Router>
    </HelmetProvider>
  );
}
