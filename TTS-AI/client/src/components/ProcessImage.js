import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './ProcessImage.css'; // Ensure you have a CSS file for styling

const ProcessImage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [audioUrls, setAudioUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [extractedText, setExtractedText] = useState('');

  // Handle file selection
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setAudioUrls([]); // Clear previous results
    setExtractedText('');
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      setError('Please select an image.');
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/process_image/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data && response.data.data && response.data.data.length > 0) {
        // Extract text from response
        setExtractedText(response.data.data.map(item => item.Sentence).join('. '));

        // Construct proper URLs for audio files
        const audioPaths = response.data.data.map(item => {
          const fileName = item.Mp3_Path.split('/').pop(); // Get only the file name
          console.log(`http://127.0.0.1:8000/media/${fileName}`);
          return `http://127.0.0.1:8000/media/${fileName}`; // Ensure correct path
        });

        setAudioUrls(audioPaths);
      } else {
        setError('No text detected in the image.');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Error processing the image.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="process-image">
      <Link to="/" className="home-link">
        <button className="home-button">🏠 Home</button>
      </Link>

      <h1>Upload an Image for OCR & TTS</h1>

      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={handleFileChange} disabled={loading} />
        <button type="submit" disabled={loading || !selectedFile}>
          {loading ? 'Processing...' : 'Upload & Process'}
        </button>
      </form>

      {loading && <div className="spinner"></div>}

      {error && <div className="error-message">{error}</div>}

      {extractedText && (
        <div>
          <h2>Extracted Text:</h2>
          <p>{extractedText}</p>
        </div>
      )}

      {audioUrls.length > 0 && (
        <div>
          <h2>Generated Audio:</h2>
          {audioUrls.map((url, index) => (
            <div key={index}>
              <audio controls>
                <source src={url} type="audio/wav" />
                Your browser does not support the audio element.
              </audio>
              <p>Audio {index + 1}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProcessImage;
