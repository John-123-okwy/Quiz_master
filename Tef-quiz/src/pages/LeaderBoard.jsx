import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

function LeaderBoard() {
  //==============================================//
  const [selectedSubject, setSelectedSubject] = useState("maths");
  //=============================================//
  const [Leaderboard, setLeaderboard] = useState([]);

  //===========================================///
  const navigate = useNavigate();

  //==============Fetch Leader board=====================//
  const fetchLeaderboard = async () => {
    try {
      const leaderboardQuery = query(
        collection(db, "users"),
        orderBy("totalPoints", "desc"),
      );
      const snapshot = await getDocs(leaderboardQuery);
      const users = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      console.log(users);

      const sortedUsers = [...users].sort((a, b) => {
        if (selectedSubject === "overall") {
          return (b.totalPoints || 0) - (a.totalPoints || 0);
        }
        return (
          (b.subjectPoints?.[selectedSubject] || 0) -
          (a.subjectPoints?.[selectedSubject] || 0)
        );
      });
      setLeaderboard(sortedUsers);
    } catch (error) {}
  };
  //------------------------//
  useEffect(() => {
    fetchLeaderboard();
  }, [selectedSubject]);

  /////////////////////////
  return (
    <div className="leaderboard-page">
      <button onClick={() => navigate("/dashboard")} className="back-btn">
        <ArrowLeft /> <span>Back To Dashboard</span>
      </button>
      <select
        value={selectedSubject}
        onChange={(e) => setSelectedSubject(e.target.value)}
      >
        <option value="overall">Overall</option>
        <option value="mathematics">Maths</option>
        <option value="physics">Physics</option>
        <option value="chemistry">Chemistry</option>
        <option value="english">English</option>
      </select>

      <h1 className="leader-b">🏆 Leaderboard</h1>
      <div className="leaderboard-header">
        <span>Rank</span>
        <span>Name</span>
        <span>Points</span>
        <span>Average Score</span>
        <span>Best Score</span>
      </div>
      {Leaderboard.map((user1, index) => (
        <div key={user1.id} className="leaderboard-row">
          <span>
            {index === 0
              ? "🥇"
              : index === 1
                ? "🥈"
                : index === 2
                  ? "🥉"
                  : `#${index + 1}`}
          </span>

          <span>{user1?.displayName}</span>
          <span>
            {selectedSubject === "overall"
              ? user1.totalPoints || 0
              : user1?.subjectPoints?.[selectedSubject] || 0}
          </span>
          <span>
            {selectedSubject === "overall"
              ? user1.averageScores || 0
              : user1?.subjectStats?.[selectedSubject]?.averageScore || 0}%
          </span>
          <span>{selectedSubject === "overall"
              ? user1.bestScores || 0
              : user1?.subjectStats?.[selectedSubject]?.bestScore || 0}%</span>
        </div>
      ))}
    </div>
  );
}

export default LeaderBoard;
