import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme";
import SignUpPage from "./pages/SignUpPage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import SignInPage from "./pages/SignInPage.jsx";
import Unauthorized from "./pages/Unauthorized.jsx";
import NotFound from "./pages/NotFound.jsx";
import Navbar from './components/Navbar';
import ProfilePage from "./pages/Profile.jsx"
import TempHome from "./pages/TempHome.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import ProcessText from './pages/ProcessText.jsx';
import ProcessImage from './components/ProcessImage.jsx';
import AdminDashboard from "./pages/AdminDashboard.jsx";
import UserDashboard from "./pages/UserDashboard.jsx";
function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar/>
        <br></br>
        <Routes>

          <Route path="/" element={<TempHome />} />
          <Route path="/login" element={<SignInPage />} />
          <Route path="/signUp" element={<SignUpPage isCreatingUser={false}/>}></Route>

          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/dashboard/admin" element={<AdminDashboard />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
            <Route path="/dashboard/user" element={<UserDashboard />} />
          </Route> 
        
          <Route element={<ProtectedRoute allowedRoles={["user","admin"]} />}>
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/resetPassword" element={<ResetPassword />} />
              <Route path="/textToSpeech" element={<ProcessText />} />
              <Route path="/imageToSpeech" element={<ProcessImage />} />
          </Route> 
          <Route path="/forgotPassword" element={<ForgotPassword />} />

          <Route path="/unauth" element={<Unauthorized />}></Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;

