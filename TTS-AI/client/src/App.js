import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import ProcessText from './components/ProcessText';
import ProcessImage from './components/ProcessImage';
import './App.css';

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/text-to-speech" element={<ProcessText />} />
          <Route path="/image-to-speech" element={<ProcessImage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
