import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useDropzone } from 'react-dropzone'; // Importing useDropzone for drag and drop
import './ProcessImage.css'; // Ensure you have a CSS file for styling
import { Alert } from '@mui/material';
const ProcessImage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [audioUrls, setAudioUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [extractedText, setExtractedText] = useState('');

  // Handle file selection through file picker
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setAudioUrls([]); // Clear previous results
    setExtractedText('');
  };

  // // Handle file drop (Drag and Drop)
  // const onDrop = useCallback((acceptedFiles) => {
  //   setSelectedFile(acceptedFiles[0]);
  //   setAudioUrls([]); // Clear previous results
  //   setExtractedText('');
  // }, []);

  // const { getRootProps, getInputProps, isDragActive } = useDropzone({
  //   onDrop,
  //   accept: 'image/jpeg, image/png, image/jpg', // Accept only valid image types
  //   multiple: false, // Only allow one file to be dropped
  // });

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
      const response = await axios.post('http://127.0.0.1:8000/api/tts/process_image/', formData, {
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
          console.log(`http://127.0.0.1:8000/tts/media/${fileName}`);
          return `http://127.0.0.1:8000/tts/media/${fileName}`; // Ensure correct path
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

      <Alert severity='error'>Page is not ready for final review</Alert>
      <h1>Upload an Image for OCR & TTS</h1>

      <form onSubmit={handleSubmit}>
        {/* Drag and Drop or File Picker */}
        {/* <div {...getRootProps()} className="dropzone">
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <p>Drag 'n' drop an image here, or click to select a file</p>
          )}
        </div> */}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={loading}
          className="file-input"
        />
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
