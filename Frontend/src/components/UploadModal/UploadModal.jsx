import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUpload } from "../../context/UploadContext";
import { useFeed } from "../../context/FeedContext";
import { useAuth } from "../../context/AuthContext";
import { useLocale } from "../../context/LocaleContext";
import Modal from "../ui/Modal/Modal";
import Input from "../ui/Input/Input";
import Button from "../ui/Button/Button";
import "./UploadModal.css";

const categories = ["Sports", "Events", "Campus life", "Food", "Memes", "Startup ideas"];

function UploadModal() {
  const { open, closeUpload } = useUpload();
  const { addVibe } = useFeed();
  const { user } = useAuth();
  const { t } = useLocale();
  const navigate = useNavigate();
  const [caption, setCaption] = useState("");
  const [category, setCategory] = useState(categories[0]);

  const handlePublish = () => {
    if (!caption.trim() || !user) return;
    addVibe({
      id: `v${Date.now()}`,
      type: "image",
      user,
      media: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80",
      caption,
      music: "Original Audio",
      category,
      location: user.university,
      hashtags: ["#UVit"],
      likes: 0, comments: 0, shares: 0, saves: 0, views: 0,
      universityId: user.universityId,
      clubId: null, eventId: null,
    });
    setCaption("");
    closeUpload();
    navigate("/feed");
  };

  return (
    <Modal open={open} onClose={closeUpload} title={t("upload.title")}>
      <div className="upload-modal">
        <div className="upload-modal__preview">
          <span>📷 Media picker (mock)</span>
        </div>
        <Input label={t("upload.caption")} value={caption} onChange={(e) => setCaption(e.target.value)} />
        <label className="upload-modal__label">{t("upload.category")}</label>
        <select className="upload-modal__select" value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <Button variant="primary" className="upload-modal__publish" onClick={handlePublish}>
          {t("upload.publish")}
        </Button>
      </div>
    </Modal>
  );
}

export default UploadModal;
