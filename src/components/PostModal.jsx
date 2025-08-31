import { useEffect, useRef, useState } from "react";
import {
  toggleLike, toggleSave, deletePost,
  listComments, addComment, getSavedCount, getCurrentUserId
} from "../lib/fakeApi";
import { showToast } from "../lib/toast";

export default function PostModal({ post, onClose }) {
  const dialogRef = useRef(null);
  const [idx, setIdx] = useState(0);
  const [comments, setComments] = useState([]);
  const [input, setInput] = useState("");
  const [savedCount, setSavedCount] = useState(0);
  const me = getCurrentUserId();

  useEffect(() => {
    if (!post) return;
    const d = dialogRef.current;
    if (!d.open) d.showModal();
    const key = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", key);
    (async () => {
      setComments(await listComments(post.id || post._id));
      setSavedCount(getSavedCount(post.id || post._id));
    })();
    setIdx(0);
    return () => window.removeEventListener("keydown", key);
  }, [post, onClose]);

  if (!post) return null;

  const imgs = Array.isArray(post.images) && post.images.length ? post.images : [post.photo];

  const next = () => setIdx(i => (i + 1) % imgs.length);
  const prev = () => setIdx(i => (i - 1 + imgs.length) % imgs.length);

  const like = async () => {
    const n = await toggleLike({ userId: me, postId: post.id || post._id });
    showToast(`♥ ${n} likes`);
  };
  const save = async () => {
    const s = await toggleSave({ userId: me, postId: post.id || post._id });
    setSavedCount(getSavedCount(post.id || post._id));
    showToast(s ? "Saved to your collection" : "Removed from Saved");
  };
  const del = async () => {
    await deletePost({ userId: me, postId: post.id || post._id });
    showToast("Post deleted");
    onClose();
  };

  const submitComment = async () => {
    if (!input.trim()) return;
    const newC = await addComment({ userId: me, postId: post.id || post._id, text: input.trim() });
    setComments(prev => [...prev, { ...newC, user: post.author, time: "now" }]);
    setInput("");
  };

  return (
    <dialog ref={dialogRef} className="modal" onClose={onClose}>
      <style>{`
        .modal {
          padding: 0;
          border: 0;
          border-radius: 18px;
          width: min(980px, 96vw);
          max-height: 90vh;
          overflow: hidden;
          background: #fff;
        }
        .modal::backdrop {
          background: rgba(10,12,20,0.55);
          backdrop-filter: blur(2px);
        }
        .modal-close {
          position: absolute;
          top: 10px;
          right: 12px;
          width: 36px;
          height: 36px;
          border-radius: 12px;
          border: 1px solid #ece6df;
          background: #fff;
          cursor: pointer;
          font-size: 22px;
          line-height: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 6px 18px rgba(0,0,0,.08);
          z-index: 3;
        }
        .modal-grid {
          display: grid;
          grid-template-columns: 1.1fr 1fr;
        }
        .photo-wrap {
          position: relative;
          background: #000;
        }
        .modal-photo {
          width: 100%;
          height: 100%;
          max-height: 90vh;
          object-fit: cover;
          display: block;
        }
        /* Centered arrows constrained to the image area */
        .carousel {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 40px;
          height: 40px;
          border-radius: 12px;
          border: 0;
          background: rgba(0,0,0,.45);
          color: #fff;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          z-index: 2;
        }
        .carousel:hover { background: rgba(0,0,0,.6); }
        .carousel.left  { left: 8px; }
        .carousel.right { right: 8px; }
        .carousel svg { display:block; }
        .modal-body {
          padding: 14px 16px 16px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          overflow: hidden;
        }
        .modal-head { display: flex; align-items: center; gap: 10px; }
        .modal-avatar { width: 36px; height: 36px; border-radius: 50%; object-fit: cover; }
        .modal-meta { display: flex; flex-direction: column; line-height: 1.1; }
        .modal-name { font-weight: 800; }
        .modal-handle { color: #6b7280; font-size: 12px; }
        .btn.ghost.sm {
          height: 28px; padding: 0 10px; border: 1px solid #ece6df; border-radius: 999px;
          background: #fff; font-weight: 800; cursor: pointer; margin-left: auto;
        }
        .btn.ghost.sm:hover { background: #fff7ed; }
        .modal-title { margin: 2px 0 2px; }
        .stats { font-size: 12px; color: #6b7280; display: flex; gap: 12px; }
        .recipe-meta { display: flex; flex-wrap: wrap; gap: 10px; color: #111; font-size: 13px; }
        .modal-tags { display: flex; gap: 8px; flex-wrap: wrap; }
        .tag { background: #fff7ed; border: 1px solid #ffd7b0; color: #b45309; padding: 2px 8px; border-radius: 999px; font-size: 12px; }
        .modal-actions { display: flex; align-items: center; gap: 8px; }
        .modal-actions .btn {
          border: 1px solid #ece6df; background: #fff; border-radius: 999px;
          height: 32px; padding: 0 12px; cursor: pointer; font-weight: 800;
        }
        .comments {
          margin-top: 8px; border-top: 1px solid #f1efe9; padding-top: 8px;
          overflow: auto; max-height: 240px;
        }
        .comment { display: grid; grid-template-columns: 32px 1fr; gap: 8px; align-items: start; margin-bottom: 8px; }
        .comment img { width: 32px; height: 32px; border-radius: 50%; object-fit: cover; }
        .bubble { background: #fafafa; border: 1px solid #ece6df; border-radius: 12px; padding: 8px 10px; }
        .bubble .head { display: flex; gap: 8px; align-items: center; color: #6b7280; font-size: 12px; }
        .comment-form { display: flex; gap: 8px; margin-top: 8px; }
        .comment-form input { flex: 1; height: 34px; border: 1px solid #ece6df; border-radius: 12px; padding: 0 10px; font: inherit; }
        .comment-form button {
          height: 34px; padding: 0 12px; border-radius: 12px; border: 0; cursor: pointer; font-weight: 800; color: #fff;
          background: linear-gradient(90deg,#ef4444,#f97316 55%,#f59e0b);
        }
        @media (max-width: 900px) {
          .modal-grid { grid-template-columns: 1fr; }
          .modal-photo { height: 240px; }
        }
      `}</style>

      <button className="modal-close" onClick={onClose} aria-label="Close">×</button>

      <div className="modal-grid">
       
        <div className="photo-wrap">
          <img className="modal-photo" src={imgs[idx]} alt={post.title} />
          {imgs.length > 1 && (
            <>
              <button className="carousel left" onClick={prev} aria-label="Previous image">
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                  <path d="M15 18l-6-6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button className="carousel right" onClick={next} aria-label="Next image">
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                  <path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </>
          )}
        </div>

        <div className="modal-body">
          <header className="modal-head">
            <img src={post.author?.avatar} alt={post.author?.name} className="modal-avatar" />
            <div className="modal-meta">
              <strong className="modal-name">{post.author?.name}</strong>
              <span className="modal-handle">@{post.author?.handle}</span>
            </div>
            {post.author?.id === me && <button className="btn.ghost.sm" onClick={del}>Delete</button>}
          </header>

          <h2 className="modal-title">{post.title}</h2>

          {/* Compact stats right under title */}
          <div className="stats">
            <span>♥ {post.likes}</span>
            <span>💬 {comments.length}</span>
            <span>🔖 {savedCount}</span>
          </div>

          <div className="recipe-meta">
            <span>⏱ {post.cookTime ?? "—"}</span>
            <span>🍽 {post.servings ?? "—"}</span>
            <span>🔥 {post.difficulty ?? "—"}</span>
          </div>

          <div className="modal-tags">
            {(post.tags || []).map((t) => <span key={t} className="tag">#{t}</span>)}
          </div>

          {post.ingredients?.length ? (
            <section className="recipe-section">
              <h3 style={{margin:"8px 0 4px"}}>Ingredients</h3>
              <ul className="ingredients">{post.ingredients.map((x,i)=><li key={i}>{x}</li>)}</ul>
            </section>
          ) : null}

          {post.steps?.length ? (
            <section className="recipe-section">
              <h3 style={{margin:"8px 0 4px"}}>Steps</h3>
              <ol className="steps">{post.steps.map((x,i)=><li key={i}>{x}</li>)}</ol>
            </section>
          ) : null}

          <div className="modal-actions">
            <button className="btn" onClick={save}>Save</button>
            <button className="btn" onClick={like}>Like</button>
          </div>

         
          <div className="comments">
            {comments.map(c => (
              <div className="comment" key={c.id}>
                <img src={c.user?.avatar} alt={c.user?.name} />
                <div className="bubble">
                  <div className="head">
                    <span className="name" style={{ fontWeight:800, color:"#0e1020" }}>{c.user?.name}</span>
                    <span className="time">{c.time}</span>
                  </div>
                  <div className="text">{c.text}</div>
                </div>
              </div>
            ))}
            <form className="comment-form" onSubmit={(e)=>{e.preventDefault(); submitComment();}}>
              <input value={input} onChange={e=>setInput(e.target.value)} placeholder="Leave a comment…" />
              <button disabled={!input.trim()} type="submit">Post</button>
            </form>
          </div>
        </div>
      </div>
    </dialog>
  );
}
