import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css'; // Ensure you create a CSS file for styling

const Home = () => {
  return (
    <div className="home-container">
      <h1>Welcome to the Speech Converter</h1>
      <p>Select an option below:</p>

      <div className="button-container">
        <Link to="/text-to-speech">
          <button className="home-button">Text to Speech</button>
        </Link>
        <Link to="/image-to-speech">
          <button className="home-button">Image to Speech</button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
