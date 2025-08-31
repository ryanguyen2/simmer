import { useEffect, useState } from "react";
import { getStories, getCurrentUserId, getUserById } from "../lib/fakeApi";
import StoryViewer from "./StoryViewer";
import CreateStoryModal from "./CreateStoryModal";

export default function StoryRail() {
  const [stories, setStories] = useState([]);
  const [openAt, setOpenAt] = useState(-1);
  const [creating, setCreating] = useState(false);

  const meId = getCurrentUserId();
  const me = getUserById(meId);

  const refresh = async () => setStories(await getStories());
  useEffect(() => { refresh(); }, []);

  return (
    <>
      <div className="story-rail">
        
        <button className="story add" onClick={() => setCreating(true)} title="Add story">
          <div className="ring">
            {me?.avatar ? (
              <img className="avatar" src={me.avatar} alt={me.name} />
            ) : (
              <div className="avatar" />
            )}
            <span className="plus">+</span>
          </div>
          <span>Your story</span>
        </button>

        {stories.length === 0 ? (
          <div className="story placeholder" style={{ opacity:.6 }}>
            <div className="ring"><div className="empty" /></div>
            <span>No stories yet</span>
          </div>
        ) : stories.map((s, i) => (
          <button className="story" key={s.id} onClick={() => setOpenAt(i)}>
            <div className="ring"><img src={s.author.avatar} alt={s.author.name} /></div>
            <span>{s.author.name.split(" ")[0]}</span>
          </button>
        ))}
      </div>

      {openAt >= 0 && (
        <StoryViewer
          stories={stories}
          startIndex={openAt}
          onClose={() => setOpenAt(-1)}
        />
      )}

      <CreateStoryModal
        open={creating}
        onClose={async (changed) => {
          setCreating(false);
          if (changed) await refresh();
        }}
        userId={meId}
      />
    </>
  );
}
