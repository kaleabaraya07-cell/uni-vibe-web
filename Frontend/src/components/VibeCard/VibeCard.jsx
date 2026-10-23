import { useEffect, useMemo, useRef, useState } from "react";
import "./VibeCard.css";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Repeat,
  MoreHorizontal,
  BadgeCheck,
  Music,
  Scan,
  Sparkles,
  X,
  Send,
  Copy,
  MessageSquare,
  Zap,
  EyeOff,
  Flag,
  Ban,
  Volume2,
  FolderPlus,
  Clock3,
  ChevronRight,
  Check,
} from "lucide-react";
import { Link } from "react-router-dom";
import Modal from "../ui/Modal/Modal";
import { useFeed } from "../../context/FeedContext";
import { useSeeThrough } from "../../context/SeeThroughContext";
import { useLocale } from "../../context/LocaleContext";
import { formatCount } from "../../data/mockVibes";

function VibeCard({ vibe }) {
<<<<<<< HEAD
  const { toggleLike, toggleSave, toggleShare, addComment, isLiked, isSaved, hideVibe, increaseRecommendation } = useFeed();
=======
  const {
    toggleLike,
    toggleSave,
    toggleRepost,
    toggleShare,
    addComment,
    isLiked,
    isSaved,
    isReposted,
  } = useFeed();
>>>>>>> good
  const { openSeeThrough } = useSeeThrough();
  const { t } = useLocale();
  const { user, media, caption, music, likes, comments, shares, saves, reposts, type } = vibe;
  const liked = isLiked(vibe.id);
  const saved = isSaved(vibe.id);
  const reposted = isReposted(vibe.id);

  const [expanded, setExpanded] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuClosing, setMenuClosing] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commentCount, setCommentCount] = useState(comments);
<<<<<<< HEAD
  const [speedMenuOpen, setSpeedMenuOpen] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [reportOpen, setReportOpen] = useState(false);
=======
  const [repostToast, setRepostToast] = useState(false);
