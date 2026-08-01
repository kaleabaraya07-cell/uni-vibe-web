import "./VibeCard.css";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  BadgeCheck,
  Music,
  Scan,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useFeed } from "../../context/FeedContext";
import { useSeeThrough } from "../../context/SeeThroughContext";
import { useLocale } from "../../context/LocaleContext";
import { formatCount } from "../../data/mockVibes";

function VibeCard({ vibe }) {
  const { toggleLike, toggleSave, toggleShare, addComment, isLiked, isSaved } = useFeed();
  const { openSeeThrough } = useSeeThrough();
  const { t } = useLocale();
  const { user, media, caption, music, likes, comments, shares, saves, type } = vibe;
  const liked = isLiked(vibe.id);
  const saved = isSaved(vibe.id);

  return (
    <article className="vibe-card">
      <img src={media} alt="" className="vibe-card__media" />

      <div className="vibe-card__actions">
        <button type="button" className="vibe-card__action" onClick={() => toggleLike(vibe.id)}>
          <Heart size={26} fill={liked ? "#ff4757" : "none"} color={liked ? "#ff4757" : "white"} />
          <span>{formatCount(likes)}</span>
        </button>
        <button type="button" className="vibe-card__action" onClick={() => addComment(vibe.id)}>
          <MessageCircle size={26} />
          <span>{formatCount(comments)}</span>
        </button>
        <button type="button" className="vibe-card__action" onClick={() => toggleShare(vibe.id)}>
          <Share2 size={26} />
          <span>{formatCount(shares)}</span>
        </button>
        <button type="button" className="vibe-card__action" onClick={() => toggleSave(vibe.id)}>
          <Bookmark size={26} fill={saved ? "#2d8cff" : "none"} color={saved ? "#2d8cff" : "white"} />
          <span>{formatCount(saves)}</span>
        </button>
        <button type="button" className="vibe-card__action vibe-card__action--more">
          <MoreHorizontal size={26} />
        </button>
      </div>

      <div className="vibe-card__overlay">
        <Link to={`/profile/${user.id}`} className="vibe-card__user">
          <img src={user.avatar} alt={user.name} className="vibe-card__avatar" />
          <div>
            <div className="vibe-card__name">
              {user.name}
              {user.verified && <BadgeCheck size={16} className="vibe-card__verified" />}
            </div>
            <div className="vibe-card__meta">
              {user.university} • {user.department}
            </div>
          </div>
        </Link>

        <p className="vibe-card__caption">{caption}</p>

        <div className="vibe-card__footer">
          <div className="vibe-card__music">
            <Music size={14} />
            <span>{music}</span>
          </div>
          <button
            type="button"
            className="vibe-card__see-through"
            onClick={() => openSeeThrough(vibe, type)}
          >
            <Scan size={16} />
            {t("common.seeThrough")}
          </button>
        </div>
      </div>
    </article>
  );
}

export default VibeCard;
