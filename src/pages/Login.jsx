import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import logoIcon from "../assets/logo-icon.svg";
import { getDemoUsers, setCurrentUserId } from "../lib/fakeApi";
import { showToast } from "../lib/toast";

export default function Login() {
  const nav = useNavigate();
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState("u1");

  useEffect(() => { setUsers(getDemoUsers()); }, []);

  const goDemo = () => {
    setCurrentUserId(selected);
    showToast("Signed in (demo)");
    nav("/feed");
  };

  return (
    <div className="login-page">
      <div className="login-shell">
       
        <div className="brand">
          <div className="logo">
            <img src={logoIcon} alt="Simmer" />
            <div className="word">Simmer</div>
          </div>
          <h1>Cook. Share. Inspire.</h1>
          <p>Instagram-style recipes and stories—built with React + Vite (frontend-only demo).</p>

          <div className="features">
            <div className="feature">
              <div className="dot" />
              <div>Browse the feed, open posts, view stories.</div>
            </div>
            <div className="feature">
              <div className="dot" />
              <div>Create a post (URLs or upload files—stored locally).</div>
            </div>
            <div className="feature">
              <div className="dot" />
              <div>Save, like, and comment—persists in your browser.</div>
            </div>
          </div>
        </div>

       
        <div className="auth-col">
          <div className="auth-card">
            <div className="auth-head">
              <div className="title">Sign in to Simmer</div>
              <div className="meta">
                <span>secured by Clerk (demo)</span>
                <span>development mode</span>
              </div>
            </div>

            <div className="clerk-mount">
              <div style={{ display:"grid", gap:10 }}>
                <label style={{ fontWeight:800, fontSize:13 }}>Choose a demo user</label>
                <select
                  value={selected}
                  onChange={(e)=>setSelected(e.target.value)}
                  style={{ height:42, border:"1px solid #ece6df", borderRadius:12, padding:"0 12px", font:"inherit" }}
                >
                  {users.map(u => (
                    <option key={u.id} value={u.id}>
                      {u.name} @{u.handle}
                    </option>
                  ))}
                </select>

                <button
                  onClick={goDemo}
                  style={{
                    height:42, borderRadius:12, border:0, cursor:"pointer", fontWeight:800, color:"#fff",
                    background: "linear-gradient(90deg,#ef4444,#f97316 55%,#f59e0b)"
                  }}
                >
                  Continue to demo
                </button>

                <div style={{ fontSize:12, color:"#6b7280" }}>
                  No backend required. Actions persist in <code>localStorage</code>. Use the floating “Demo” button to reset data or switch users.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
