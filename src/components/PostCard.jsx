import { useEffect, useState } from "react";
import { getSavedCount } from "../lib/fakeApi";

const FALLBACK_IMG = "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=1600&auto=format&fit=crop";

export default function PostCard({ post, onOpen }) {
  const [savedCount, setSavedCount] = useState(0);
  const imgs = Array.isArray(post.images) && post.images.length ? post.images : [post.photo];

  useEffect(() => { setSavedCount(getSavedCount(post.id)); }, [post.id]);

  return (
    <article className="post">
      <header className="post-head" style={{ padding: 12 }}>
        <img src={post.author?.avatar} alt={post.author?.name} style={{ width:36, height:36, borderRadius:"50%", objectFit:"cover" }} />
        <div className="meta">
          <div className="name" style={{ fontWeight:800 }}>{post.author?.name}</div>
          <div className="handle" style={{ color:"#6b7280", fontSize:12 }}>@{post.author?.handle} • {post.time}</div>
        </div>
      </header>

      <div className="post-photo" style={{ position:"relative" }}>
        <img
          src={imgs[0]}
          alt={post.title}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onError={(e)=>{ e.currentTarget.src = FALLBACK_IMG; e.currentTarget.onerror=null; }}
          onClick={onOpen}
          style={{ width:"100%", display:"block", cursor:"pointer", objectFit:"cover", maxHeight:520 }}
        />
      </div>

      <div className="post-body" style={{ padding: 12 }}>
        <h3 style={{ margin:"4px 0 6px" }}>{post.title}</h3>

       
        <div style={{ fontSize:12, color:"#6b7280", display:"flex", gap:10, alignItems:"center" }}>
          <span>♥ {post.likes}</span>
          <span>💬 {post.comments ?? 0}</span>
          <span>🔖 {savedCount}</span>
        </div>

        {!!(post.tags?.length) && (
          <div style={{ display:"flex", gap:8, marginTop:8, flexWrap:"wrap" }}>
            {post.tags.map(t => <span key={t} className="tag">#{t}</span>)}
          </div>
        )}
      </div>
    </article>
  );
}
