import { ArrowLeft } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import subjects from "../data/subjects";
import { auth, db } from "../firebase/firebase";
import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { quizReducer } from "../reducer/quizReducer";

function ResultPage({
  score,
  questions,
  answer,
  points,
  dispatch,
  secondsRemaining,
  totalQuizTime,
}) {
  const [quizHistory, setQuizHistory] = useState([]);
  //=======Derived state for Total number of questions=============//
  const totalQuestions = questions.length;

  //========Derived timed used =====================//
  const timedUsed = totalQuizTime - secondsRemaining;

  //===========Derived state for number of answered questions =============//
  const answeredQuestions = Object.keys(answer).length;

  //================Derived state for Total Points=====================//
  const totalPossiblePoints = questions.reduce(
    (acc, question) => acc + question.points,
    0,
  );

  console.group({ points, totalPossiblePoints });
  //=============Derived state for percntage of result===================//
  const resultPercentage = ((points / totalPossiblePoints) * 100).toFixed(1);

  //==============Derived state for Correct answers======================//
  const correctAnswer = Object.entries(answer).reduce(
    (count, [index, answer]) => {
      return answer === questions[index].correctAnswer ? count + 1 : count;
    },
    0,
  );

  //===============Derived state for Wrong answers===========//
  const wrongAnswer = Object.keys(answer).length - correctAnswer;

  //=============useNavigate=======================//
  const navigate = useNavigate();

  //=========== subjectName Derived state=====================//
  const { subjectId } = useParams();
  const subjectName =
    subjects.find((item) => item.id === subjectId)?.name || "Unkown subject";

  //================quizAttempts object=================//
  const quizAttempt = {
    id: Date.now(),
    subject: subjectName,
    score: resultPercentage,

    points,
    totalPoints: totalPossiblePoints,
    correctAnswer,
    wrongAnswer,
    totalQuestions: totalQuestions,
    date: new Date().toISOString(),
    submittedAt: new Date().toISOString(),
    timedUsed,
  };

  //==============user UID===================//

  const currentUser = auth.currentUser;
  const userId = currentUser?.uid;
  const historyKey = `quizHistory_${currentUser.uid}`;

  //============useEffect for updating statistics saving logic==================//
  /*useEffect(() => {
    const alreadySaved = sessionStorage.getItem("resultSaved");
    if (alreadySaved || !userId) return;

    const history = JSON.parse(localStorage.getItem(historyKey)) || [];

    history.unshift(quizAttempt);
    localStorage.setItem(historyKey, JSON.stringify(history));
    sessionStorage.setItem("resultSaved", "true");
  }, []);*/

  console.log(historyKey);

  //============format time used============================//
  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs}`;
  }
  console.log(totalQuizTime);
  console.log(secondsRemaining);

  //==================state variable for saved function=================//
  const [saved, setSaved] = useState(false);

  const hasSaved = useRef(false);

  //============= Quiz Attempts Saving function ============================//
  async function saveQuizAttempt() {
    if (hasSaved.current) return;

    hasSaved.current = true;
    // if (saved) return;
    try {
      const user = auth.currentUser;
      if (!user) return;
      await addDoc(
        collection(db, "users", user.uid, "quizHistory"),
        quizAttempt,
      );

      /*------------------------------------- */

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.data();
      console.log(userData)
      const subject = quizAttempt.subject.toLowerCase();
      const currentSubjectPoints = userData.subjectPoints || {};
      const currentSubjectStats = userData.subjectStats || {};
      const currentStats = currentSubjectStats[subject] || {
        bestScore: 0,
        averageScore: 0,
        attempts: 0,
      };
      const updatedSubjectAttempts = currentStats.attempts + 1;
      const updatedSubjectBestScore = Math.max(
        currentStats.bestScore,
        resultPercentage,
      );
      const updatedSubjectAverage =
        Math.round(
          currentStats.averageScore * currentStats.attempts +Number( resultPercentage),
        ) / updatedSubjectAttempts;
      const updatedSubjectStats = {
        ...currentSubjectStats,
        [subject]: {
          bestScore: updatedSubjectBestScore,
          averageScore: updatedSubjectAverage,
          attempts: updatedSubjectAttempts,
        },
      };

      const updatedSubjectPoints = {
        ...currentSubjectPoints,
        [subject]: (currentSubjectPoints[subject] || 0) + points,
      };
      const updatedPoints = (userData.totalPoints || 0) + points;
      const updatedBestScore = Math.max(
        userData.bestScores || 0,
        Number(resultPercentage),
      );

      const updatedAttempts = (userData.quizAttempts || 0) + 1;
      const updatedAverage = Math.round(
        ((userData.averageScores || 0) * (updatedAttempts - 1) +
          Number(resultPercentage)) /
          updatedAttempts,
      );
      console.log("Subject:",subject)
      console.log("Current subject stat:",currentSubjectStats)
      console.log("current stat:",currentStats)
        console.log("updated subject sats:", updatedSubjectStats)
        console.log("Result percentage:", resultPercentage)

      

      await updateDoc(userRef, {
        totalPoints: updatedPoints,
        bestScores: updatedBestScore,
        quizAttempts: updatedAttempts,
        averageScores: updatedAverage,
        subjectPoints: updatedSubjectPoints,
        subjectStats: updatedSubjectStats,
      });
      /*------------------------------------- */
      console.log("quiz saved");
      setSaved(true);
    } catch (err) {
      console.log(err);
    }
  }
  //===============state variable for streak==================//

  // const[streak, setStreak]=useState(0)

  //==================function for updateStreak======================//
  /* async function updateUserStreak() {
    const user = auth.currentUser;
    if (!user) return;
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    const userData = userSnap.data();
    const today = new Date().toISOString().split("T")[0];
    const lastQuizDate = userData?.lastQuizDate;
    const currentStreak = userData?.streak || 0;
  //  setStreak(userData.streak || 0)

    //same day

    if (lastQuizDate === today) {
      return;
    }
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayString = yesterday.toISOString().split("T")[0];
    let newStreak =1;
    if (lastQuizDate === yesterdayString) {
      newStreak = currentStreak + 1;
    } else {
      newStreak + 1;
    }
    await updateDoc(userRef, { streak: newStreak, lastQuizDate: today });
  }*/

  //==============useEffect to call the saving function===============//
  useEffect(() => {
    saveQuizAttempt();
  }, []);
  /////////////////
  return (
    <main className="result-page">
      <section className="result-card">
        <div className="result-header">
          <h1>Quiz Completed</h1>
          <p>
            {resultPercentage >= 80 && "Outstanding Performance🎉"}
            {resultPercentage >= 50 && resultPercentage < 80 && "Good Job!⭐"}
            {resultPercentage < 50 && "Keep Practicing!😊"}
          </p>
        </div>
        <p>Time Used: {formatTime(timedUsed)}</p>
        <div className="score-section">
          <h2> {resultPercentage}%</h2>
          <p>
            Your Score: {points}/{totalPossiblePoints} points
          </p>
        </div>
        <div
          className={` status-badge ${resultPercentage >= 50 ? "pass" : "fail"}`}
        >
          {resultPercentage >= 50 ? "PASSED!" : "FAILED!"}
        </div>
        <div className="stats-grid">
          <div className="result-stat">
            <h3>{correctAnswer}</h3>
            <p>Correct Answers</p>
          </div>
          <div className="result-stat">
            <h3>{wrongAnswer}</h3>
            <p>Wrong Answers</p>
          </div>
          <div className="result-stat">
            <h3>{totalQuestions}</h3>
            <p>Total Questions</p>
          </div>
          <div className="result-stat">
            <h3>
              {answeredQuestions}/{totalQuestions}
            </h3>
            <p>Questions Answered</p>
          </div>
        </div>
        <div className="result-actions">
          <button
            className="review-btn"
            onClick={() => dispatch({ type: "SHOW_REVIEW" })}
          >
            Review answers
          </button>

          <button
            className="dashboard-btn "
            onClick={() => navigate("/dashboard")}
          >
            Dashboard
          </button>
        </div>
      </section>
      {/*
      <h1>Result Page</h1>

      <h2>Quiz completed!</h2>
      <h2>
        You scored:{points}/{totalPossiblePoints}
      </h2>
      <h2>Percentage: {resultPercentage}%</h2>
      <p>
        Questions answered:
        {answeredQuestions}/{totalQuestions}
      </p>
      <p>Correct Answers:{correctAnswer}</p>
      <p>Wrong Answers:{wrongAnswers}</p>

      <button onClick={() => dispatch({ type: "SHOW_REVIEW" })}>
        Review answers
      </button>*/}
    </main>
  );
}

export default ResultPage;
