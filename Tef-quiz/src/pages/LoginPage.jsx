/*function LoginPage({
  dispatch,
  onLogin,
  switchToSignup,
  email,
  password,
  loading,
  error,
  handleResetPassword,
}) {
  console.log( typeof dispatch)
  return (
    <div className="login-page-cont">
      <div className="Q--">
        <h1>Q</h1>
      </div>
      <h3>Welcome Back!</h3>
      <h4>Email Address:</h4>
      <div className="login-email">
        <input
          type="email"
          placeholder="Enter email..."
          value={email}
          onChange={(e) =>
            dispatch({ type: "SetEmail", payload: e.target.value })
          }
        />
      </div>
      <h4>Your Password:</h4>
      <div className="login-password">
        <input
          type="password"
          placeholder="Enter password..."
          value={password}
          onChange={(e) =>
            dispatch({ type: "SetPassword", payload: e.target.value })
          }
        />
      </div>
      <div className="login-btn">
        <button onClick={onLogin}>{loading ? "Loading..." : "Log in"}</button>
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <p onClick={switchToSignup} className="dont-have-account">
        Don't have an account? <span className="sign-up">Sign up</span>
      </p>
      <p
        onClick={handleResetPassword}
        className="forgot-password"
      >
        Forgot password?
      </p>
    </div>
  );
}

export default LoginPage;*/

import {
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebase";
import { Eye, EyeOff } from "lucide-react";

function LoginPage() {
  //==============state variable for email============//

  const [email, setEmail] = useState("");

  //===============state variable for password========//

  const [password, setPassword] = useState("");
  //=======================================//
  const[loading, setLoading]=useState(false)
  const[showPassword, setShowPassword]=useState(false)

  //========state variable for error==================//

  const [error, setError] = useState("");

  //==========variable for navigate===================//

  const navigate = useNavigate();

  //====================handleLogin===================//

  async function handleLogin(e) {
    e.preventDefault();

    setError("");
  
    
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
      await signInWithEmailAndPassword(auth, email, password);

      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }finally{
      setLoading(false)
    }
  }
  //===============handle Reset password=========================//

  const handleResetPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email was just to you, please check your email.");
    } catch (error) {
      alert("Failed to send email. Try again.");
    }
  };
  ////////////////////////////////
  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Welcome To QuizMaster</h1>
          <p>Login to continue your quiz journey</p>
        </div>
        <form onSubmit={handleLogin} className="login-form" autoComplete="off">
          <div className="input-group">
            
            <input
              type="email"
              placeholder="Enter email..."
              value={email}
               name="new-email" autoComplete="new-email"
            
              
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input-group">
          
            <input
               type={showPassword ? "text" :"password"}
              placeholder="Enter password..."
              value={password}
               name="new-password" autoComplete="new-password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="button" className="eye-btn" onClick={()=>setShowPassword(!showPassword)}>
              {showPassword ? (<EyeOff size={20}/>):(<Eye size={20}/>)}
            </button>

          </div>
          <button type="submit" className="log-in-btn" disabled={loading}> {loading?(<span className="loading-content"><span className="login-spinner"></span>
          Logging in...</span>):"Login"}</button>
        </form>
        <button onClick={handleResetPassword} className="forgot-btn">Forgot password?</button>
        {error && <p className="error-message">{error}</p>}
        <p className="signup-text">
          No account ? <Link to="/signup" className="signup-text-link">Sign up</Link>
        </p>

        <button onClick={() => navigate("/")} className="back-btn-to-landing">Back To Landing Page</button>
      </div>
    </div>
  );
}

export default LoginPage;
