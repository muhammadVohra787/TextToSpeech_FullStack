import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme";
import SignUpPage from "./pages/SignUpPage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import SignInPage from "./pages/SignInPage.jsx";
import Unauthorized from "./pages/Unauthorized.jsx";
import NotFound from "./pages/NotFound.jsx";
import Navbar from './components/Navbar';
import TextToSpeech from "./pages/Dashboard.jsx";
import ProfilePage from "./pages/Profile.jsx";
function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
      <Navbar/>
      <br></br>
        <Routes>

          <Route path="/login" element={<SignInPage />} />
          <Route path="/" element={<SignUpPage firstPage={true} />}></Route>
          {/* <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/dashboard/admin" element={<AdminDashboard />} />
          </Route>
 
          <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
            <Route path="/dashboard/student" element={<UserDashboard />} />
          </Route> */}
          <Route path="/dashboard/student" element={<TextToSpeech />} />
          <Route path="/unauth" element={<Unauthorized/>}></Route>
          <Route path="/profile" element={<ProfilePage />} /> 
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;

