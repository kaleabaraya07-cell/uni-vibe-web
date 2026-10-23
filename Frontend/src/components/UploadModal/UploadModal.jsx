import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUpload } from "../../context/UploadContext";
import { useFeed } from "../../context/FeedContext";
import { useAuth } from "../../context/useAuth";
import { useLocale } from "../../context/LocaleContext";
import Modal from "../ui/Modal/Modal";
import Input from "../ui/Input/Input";
import Button from "../ui/Button/Button";
import universityService from "../../services/universityService";
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
  const { user } = useAuth();
  const { t } = useLocale();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [caption, setCaption] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [hashtags, setHashtags] = useState("");
  const [mediaType, setMediaType] = useState("Photo");
  const [preview, setPreview] = useState("");
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaError, setMediaError] = useState("");
  const [publishError, setPublishError] = useState("");
  const [universities, setUniversities] = useState([]);
  const [publishing, setPublishing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const previewObjectUrl = useRef(null);
  const publishTimer = useRef(null);

  const isVerifiedStudent = Boolean(user?.isStudent && (user?.verified || user?.verificationStatus === "verified"));

  useEffect(() => {
    let active = true;
    universityService.getUniversities()
      .then((items) => {
        if (active) setUniversities(items);
      })
      .catch((error) => {
        if (active) setPublishError(error.message || "Unable to load the university directory.");
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(
    () => () => {
      if (previewObjectUrl.current) URL.revokeObjectURL(previewObjectUrl.current);
      if (publishTimer.current) window.clearTimeout(publishTimer.current);
    },
    []
  );

  const stepLabel = useMemo(() => {
    if (step === 1) return "Choose vibe type";
    if (step === 2) return "Preview & refine";
    if (step === 3) return "Share details";
    return "Publish";
  }, [step]);

  const handlePublish = async () => {
    if (!caption.trim() || !user || !isVerifiedStudent) return;
    if (!previewObjectUrl.current) {
      setMediaError(mediaType === "Video"
        ? "Choose a video file before publishing a video post."
        : "Choose a photo or video file before publishing.");
      return;
    }
    setPublishing(true);
    setPublishError("");
    try {
      await addVibe({ caption: caption.trim(), file: mediaFile, category, hashtags });
      setCaption("");
      setStep(4);
      setPublishing(false);
      publishTimer.current = window.setTimeout(() => {
        publishTimer.current = null;
        closeModal();
        navigate("/feed");
      }, 900);
    } catch (error) {
      setPublishError(error.message || "Unable to publish this vibe.");
      setPublishing(false);
    }
  };

  const closeModal = () => {
    if (publishTimer.current) {
      window.clearTimeout(publishTimer.current);
      publishTimer.current = null;
    }
    setPublishing(false);
    if (previewObjectUrl.current) {
      URL.revokeObjectURL(previewObjectUrl.current);
      previewObjectUrl.current = null;
    }
    setStep(1);
    setCaption("");
    setMediaFile(null);
    setCategory(categories[0]);
    setHashtags("");
    setMediaType("Photo");
    setPreview("");
    setMediaError("");
    setPublishError("");
    setDragActive(false);
    closeUpload();
  };

  const handleFileSelection = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
      setMediaError("Choose an image or video file.");
      return;
    }
    if (previewObjectUrl.current) URL.revokeObjectURL(previewObjectUrl.current);
    const objectUrl = URL.createObjectURL(file);
    previewObjectUrl.current = objectUrl;
    setPreview(objectUrl);
    setMediaFile(file);
    setMediaType(file.type.startsWith("video/") ? "Video" : "Photo");
    setMediaError("");
    setStep(2);
  };

  return (
    <Modal open={open} onClose={closeModal} title={t("upload.title") || "Create New Vibe"}>
      <div className="upload-modal">
        {mediaError && <p className="upload-modal__error" role="alert">{mediaError}</p>}
        {publishError && <p className="upload-modal__error" role="alert">{publishError}</p>}
        {/* Core Verification Gate Check */}
        {!isVerifiedStudent ? (
          <div className="upload-modal__verification-gate">
            <div className="verification-gate__badge">
              <ShieldAlert size={36} className="gate-icon" />
            </div>
            <h3 className="gate-title">
              {user ? "Verified Student Account Required" : "Log in to create a post"}
            </h3>
            <p className="gate-message">
              {user
                ? "Only verified university students can create and publish posts on Uni Vibe. This helps ensure campus posts represent active student communities."
                : "Sign in with a verified student account to share campus posts."}
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
              {!user && (
                <Button
                  variant="primary"
                  onClick={() => {
                    closeModal();
                    navigate("/login");
                  }}
                >
                  Log in
                </Button>
              )}
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
                <Button variant="primary" className="upload-modal__publish" onClick={() => setStep(2)} disabled={!preview}>Continue to preview</Button>
              </>
            )}

            {step === 2 && (
              <>
                <div className="upload-modal__preview">
                  {mediaType === "Video" && preview ? (
                    <video src={preview} controls playsInline className="upload-modal__preview-image" />
                  ) : preview ? (
                    <img src={preview} alt="preview" className="upload-modal__preview-image" />
                  ) : (
                    <div className="upload-modal__preview-placeholder">Choose a media file to preview it here.</div>
                  )}
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
                <input
                  className="upload-modal__select"
                  value={hashtags}
                  onChange={(e) => setHashtags(e.target.value)}
                  placeholder="#CampusLife #EPSU #UVit"
                />
                <label className="upload-modal__label">Representing University</label>
                <p>{universities.find((item) => item.id === user.universityId)?.name || user.universityId}</p>
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
