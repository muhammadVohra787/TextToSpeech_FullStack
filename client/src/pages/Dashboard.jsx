import React, { useEffect, useState } from 'react';

const TextToSpeech = () => {
  useEffect(() => {
    document.body.style.backgroundColor = 'white';
    document.body.style.color = 'black';
    document.body.style.display = 'flex';
    document.body.style.justifyContent = 'center';
    document.body.style.alignItems = 'center';
    document.body.style.minHeight = '100vh';

    return () => {
      document.body.style.backgroundColor = '';
      document.body.style.color = '';
      document.body.style.display = '';
      document.body.style.justifyContent = '';
      document.body.style.alignItems = '';
      document.body.style.minHeight = '';
    };
  }, []);

  const [progress, setProgress] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0.0);
  const totalDuration = 0.6;

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100vw' }}>
      <div style={{
        textAlign: 'center',
        maxWidth: '600px',
        width: '100%',
        padding: '20px',
        background: 'white',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
        borderRadius: '10px'
      }}>
        <h1 style={{ fontSize: '26px', fontWeight: 'bold', color: 'black', marginBottom: '10px' }}>
          🔊 Convert Text to Speech Instantly
        </h1>

        <p style={{ fontSize: '16px', color: 'black', marginBottom: '20px' }}>
          Enter your text below and generate high-quality speech in just one click.  
          Choose a voice, adjust settings if needed, and press "Generate Audio" to listen or download.
        </p>

        <textarea
          style={{
            width: '100%',
            height: '150px',
            padding: '12px',
            fontSize: '16px',
            borderRadius: '10px',
            border: '1px solid #ccc',
            backgroundColor: '#F3F4F6',
            outline: 'none',
            resize: 'none'
          }}
          placeholder="Type your text here..."
        />

        <button
          style={{
            marginTop: '15px',
            padding: '12px 24px',
            fontSize: '16px',
            fontWeight: 'bold',
            color: 'white',
            backgroundColor: '#6B46C1',
            border: 'none',
            borderRadius: '25px',
            cursor: 'pointer',
            transition: 'background 0.3s ease'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#553C9A'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#6B46C1'}
        >
          Generate
        </button>

        <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <button
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: '#444',
              color: 'white',
              fontSize: '20px',
              border: 'none',
              marginRight: '10px',
              cursor: 'pointer'
            }}
          >
            ▶
          </button>

          <div style={{
            flexGrow: 1,
            height: '6px',
            width: '100%',
            backgroundColor: '#ddd',
            borderRadius: '5px',
            position: 'relative'
          }}>
            <div style={{
              width: `${progress}%`,
              height: '100%',
              backgroundColor: '#4A90E2',
              borderRadius: '5px'
            }}></div>
          </div>
        </div>

        <p style={{ fontSize: '12px', color: 'black', marginTop: '5px' }}>
          {timeElapsed.toFixed(1)}/{totalDuration}
        </p>
      </div>
    </div>
  );
};

export default TextToSpeech;
