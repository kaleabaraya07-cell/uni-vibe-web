import { useEffect, useMemo, useState } from "react";
import { Plus, Sparkles, Camera, Clock3 } from "lucide-react";
import Modal from "../ui/Modal/Modal";
import Input from "../ui/Input/Input";
import Button from "../ui/Button/Button";
import StoryViewer from "../StoryViewer/StoryViewer";
import { mockStories } from "../../data/mockStories";
import { useAuth } from "../../context/useAuth";
import "./Stories.css";

function Stories() {
  const { user } = useAuth();
  const [stories, setStories] = useState(mockStories);
  const [activeIndex, setActiveIndex] = useState(null);
  const [composerOpen, setComposerOpen] = useState(false);
  const [draftText, setDraftText] = useState("");
  const [draftType, setDraftType] = useState("image");
  const [preview, setPreview] = useState("");
  const [publishing, setPublishing] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const orderedStories = useMemo(() => {
    const currentUserStory = stories.find((story) => story.user.id === user?.id);
    const others = stories.filter((story) => story.user.id !== user?.id);
    return currentUserStory ? [currentUserStory, ...others] : stories;
  }, [stories, user]);

  const openStory = (index) => setActiveIndex(index);
  const closeStory = () => setActiveIndex(null);
  const nextStory = () => {
    setActiveIndex((prev) => (prev === null ? 0 : prev + 1 >= orderedStories.length ? 0 : prev + 1));
  };
  const prevStory = () => {
    setActiveIndex((prev) => (prev === null ? orderedStories.length - 1 : prev - 1 < 0 ? orderedStories.length - 1 : prev - 1));
  };

  const handlePreview = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
  };

  const handlePublishStory = () => {
    if (!draftText.trim()) return;
    setPublishing(true);
    window.setTimeout(() => {
      const newStory = {
        id: `s${Date.now()}`,
        user,
        type: draftType,
        media: preview || "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=900&q=80",
        text: draftText,
        expiresAt: Date.now() + 1000 * 60 * 60 * 12,
        viewed: false,
      };
      setStories((prev) => [newStory, ...prev]);
      setDraftText("");
      setPreview("");
      setPublishing(false);
      setComposerOpen(false);
      setActiveIndex(0);
    }, 900);
  };

  return (
    <section className="stories-shell">
      <div className="stories-shell__header">
        <div>
          <p className="stories-shell__eyebrow">Stories</p>
          <h3>Campus moments in motion</h3>
        </div>
        <button type="button" className="stories-shell__add" onClick={() => setComposerOpen(true)}>
          <Plus size={16} />
        </button>
      </div>

      <div className="stories-list">
        <button type="button" className="story-pill story-pill--add" onClick={() => setComposerOpen(true)}>
          <div className="story-pill__avatar story-pill__avatar--add">
            <Plus size={18} />
          </div>
          <span>Add story</span>
        </button>

        {orderedStories.map((story, index) => {
          const expired = story.expiresAt < now;
          return (
            <button key={story.id} type="button" className="story-pill" onClick={() => openStory(index)}>
              <div className={`story-pill__avatar ${story.viewed ? "" : "story-pill__avatar--unread"}`}>
                <img src={story.user.avatar} alt={story.user.name} />
              </div>
              <span>{story.user.name.split(" ")[0]}</span>
              {expired && <small className="story-pill__badge"><Clock3 size={12} /></small>}
            </button>
          );
        })}
      </div>

      {activeIndex !== null && (
        <StoryViewer
          key={orderedStories[activeIndex]?.id ?? "story-viewer"}
          stories={orderedStories}
          activeIndex={activeIndex}
          onClose={closeStory}
          onNext={nextStory}
          onPrev={prevStory}
        />
      )}

      <Modal open={composerOpen} onClose={() => setComposerOpen(false)} title="Create a story">
        <div className="story-composer">
          <div className="story-composer__type-row">
            {['image', 'video', 'text'].map((type) => (
              <button
                key={type}
                type="button"
                className={`story-composer__type ${draftType === type ? "active" : ""}`}
                onClick={() => setDraftType(type)}
              >
                {type === 'image' ? <Camera size={14} /> : type === 'video' ? <Sparkles size={14} /> : <Sparkles size={14} />}
                {type}
              </button>
            ))}
          </div>

          <label className="story-composer__dropzone">
            <input type="file" accept="image/*,video/*" onChange={handlePreview} />
            {preview ? <img src={preview} alt="preview" className="story-composer__preview" /> : <span>Drop a photo or video to preview</span>}
          </label>

          <Input label="Caption" value={draftText} onChange={(e) => setDraftText(e.target.value)} placeholder="Share what’s happening" />
          <Button variant="primary" onClick={handlePublishStory} disabled={publishing || !draftText.trim()}>
            {publishing ? "Publishing…" : "Publish story"}
          </Button>
        </div>
      </Modal>
    </section>
  );
}

export default Stories;
