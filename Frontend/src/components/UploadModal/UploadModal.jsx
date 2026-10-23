import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUpload } from "../../context/UploadContext";
import { useFeed } from "../../context/FeedContext";
import { useAuth } from "../../context/useAuth";
import { useLocale } from "../../context/LocaleContext";
import Modal from "../ui/Modal/Modal";
import Input from "../ui/Input/Input";
import Button from "../ui/Button/Button";
import { mockUniversities } from "../../data/mockUniversities";
import { currentUser } from "../../data/mockUsers";
import {
  Camera,
  Video,
  Sparkles,
  Megaphone,
  Building2,
  MessageSquareText,
  CheckCircle2,
  Image as ImageIcon,
  UploadCloud,
  Check,
  ShieldAlert,
  GraduationCap,
} from "lucide-react";
import "./UploadModal.css";

const categories = ["Sports", "Events", "Campus life", "Food", "Memes", "Startup ideas"];
const types = ["Photo", "Video", "Story", "Live Event", "Announcement", "Opportunity", "Club Post", "Question", "Poll"];

function UploadModal() {
  const { open, closeUpload } = useUpload();
  const { addVibe } = useFeed();
  const { user, switchAccount } = useAuth();
  const { t } = useLocale();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [caption, setCaption] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [mediaType, setMediaType] = useState("Photo");
  const [preview, setPreview] = useState("https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80");
  const [publishing, setPublishing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [selectedUniId, setSelectedUniId] = useState(user?.universityId || "uni1");

  const isVerifiedStudent = Boolean(user?.isStudent && (user?.verified || user?.verificationStatus === "verified"));

  const stepLabel = useMemo(() => {
    if (step === 1) return "Choose vibe type";
    if (step === 2) return "Preview & refine";
    if (step === 3) return "Share details";
    return "Publish";
  }, [step]);

  const handlePublish = () => {
    if (!caption.trim() || !user || !isVerifiedStudent) return;
    setPublishing(true);

    const selectedUni = mockUniversities.find((u) => u.id === selectedUniId) || mockUniversities[0];

    window.setTimeout(() => {
      addVibe({
        id: `v${Date.now()}`,
        type: mediaType === "Video" ? "video" : "image",
        user,
        media: preview,
        caption,
        music: "Original Audio",
        category,
        location: selectedUni.name,
        hashtags: ["#UVit", `#${selectedUni.shortName}`, "#CampusLife"],
        likes: 0,
        comments: 0,
        shares: 0,
        reposts: 0,
        saves: 0,
        views: 0,
        validViews: 0,
        season: "2026",
        universityId: selectedUni.id,
        clubId: null,
        eventId: null,
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
    setCaption("");
    setCategory(categories[0]);
    setMediaType("Photo");
    setPreview("https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80");
    setDragActive(false);
    closeUpload();
  };

  const handleFileSelection = (file) => {
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    setStep(2);
  };

  return (
    <Modal open={open} onClose={closeModal} title={t("upload.title") || "Create New Vibe"}>
      <div className="upload-modal">
        {/* Core Verification Gate Check */}
        {!isVerifiedStudent ? (
          <div className="upload-modal__verification-gate">
            <div className="verification-gate__badge">
              <ShieldAlert size={36} className="gate-icon" />
            </div>
            <h3 className="gate-title">Verified Student Account Required</h3>
            <p className="gate-message">
              Only verified university students can create and publish posts on Uni Vibe.
              This guarantees that all campus stories, events, and vibe points genuinely represent active student bodies.
            </p>
            {user?.isStudent && user?.verificationStatus === "pending" ? (
              <div className="gate-pending-box">
                <GraduationCap size={18} />
                <span>Your student ID verification is currently pending review by your university registrar.</span>
              </div>
            ) : null}
            <div className="gate-actions">
              <Button variant="secondary" onClick={closeModal}>
                Continue Browsing
              </Button>
              {switchAccount ? (
                <Button
                  variant="primary"
                  onClick={() => {
                    switchAccount(currentUser);
                  }}
                >
                  Switch to Verified Student Demo
                </Button>
              ) : null}
            </div>
          </div>
        ) : (
          <>
            <div className="upload-modal__step">Step {step} • {stepLabel}</div>
            {step === 1 && (
              <>
                <div className="upload-modal__grid">
                  {types.map((type) => (
                    <button
                      key={type}
                      type="button"
                      className={`upload-modal__chip ${mediaType === type ? "active" : ""}`}
                      onClick={() => setMediaType(type)}
                    >
                      {type === "Photo" ? <Camera size={16} /> : type === "Video" ? <Video size={16} /> : type === "Story" ? <Sparkles size={16} /> : type === "Announcement" || type === "Opportunity" ? <Megaphone size={16} /> : type === "Club Post" ? <Building2 size={16} /> : <MessageSquareText size={16} />}
                      {type}
                    </button>
                  ))}
                </div>
                <label
                  className={`upload-modal__dropzone ${dragActive ? "active" : ""}`}
                  onDragOver={(event) => { event.preventDefault(); setDragActive(true); }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={(event) => { event.preventDefault(); setDragActive(false); handleFileSelection(event.dataTransfer.files?.[0]); }}
                >
                  <input type="file" accept="image/*,video/*" onChange={(event) => handleFileSelection(event.target.files?.[0])} />
                  <UploadCloud size={20} />
                  <span>Drag & drop or click to choose a photo or video</span>
                </label>
                <div className="upload-modal__options">
                  <button type="button" className="upload-modal__option" onClick={() => setStep(2)}><ImageIcon size={16} /> Photo</button>
                  <button type="button" className="upload-modal__option" onClick={() => setStep(2)}><Video size={16} /> Video</button>
                  <button type="button" className="upload-modal__option" onClick={() => setStep(2)}><Camera size={16} /> Camera</button>
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
                <div className="upload-modal__detail-list">
                  <span className="upload-modal__detail-pill"><Check size={14} /> Caption</span>
                  <span className="upload-modal__detail-pill"><Check size={14} /> Hashtags</span>
                  <span className="upload-modal__detail-pill"><Check size={14} /> University</span>
                </div>
                <Button variant="secondary" className="upload-modal__publish" onClick={() => setStep(3)}>Continue to details</Button>
              </>
            )}

            {step === 3 && (
              <>
                <Input label={t("upload.caption") || "Caption"} value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="What’s the vibe?" />
                <label className="upload-modal__label">Hashtags</label>
                <input className="upload-modal__select" placeholder="#CampusLife #EPSU #UVit" />
                <label className="upload-modal__label">Representing University</label>
                <select
                  className="upload-modal__select"
                  value={selectedUniId}
                  onChange={(e) => setSelectedUniId(e.target.value)}
                >
                  {mockUniversities.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.shortName})
                    </option>
                  ))}
                </select>
                <label className="upload-modal__label">{t("upload.category") || "Category"}</label>
                <select className="upload-modal__select" value={category} onChange={(e) => setCategory(e.target.value)}>
                  {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <div className="upload-modal__toggles">
                  <label><input type="checkbox" defaultChecked /> Public</label>
                  <label><input type="checkbox" defaultChecked /> Allow remix</label>
                  <label><input type="checkbox" defaultChecked /> Qualify for Season 2026 PT</label>
                </div>
                <Button variant="primary" className="upload-modal__publish" onClick={handlePublish} disabled={publishing || !caption.trim()}>
                  {publishing ? "Publishing..." : (t("upload.publish") || "Publish Vibe")}
                </Button>
              </>
            )}

            {step === 4 && (
              <div className="upload-modal__success">
                <CheckCircle2 size={48} className="upload-modal__success-icon" />
                <h3>Your vibe is live!</h3>
                <p>Your post is now on the feed and earning PT for your university in Season 2026.</p>
              </div>
            )}
          </>
        )}
      </div>
    </Modal>
  );
}

export default UploadModal;
