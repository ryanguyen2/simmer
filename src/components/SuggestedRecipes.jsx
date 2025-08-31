import { useEffect, useState } from "react";
import { getRecommendedRecipes, getPostById } from "../lib/fakeApi";

export default function SuggestedRecipes({ onOpenPost }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    (async () => setItems(await getRecommendedRecipes()))();
  }, []);

  const open = async (postId) => {
    const post = await getPostById(postId);
    if (post && onOpenPost) onOpenPost(post);
  };

  return (
    <div className="side-card">
      <h4 className="side-title">Suggested recipes</h4>
      <div className="suggested">
        {items.map((r) => (
          <button key={r.id} className="rec" onClick={() => open(r.postId)}>
            <img src={r.image} alt={r.title} />
            <div className="t">{r.title}</div>
          </button>
        ))}
      </div>

      
      <style>{`
        .suggested { display: grid; gap: 10px; }
        .rec {
          display: grid;
          grid-template-columns: 64px 1fr;
          gap: 10px;
          align-items: center;
          background: none;
          border: 0;
          padding: 0;
          cursor: pointer;
          text-align: left;
        }
        .rec img {
          width: 64px;
          height: 48px;
          border-radius: 10px;
          object-fit: cover;
          border: 1px solid #ece6df;
        }
        .rec .t {
          font-weight: 700;
          font-size: 13px;
        }
        .rec:hover .t { text-decoration: underline; }
      `}</style>
    </div>
  );
}
