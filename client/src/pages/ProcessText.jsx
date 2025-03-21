import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, Box, CircularProgress, Card, CardContent } from '@mui/material';
import WavEncoder from 'wav-encoder'; // Import the wav-encoder library

const ProcessText = () => {
  const [text, setText] = useState('');
  const [audioUrl, setAudioUrl] = useState(''); // Store the final combined audio URL
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

    try {
      // Send the text to generate audio
      const response = await axios.post('http://127.0.0.1:8000/api/tts/process_text/', {
        text: text.trim(),
      });

      if (response.data?.data?.length > 0) {
        // Extract audio URLs from the response data
        const audioPaths = response.data.data.map(item => `http://127.0.0.1:8000/${item.Mp3_Path}`);
        
        // Combine the audio files on the frontend
        combineAudioFiles(audioPaths);
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
      const audioUrl = URL.createObjectURL(audioBlob);

      // Set the audio URL for playback
      setAudioUrl(audioUrl);

      // Optionally, play the audio immediately after it's ready
      const audioElement = new Audio(audioUrl);
      // audioElement.play();
    } catch (err) {
      console.error('Error combining audio files:', err);
      setError('Error combining audio files.');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 3,
        padding: 3,
      }}
    >
      <Card sx={{ width: 500, padding: 3, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Process Text to Speech
          </Typography>

          <form onSubmit={handleSubmit}>
            {/* Text Input */}
            <TextField
              label="Enter Text"
              multiline
              fullWidth
              rows={4}
              value={text}
              onChange={handleTextChange}
              disabled={loading}
              variant="outlined"
              margin="normal"
            />

            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{ marginTop: 2 }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Process Text'}
            </Button>
          </form>

          {/* Error Message */}
          {error && (
            <Typography color="error" sx={{ marginTop: 2 }}>
              {error}
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* Combined Audio Section */}
      {audioUrl && (
        <Box sx={{ width: '100%', maxWidth: 500 }}>
          <Typography variant="h6">Generated Combined Audio:</Typography>
          <Box sx={{ marginTop: 1, width: '100%' }}>
            <audio controls style={{ width: '100%' }}>
              <source src={audioUrl} type="audio/wav" />
              Your browser does not support the audio element.
            </audio>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default ProcessText;
