import { Link } from "react-router-dom"

function LandingNavBar(){
    return<nav className="landing-navbar">
        <h2 className="logo">QuizMaster</h2>
        <div className="nav-links">
            <a href="#features">Features</a>
            <a href="#how">How it works</a>
            <Link to="/login"><button className="landing-login-btn"> Login</button></Link>
        </div>
    </nav>
}
export default LandingNavBar