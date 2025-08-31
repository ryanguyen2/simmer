import { useEffect, useState } from "react";
import "./profiles.css";
import TopNav from "../components/TopNav.jsx";
import PostCard from "../components/PostCard.jsx";
import PostModal from "../components/PostModal.jsx";
import { useParams } from "react-router-dom";
import { getUserByHandle } from "../lib/fakeApi.js";

export default function Profile() {
  const { handle } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const refresh = async () => {
    setLoading(true);
    const res = await getUserByHandle(handle);
    setUser(res?.user || null);
    setPosts(res?.posts || []);
    setLoading(false);
  };

  useEffect(() => { refresh(); }, [handle]);

  if (loading) {
    return (
      <div className="profile-page">
        <TopNav />
        <main className="profile-shell">
          <div className="ph sk" />
          <div className="tabs sk" />
          <div className="grid">
            {Array.from({ length: 3 }).map((_, i) => <div key={i} className="box sk" />)}
          </div>
        </main>
      </div>
    );
  }
  if (!user) {
    return (
      <div className="profile-page">
        <TopNav />
        <main className="profile-shell">
          <div className="empty">User not found.</div>
        </main>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <TopNav />
      <main className="profile-shell">
        <header className="pheader">
          <img className="avatar" src={user.avatar} alt={user.name} />
          <div className="info">
            <div className="row">
              <h1>{user.name}</h1>
            </div>
            <div className="handle">@{user.handle}</div>
            <p className="bio">{user.bio ?? "Home cook."}</p>
          </div>
        </header>

        <nav className="tabs">
          <button className="active">Posts</button>
        </nav>

        <section className="post-grid">
          {posts.length === 0 ? (
            <div className="empty">No posts yet.</div>
          ) : posts.map(p => (
            <PostCard key={p.id} post={{...p}} onOpen={() => setSelected(p)} />
          ))}
        </section>
      </main>

      <PostModal post={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