>>>>>>> good
  const menuRef = useRef(null);

  const demoComments = useMemo(
    () => [
      { id: 1, user: "Hana", text: "This is such a good campus vibe ✨", time: "2m", liked: true, replies: [{ id: 11, user: "Abel", text: "Totally agree", time: "1m" }] },
      { id: 2, user: "Mesay", text: "Can’t wait for the event 🎉", time: "8m", liked: false, replies: [] },
    ],
    []
  );

  const handleAddComment = () => {
    if (!commentText.trim()) return;
    setCommentCount((prev) => prev + 1);
    setCommentText("");
  };

  const handleRepost = () => {
    toggleRepost(vibe.id);
    if (!reposted) {
      setRepostToast(true);
      setTimeout(() => setRepostToast(false), 2200);
    }
  };

  const closeMenu = () => {
    if (!menuOpen && !menuClosing) return;
    setMenuClosing(true);
    setSpeedMenuOpen(false);
    window.setTimeout(() => {
      setMenuOpen(false);
      setMenuClosing(false);
    }, 180);
  };

  const toggleMenu = () => {
    if (menuOpen) {
      closeMenu();
    } else {
      setMenuClosing(false);
      setMenuOpen(true);
    }
  };

  useEffect(() => {
    if (!menuOpen) return undefined;

    const handlePointerDown = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        closeMenu();
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen, menuClosing]);

  return (
    <article className="vibe-card">
      <img src={media} alt="" className="vibe-card__media" />

      {repostToast && (
        <div className="vibe-card__repost-toast">
          <Repeat size={14} />
          <span>Reposted to your campus followers (+5× League PT)</span>
        </div>
      )}

      <div className="vibe-card__actions">
        <button
          type="button"
          className={`vibe-card__action ${liked ? "active" : ""}`}
          onClick={() => toggleLike(vibe.id)}
          title="Like (1× PT)"
        >
          <Heart size={24} fill={liked ? "#ff4757" : "none"} color={liked ? "#ff4757" : "white"} />
          <span>{formatCount(likes)}</span>
        </button>

        <button
          type="button"
          className="vibe-card__action"
          onClick={() => { addComment(vibe.id); setCommentsOpen(true); }}
          title="Comments"
        >
          <MessageCircle size={24} />
          <span>{formatCount(commentCount)}</span>
        </button>

        <button
          type="button"
          className={`vibe-card__action ${reposted ? "reposted" : ""}`}
          onClick={handleRepost}
          title="Repost (5× League PT)"
        >
          <Repeat size={24} color={reposted ? "#2ed573" : "white"} />
          <span>{formatCount(reposts || 0)}</span>
        </button>

        <button
          type="button"
          className={`vibe-card__action ${saved ? "active" : ""}`}
          onClick={() => toggleSave(vibe.id)}
          title="Save (5× League PT)"
        >
          <Bookmark size={24} fill={saved ? "#2d8cff" : "none"} color={saved ? "#2d8cff" : "white"} />
          <span>{formatCount(saves)}</span>
        </button>

        <button
          type="button"
          className="vibe-card__action"
          onClick={() => { toggleShare(vibe.id); setShareOpen(true); }}
          title="Share"
        >
          <Share2 size={24} />
          <span>{formatCount(shares)}</span>
        </button>

        <button
          type="button"
          className="vibe-card__action vibe-card__action--more"
          onClick={toggleMenu}
          title="More options"
        >
          <MoreHorizontal size={24} />
        </button>
      </div>

      {(menuOpen || menuClosing) && (
        <div ref={menuRef} role="menu" aria-label="Post actions" tabIndex={-1} className={`vibe-card__menu ${menuClosing ? "closing" : "open"}`}>
          <button type="button" onClick={() => { increaseRecommendation(vibe.id); closeMenu(); }}><Zap size={16} /> Interested</button>
          <button type="button" onClick={() => { hideVibe(vibe.id); closeMenu(); }}><EyeOff size={16} /> Not Interested</button>
          <button type="button" onClick={() => { hideVibe(vibe.id); closeMenu(); }}><Flag size={16} /> Hide Post</button>
          <button type="button" onClick={closeMenu}><FolderPlus size={16} /> Save to Collection</button>
          <button type="button" onClick={closeMenu}><Copy size={16} /> Copy Link</button>
          <button type="button" onClick={() => { setReportOpen(true); closeMenu(); }}><Ban size={16} /> Report</button>
          <button type="button" onClick={closeMenu}><Volume2 size={16} /> Block User</button>
          <button type="button" onClick={closeMenu}><Volume2 size={16} /> Mute User</button>
          <div className="vibe-card__menu-group">
            <button type="button" className="vibe-card__speed-trigger" onClick={() => setSpeedMenuOpen((prev) => !prev)}>
              <span>Playback Speed</span>
              <ChevronRight size={14} />
            </button>
            {speedMenuOpen && (
              <div className="vibe-card__speed-row">
                {[0.5, 1, 1.5, 2].map((value) => (
                  <button key={value} type="button" className={playbackSpeed === value ? "active" : ""} onClick={() => { setPlaybackSpeed(value); setSpeedMenuOpen(false); }}>
                    {value === 1 ? "1.0x" : `${value}x`}
                    {playbackSpeed === value && <Check size={12} />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {commentsOpen && (
        <div className="vibe-card__sheet vibe-card__sheet--comments">
          <div className="vibe-card__sheet-header">
            <h3>Comments</h3>
            <button type="button" className="vibe-card__sheet-close" onClick={() => setCommentsOpen(false)}><X size={16} /></button>
          </div>
          <div className="vibe-card__comment-list">
            {demoComments.map((comment) => (
              <div key={comment.id} className="vibe-card__comment-item">
                <div className="vibe-card__comment-main">
                  <strong>{comment.user}</strong>
                  <p>{comment.text}</p>
                  <span>{comment.time}</span>
                </div>
                {comment.replies.length > 0 && (
                  <div className="vibe-card__reply-list">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="vibe-card__reply-item">
                        <strong>{reply.user}</strong>
                        <p>{reply.text}</p>
                        <span>{reply.time}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="vibe-card__composer">
            <input value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="Write a comment..." />
            <button type="button" onClick={handleAddComment}><Send size={16} /></button>
          </div>
        </div>
      )}

      {shareOpen && (
        <div className="vibe-card__sheet vibe-card__sheet--share">
          <div className="vibe-card__sheet-header">
            <h3>Share</h3>
            <button type="button" className="vibe-card__sheet-close" onClick={() => setShareOpen(false)}><X size={16} /></button>
          </div>
          <div className="vibe-card__share-grid">
            <button type="button"><Copy size={16} /> Copy Link</button>
            <button type="button"><MessageSquare size={16} /> WhatsApp</button>
            <button type="button"><Send size={16} /> Telegram</button>
            <button type="button"><Sparkles size={16} /> Facebook</button>
            <button type="button"><MessageCircle size={16} /> Messenger</button>
            <button type="button"><Share2 size={16} /> X</button>
          </div>
          <button type="button" className="vibe-card__share-action">Download Video</button>
          <button type="button" className="vibe-card__share-action vibe-card__share-action--secondary" onClick={() => setShareOpen(false)}>Cancel</button>
        </div>
      )}

      <Modal open={reportOpen} onClose={() => setReportOpen(false)} title="Report post">
        <div className="vibe-card__report-list">
          {['Spam', 'Violence', 'Harassment', 'False Information', 'Nudity', 'Other'].map((reason) => (
            <button key={reason} type="button" className="vibe-card__report-item" onClick={() => setReportOpen(false)}>
              {reason}
            </button>
          ))}
        </div>
      </Modal>

      <div className="vibe-card__overlay">
        <Link to={`/profile/${user.id}`} className="vibe-card__user">
          <img src={user.avatar} alt={user.name} className="vibe-card__avatar" />
          <div>
            <div className="vibe-card__name">
              {user.name}
              {(user.verified || user.isStudent) && (
                <span title="Verified University Student">
                  <BadgeCheck size={16} className="vibe-card__verified" />
                </span>
              )}
            </div>
            <div className="vibe-card__meta">
              {user.university || "Uni Vibe Community"} • {user.department || "Campus"}
            </div>
          </div>
        </Link>

        <p className="vibe-card__caption" onClick={() => setExpanded(!expanded)}>
          {expanded ? caption : `${caption.slice(0, 90)}${caption.length > 90 ? "…" : ""}`}
        </p>

        <div className="vibe-card__footer">
          <div className="vibe-card__music">
            <Music size={14} />
            <span>{music}</span>
          </div>
          <div className="vibe-card__footer-actions">
            <button type="button" className="vibe-card__mini" onClick={() => openSeeThrough(vibe, type)}>
              <Scan size={16} />
              {t("common.seeThrough")}
            </button>
            <button type="button" className="vibe-card__mini">
              <Sparkles size={16} />
              Remix
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export default VibeCard;
