/*import { useEffect, useReducer, useState } from "react";
import app from "./firebase/firebase";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "./firebase/firebase";
import Login from "./pages/LoginPage";
import Signup from "./pages/SignupPage";
import Auth from "./Auth";
import Welcome from "./pages/Dashboard";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import StartScreen from "./StartScreen";

///======================Component====================//
function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="login" element={<Auth />} />
      </Routes>
    </div>
  );
}

export default App;*/

import { Route, Routes } from "react-router-dom";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import LandingPage from "./pages/LandingPage";
import Quiz from "./pages/Quiz";
import SubjectDetails from "./pages/subjectDetails";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/firebase";
import Profile from "./pages/Profile";
import AdminRoute from "./components/AdminRoute";
import Admin from "./pages/Admin";
import LeaderBoard from "./pages/LeaderBoard";

function App() {
  const [isloading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, () => {
      setIsLoading(false);
    });
    return unsubscribe;
  }, []);

  if (isloading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <h3>Loading your progress...</h3>
      </div>
    );
  }
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <Admin />
          </AdminRoute>
        }
      />
      <Route path="/leaderboard" element={<LeaderBoard/>}/>
      <Route path="/subject/:subjectId" element={<SubjectDetails />} />
      <Route path="/quiz/:subjectId" element={<Quiz />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
}

export default App;
