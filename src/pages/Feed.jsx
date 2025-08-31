import { useEffect, useState } from "react";
import "./feed.css";
import TopNav from "../components/TopNav.jsx";
import StoryRail from "../components/StoryRail.jsx";
import PostCard from "../components/PostCard.jsx";
import SuggestedRecipes from "../components/SuggestedRecipes.jsx";
import PostModal from "../components/PostModal.jsx";
import LeftBar from "../components/LeftBar.jsx";
import CreatePostModal from "../components/CreatePostModal.jsx";
import { getFeed, getSavedPosts } from "../lib/fakeApi.js";

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selected, setSelected] = useState(null);
  const [creating, setCreating] = useState(false);
  const [mode, setMode] = useState(getModeFromHash());

  function getModeFromHash(){ return (location.hash.replace("#","") || "latest"); }

  useEffect(() => {
    const onHash = () => setMode(getModeFromHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => { (async () => {
    setLoading(true);
    if (mode === "saved") {
      const items = await getSavedPosts("u1");
      setPosts(items); setCursor(null); setLoading(false);
    } else {
      const { items, nextCursor } = await getFeed({ limit: 6 });
      setPosts(items); setCursor(nextCursor); setLoading(false);
    }
  })(); }, [mode]);

  const loadMore = async () => {
    if (!cursor || mode === "saved") return;
    try {
      setLoadingMore(true);
      const { items, nextCursor } = await getFeed({ cursor, limit: 6 });
      setPosts((prev) => [...prev, ...items]);
      setCursor(nextCursor);
    } finally { setLoadingMore(false); }
  };

  const removePost = (id) => setPosts(prev => prev.filter(p => p.id !== id));

  return (
    <div className="feed-page">
      <TopNav />

      <main className="feed-shell three">
        <aside className="feed-left">
          <LeftBar onCreate={() => setCreating(true)} />
        </aside>

        <section className="feed-main">
          <StoryRail />

          <div className="post-list">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => <SkeletonPost key={i} />)
            ) : posts.length === 0 ? (
              <div className="side-card" style={{ textAlign:"center", color:"#6b7280" }}>
                {mode === "saved" ? "No saved recipes yet." : "No posts yet."}
              </div>
            ) : (
              posts.map((p) => (
                <PostCard key={p.id} post={{...p, onDeleted: removePost}} onOpen={() => setSelected(p)} />
              ))
            )}
          </div>

          {mode !== "saved" && (
            <div style={{ display: "flex", justifyContent: "center", marginTop: 14 }}>
              <button className="save-btn" disabled={!cursor || loadingMore} onClick={loadMore} style={{ minWidth: 140 }}>
                {loadingMore ? "Loading…" : cursor ? "Load more" : "No more posts"}
              </button>
            </div>
          )}
        </section>

        <aside className="feed-aside">
          <SuggestedRecipes onOpenPost={(p)=> setSelected(p)} />
        </aside>
      </main>

      <PostModal post={selected} onClose={() => setSelected(null)} />
      <CreatePostModal
        open={creating}
        onClose={() => setCreating(false)}
        onCreated={(post) => setPosts(prev => [post, ...prev])}
      />
    </div>
  );
}

function SkeletonPost() {
  return (
    <article className="post">
      <header className="post-head">
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#f1f1f1" }}/>
        <div className="meta">
          <div style={{ width: 120, height: 10, background: "#f1f1f1", borderRadius: 6, marginBottom: 6 }} />
          <div style={{ width: 80, height: 8, background: "#f1f1f1", borderRadius: 6 }} />
        </div>
      </header>
      <div className="post-photo" style={{ background: "#f1f1f1", height: 420 }} />
      <div className="post-body">
        <div style={{ width: 200, height: 12, background: "#f1f1f1", borderRadius: 6 }} />
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <div style={{ width: 60, height: 10, background: "#f1f1f1", borderRadius: 999 }} />
          <div style={{ width: 50, height: 10, background: "#f1f1f1", borderRadius: 999 }} />
        </div>
        <div className="post-actions" style={{ marginTop: 10 }}>
          <div className="left">
            <div style={{ width: 40, height: 10, background: "#f1f1f1", borderRadius: 6 }} />
            <div style={{ width: 40, height: 10, background: "#f1f1f1", borderRadius: 6 }} />
          </div>
          <div style={{ width: 60, height: 26, background: "#f1f1f1", borderRadius: 999 }} />
        </div>
      </div>
    </article>
  );
}
