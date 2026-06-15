import { ArrowLeft, ArrowUp } from "lucide-react";
import { auth, db } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";

function Profile() {
  //===========use const state=============//
  const user = auth.currentUser;

  //===============useNavigat=================//
  const navigate = useNavigate();

  //=============== state variable for quizHistory=========//
  const [quizHistory, setQuizHistory] = useState([]);

  //============= state varable for loading====================//
  const [loading, setLoading] = useState(true);

  //============state variable for online user==============//
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  //================ useEffect for fetchHistory=============//
  useEffect(() => {
    async function fetchQuizHistory() {
      setLoading(true);
      try {
        const user = auth.currentUser;
        if (!user) {
          setLoading(false);
          return;
        }
        if (navigator.onLine) {
          const q = await query(
            collection(db, "users", user.uid, "quizHistory"),
            orderBy("submittedAt", "desc"),
          );
          const querySnapshot = await getDocs(q);
          const history = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          history.sort(
            (a, b) => new Date(b.submittedAt) - new Date(a.submittedAt),
          );
          setQuizHistory(history);
          localStorage.setItem(
            `quizHistory_${user.uid}`,
            JSON.stringify(history),
          );
        } else {
          const cached =
            JSON.parse(localStorage.getItem(`quizHistory_${user.uid}`)) || [];
          setQuizHistory(cached);
        }
        setLoading(false);
      } catch (err) {
        console.log(err.message);
      }
    }

    if (isOnline) {
      fetchQuizHistory();
      setLoading(false);
    }
  }, []);

  //===========Derived state for quizzes Taken====================//
  const quizzesTaken = quizHistory.length;

  //==============connect Average Score====================//
  const averageScore = quizHistory.length
    ? Math.round(
        quizHistory.reduce((sum, quiz) => sum + Number(quiz.score), 0) /
          quizHistory.length,
      )
    : 0;

  //=============connect Best Score======================//
  const bestScore = quizHistory.length
    ? Math.max(...quizHistory.map((quiz) => quiz.score))
    : 0;

  //================//

  /*if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <h3>Loading your progress...</h3>
      </div>
    );
  
  }
*/
  /////////////////////////////
  return (
    <div>
      {!isOnline ? (
        <div className={`offline-banner `}>
          ⚠ You are offline. Some data may not be synced, check your internet.
        </div>
      ) : (
        <div className={`offline-banne `}>
          ⚠ You are offline. Some data may not be synced.
        </div>
      )}
      <section className="profile">
        <button onClick={() => navigate("/dashboard")} className="back-btn">
          <ArrowLeft /> <span>Back To Dashboard</span>
        </button>
        <div className="profile-card">
          <div className="avatar">
            {user?.displayName?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <h2>{user?.displayName || "User"}</h2>
          <p>{user?.email}</p>
        </div>
        <div className="profile-stats">
          <div className="stat-card">
            <span>📊</span>
            <h3>{quizzesTaken}</h3>
            <p>Quizzes Taken</p>
          </div>
          <div className="stat-card">
            <span>🎯</span>
            <h3>{averageScore}%</h3>
            <p>Average Score</p>
          </div>
          <div className="stat-card">
            <span>🏆</span>
            <h3>{bestScore}%</h3>
            <p>Best Score</p>
          </div>
        </div>
        <div className="Up-btn">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <ArrowUp size={18} />
          </button>
        </div>
      </section>
    </div>
  );
}
export default Profile;
