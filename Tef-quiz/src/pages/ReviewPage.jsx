import { useNavigate } from "react-router-dom";
import ReviewExplain from "../components/ReviewExplain";
import ReviewOption from "../components/ReviewOption";
import ReviewQueNav from "../components/ReviewQueNav";
import ReviewQuestion from "../components/ReviewQuestion";
import RevNextButton from "../components/RevNextButton";
import RevPrevButton from "../components/RevPrevButton";
import { ArrowLeft } from "lucide-react";

function ReviewPage({ questions, answer, reviewIndex, dispatch }) {

  //=========question derived state====================//
  const pquestion = questions[reviewIndex];

  //=======================userAnswer deried state====================//


  const userAnswer = answer[reviewIndex];

  //=============useNavigate derived state===================//
  const navigate=useNavigate()
  return (
    <div>
       <button onClick={() => navigate("/dashboard")} className="back-btn">
          <ArrowLeft/> <span>Back To Dashboard</span>
        </button>
      <h1> Review Page</h1>
      <ReviewQuestion  reviewIndex={reviewIndex} pquestion={pquestion}/>
      <ReviewOption pquestion={pquestion} userAnswer={userAnswer}/>

      <ReviewExplain pquestion={pquestion}/>
      <ReviewQueNav questions={questions} reviewIndex={reviewIndex} dispatch={dispatch}/>
      <RevPrevButton reviewIndex={reviewIndex} dispatch={dispatch}/>
      <RevNextButton reviewIndex={reviewIndex} questions={questions} dispatch={dispatch}/>
      
    </div>
  );
}

export default ReviewPage;
