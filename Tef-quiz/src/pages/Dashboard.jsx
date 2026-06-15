/*import { useRef } from "react";
import DashboardHeader from "../DashboardHeader";
import SelectSubject from "../SelectSubject";
import Sidebar from "../Sidebar";
import StatCards from "../StatCards";
import TopSubjects from "../TopSubjects";
import Major from "../Major";

function Dashboard({ dispatch, handleLogout, status }) {
  //useRefs for sidebar
  //
  const dashboardRef = useRef(null);
  const subjectRef = useRef(null);
  /////

  return (
    <div className="dashboard-container">
      <div className="sidebar-content">
        <Sidebar
          subjectRef={subjectRef}
          dashboardRef={dashboardRef}
          handleLogout={handleLogout}
        />
      </div>
      <div className="dashboard-content">
        <DashboardHeader dashboardRef={dashboardRef} /> <StatCards />
        <SelectSubject dispatch={dispatch} />
        <TopSubjects subjectRef={subjectRef} />
      </div>
    </div>
  );
}
export default Dashboard;*/

import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "../firebase/firebase";
import { Link, useNavigate } from "react-router-dom";
import subjects from "../data/subjects";
import { useEffect, useState } from "react";
import SideBar from "../components/SideBar";
import NavBar from "../components/NavBar";
import DashWelcome from "../components/DashWelcome";
import StatCards from "../components/StatsCard";
import {
  ArrowUp,
  CircleHelp,
  ClipboardList,
  TrendingUp,
  Trophy,
} from "lucide-react";
import StatsCardCont from "../components/StatsCardCont";
import SubjectCard from "../components/SubjectCard";
import RecentActivity from "../components/RecentActivity";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";

function Dashboard() {
  //======handler for view details button==================//
  const navigate = useNavigate();
  function handleSubject(subjectId) {
    navigate(`/subject/${subjectId}`);
  }
  //==============side bar state variable=======================//

  const [showSidebar, setShowSidebar] = useState(false);
  console.log(showSidebar);

  //============state variable for online user==============//
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  //=====handler function for its online================//
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  //===========handleLogout===================//

  async function handleLogout() {
    await signOut(auth);
  }
  /////////////////

  const [quizHistory, setQuizHistory] = useState([]);

  const [loading, setLoading] = useState(null);

  const [error, setError] = useState(false);

  console.log(quizHistory);
  //========================userDAta state variable==================//

  //===============state variable for streak==================//

  const [streak, setStreak] = useState(0);

  //===============function for calculate streak==============//
  function caculateStreak(quizHistory) {
    if (!quizHistory || quizHistory.length === 0) {
      return 0;
    }
    const uniqueDate = [
      ...new Set(quizHistory.map((item) => item.submittedAt.split("T")[0])),
    ];
    uniqueDate.sort((a, b) => new Date(b) - new Date(a));

    const today = new Date();
    const latestDate = new Date(uniqueDate[0]);
    const gap = Math.floor((today - latestDate) / (1000 * 60 * 60 * 24));
    if (gap > 1) {
      return 0;
    }
    let streak = 1;
    for (let i = 0; i < uniqueDate.length - 1; i++) {
      const current = new Date(uniqueDate[i]);
      const previous = new Date(uniqueDate[1 + i]);
      const diffDays = (current - previous) / (1000 * 60 * 60 * 24);
      if (diffDays === 1) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  }

  //================fetchHistory/useEffect=======================//

  useEffect(() => {
    async function fetchQuizHistory() {
      setLoading(true);
      try {
        const user = auth.currentUser;

        if (!user) {
          setLoading(false);
          return;
        }
        // const userRef = doc(db, "users", user.uid);
        //const userSnap = await getDoc(userRef);
        //const fetchUserData = userSnap.data();
        //console.log(fetchUserData);
        //setUserData(fetchUserData)

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

          // sort the history according tot the most recent
          history.sort(
            (a, b) => new Date(b.submittedAt) - new Date(a.submittedAt),
          );

          setQuizHistory(history);
          console.log(history);

          setStreak(caculateStreak(history));

          localStorage.setItem(
            `quizHistory_${user.uid}`,
            JSON.stringify(history),
          );
        } else {
          const cached =
            JSON.parse(localStorage.getItem(`quizHistory_${user.uid}`)) || [];

          setQuizHistory(cached);

          setStreak(caculateStreak(cached));
        }

        setLoading(false);
      } catch (err) {
        console.log(err.message);
        setError(err);
      }
    } 

    if (isOnline) {
      fetchQuizHistory();

      setLoading(false);
    }
  }, []);

  
  //==========derived state for userName================//
  const currentUser = auth.currentUser;

  //==============user UID===================//

  //const userId=currentUser?.uid
  // const historyKey=`quizHistory_${userId}`

  //=============quizHistory========================//
  //const quizHistory = JSON.parse(localStorage.getItem(historyKey)) || [];

  //=================connect Quizzes Taken============//
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

  //============connect Question Answered===================//
  const questionAnswered = quizHistory.reduce(
    (sum, quiz) => sum + quiz.totalQuestions,
    0,
  );
  

  //======= loading screen=========//

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <h3>Loading your progress...</h3>
      </div>
    );
  }

  ///////////////////////
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
      <div className="dashboard">
        <NavBar setShowSidebar={setShowSidebar} />
        <SideBar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
        {showSidebar && (
          <div className="overlay" onClick={() => setShowSidebar(false)} />
        )}
        <DashWelcome currentUser={currentUser} streak={streak} />
       <section className="general-stat-section">
        <h2>General Performance</h2>
        <StatsCardCont
          quizzesTaken={quizzesTaken}
          averageScore={averageScore}
          bestScore={bestScore}
          questionAnswered={questionAnswered}
         // totalPointsScored={totalPointsScored}
        />
        </section>
       
        <Link to="/leaderboard">
          <div className="stat-card">
            <h3> Leaderboard</h3>
            <p>View Ranking</p>
          </div>
        </Link>
        <section className="subjects-section">
          <h2>Subjects</h2>
          <div className="subjects-grid">
            {subjects.map((subject) => (
              <SubjectCard
                key={subject.id}
                subject={subject.name}
                questions={subject.questions}
                onSelect={() => {
                  handleSubject(subject.id);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            ))}
          </div>
        </section>
        <RecentActivity history={quizHistory} />

        <div className="Up-btn">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <ArrowUp size={18} />
          </button>
        </div>
        <button  className="admin-login-btn" onClick={() => navigate("/admin")}>Admin</button>
      </div>
    </div>
  );
}

export default Dashboard;
