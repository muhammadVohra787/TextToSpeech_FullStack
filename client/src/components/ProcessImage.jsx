import React, { useState } from 'react';
import axios from 'axios';
import { Alert } from '@mui/material';
import WavEncoder from 'wav-encoder'; // Import the wav-encoder library
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';

const ProcessImage = () => {
  const authUser = useAuthUser();
  const userId = authUser?.user_id;

  const [selectedFile, setSelectedFile] = useState(null);
  const [audioUrl, setAudioUrl] = useState(''); // Store the final combined audio URL
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [extractedText, setExtractedText] = useState('');


  // Handle file selection through file picker
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setExtractedText('');
    setAudioUrl(''); // Clear the combined audio URL
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
    formData.append('userId', userId);    // Append the userId to the form data


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
          return `http://127.0.0.1:8000/tts/media/${fileName}`; // Ensure correct path
        });


        // Combine the audio files into one
        combineAudioFiles(audioPaths);
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

  // Function to combine multiple audio files into one
  const combineAudioFiles = async (audioPaths) => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const buffers = [];

      // Fetch and decode each audio file
      for (let i = 0; i < audioPaths.length; i++) {
        const response = await fetch(audioPaths[i]);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        buffers.push(audioBuffer);
      }

      // Calculate the total length of the combined audio
      const totalLength = buffers.reduce((acc, buffer) => acc + buffer.length, 0);
      const combinedBuffer = audioContext.createBuffer(2, totalLength, audioContext.sampleRate);

      let offset = 0;
      buffers.forEach(buffer => {
        for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
          combinedBuffer.getChannelData(channel).set(buffer.getChannelData(channel), offset);
        }
        offset += buffer.length;
      });

      // Encode the combined audio buffer into WAV format
      const wavData = await WavEncoder.encode({
        sampleRate: audioContext.sampleRate,
        channelData: [combinedBuffer.getChannelData(0), combinedBuffer.getChannelData(1)],
      });

      // Create a Blob from the WAV data
      const audioBlob = new Blob([wavData], { type: 'audio/wav' });

      // Create a URL for the audio Blob
      const combinedAudioUrl = URL.createObjectURL(audioBlob);

      // Set the audio URL for playback
      setAudioUrl(combinedAudioUrl);

      // Optionally, play the audio immediately after it's ready
      const audioElement = new Audio(combinedAudioUrl);

    } catch (err) {
      console.error('Error combining audio files:', err);
      setError('Error combining audio files.');
    }
  };

  return (
    <div className="process-image">
      <Alert severity="error">Page is not ready for final review</Alert>
      <h1>Upload an Image for OCR & TTS</h1>

      <form onSubmit={handleSubmit}>
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

      {/* Combined Audio Section */}
      {audioUrl && (
        <div>
          <h2>Combined Audio:</h2>
          <audio controls>
            <source src={audioUrl} type="audio/wav" />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
    </div>
  );
};

export default ProcessImage;
