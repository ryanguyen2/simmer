import { useEffect, useRef, useState } from "react";
import { createPost, getCurrentUserId } from "../lib/fakeApi";
import { showToast } from "../lib/toast";

async function fileToDataURL(file, maxW = 1280, quality = 0.85) {
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

export default function CreatePostModal({ open, onClose, onCreated }) {
  const dialogRef = useRef(null);
  const [title, setTitle] = useState("");
  const [imageList, setImageList] = useState("");
  const [files, setFiles] = useState([]);
  const [tags, setTags] = useState("");
  const [cookTime, setCookTime] = useState("");
  const [servings, setServings] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const [ingredients, setIngredients] = useState("");
  const [steps, setSteps] = useState("");
  const [working, setWorking] = useState(false);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
    const esc = (e)=> e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", esc);
    return ()=> window.removeEventListener("keydown", esc);
  }, [open, onClose]);

  if (!open) return null;

  const pickFiles = (e) => setFiles(Array.from(e.target.files || []));

  const submit = async () => {
    try {
      setWorking(true);
      const urlImages = imageList.split(/[\n,]/).map(s => s.trim()).filter(Boolean);
      const fileImages = [];
      for (const f of files) fileImages.push(await fileToDataURL(f));
      const images = [...urlImages, ...fileImages];
      if (!images.length) { showToast("Add at least one image (URL or file)"); return; }

      const payload = {
        userId: getCurrentUserId(),
        title,
        images,
        tags: tags.split(",").map(t=>t.trim()).filter(Boolean),
        cookTime, servings, difficulty,
        ingredients: ingredients.split("\n").map(s=>s.trim()).filter(Boolean),
        steps: steps.split("\n").map(s=>s.trim()).filter(Boolean),
      };

      const post = await createPost(payload);
      onCreated?.(post);
      onClose?.();
      showToast("Post created");

      setTitle(""); setImageList(""); setFiles([]);
      setTags(""); setCookTime(""); setServings(""); setDifficulty("Easy");
      setIngredients(""); setSteps("");
    } finally {
      setWorking(false);
    }
  };

  return (
    <dialog ref={dialogRef} className="modal edit">
      <style>{`
        .modal.edit {
          width: min(820px, 96vw);
          border:0; border-radius:18px; background:#fff; padding:0;
          overflow: hidden;
        }
        .modal.edit::backdrop { background: rgba(10,12,20,.55); backdrop-filter: blur(2px); }
        .edit-head { display:flex; align-items:center; justify-content:space-between; padding:16px 18px; border-bottom:1px solid #ece6df; }
        .modal-x { width:32px; height:32px; border-radius:50%; border:1px solid #ece6df; background:#fff; cursor:pointer; }
        .edit-body { padding:16px 18px; display:grid; gap:16px; }
        .grid2 { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); }
        .col { display:flex; flex-direction:column; gap:10px; min-width: 0; }
        label { font-weight:700; font-size:13px; }
        .in { height:42px; border:1px solid #ece6df; border-radius:12px; padding:0 12px; font:inherit; width:100%; }
        .ta { border:1px solid #ece6df; border-radius:12px; padding:10px 12px; font:inherit; width:100%; }
        .row3 { display:grid; grid-template-columns: 1fr 1fr 1fr; gap:10px; }
        .edit-foot { display:flex; justify-content:flex-end; gap:10px; padding:14px 18px; border-top:1px solid #ece6df; }
        .btn { height:36px; padding:0 14px; border-radius:999px; font-weight:800; cursor:pointer; }
        .btn.ghost { background:#fff; border:1px solid #ece6df; }
        .btn.ghost:hover { background:#fff7ed; }
        .btn.solid { border:0; background:linear-gradient(90deg,#ef4444,#f97316 55%,#f59e0b); color:#fff; }
        .btn.solid:hover { filter: brightness(.98); }
        @media (max-width: 1000px){ .grid2 { grid-template-columns: 1fr; } }
      `}</style>

      <header className="edit-head">
        <h2>Create post</h2>
        <button className="modal-x" onClick={onClose}>×</button>
      </header>

      <div className="edit-body grid2">
        <div className="col">
          <label>Title</label>
          <input className="in" value={title} onChange={e=>setTitle(e.target.value)} placeholder="e.g., Chili Crisp Eggs" />

          <label>Image URLs (comma or new line)</label>
          <textarea className="ta" rows={3} value={imageList} onChange={e=>setImageList(e.target.value)} placeholder="https://..., https://..." />

          <label>Or upload images</label>
          <input className="in" type="file" accept="image/*" multiple onChange={pickFiles} />
          {files.length > 0 && (
            <div style={{ fontSize:12, color:"#6b7280", marginTop:6 }}>
              {files.length} file(s) selected. Large images will be resized to ~1280px for storage.
            </div>
          )}

          <label>Tags (comma-separated)</label>
          <input className="in" value={tags} onChange={e=>setTags(e.target.value)} placeholder="quick, spicy" />

          <div className="row3">
            <div>
              <label>Cook time</label>
              <input className="in" value={cookTime} onChange={e=>setCookTime(e.target.value)} placeholder="e.g., 20 min" />
            </div>
            <div>
              <label>Servings</label>
              <input className="in" value={servings} onChange={e=>setServings(e.target.value)} placeholder="e.g., 2" />
            </div>
            <div>
              <label>Difficulty</label>
              <select className="in" value={difficulty} onChange={e=>setDifficulty(e.target.value)}>
                <option>Easy</option><option>Medium</option><option>Hard</option>
              </select>
            </div>
          </div>
        </div>

        <div className="col">
          <label>Ingredients (one per line)</label>
          <textarea className="ta" rows={7} value={ingredients} onChange={e=>setIngredients(e.target.value)} />
          <label>Steps (one per line)</label>
          <textarea className="ta" rows={8} value={steps} onChange={e=>setSteps(e.target.value)} />
        </div>
      </div>

      <footer className="edit-foot">
        <button className="btn ghost" onClick={onClose} disabled={working}>Cancel</button>
        <button className="btn solid" onClick={submit} disabled={working || !title}>Publish</button>
      </footer>
    </dialog>
  );
}
