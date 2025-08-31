import { useEffect, useRef, useState } from "react";
import { updateUser } from "../lib/fakeApi";

export default function EditProfileModal({ open, user, onClose }) {
  const dialogRef = useRef(null);
  const [name, setName] = useState(user?.name || "");
  const [handle, setHandle] = useState(user?.handle || "");
  const [avatar, setAvatar] = useState(user?.avatar || "");
  const [bio, setBio] = useState(user?.bio || "");

  useEffect(() => {
    setName(user?.name || "");
    setHandle(user?.handle || "");
    setAvatar(user?.avatar || "");
    setBio(user?.bio || "");
  }, [user]);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
    const esc = (e) => e.key === "Escape" && onClose?.(false);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [open, onClose]);

  if (!open) return null;

  const save = async () => {
    await updateUser({ id: user.id, name, handle, avatar, bio });
    onClose?.(true);
  };

  return (
    <dialog ref={dialogRef} className="modal edit">
      <header className="edit-head">
        <h2>Edit profile</h2>
        <button className="modal-x" onClick={() => onClose?.(false)}>×</button>
      </header>

      <div className="edit-body">
        <div className="row">
          <label>Name</label>
          <input className="in" value={name} onChange={e=>setName(e.target.value)} />
        </div>
        <div className="row">
          <label>Handle</label>
          <div className="handle-wrap">
            <span>@</span>
            <input className="in" value={handle} onChange={e=>setHandle(e.target.value.replace(/^@/, ""))} />
          </div>
        </div>
        <div className="row">
          <label>Avatar URL</label>
          <input className="in" value={avatar} onChange={e=>setAvatar(e.target.value)} />
        </div>
        <div className="row">
          <label>Bio</label>
          <textarea className="ta" rows={4} value={bio} onChange={e=>setBio(e.target.value)} />
        </div>
      </div>

      <footer className="edit-foot">
        <button className="btn ghost" onClick={() => onClose?.(false)}>Cancel</button>
        <button className="btn solid" onClick={save}>Save changes</button>
      </footer>

      <style>{`
        .modal.edit { width: min(560px, 94vw); border:0; border-radius:18px; background:#fff; padding:0; }
        .modal.edit::backdrop { background: rgba(10,12,20,.55); backdrop-filter: blur(2px); }
        .edit-head { display:flex; align-items:center; justify-content:space-between; padding:16px 18px; border-bottom:1px solid #ece6df; }
        .modal-x { width:32px; height:32px; border-radius:50%; border:1px solid #ece6df; background:#fff; cursor:pointer; }
        .edit-body { padding:16px 18px; display:flex; flex-direction:column; gap:12px; }
        .row { display:flex; flex-direction:column; gap:6px; }
        label { font-weight:700; font-size:13px; }
        .in { height:42px; border:1px solid #ece6df; border-radius:12px; padding:0 12px; font:inherit; }
        .ta { border:1px solid #ece6df; border-radius:12px; padding:10px 12px; font:inherit; }
        .handle-wrap { display:flex; align-items:center; gap:6px; }
        .handle-wrap > span { color:#6b7280; }
        .edit-foot { display:flex; justify-content:flex-end; gap:10px; padding:14px 18px; border-top:1px solid #ece6df; }
        .btn { height:36px; padding:0 14px; border-radius:999px; font-weight:800; cursor:pointer; }
        .btn.ghost { background:#fff; border:1px solid #ece6df; }
        .btn.ghost:hover { background:#fff7ed; }
        .btn.solid { border:0; background:linear-gradient(90deg,#ef4444,#f97316 55%,#f59e0b); color:#fff; }
        .btn.solid:hover { filter: brightness(.98); }
      `}</style>
    </dialog>
  );
}
