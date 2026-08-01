import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Pause, Play, X, Clock3, Camera, Sparkles } from "lucide-react";
import "./StoryViewer.css";

function StoryViewer({ stories, activeIndex, onClose, onNext, onPrev }) {
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const story = stories[activeIndex];
  const showSwitch = stories.length > 1;

  useEffect(() => {
    if (!story || paused) return undefined;

    const start = Date.now();
    const frame = window.setInterval(() => {
      const elapsed = Date.now() - start;
      const nextProgress = Math.min(100, (elapsed / 4200) * 100);
      setProgress((current) => {
        if (nextProgress >= 100) {
          onNext();
          return 100;
        }
        return current < nextProgress ? nextProgress : current;
      });
    }, 50);

    return () => window.clearInterval(frame);
  }, [story, paused, onNext]);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const isExpired = useMemo(() => {
    if (!story?.expiresAt) return false;
    return story.expiresAt < now;
  }, [now, story?.expiresAt]);

  if (!story) return null;

  return (
    <div className="story-viewer" role="dialog" aria-modal="true">
      <div className="story-viewer__backdrop" onClick={onClose} />
      <div className="story-viewer__card">
        <div className="story-viewer__header">
          <div className="story-viewer__user">
            <img src={story.user.avatar} alt={story.user.name} />
            <div>
              <strong>{story.user.name}</strong>
              <p>{story.user.university}</p>
            </div>
          </div>
          <div className="story-viewer__actions">
            <span className="story-viewer__badge">
              <Clock3 size={14} /> {isExpired ? "Expired" : "Fresh"}
            </span>
            <button type="button" className="story-viewer__icon" onClick={onClose}>
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="story-viewer__progress">
          {stories.map((item, index) => (
            <span
              key={item.id}
              className={`story-viewer__progress-bar ${index <= activeIndex ? "active" : ""}`}
              style={{ width: `${index === activeIndex ? progress : index < activeIndex ? 100 : 0}%` }}
            />
          ))}
        </div>

        <div className="story-viewer__content">
          {showSwitch && (
            <button type="button" className="story-viewer__nav story-viewer__nav--left" onClick={onPrev}>
              <ChevronLeft size={20} />
            </button>
          )}

          <div className="story-viewer__media-shell" onClick={() => setPaused((prev) => !prev)}>
            {story.type === "video" && story.media ? (
              <video src={story.media} className="story-viewer__media" autoPlay muted loop playsInline />
            ) : story.type === "image" && story.media ? (
              <img src={story.media} alt={story.text} className="story-viewer__media" />
            ) : (
              <div className="story-viewer__text-card">{story.text}</div>
            )}
            <div className="story-viewer__footer">
              <p>{story.text}</p>
              <button type="button" className="story-viewer__icon story-viewer__icon--small">
                {paused ? <Play size={16} /> : <Pause size={16} />}
              </button>
            </div>
          </div>

          {showSwitch && (
            <button type="button" className="story-viewer__nav story-viewer__nav--right" onClick={onNext}>
              <ChevronRight size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default StoryViewer;
