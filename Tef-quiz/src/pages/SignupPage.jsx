/*function SignupPage({
  
  password,
  dispatch,
  switchToLogin,
  onSignup,
  loading,
  error,
  email
  
}) {
  return (
    <div className="signup-page-cont">
      <div className="Q--"><h1>Q</h1></div>
      <h3>Create Account</h3>
      <h4>Email Address:</h4>
      <div className="signup-email"><input
        type="email"
        placeholder="Enter email"
        value={email}
        onChange={(e) =>
          dispatch({ type: "SetEmail", payload: e.target.value })
        }
      />
      </div>
      <h4>Your Password:</h4>
      <div className="signup-password">
      <input
        type="password"
        placeholder="Enter password"
        value={password}
        onChange={(e) =>
          dispatch({ type: "SetPassword", payload: e.target.value })
        }
      />
      </div>
<div className="signup-btn"><button onClick={onSignup}>{loading ? "Loading..." : "Sign up"}</button>
</div>
      
      {error && <p style={{ color: "red" }}>{error}</p>}
      <p onClick={switchToLogin} className="dont-have-account">
        Already have an account? <span className="login-up"> Log in</span>
      </p>
    </div>
  );
}

export default SignupPage;
*/

import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase/firebase";
import { doc, setDoc } from "firebase/firestore";
import { Eye, EyeOff } from "lucide-react";

function SignupPage() {
  //===========state variable for user name==============//
  const [userName, setUserName] = useState("");

  //================state variabale for email============//

  const [email, setEmail] = useState("");

  //==============state variable for password===========//

  const [password, setPassword] = useState("");

  //========= state showPassword==============================//
  const [showPassword, setShowPassword] = useState(false);

  //=============state variable for error==========//

  const [error, setError] = useState("");
  //===================state loading==================//
  const[loading, setLoading]=useState(false)

  //============variable for navigate=============//

  const navigate = useNavigate();

  //============handleSignUp==============//

  async function handleSignup(e) {
    e.preventDefault();

    setError("");
    if(!userName.trim()){
      setError("Please enter your username!");
      return
    }
    if(!password){
      setError("Please enter your password!")
      ;return
    }
    if(!email){
      setError("Please enter your email!")
      ;return
    }
    setLoading(true)

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      await updateProfile(userCredential.user, { displayName: userName });

      await setDoc(
        doc(db, "users", userCredential.user.uid),
        {
          role: "user",
          createdAt: new Date().toISOString(),
          email: email,
          displayName: userName,
          totalPoints: 0,
          averageScores: 0,
          bestScores: 0,
          quizAttempts: 0,
          currentStreak: 0,
          subjectPoints: {
            mathematics: 0,
            physics: 0,
            chemistry: 0,
            english: 0,
          },
          subjectStats: {
            mathematics: {
              bestScore: 0,
              averageScore: 0,
              attempts: 0,
            },
            physics: {
              bestScore: 0,
              averageScore: 0,
              attempts: 0,
            },
            chemistry: {
              bestScore: 0,
              averageScore: 0,
              attempts: 0,
            },
            english: {
              bestScore: 0,
              averageScore: 0,
              attempts: 0,
            },
          },
        },
        { merge: true },
      );

      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally{
      setLoading(false)
    }
  }
  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Create Account</h1>
          <p>Signup to start your quiz journey</p>
        </div>

        <form onSubmit={handleSignup} autoComplete="off" className="login-form">
          <div className="input-group">
            {" "}
            <input
              type="text"
              placeholder="Enter user name..."
              value={userName}
               name="fullName" autoComplete="new-name"
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>
          <div className="input-group">
            {" "}
            <input
              type="email"
              placeholder="Enter email..."
              value={email}
               name="new-email" autoComplete="new-email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            {" "}
            <input
              type="password"
              placeholder="Enter password..."
              value={password}


               name="new-password" autoComplete="new-password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="eye-btn"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button type="submit" className="log-in-btn" disabled={loading}> {loading?(<span className="loading-content"><span className="login-spinner"></span>
          Signing in...</span>):"Sign up"}</button>
        </form>
        {error && <p className="error-message">{error}</p>}
        <p className="signup-text">
          Already have account? <Link to="/login" className="signup-text-link">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default SignupPage;
