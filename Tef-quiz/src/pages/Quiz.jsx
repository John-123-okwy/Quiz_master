import { useEffect, useReducer, useRef } from "react";
import { useParams } from "react-router-dom";
import { initialState, quizReducer } from "../reducer/quizReducer";
import Questions from "../components/Questions";
import Options from "../components/Options";
import NextButton from "../components/NextButton";
import PreviousButton from "../components/PreviousButton";
import ProgressBar from "../components/ProgressBar";
import SubmitButton from "../components/SubmitButton";
import ResultPage from "./ResultPage";
import QuestionNavigation from "../components/QuestionNavigation";
import Timer from "../components/Timer";
import ReviewPage from "./ReviewPage";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/firebase";
import NoQuestions from "../components/NoQuestions";


function Quiz() {
  //===============subjectId=========================//
  const { subjectId } = useParams();

  //========useRef to go back to Quiz page begining=====//
  const topPageRef=useRef(null)

  //==================userReducer for the Quiz Logic==================//



  const [
    {
      questions,
      index,
      answer,
      points,
      finished,
      secondsRemaining,
      showReview,
      reviewIndex,
      totalQuizTime,score
    },
    dispatch,
  ] = useReducer(quizReducer, initialState);

  //===============useEffect for fetching Questions wrt to subject========//

  useEffect(() => {
    async function fetchQuestions() {
     {/* const res = await fetch(`http://localhost:9000/${subjectId}`);
      const data = await res.json();*/}
     const q =query(collection(db,"questions"), where("subject","==",subjectId));
      const querySnapshot=await getDocs(q);
      const data=querySnapshot.docs.map((doc)=>({id:doc.id, ...doc.data()}))

      dispatch({
        type: "SET_QUESTIONS",
        payload: data,
      });
      console.log(data);
    }

    fetchQuestions();
  }, [subjectId]);

  //===============fetching of each question========================//

  if (questions.length === 0) {
    return <NoQuestions>No Questions Found Yet...</NoQuestions>;
  }
  

  console.log(questions);
  const pquestions = questions[index];
  console.log(pquestions);

  //=====================Review page logic==================//
  if (showReview) {
    return (
      <ReviewPage
        reviewIndex={reviewIndex}
        dispatch={dispatch}
        questions={questions}
        answer={answer}
      />
    );
  }

  //==================Result page logic=============================//
  if (finished) {
    return (
      <ResultPage
      score={score}
        points={points}
        answer={answer}
        questions={questions}
        dispatch={dispatch}
        secondsRemaining={secondsRemaining}
        totalQuizTime={totalQuizTime}
      />
    );
  }

  ////////////////////////////////////////////////////////

  return (
    <div>
      <section className="quiz-header">
        <h1>{subjectId.toUpperCase()} Quiz </h1>
        <div className="timer-box">
          <Timer dispatch={dispatch} secondsRemaining={secondsRemaining} />
        </div>
      </section>
      <div>
        <ProgressBar answer={answer} questions={questions} />
      </div>

      <br></br>
      <Questions pquestions={pquestions}  />
      <Options
        dispatch={dispatch}
        pquestions={pquestions}
        answer={answer}
        index={index}
       
      />

      <div className="prevNext-flex">
        <PreviousButton dispatch={dispatch} />
        <br></br>
        {/*<NextButton dispatch={dispatch} />*/}
        <SubmitButton index={index} dispatch={dispatch} questions={questions} answer={answer} />
      </div>

      <QuestionNavigation
        questions={questions}
        dispatch={dispatch}
        answer={answer}
        index={index}
         
      />
      
    </div>
  );
}

export default Quiz;
