import React, { useEffect, useState } from 'react';
import { Button, TextField, Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, CircularProgress } from '@mui/material';
import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { usePostAuthenticated } from '../api/tanstack-get-post';

const ProfilePage = () => {
  const authUser = useAuthUser();
  const userId = authUser?.user_id;
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({ name: "", email: "" });
  const { isPending: gettingUserData, mutateAsync: getUser } = usePostAuthenticated();
  const { isPending: updatingUserData, mutateAsync: updateUser } = usePostAuthenticated();

  // Fetch user data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getUser({ postData: { userId }, url: "users/get_user" });
        setUserData({
          name: res?.data?.user?.fullName || "",
          email: res?.data?.user?.email || "",
        });
      } catch (error) {
        console.error("Error fetching user:", error.message);
      }
    };
    fetchData();
  }, [getUser, userId]);

  // Handle Update/Edit
  const handleUpdate = () => {
    setIsEditing(true);
  };

  // Handle Save
  const handleSave = async () => {
    console.log({ userId: userId, fullName: userData?.name, email: userData?.email })
    try {
      const res = await updateUser({ postData: { userId: userId, fullName: userData?.name, email: userData?.email }, url: "users/update_user" });
      console.log(res)
    } catch (error) {
      setUserData({ name: userData.name, email: userData.email });
      console.error("Error updating user:", error.message);
    }

    setIsEditing(false);

  };

  // Handle Cancel
  const handleCancel = () => {
    setIsEditing(false);
    // Reset to initial user data (in case of cancel)
    setUserData({ name: userData.name, email: userData.email });
  };

  return (
    <Box sx={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'column', display: 'flex' }}>
      {!gettingUserData && !updatingUserData ? (
        <>
          <Paper sx={{ textAlign: 'center', maxWidth: 600, width: '100%', padding: 3, boxShadow: 2, borderRadius: 2 }}>
            {/* Username */}
            <Typography variant="h4" sx={{ marginBottom: 3 }}>
              {userData.name.split(" ")[0]}'s Profile
            </Typography>

            {/* Name Field */}
            <TextField
              label="Name"
              value={userData.name}
              onChange={(e) => setUserData((prevData) => ({ ...prevData, name: e.target.value }))}
              disabled={!isEditing}
              fullWidth
              variant="outlined"
              sx={{ marginBottom: 2 }}
            />

            {/* Email Field */}
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

            {/* Buttons */}
            <Box sx={{ marginTop: 2 }}>
              {!isEditing ? (
                <>
                  <Button
                    onClick={handleUpdate}
                    variant="contained"
                    color="primary"
                    fullWidth
                  >
                    Update info
                  </Button>
                  <Button
                    onClick={() => navigate(`/resetPassword`)}
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{mt:2,mb:1}}
                  >
                    Reset Password
                  </Button></>

              ) : (
                <>
                  <Button
                    onClick={handleSave}
                    variant="contained"
                    color="primary"
                    fullWidth
                  >
                    Save
                  </Button>
                  <Button
                    onClick={handleCancel}
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2 }}
                  >
                    Cancel
                  </Button>
                </>
              )}

            </Box>
          </Paper>

          <Paper sx={{ textAlign: 'center', maxWidth: 600, width: '100%', padding: 3, boxShadow: 2, borderRadius: 2, mt: 4 }}>

            {/* Table */}

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
                  {/* Map through rows data */}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </>

      )
        : (<CircularProgress color='secondary' sx={{ mt: 10 }} size={80} />)
      }
    </Box>
  );
};

export default ProfilePage;
