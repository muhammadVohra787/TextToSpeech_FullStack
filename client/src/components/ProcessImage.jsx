import React, { useState } from 'react';
import axios from 'axios';
import { Alert, Button, Box, Typography, CircularProgress, Container } from '@mui/material';
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

  // Handle file selection through drag and drop or file picker
  const handleFileChange = (e) => {
    const file = e.target.files ? e.target.files[0] : e.dataTransfer.files[0];
    setSelectedFile(file);
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
        setExtractedText(response?.data?.word);
        console.log(response)
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

  // Handle drag over and drop for the drag-and-drop zone
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFileChange(e);
  };

  return (
    <Container sx={{ padding: 2, display: 'flex', justifyContent: 'center', maxWidth: 'lg', width: '100%' }}>
      <Box className="process-image" sx={{ width: '100%', overflow: 'hidden' }}>
        <Typography variant="h4" gutterBottom>
          Upload an Image for OCR & TTS
        </Typography>

        {/* Drag and Drop Area */}
        <Box
          sx={{
            border: '2px dashed #1976d2',
            borderRadius: '8px',
            padding: '20px',
            textAlign: 'center',
            cursor: 'pointer',
            backgroundColor: '#f5f5f5',
            '&:hover': {
              backgroundColor: '#e3f2fd',
            },
            minWidth: 300, // Prevent shrinkage
            maxWidth: '100%', // Allow expansion
          }}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <Typography variant="body1" color="textSecondary">
            Drag and drop your image here, or click to select.
          </Typography>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
            id="file-input"
          />
          <label htmlFor="file-input">
            <Button variant="contained" component="span" sx={{ marginTop: 2 }}>
              Select Image
            </Button>
          </label>
        </Box>

        {/* Submit button */}
        <Box sx={{ marginTop: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={loading || !selectedFile}
            sx={{ width: '100%' }}
          >
            {loading ? 'Processing...' : 'Upload & Process'}
          </Button>
        </Box>

        {/* Loading spinner */}
        <Box sx={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'column', display: 'flex' }}>
          {loading && <CircularProgress color="secondary" sx={{ marginTop: 2 }} />}
        </Box>

        {/* Error message */}
        {error && <Alert severity="error" sx={{ marginTop: 2 }}>{error}</Alert>}
        {selectedFile && (
          <Box sx={{ marginTop: 2 }}>
            <Typography variant="subtitle1">Selected File:</Typography>
            <Typography variant="body2">{selectedFile.name}</Typography>
          </Box>
        )}

        {/* Extracted Text */}
        {extractedText && (
          <Box sx={{ marginTop: 2 }}>
            <Typography variant="h6">Extracted Text:</Typography>
            <Typography variant="body1">{extractedText}</Typography>
          </Box>
        )}

        {/* Combined Audio Section */}
        {audioUrl && (
          <Box sx={{ marginTop: 2 }}>
            <Typography variant="h6">Combined Audio:</Typography>
            <audio controls>
              <source src={audioUrl} type="audio/wav" />
              Your browser does not support the audio element.
            </audio>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default ProcessImage;
