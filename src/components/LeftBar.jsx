export default function LeftBar({ onCreate }) {
  return (
    <aside className="leftbar">
      <button className="primary" onClick={onCreate}>＋ Create Post</button>

      <div className="section">
        <div className="title">Feed</div>
        <ul>
          <li><a href="/feed#latest">Latest</a></li>
          <li><a href="/feed#saved">Saved</a></li>
        </ul>
      </div>

      <div className="section">
        <div className="title">Explore</div>
        <ul>
          <li><a href="/discover">Discover</a></li>
        </ul>
      </div>

      <style>{`
        .leftbar { position: sticky; top: 88px; height: max-content; display: grid; gap: 14px; }
        .primary {
          height: 42px; border-radius: 12px; font-weight: 800; cursor: pointer;
          border: 0; color: #fff;
          background: linear-gradient(90deg,#ef4444,#f97316 55%,#f59e0b);
        }
        .section { background:#fff; border:1px solid #ece6df; border-radius:16px; padding:12px; }
        .title { font-weight:800; font-size:14px; margin-bottom:8px;
          background:linear-gradient(90deg,#ef4444,#f97316 55%,#f59e0b);
          -webkit-background-clip:text; background-clip:text; color:transparent;
        }
        ul { list-style:none; margin:0; padding:0; display:grid; gap:8px; }
        a { color:#0e1020; text-decoration:none; }
        a:hover { text-decoration:underline; }
      `}</style>
    </aside>
  );
}
