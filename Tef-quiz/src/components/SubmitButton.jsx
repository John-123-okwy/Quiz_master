function SubmitButton({ index, questions, dispatch, answer }) {
  //=============Derived state for last Question========//
  const isLastQuestion = index === questions.length - 1;

  //=============Derived state for Total number of questions=================//

  const totalQuestions = questions.length;
  //==============Answered question derived state================//
  const answeredQuestions = Object.keys(answer).length;

  //==========================================================//
  const notAnsweredAll = answeredQuestions !== totalQuestions;

  //if(answeredQuestions !== totalQuestions){
  // return<h4>You have unanswered questions!</h4>
  // }
  return (
    <div className={`submit-btn ${isLastQuestion ? "submit" : ""}`}>
      {isLastQuestion ? (
        <button
          onClick={() => dispatch({ type: "FINISH_QUIZ" })}
        >{`Submit Quiz  `}</button>
      ) : (
        <button onClick={() => dispatch({ type: "NEXT_QUESTION" })}>
          Next
        </button>
      )}
    </div>
  );
}
export default SubmitButton;
