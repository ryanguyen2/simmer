import { useEffect, useState } from "react";
import { getDemoUsers, resetDemo, setCurrentUserId } from "../lib/fakeApi";
import { showToast } from "../lib/toast";

export default function DemoControls() {
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => { setUsers(getDemoUsers()); }, []);

  const doReset = () => {
    resetDemo({ setUserId: "u1" });
    showToast("Demo data reset");
    location.reload();
  };

  const switchTo = (id) => {
    setCurrentUserId(id);
    showToast("Switched demo user");
    location.reload();
  };

  return (
    <>
      <button className="demo-fab" onClick={() => setOpen((v) => !v)} aria-label="Demo menu">
        Demo
      </button>

      {open && (
        <div className="demo-panel">
          <div className="row">
            <strong>Demo controls</strong>
            <button className="x" onClick={() => setOpen(false)}>×</button>
          </div>

          <button className="reset" onClick={doReset}>Reset demo data</button>

          <div className="users">
            {users.map((u) => (
              <button key={u.id} className="user" onClick={() => switchTo(u.id)}>
                <img src={u.avatar} alt={u.name} />
                <div>
                  <div className="name">{u.name}</div>
                  <div className="handle">@{u.handle}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <style>{`
        .demo-fab{
          position: fixed; right: 16px; bottom: 16px;
          height: 40px; padding: 0 14px; border-radius: 999px;
          border: 0; cursor: pointer; font-weight: 800; color:#fff;
          background: linear-gradient(90deg,#ef4444,#f97316 55%,#f59e0b);
          box-shadow: 0 10px 24px rgba(0,0,0,.18);
          z-index: 50;
        }
        .demo-panel{
          position: fixed; right: 16px; bottom: 64px; width: 320px;
          background: #fff; border: 1px solid #ece6df; border-radius: 16px; padding: 12px;
          box-shadow: 0 20px 40px rgba(0,0,0,.18); z-index: 50;
        }
        .demo-panel .row{ display:flex; align-items:center; justify-content:space-between; margin-bottom: 8px; }
        .demo-panel .x{ width:28px; height:28px; border-radius:10px; border:1px solid #ece6df; background:#fff; cursor:pointer; }
        .demo-panel .reset{
          width: 100%; height: 34px; border-radius: 10px; border: 1px solid #ece6df; background: #fff; cursor: pointer; font-weight: 800;
        }
        .demo-panel .reset:hover{ background: #fff7ed; }
        .demo-panel .users{ display:grid; gap: 8px; margin-top: 10px; max-height: 260px; overflow:auto; }
        .demo-panel .user{
          display:grid; grid-template-columns: 40px 1fr; gap:10px; align-items:center; background:none; border:0; cursor:pointer; text-align:left;
        }
        .demo-panel .user img{ width:40px; height:40px; border-radius:50%; object-fit:cover; border:1px solid #ece6df; }
        .demo-panel .user .name{ font-weight: 800; font-size: 13px; }
        .demo-panel .user .handle{ color:#6b7280; font-size: 12px; }
      `}</style>
    </>
  );
}
