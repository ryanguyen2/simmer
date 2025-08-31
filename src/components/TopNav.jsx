import { UserButton, useUser } from "@clerk/clerk-react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo-icon.svg";
import { getCurrentUserHandle, getCurrentUserId, getUserById } from "../lib/fakeApi";

export default function TopNav() {
  const { user } = useUser();              
  const nav = useNavigate();


  const myHandle = getCurrentUserHandle();
  const demoUser  = getUserById(getCurrentUserId());

  return (
    <header className="topnav">
      <div className="left" onClick={() => nav("/feed")} role="button" aria-label="Go to Feed">
        <img src={logo} alt="Simmer" className="logo" />
        <span className="wordmark">simmer</span>
      </div>

      <nav className="mid" aria-label="Primary">
        <Link to="/feed" className="navlink">Feed</Link>
        <Link to="/discover" className="navlink">Discover</Link>
        <Link to={`/profile/${myHandle}`} className="navlink">Profile</Link>
      </nav>

      <div className="right">
        <span className="hello">
          Hi, {user?.firstName ?? demoUser?.name?.split(" ")[0] ?? "Chef"} 👋
        </span>

      
        {user?.id ? (
          <UserButton afterSignOutUrl="/login" />
        ) : (
          <div className="demo-actions">
            {demoUser?.avatar && <img src={demoUser.avatar} alt="" className="mini" />}
         
          </div>
        )}
      </div>

      <style>{`
        .topnav{
          position: fixed; inset: 0 0 auto 0; height: 64px; background: #ffffffcc;
          backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: space-between;
          border-bottom: 1px solid #ece6df; padding: 0 clamp(16px, 5vw, 32px); z-index: 20;
        }
        .left{ display: flex; align-items: center; gap: 8px; cursor: pointer; }
        .logo{ width: 22px; height: 22px; }
        .wordmark{
          font-weight: 800; text-transform: lowercase;
          background: linear-gradient(90deg,#ef4444,#f97316 55%,#f59e0b);
          -webkit-background-clip: text; background-clip: text; color: transparent;
        }
        .mid{ display: flex; gap: 16px; }
        .navlink{ color: #6b7280; text-decoration: none; font-weight: 600; }
        .navlink:hover{ text-decoration: underline; }
        .right{ display: flex; align-items: center; gap: 12px; }
        .hello{ color: #6b7280; font-size: 14px; }

        /* Demo fallback bits */
        .demo-actions{ display: flex; align-items: center; gap: 8px; }
        .mini{
          width: 26px; height: 26px; border-radius: 50%; object-fit: cover;
          border: 1px solid #ece6df;
        }
        .pill{
          height: 32px; padding: 0 12px; border-radius: 999px;
          border: 1px solid #ece6df; background: #fff; font-weight: 800; cursor: pointer;
        }
        .pill:hover{ background: #fff7ed; }
      `}</style>
    </header>
  );
}
