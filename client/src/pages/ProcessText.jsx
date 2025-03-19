import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
  Card,
  CardContent,
} from '@mui/material';

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

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/tts/process_text/', {
        text: text.trim(),
      });

      if (response.data?.data?.length > 0) {
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

      {/* Generated Audio Section */}
      {audioUrls.length > 0 && (
        <Box sx={{ width: '100%', maxWidth: 500 }}>
          <Typography variant="h6">Generated Audio:</Typography>
          {audioUrls.map((url, index) => (
            <Box key={url} sx={{ marginTop: 1, width: '100%' }}>
              <audio controls style={{ width: '100%' }}>
                <source src={url} type="audio/wav" />
                Your browser does not support the audio element.
              </audio>
            </Box>

          ))}
        </Box>
      )}
    </Box>
  );
};

export default ProcessText;
