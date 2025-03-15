import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './ProcessText.css';  // Ensure you import the CSS file if you're adding it separately

const ProcessText = () => {
  const [text, setText] = useState('');
  const [audioUrls, setAudioUrls] = useState([]); // Store multiple audio URLs
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!text.trim()) {
      setError('Please enter some text.');
      return;
    }

    setLoading(true);
    setError(null);

    // Clear previous Audio
    setAudioUrls([]);


    try {
      const response = await axios.post('http://127.0.0.1:8000/api/process_text/', {
        text: text.trim(),
      });

      if (response.data && response.data.data && response.data.data.length > 0) {
        console.log('Response Data:', response.data.data);

        // Extract multiple audio file paths
        const audioPaths = response.data.data.map(item => `http://127.0.0.1:8000/${item.Mp3_Path}`);
        setAudioUrls(audioPaths);
      } else {
        setError('No audio generated.');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Error processing the text.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="process-text">
      <Link to="/" className="home-link">
        <button className="home-button">🏠 Home</button>
      </Link>

      <h1>Process Text to Speech</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="text">Enter Text:</label>
          <textarea
            id="text"
            name="text"
            rows="4"
            cols="50"
            value={text}
            onChange={handleTextChange}
            disabled={loading}
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Processing...' : 'Process Text'}
        </button>
      </form>

      {loading && <div className="spinner-container"><div className="spinner"></div></div>}

      {error && <div style={{ color: 'red' }}>{error}</div>}

      {audioUrls.length > 0 && (
        <div>
          <h2>Generated Audio:</h2>
          {audioUrls.map((url, index) => (
            <div key={index}>
              <audio controls>
                <source src={url} type="audio/wav" />
                Your browser does not support the audio element.
              </audio>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProcessText;
