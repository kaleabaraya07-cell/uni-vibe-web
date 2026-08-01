import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUpload } from "../../context/UploadContext";
import { useFeed } from "../../context/FeedContext";
import { useAuth } from "../../context/useAuth";
import { useLocale } from "../../context/LocaleContext";
import Modal from "../ui/Modal/Modal";
import Input from "../ui/Input/Input";
import Button from "../ui/Button/Button";
import { Camera, Video, Sparkles, Megaphone, Building2, MessageSquareText, CheckCircle2 } from "lucide-react";
import "./UploadModal.css";

const categories = ["Sports", "Events", "Campus life", "Food", "Memes", "Startup ideas"];
const types = ["Photo", "Video", "Story", "Live Event", "Announcement", "Opportunity", "Club Post", "Question", "Poll"];

function UploadModal() {
  const { open, closeUpload } = useUpload();
  const { addVibe } = useFeed();
  const { user } = useAuth();
  const { t } = useLocale();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [caption, setCaption] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [mediaType, setMediaType] = useState("Photo");
  const [preview] = useState("https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80");
  const [publishing, setPublishing] = useState(false);

  const stepLabel = useMemo(() => {
    if (step === 1) return "Choose vibe type";
    if (step === 2) return "Preview & refine";
    if (step === 3) return "Share details";
    return "Publish";
  }, [step]);

  const handlePublish = () => {
    if (!caption.trim() || !user) return;
    setPublishing(true);
    window.setTimeout(() => {
      addVibe({
        id: `v${Date.now()}`,
        type: mediaType === "Video" ? "video" : "image",
        user,
        media: preview,
        caption,
        music: "Original Audio",
        category,
        location: user.university,
        hashtags: ["#UVit", "#CampusLife"],
        likes: 0, comments: 0, shares: 0, saves: 0, views: 0,
        universityId: user.universityId,
        clubId: null, eventId: null,
      });
      setCaption("");
      setStep(4);
      setPublishing(false);
      window.setTimeout(() => {
        closeUpload();
        navigate("/feed");
      }, 900);
    }, 800);
  };

  const closeModal = () => {
    setStep(1);
    closeUpload();
  };

  return (
    <Modal open={open} onClose={closeModal} title={t("upload.title")}>
      <div className="upload-modal">
        <div className="upload-modal__step">Step {step} • {stepLabel}</div>
        {step === 1 && (
          <>
            <div className="upload-modal__grid">
              {types.map((type) => (
                <button key={type} type="button" className={`upload-modal__chip ${mediaType === type ? "active" : ""}`} onClick={() => setMediaType(type)}>
                  {type === "Photo" ? <Camera size={16} /> : type === "Video" ? <Video size={16} /> : type === "Story" ? <Sparkles size={16} /> : type === "Announcement" || type === "Opportunity" ? <Megaphone size={16} /> : type === "Club Post" ? <Building2 size={16} /> : <MessageSquareText size={16} />}
                  {type}
                </button>
              ))}
            </div>
            <Button variant="primary" className="upload-modal__publish" onClick={() => setStep(2)}>Continue to preview</Button>
          </>
        )}

        {step === 2 && (
          <>
            <div className="upload-modal__preview">
              <img src={preview} alt="preview" className="upload-modal__preview-image" />
              <div className="upload-modal__preview-overlay">
                <strong>{mediaType}</strong>
                <span>Tap through to preview your vibe</span>
              </div>
            </div>
            <Button variant="secondary" className="upload-modal__publish" onClick={() => setStep(3)}>Continue to details</Button>
          </>
        )}

        {step === 3 && (
          <>
            <Input label={t("upload.caption")} value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="What’s the vibe?" />
            <label className="upload-modal__label">{t("upload.category")}</label>
            <select className="upload-modal__select" value={category} onChange={(e) => setCategory(e.target.value)}>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <div className="upload-modal__toggles">
              <label><input type="checkbox" defaultChecked /> Public</label>
              <label><input type="checkbox" defaultChecked /> Allow remix</label>
            </div>
            <Button variant="primary" className="upload-modal__publish" onClick={handlePublish} disabled={publishing || !caption.trim()}>
              {publishing ? "Publishing..." : t("upload.publish")}
            </Button>
          </>
        )}

        {step === 4 && (
          <div className="upload-modal__success">
            <CheckCircle2 size={48} className="upload-modal__success-icon" />
            <h3>Your vibe is live</h3>
            <p>Your post is now on the feed and ready for your campus community.</p>
          </div>
        )}
      </div>
    </Modal>
  );
}

export default UploadModal;
