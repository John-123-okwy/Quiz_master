import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowUp, User } from "lucide-react";

function Admin() {
  //============ use Navigate ======================//
  const navigate = useNavigate();
  //=============== state variable for analytics =====================//
  const [analytics, setAnalytics] = useState({
    totalUsers: 0,
    totalQuestions: 0,
    totalAttempts: 0,
    averageScore: 0,
    highestScore: 0,
    mostActiveUser: "-",
  });

  //================= state variable for search Item/ Question Management ======================//
  const [searchTerm, setSearchItem] = useState("");

  //=================== state variable for selectedSubject/ for Question Management ====================//
  const [selectedSubject, setSelectedSubject] = useState("all");

  //============== state variable for selectedDifficulty / Quuestion Management =================================//
  const [selectedDifficulty, setSelectedDificulty] = useState("all");

  //============state variable for bulkQuestions / Question Upload =========================//
  const [bulkQuestions, setBulkQuestions] = useState("");

  //============ state variable for upload Question/ Question upload button=========================//
  const [uploadBulk, setUploadBulk] = useState(false);

  //========== state variable for Editing question / ============================//
  const [editingId, setEditingId] = useState(null);

  //============= state variable for Questions array =====================//
  const [questions, setQuestions] = useState([]);

  //========== state variable for a question to be added =========================//
  const [question, setQuestion] = useState("");

  //============ option A state variable =====================//
  const [optionA, setOptionA] = useState("");

  //============= option B state variable =====================//
  const [optionB, setOptionB] = useState("");

  //============ option C state variable =====================//
  const [optionC, setOptionC] = useState("");

  //============ option D state variable ===================//
  const [optionD, setOptionD] = useState("");

  //============ users array state variable ==================================//
  const [users, setUsers] = useState([]);

  //============== correct Answer state variable ====================================//

  const [correctAnswer, setCorrectAnswer] = useState("");

  //============ subject State variable ================================//

  const [subject, setSubject] = useState("");

  //=========== difficulty state variable ============================//

  const [difficulty, setDifficulty] = useState("easy");

  //================= points state variable ===============================//
  const [points, setPoints] = useState("");

  //=============explanation state variable =====================================//
  const [explanation, setExplanation] = useState("");

  //==================== handle Bulk Questions Upload function=======================//
  const handleBulkUpload = async () => {
    try {
      setUploadBulk(true);
      const parsedQUestions = JSON.parse(bulkQuestions);
      if (!Array.isArray(parsedQUestions)) {
        alert("JSON must be an array of questions");
        return;
      }
      let successCount = 0;
      for (const question of parsedQUestions) {
        if (!question.question || !question.options || !question.subject) {
          continue;
        }
        await addDoc(collection(db, "questions"), {
          ...question,
          createdAt: new Date().toISOString(),
        });
        successCount++;
      }
      alert(`${successCount} questions uploaded succesfully!`);
      setBulkQuestions("");
      await fetchQuestions();
    } catch (error) {
      console.error(error);
      alert("Invalid JSON format");
    } finally {
      setUploadBulk(false);
    }
  };
  //============= fetch Questions function  ====================//
  async function fetchQuestions() {
    try {
      const querySnapshot = await getDocs(collection(db, "questions"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setQuestions(data);
    } catch (error) {
      console.log(error);
    }
  }

  //--------- useEffect for fetchQuestion------------------
  useEffect(() => {
    fetchQuestions();
    fetchUsers();
    fetchAnalytics();
  }, []);

  //======================fetch user function=====================//
  const fetchUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const usersData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(usersData);
    } catch (error) {
      console.error(error);
    }
  };

  //================ fetch Analytics function ===============================//
  const fetchAnalytics = async () => {
    try {
      const usersSnapshot = await getDocs(collection(db, "users"));
      const questionsSnapshot = await getDocs(collection(db, "questions"));
      const users = usersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const totalUsers = users.length;
      const totalQuestions = questionsSnapshot.size;
      const totalAttempts = users.reduce(
        (sum, user) => sum + (user.quizAttempts || 0),
        0,
      );
      const totalAverage = users.reduce(
        (sum, user) => sum + (user.averageScores || 0),
        0,
      );
      const platformAverage = totalUsers
        ? Math.round(totalAverage / totalUsers)
        : 0;
      const highestScore = Math.max(
        ...users.map((user) => user.bestScores || 0),
        0,
      );
      const mostActive = users.reduce(
        (top, user) =>
          (user.quizAttempts || 0) > (top.quizAttempts || 0) ? user : top,
        {},
      );
      setAnalytics({
        totalUsers,
        totalQuestions,
        totalAttempts,
        averageScore: platformAverage,
        highestScore,
        mostActiveUser: mostActive.displayName || "-",
      });
    } catch (error) {
      console.error(error);
    }
  };

  //================= handle submit questions function=============//

  async function handleSubmit(e) {
    e.preventDefault();

    //--------------------------------//
    if (!question || !optionA || !optionB || !optionC || !optionD || !subject) {
      alert("Please fill all the fields");
      return;
    }
    try {
      if (editingId) {
        await updateDoc(doc(db, "questions", editingId), {
          question,
          options: [optionA, optionB, optionC, optionD],
          correctAnswer: Number(correctAnswer),
          subject: subject.toLowerCase(),
          difficulty,
          points: Number(points),
          explanation,
        });
        alert("Questions updated!");
        setEditingId(null);
        fetchQuestions();
        setQuestion("");
        setOptionA("");
        setOptionB("");
        setOptionC("");
        setOptionD("");
        setCorrectAnswer("");
        setSubject("");
        setDifficulty("easy");
        setExplanation("");
        setPoints(0);
      } else {
        await addDoc(collection(db, "questions"), {
          question,
          options: [optionA, optionB, optionC, optionD],
          correctAnswer: Number(correctAnswer),
          subject: subject.toLowerCase(),
          difficulty,
          createdAt: new Date().toISOString(),
          points: Number(points),
          explanation,
        });
        alert("Question added succesfully");
        fetchQuestions();

        setQuestion("");
        setOptionA("");
        setOptionB("");
        setOptionC("");
        setOptionD("");
        setCorrectAnswer("");
        setSubject("");
        setDifficulty("easy");
        setExplanation("");
        setPoints(0);
      }
    } catch (error) {
      console.error(error);
      alert("Failed To Add Question");
    }
  }

  //=================== handle Delete Questions function=======================//
  async function deleteQuestion(id) {
    try {
      await deleteDoc(doc(db, "questions", id));
      fetchQuestions();
    } catch (error) {
      console.log(error);
    }
  }
  //================== filter Questions function==========================//
  const filteredQuestions = questions.filter((question) => {
    const matchesSearch = question.question
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesSubject =
      selectedSubject === "all" || question.subject === selectedSubject;

    const matchesDifficulty =
      selectedDifficulty === "all" ||
      question.difficulty === selectedDifficulty;

    return matchesSearch && matchesSubject && matchesDifficulty;
  });

  //===================== make Adim function===================//
  const makeAdmin = async (userId) => {
    try {
      await updateDoc(doc(db, "users", userId), {
        role: "admin",
      });
      await fetchUsers();
      alert("User Promoted succesfully!");
    } catch (error) {
      console.error(error);
    }
  };

  //-====================== remove Admin function =============================================//
  const removeAdmin = async (userId) => {
    try {
      await updateDoc(doc(db, "users", userId), {
        role: "user",
      });

      await fetchUsers();
      alert("Admin Removed successfully!");
    } catch (error) {
      console.error(error);
    }
  };

  ///////////////////////////////////
  return ( 
    <section>
    <div className="admin-page">
      <button onClick={() => navigate("/dashboard")} className="back-btn">
        <ArrowLeft /> <span>Back To Dashboard</span>
      </button>
      <div className="admin-header">
        {" "}
        <h1>Admin Panel</h1>
      </div>
      {/* ===========Form for adding questions singly====================*/}

      <form className="admin-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />

        <input
          type="text"
          placeholder="Option A"
          value={optionA}
          onChange={(e) => setOptionA(e.target.value)}
        />

        <input
          type="text"
          placeholder="Option B"
          value={optionB}
          onChange={(e) => setOptionB(e.target.value)}
        />

        <input
          type="text"
          placeholder="Option C"
          value={optionC}
          onChange={(e) => setOptionC(e.target.value)}
        />

        <input
          type="text"
          placeholder="Option D"
          value={optionD}
          onChange={(e) => setOptionD(e.target.value)}
        />

        <input
          type="text"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />

        <input
          type="text"
          placeholder="Explanation To Answer"
          value={explanation}
          onChange={(e) => setExplanation(e.target.value)}
        />

        <input
          type="text"
          placeholder="Point per question"
          value={points}
          onChange={(e) => setPoints(e.target.value)}
        />

        <select
          value={correctAnswer}
          onChange={(e) => setCorrectAnswer(Number(e.target.value))}
        >
          <option value="">Select correct option</option>
          <option value={0}>Option A</option>
          <option value={1}>Option B</option>
          <option value={2}>Option C</option>

          <option value={3}>Option D</option>
        </select>

        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        <button type="submit" className="add-question-btn">
          {editingId ? "Update Question" : "Add Question"}
        </button>
      </form>

      {/* ===================Section for Adding question json format in Bulk==================== */}
      <div className="bulk-upload">
        <h2>Bulk Upload questions</h2>
        <p>Paste a json array of questions below:</p>
        <textarea
          value={bulkQuestions}
          onChange={(e) => setBulkQuestions(e.target.value)}
          rows={15}
          placeholder="Paste questions JSON here..."
        />
        <button onClick={handleBulkUpload} disabled={uploadBulk}>
          {uploadBulk ? "Uploading..." : "Upload Questions"}
        </button>
      </div>

      {/*===============================Analytics section============================ */}
      <div className="analytics-section">
        <h2>📊 Platform Analytics</h2>
        <div className="analytics-grid">
          <div className="analytics-card">
            <h3>👤 Users</h3>
            <p>{analytics.totalUsers}</p>
          </div>
          <div className="analytics-card">
            <h3>❓ Questions</h3>
            <p>{analytics.totalQuestions}</p>
          </div>
          <div className="analytics-card">
            <h3>📝 Attempts</h3>
            <p>{analytics.totalAttempts}</p>
          </div>
          <div className="analytics-card">
            <h3>📈 Avg Score</h3>
            <p>{analytics.averageScore} %</p>
          </div>
          <div className="analytics-card">
            <h3>🏆 Highest Score</h3>
            <p>{analytics.highestScore}%</p>
          </div>
          <div className="analytics-card">
            <h3>🔥 Most Active</h3>
            <p>{analytics.mostActiveUser}</p>
          </div>
        </div>
      </div>

      {/*============================section for question filter/ Question Management =======================*/}

      <h2>All Questions</h2>
      <div className="question-filters">
        <input
          type="text"
          placeholder="Search questions..."
          value={searchTerm}
          onChange={(e) => setSearchItem(e.target.value)}
        />
        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
        >
          <option value="all">All subjects</option>
          <option value="maths">Maths</option>
          <option value="physics">Physics</option>
          <option value="english">English</option>

          <option value="chemistry">Chemistry</option>
        </select>
        <select
          value={selectedDifficulty}
          onChange={(e) => setSelectedDificulty(e.target.value)}
        >
          <option value="all">All Difficulties</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>
      <h3>Showing {filteredQuestions.length} Questions</h3>
      {/*========================User management Section====================== */}

      <div className="users-section">
        <h2>User Management</h2>
        {users.map((user) => (
          <div key={user.id} className="user-card">
            <div>
              <p>{user.displayName}</p>
              <p>{user.email}</p>
              <span>{user.role}</span>
            </div>
            {user.email ==="johnchukwu511@gmail.com"? "" : user.role === "admin" ? (
              <button onClick={() => removeAdmin(user.id)}>Remove Admin</button>
            ) : (
              <button onClick={() => makeAdmin(user.id)}>Make Admin</button>
            )}
          </div>
        ))}
      </div>

      {/*=========================section for questions displayed list========================= */}
      <div className="questions-list">
        {filteredQuestions.map((item) => (
          <div className="quesstion-card" key={item.id}>
            <h3>{item.question}</h3>
            <span className="theSubject-badge">subject:{item.subject}</span>
            <span className="theSubject-badge">Point:{item.points}</span>

            <span className="theSubject-badge">
              Correct:{item.options[item.correctAnswer]}
            </span>
            <span className="theSubject-badge">Question Id:{item.id}</span>
            <span className="theSubject-badge">
              Difficulty:{item.difficulty}
            </span>
            <span className="theSubject-badge">
              Explanation:{item.explanation}
            </span>
            <div className="the-options">
              {item.options.map((option, index) => (
                <p key={index}>
                  {String.fromCharCode(65 + index)}.{option}
                </p>
              ))}{" "}
            </div>
            <button
              onClick={() => deleteQuestion(item.id)}
              className="delete-question-btn"
            >
              Delete
            </button>
            <button
              onClick={() => {
                setEditingId(item.id);
                setQuestion(item.question);
                setOptionA(item.options[0]);
                setOptionB(item.options[1]);
                setOptionC(item.options[2]);
                setOptionD(item.options[3]);
                setCorrectAnswer(item.correctAnswer);
                setSubject(item.subject);
                setDifficulty(item.difficulty);
              }}
            >
              Edit
            </button>
            
          </div>
        ))}
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
  );
}

export default Admin;
