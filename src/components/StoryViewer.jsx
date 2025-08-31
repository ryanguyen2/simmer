import { useEffect, useRef, useState } from "react";

export default function StoryViewer({ stories, startIndex=0, onClose }) {
  const dialogRef = useRef(null);
  const [idx, setIdx] = useState(startIndex);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d.open) d.showModal();
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const next = () => setIdx(i => (i+1) % stories.length);
  const prev = () => setIdx(i => (i-1+stories.length) % stories.length);

  const s = stories[idx];
  const img = s.images?.[0];

  return (
    <dialog ref={dialogRef} className="story-modal" onClose={onClose}>
      <button className="story-x" onClick={onClose}>×</button>
      <button className="story-nav left" onClick={prev}>‹</button>
      <button className="story-nav right" onClick={next}>›</button>
      <div className="story-wrap">
        <img className="story-img" src={img} alt={s.author?.name || "story"} />
        <div className="story-meta">
          <img src={s.author?.avatar} alt="" />
          <strong>{s.author?.name}</strong>
          <span>@{s.author?.handle}</span>
        </div>
      </div>
    </dialog>
  );
}
