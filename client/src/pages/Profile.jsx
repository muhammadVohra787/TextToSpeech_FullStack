import React, { useEffect, useState } from 'react';
import { Button, TextField, Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress } from '@mui/material';
import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { usePostAuthenticated } from '../api/tanstack-get-post';
import WavEncoder from 'wav-encoder'; // Import the wav-encoder library
import axios from 'axios';
import {useNavigate} from "react-router-dom"

const API_URL=import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const ProfilePage = () => {
  const authUser = useAuthUser();
  const userId = authUser?.user_id;
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({ name: "", email: "" });
  const { isPending: gettingUserData, mutateAsync: getUser } = usePostAuthenticated();
  const { isPending: updatingUserData, mutateAsync: updateUser } = usePostAuthenticated();
  const { isPending: gettingUserRecordings, mutateAsync: getUserRecordings } = usePostAuthenticated();
  const { isPending: deletingRecordings, mutateAsync: deleteRecording } = usePostAuthenticated();
  const [userRecordings, setUserRecordings] = useState([]);
  const navigate = useNavigate()
  // Fetch user data and recordings
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getUser({ postData: { userId }, url: "users/get_user" });
        setUserData({
          name: res?.data?.user?.fullName || "",
          email: res?.data?.user?.email || "",
        });

        const recordings = await getUserRecordings({ postData: { userId }, url: "users/get_user_recordings" });

        const audioPaths = recordings.data.recordings;

        const recordingsArray = Object.entries(audioPaths).map(([referenceId, data]) => ({
          id: referenceId,
          sentence: data.sentence,
          paths: data.paths, 
        }));

        setUserRecordings(recordingsArray);

        // Automatically combine audio after fetching recordings
        const audioPathsWithSentences = recordingsArray.map(recording => ({
          sentence: recording.sentence,
          paths: recording.paths
        }));
        combineAudioFiles(audioPathsWithSentences);

      } catch (error) {
        console.error("Error fetching user:", error.message);
      }
    };

    fetchData();
  }, [getUser, userId]);

  const combineAudioFiles = async (audioPathsWithSentences) => {
    try {
      console.log("Starting to combine audio files...");
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();

      // Iterate over each sentence and its associated audio paths
      for (let i = 0; i < audioPathsWithSentences.length; i++) {
        const { sentence, paths } = audioPathsWithSentences[i];
        const buffers = [];

        // Loop through each audio path and fetch the audio data
        for (let j = 0; j < paths.length; j++) {
          const response = await axios.get(`${API_URL}/${paths[j]}`, {
            responseType: 'arraybuffer', // Set response type to arraybuffer
          });

          if (response.status !== 200) {
            throw new Error(`Failed to fetch audio file: ${paths[j]}`);
          }

          const audioBuffer = await audioContext.decodeAudioData(response.data);
          buffers.push(audioBuffer);
        }

        if (buffers.length === 0) {
          throw new Error(`No valid audio buffers to combine for sentence: ${sentence}`);
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

        // Update the sentence with the combined audio URL
        setUserRecordings(prevRecordings => {
          const updatedRecordings = prevRecordings.map(recording => {
            if (recording.sentence === sentence) {
              return { ...recording, mp3Path: audioUrl }; // Save combined audio URL
            }
            return recording;
          });
          return updatedRecordings;
        });
      }

      console.log('All audio files combined successfully.');
    } catch (err) {
      console.error('Error combining audio files:', err);
    }
  };





  // Handle Update/Edit
  const handleUpdate = () => {
    setIsEditing(true);
  };

  // Handle Save
  const handleSave = async () => {
    try {
      await updateUser({ postData: { userId: userId, fullName: userData?.name, email: userData?.email }, url: "users/update_user" });
    } catch (error) {
      setUserData({ name: userData.name, email: userData.email });
      console.error("Error updating user:", error.message);
    }
    setIsEditing(false);
  };

  // Handle Cancel
  const handleCancel = () => {
    setIsEditing(false);
    setUserData({ name: userData.name, email: userData.email });
  };

  // Handle Delete
  const handleDelete = async (id) => {
    try {
      console.log(id);
      const res = await deleteRecording({ postData: { userId, recordingId: id }, url: "users/delete_recording" });
      setUserRecordings(prevRecordings => prevRecordings.filter(recording => recording.id !== id));
      // Remove the deleted recording from the state

    } catch (error) {
      console.error("Error deleting recording:", error.message);
    }
  };

  // Handle combining of audio when button is clicked
  const handleCombine = () => {
    const allAudioPaths = [];
    Object.values(userRecordings).forEach((data) => {
      allAudioPaths.push(...data.paths); // Collect all paths to combine
    });

    combineAudioFiles(allAudioPaths);
  };

  return (
    <Box sx={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'column', display: 'flex' }}>
      {!userId && <h1>Not logged in</h1>}
      {!gettingUserData && !updatingUserData && !gettingUserRecordings ? (
        <>
          <Paper sx={{ textAlign: 'center', maxWidth: 600, width: '100%', padding: 3, boxShadow: 2, borderRadius: 2 }}>
            <Typography variant="h4" sx={{ marginBottom: 3 }}>
              {userData.name.split(" ")[0]}'s Profile
            </Typography>
            <TextField
              label="Name"
              value={userData.name}
              onChange={(e) => setUserData((prevData) => ({ ...prevData, name: e.target.value }))}
              disabled={!isEditing}
              fullWidth
              variant="outlined"
              sx={{ marginBottom: 2 }}
            />
            <TextField
              label="Email"
              type="email"
              value={userData.email}
              onChange={(e) => setUserData((prevData) => ({ ...prevData, email: e.target.value }))}
              disabled={!isEditing}
              fullWidth
              variant="outlined"
              sx={{ marginBottom: 2, mt: 2 }}
            />
            <Box sx={{ marginTop: 2 }}>
              {!isEditing ? (
                <>
                  <Button onClick={handleUpdate} variant="contained" color="primary" fullWidth>
                    Update info
                  </Button>
                  <Button onClick={() => navigate(`/resetPassword`)} variant="contained" color="primary" fullWidth sx={{ mt: 2, mb: 1 }}>
                    Reset Password
                  </Button>
                </>
              ) : (
                <>
                  <Button onClick={handleSave} variant="contained" color="primary" fullWidth>
                    Save
                  </Button>
                  <Button onClick={handleCancel} variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                    Cancel
                  </Button>
                </>
              )}
            </Box>
          </Paper>

          <Paper sx={{ textAlign: 'center', maxWidth: 900, width: '100%', padding: 3, boxShadow: 2, borderRadius: 2, mt: 4 }}>
            <TableContainer sx={{ marginTop: 1, marginBottom: 3 }}>
              <Typography variant='h6'>Saved Recordings</Typography>
              <Table sx={{ mt: 3 }}>
                <TableHead>
                  <TableRow>
                    <TableCell align="left" sx={{ fontWeight: 'bold' }}>Sentence</TableCell>
                    <TableCell align="left" sx={{ fontWeight: 'bold' }}>MP3 File</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {userRecordings?.map((recording) => (
                    <TableRow key={recording.id}>
                      <TableCell>{recording.sentence}</TableCell>
                      <TableCell>
                        {recording.mp3Path ? (
                          <audio controls>
                            <source src={recording.mp3Path} type="audio/wav" />
                            Your browser does not support the audio element.
                          </audio>
                        ) : (
                          <Typography variant="body2">Audio not ready</Typography>
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <Button variant="contained" color="secondary" onClick={() => handleDelete(recording.id)}>
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>

              </Table>
            </TableContainer>
          </Paper>
        </>
      ) : (
        <CircularProgress color='secondary' sx={{ mt: 10 }} size={80} />
      )}
    </Box>
  );
};

export default ProfilePage;
