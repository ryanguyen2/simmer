import { useEffect, useRef, useState } from "react";
import { createStory } from "../lib/fakeApi";
import { showToast } from "../lib/toast";

async function fileToDataURL(file, maxW = 1080, quality = 0.85) {
  const data = await new Promise((res, rej) => {
    const fr = new FileReader();
    fr.onload = () => res(fr.result);
    fr.onerror = rej;
    fr.readAsDataURL(file);
  });
  if (!String(file.type).startsWith("image/")) return data;
  const img = await new Promise((res) => { const im = new Image(); im.onload = () => res(im); im.src = data; });
  if (img.width <= maxW) return data;
  const scale = maxW / img.width;
  const canvas = document.createElement("canvas");
  canvas.width = maxW;
  canvas.height = Math.round(img.height * scale);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", quality);
}

export default function CreateStoryModal({ open, onClose, userId }) {
  const dialogRef = useRef(null);
  const [imageUrls, setImageUrls] = useState("");
  const [files, setFiles] = useState([]);
  const [working, setWorking] = useState(false);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
    const esc = (e)=> e.key === "Escape" && onClose?.(false);
    window.addEventListener("keydown", esc);
    return ()=> window.removeEventListener("keydown", esc);
  }, [open, onClose]);

  if (!open) return null;

  const submit = async () => {
    try {
      setWorking(true);
      const urlImgs = imageUrls.split(/[\n,]/).map(s=>s.trim()).filter(Boolean);
      const fileImgs = [];
      for (const f of files) fileImgs.push(await fileToDataURL(f));
      const images = [...urlImgs, ...fileImgs];
      if (!images.length) { showToast("Add at least one image"); return; }

      await createStory({ userId, images, hours: 24 });
      showToast("Story added");
      setImageUrls(""); setFiles([]);
      onClose?.(true);
    } finally {
      setWorking(false);
    }
  };

  return (
    <dialog ref={dialogRef} className="modal edit">
      <style>{`
        .modal.edit { width: min(520px, 94vw); border:0; border-radius:18px; background:#fff; padding:0; overflow:hidden; }
        .modal.edit::backdrop { background: rgba(10,12,20,.55); backdrop-filter: blur(2px); }
        .edit-head { display:flex; align-items:center; justify-content:space-between; padding:14px 16px; border-bottom:1px solid #ece6df; }
        .modal-x { width:32px; height:32px; border-radius:50%; border:1px solid #ece6df; background:#fff; cursor:pointer; }
        .edit-body { padding:14px 16px; display:flex; flex-direction:column; gap:10px; }
        label { font-weight:800; font-size:13px; }
        .in { height:42px; border:1px solid #ece6df; border-radius:12px; padding:0 12px; font:inherit; }
        .ta { border:1px solid #ece6df; border-radius:12px; padding:10px 12px; font:inherit; }
        .edit-foot { display:flex; justify-content:flex-end; gap:10px; padding:12px 16px; border-top:1px solid #ece6df; }
        .btn { height:36px; padding:0 14px; border-radius:999px; font-weight:800; cursor:pointer; }
        .btn.ghost { background:#fff; border:1px solid #ece6df; }
        .btn.ghost:hover { background:#fff7ed; }
        .btn.solid { border:0; background:linear-gradient(90deg,#ef4444,#f97316 55%,#f59e0b); color:#fff; }
        .btn.solid:hover { filter: brightness(.98); }
      `}</style>

      <header className="edit-head">
        <h3 style={{margin:0}}>Add story</h3>
        <button className="modal-x" onClick={()=>onClose?.(false)}>×</button>
      </header>

      <div className="edit-body">
        <label>Image URLs (comma or new line)</label>
        <textarea className="ta" rows={3} value={imageUrls} onChange={e=>setImageUrls(e.target.value)} placeholder="https://..., https://..." />

        <label>Or upload images</label>
        <input className="in" type="file" accept="image/*" multiple onChange={(e)=>setFiles(Array.from(e.target.files||[]))} />
        {files.length>0 && <div style={{fontSize:12, color:"#6b7280"}}>{files.length} file(s) selected.</div>}
      </div>

      <footer className="edit-foot">
        <button className="btn ghost" onClick={()=>onClose?.(false)} disabled={working}>Cancel</button>
        <button className="btn solid" onClick={submit} disabled={working}>Publish</button>
      </footer>
    </dialog>
  );
}
