import {
  Award,
  HistoryIcon,
  LayoutDashboard,
  LogOut,
  Settings,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function SideBar({showSidebar,setShowSidebar}) {

  //============Derived state for useNavigate=====================//
  const navigate=useNavigate()


  return (
    
      
      <aside className={`sidebar ${showSidebar?"open":"close"}`}>
        <h1>Side bar</h1>
        <button className="close-btn" onClick={()=>setShowSidebar(false)}>
          <X />
        </button>
        <nav>
          <ul>
            <li>
              <LayoutDashboard />
              <span onClick={()=>navigate("/dashboard")}>Dashboard</span>
            </li>
            <li>
              <HistoryIcon />
              <span   >History</span>
            </li>
            <li>
              <Award />
              <span>Achievements</span>
            </li>
            <li>
              <Settings />
              <span>Settings</span>
            </li>
            <li>
              <LogOut />
              <span onClick={()=>navigate("/login")}>Logout</span>
            </li>
          </ul>
        </nav>
      </aside>

  );
}
export default SideBar;
