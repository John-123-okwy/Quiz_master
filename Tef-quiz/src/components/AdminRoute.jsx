import { useEffect, useState } from "react";
import { auth, db } from "../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Navigate, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

/////========================================////

function AdminRoute({ children }) {
  //==================================//
  const navigate = useNavigate();
  //=======================================//
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  //===================================//
  const [loading, setLoading] = useState(true);

  //==================================//
  const [isAdmin, setIsAdmin] = useState(false);

  //=====================================//
  useEffect(() => {
    async function checkAdmin() {
      const user = auth.currentUser;
      if (!user) {
        setLoading(false);
        return;
      }
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const userData = userSnap.data();
        setIsAdmin(userData.role === "admin");
      }
      setLoading(false);
    }
    checkAdmin();
  }, []);
  //===================================================//
  if (loading) {
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
        
       
        <div className="loading-screen">
          <div className="spinner"></div>
          <h3>Loading your progress...</h3>
        </div>
         <button onClick={() => navigate("/dashboard")} className="back-btn">
          <ArrowLeft /> <span>Back To Dashboard</span>
        </button>
      </div>
    );
  }
  //=============================================//
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  /////////////////////////////////////
  return children;
}
export default AdminRoute;
