import { BadgeCheck } from "lucide-react";
import { useLocale } from "../../context/LocaleContext";
import Button from "../ui/Button/Button";
import "./ProfileHeader.css";

function ProfileHeader({ user, following, onFollow }) {
  const { t } = useLocale();

  return (
    <div className="profile-header">
      <img src={user.avatar} alt={user.name} className="profile-header__avatar" />
      <div className="profile-header__info">
        <h1>{user.name} {user.verified && <BadgeCheck size={20} className="profile-header__verified" />}</h1>
        <p className="profile-header__username">{user.username}</p>
        <p className="profile-header__bio">{user.bio}</p>
        <p className="profile-header__meta">{user.university} • {user.department}</p>
        <div className="profile-header__stats">
          <span><strong>{user.vibeCount}</strong> {t("profile.vibes")}</span>
          <span><strong>{user.followers}</strong> {t("profile.followers")}</span>
          <span><strong>{user.following}</strong> {t("profile.following")}</span>
        </div>
        <Button variant={following ? "secondary" : "primary"} onClick={onFollow}>
          {following ? t("common.following") : t("common.follow")}
        </Button>
      </div>
    </div>
  );
}

export default ProfileHeader;
