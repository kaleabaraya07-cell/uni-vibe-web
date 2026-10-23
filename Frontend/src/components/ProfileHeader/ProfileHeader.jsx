import { useState } from "react";
import { BadgeCheck, GraduationCap, Compass, Share2, Edit3, Check } from "lucide-react";
import { useLocale } from "../../context/LocaleContext";
import { useAuth } from "../../context/useAuth";
import Button from "../ui/Button/Button";
import "./ProfileHeader.css";

function ProfileHeader({ user, following, onFollow, onEditProfile }) {
  const { t } = useLocale();
  const { user: currentUser } = useAuth();
  const [copied, setCopied] = useState(false);
  const [shareError, setShareError] = useState("");

  const isOwnProfile = currentUser?.id === user?.id;

  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setShareError("");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setShareError("Unable to copy this profile link from your browser.");
    }
  };

  return (
    <div className="profile-header">
      <div className="profile-header__avatar-wrap">
        <img src={user.avatar} alt={user.name} className="profile-header__avatar" />
        {user.isStudent ? (
          <span className="profile-header__badge-pill student" title="University student">
            <GraduationCap size={14} />
          </span>
        ) : (
          <span className="profile-header__badge-pill explorer" title="Campus Explorer">
            <Compass size={14} />
          </span>
        )}
      </div>

      <div className="profile-header__info">
        <div className="profile-header__name-row">
          <h1>
            {user.name}
            {user.verified && <BadgeCheck size={22} className="profile-header__verified" />}
          </h1>
          {user.verified ? (
            <span className="verified-student-tag">
              <BadgeCheck size={13} /> Verified Student
            </span>
          ) : user.isStudent ? (
            <span className="campus-explorer-tag">
              <GraduationCap size={13} /> Verification pending
            </span>
          ) : (
            <span className="campus-explorer-tag">
              <Compass size={13} /> Campus Explorer
            </span>
          )}
        </div>

        <p className="profile-header__username">{user.username}</p>
        <p className="profile-header__bio">{user.bio}</p>

        {user.isStudent && (
          <p className="profile-header__meta">
            <strong>{user.university || "EPSU"}</strong> • {user.department || "General Studies"} {user.year ? `• ${user.year}` : ""}
          </p>
        )}

        <div className="profile-header__stats">
          <span><strong>{user.vibeCount || 0}</strong> {t("profile.vibes") || "Vibes"}</span>
          <span><strong>{user.followers?.toLocaleString() || 0}</strong> {t("profile.followers") || "Followers"}</span>
          <span><strong>{user.following?.toLocaleString() || 0}</strong> {t("profile.following") || "Following"}</span>
        </div>

        <div className="profile-header__actions">
          {isOwnProfile ? (
            <>
              <Button variant="primary" onClick={onEditProfile} className="profile-btn">
                <Edit3 size={15} /> Edit Profile
              </Button>
              <Button variant="secondary" onClick={handleShare} className="profile-btn">
                {copied ? <Check size={15} /> : <Share2 size={15} />}
                {copied ? "Copied!" : "Share Profile"}
              </Button>
            </>
          ) : (
            <>
              <Button
                variant={following ? "secondary" : "primary"}
                onClick={onFollow}
                disabled
                className="profile-btn"
                title="Following is not available yet"
              >
                {following ? (t("common.following") || "Following") : (t("common.follow") || "Follow")}
              </Button>
              <Button variant="secondary" onClick={handleShare} className="profile-btn">
                {copied ? <Check size={15} /> : <Share2 size={15} />}
                {copied ? "Copied!" : "Share"}
              </Button>
            </>
          )}
        </div>
        {shareError && <p role="alert">{shareError}</p>}
      </div>
    </div>
  );
}

export default ProfileHeader;
