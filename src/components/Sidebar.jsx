export default function Sidebar() {
  return (
    <div className="side-card">
      <h4 className="side-title">Suggested cooks</h4>
      <ul className="suggestions">
        {[
          { name: "Kai", tag: "@knife_kai" },
          { name: "Priya", tag: "@currywithpriya" },
          { name: "Theo", tag: "@smokeNTender" },
        ].map((p) => (
          <li key={p.tag} className="row">
            <div className="txt">
              <strong>{p.name}</strong>
              <span>{p.tag}</span>
            </div>
            <button className="follow">Follow</button>
          </li>
        ))}
      </ul>

      <style>{`
        .suggestions { list-style:none; margin:0; padding:0; display:flex; flex-direction:column; gap:10px; }
        .row { display:flex; align-items:center; justify-content:space-between; }
        .txt { display:flex; flex-direction:column; line-height:1.1; }
        .txt span { color:#6b7280; font-size:12px; }
        .follow {
          border:1px solid #ece6df; background:#fff; border-radius:999px; height:32px; padding:0 12px;
          cursor:pointer; font-weight:700;
        }
        .follow:hover { background:#fff7ed; }
      `}</style>
    </div>
  );
}
