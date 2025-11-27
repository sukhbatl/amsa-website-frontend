// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import HomePage from "./pages/HomePage";
import ProgramsPage from "./pages/ProgramsPage";
import BlogsPage from "./pages/BlogsPage";
import TeamPage from "./pages/TeamPage";
import SignupMember from "./pages/SignupMember";
import LoginPage from "./pages/LoginPage";
import WelcomePage from "./pages/WelcomePage";
import AdminPage from "./pages/AdminPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import ProfilePage from "./pages/ProfilePage";
import PublicProfilePage from "./pages/PublicProfilePage";
import UserProfilePage from "./pages/UserProfilePage";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/programs" element={<ProgramsPage />} />
        <Route path="/team" element={<TeamPage />} />
        <Route path="/blog" element={<BlogsPage />} />
        <Route path="/signup/member" element={<SignupMember />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/user/:id" element={<UserProfilePage />} />
        <Route path="/public-profile/:id" element={<PublicProfilePage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
