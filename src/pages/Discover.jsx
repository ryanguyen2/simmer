import { useEffect, useMemo, useState } from "react";
import "./discover.css";
import TopNav from "../components/TopNav.jsx";
import UserCard from "../components/UserCard.jsx";
import { searchUsers, toggleFollow, isFollowing, getCurrentUserId } from "../lib/fakeApi.js";

export default function Discover() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const me = useMemo(() => getCurrentUserId(), []);

  useEffect(() => {
    let active = true;
    setLoading(true);
    const run = async () => {
      const r = await searchUsers(query);
      if (!active) return;
      // annotate follow state
      const withFollow = await Promise.all(
        r.map(async u => ({
          ...u,
          following: await isFollowing({ followerId: me, followeeId: u.id })
        }))
      );
      setResults(withFollow);
      setLoading(false);
    };
    const t = setTimeout(run, 250); // debounce
    return () => { active = false; clearTimeout(t); };
  }, [query, me]);

  const onToggleFollow = async (uid) => {
    const following = await toggleFollow({ followerId: me, followeeId: uid });
    setResults(prev => prev.map(u => u.id === uid ? { ...u, following } : u));
  };

  return (
    <div className="discover-page">
      <TopNav />

      <main className="discover-shell">
        <header className="discover-head">
          <h1>Discover cooks</h1>
          <input
            className="search"
            placeholder="Search by name or @handle"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </header>

        {loading ? (
          <div className="grid">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonUser key={i} />)}
          </div>
        ) : (
          <div className="grid">
            {results.map(u => (
              <UserCard key={u.id} user={u} onToggleFollow={() => onToggleFollow(u.id)} />
            ))}
            {results.length === 0 && (
              <div className="empty">No users found.</div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

function SkeletonUser() {
  return (
    <div className="ucard">
      <div className="avatar sk" />
      <div className="name sk" />
      <div className="handle sk" />
      <div className="bio sk" />
      <div className="btn sk" />
    </div>
  );
}
