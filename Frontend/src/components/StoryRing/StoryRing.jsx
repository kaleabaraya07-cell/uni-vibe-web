import { Plus } from "lucide-react";
import { useAuth } from "../../context/useAuth";
import { mockStories } from "../../data/mockStories";
import { useMemo, useState } from "react";
import StoryViewer from "../StoryViewer/StoryViewer";
import "./StoryRing.css";

function StoryRing({ user, onProfileClick, compact = false }) {
  const { user: currentUser } = useAuth();
  const [activeIndex, setActiveIndex] = useState(null);
  const stories = useMemo(() => mockStories.filter((story) => story.user.id === user.id), [user.id]);
  const hasStory = stories.length > 0;

  const openStory = () => {
    if (!hasStory) return;
    setActiveIndex(0);
  };

  const closeStory = () => setActiveIndex(null);
  const nextStory = () => setActiveIndex((prev) => (prev === null ? 0 : prev + 1 >= stories.length ? 0 : prev + 1));
  const prevStory = () => setActiveIndex((prev) => (prev === null ? stories.length - 1 : prev - 1 < 0 ? stories.length - 1 : prev - 1));

  const isOwn = currentUser?.id === user.id;

  return (
    <>
      <div className={`story-ring ${compact ? "story-ring--compact" : ""}`}>
        <button type="button" className={`story-ring__avatar ${hasStory ? "story-ring__avatar--active" : ""}`} onClick={openStory}>
          <img src={user.avatar} alt={user.name} />
          {isOwn && <span className="story-ring__add"><Plus size={12} /></span>}
        </button>
        <button type="button" className="story-ring__label" onClick={onProfileClick}>{user.name.split(" ")[0]}</button>
      </div>
      {activeIndex !== null && (
        <StoryViewer
          key={`${user.id}-${activeIndex}`}
          stories={stories}
          activeIndex={activeIndex}
          onClose={closeStory}
          onNext={nextStory}
          onPrev={prevStory}
        />
      )}
    </>
  );
}

export default StoryRing;
