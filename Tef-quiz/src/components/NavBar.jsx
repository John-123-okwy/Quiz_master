import { Menu, UserCircle } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function NavBar({setShowSidebar}) {

  //-=====================================================//
  const[showMenu, setShowMenu]=useState(false)

  //======================================================//
  const navigate=useNavigate()
  /////////////////////////
  return (
    <header className="navbar">
      <div className="nav-brand  ">
      <div className="navbar-left">
        <button className="menu-btn" onClick={()=>setShowSidebar((prev)=>!prev)}>
          <Menu size={24} />
        </button>
        
        <h2 className="logo">QuizMaster</h2>
      </div>
      <div className="navbar-right">
        <button className="profile-btn" onClick={()=>setShowMenu(!showMenu)}>
          <UserCircle size={30} />
        </button>
      </div>
      {showMenu &&(<div className="profile-menu">
        <button onClick={()=>navigate("/profile")}>Profile</button>
        <button onClick={()=>navigate("/login")}>Logout</button>
      </div>)}
   </div> </header>
  );
}
export default NavBar;
