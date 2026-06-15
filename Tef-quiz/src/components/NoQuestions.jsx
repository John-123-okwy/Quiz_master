import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function NoQuestions() {
  //=======================================//
  const navigate = useNavigate();

  //==========================//
  const [loading, setLoading] = useState(true);

  //======= loading screen=========//
  if (loading) {
    return (
      <div className="no-question">
        {" "}
        <button onClick={() => navigate("/dashboard")} className="back-btn">
          <ArrowLeft /> <span>Back To Dashboard</span>
        </button>{" "}
        <h2> No Questions Found Yet...</h2>
        <div className="loading-screen">
          <div className="spinner"></div>
          <h3>Loading your progress...</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="no-question">
      <button onClick={() => navigate("/dashboard")} className="back-btn">
        <ArrowLeft /> <span>Back To Dashboard</span>
      </button>
      <h2> No Questions Found Yet...</h2>
    </div>
  );
}
export default NoQuestions;
