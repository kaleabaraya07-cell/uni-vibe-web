import { useCallback, useEffect, useRef, useState } from "react";
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
  Zap,
  EyeOff,
  Flag,
  Ban,
  Volume2,
  FolderPlus,
  ChevronRight,
  Check,
} from "lucide-react";
import { Link } from "react-router-dom";
import Modal from "../ui/Modal/Modal";
import { useFeed } from "../../context/FeedContext";
import { useSeeThrough } from "../../context/SeeThroughContext";
import { useLocale } from "../../context/LocaleContext";
import { useAuth } from "../../context/useAuth";
import postService from "../../services/postService";
import { formatCount } from "../../data/mockVibes";

function VibeCard({ vibe }) {
  const {
    toggleLike,
    toggleSave,
    toggleRepost,
    addComment,
    hideVibe,
    increaseRecommendation,
    recordValidView,
    startView,
    isLiked,
    isSaved,
    isReposted,
  } = useFeed();
  const { openSeeThrough } = useSeeThrough();
  const { t } = useLocale();
  const { user: currentUser } = useAuth();
  const { user, media, caption, music, likes, comments, saves, reposts, type } = vibe;
  const liked = isLiked(vibe.id);
  const saved = isSaved(vibe.id);
  const reposted = isReposted(vibe.id);

  const [expanded, setExpanded] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuClosing, setMenuClosing] = useState(false);
  const [speedMenuOpen, setSpeedMenuOpen] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportMessage, setReportMessage] = useState("");
  const [actionNotice, setActionNotice] = useState("");
  const [commentText, setCommentText] = useState("");
  const [postComments, setPostComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentError, setCommentError] = useState("");
  const [shareError, setShareError] = useState("");
  const [repostToast, setRepostToast] = useState(false);
  const [mediaError, setMediaError] = useState(false);
  const menuRef = useRef(null);
  const videoRef = useRef(null);
  const viewSessionRef = useRef(null);
  const viewCompletionPendingRef = useRef(false);

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    setCommentError("");
    const comment = await addComment(vibe.id, commentText);
    if (!comment) {
      setCommentError("Your comment was not sent. Please try again.");
      return;
    }
    setPostComments((comments) => [...comments, comment]);
    setCommentText("");
  };

  const handleRepost = async () => {
    const changed = await toggleRepost(vibe.id);
    if (changed && !reposted) {
      setRepostToast(true);
      setTimeout(() => setRepostToast(false), 2200);
    }
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/feed#post-${encodeURIComponent(vibe.id)}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "Uni Vibe", text: caption, url });
      } else {
        await navigator.clipboard.writeText(url);
      }
    } catch (error) {
      if (error.name !== "AbortError") setShareError("Unable to share this vibe from your browser.");
    }
  };

  const openComments = () => {
    setCommentsLoading(true);
    setCommentError("");
    setCommentsOpen(true);
  };

  const handleVideoPlay = async () => {
    if (!currentUser || viewSessionRef.current) return;
    viewSessionRef.current = await startView(vibe.id);
  };

  const handleVideoTimeUpdate = async () => {
    const video = videoRef.current;
    if (!video || !currentUser || !viewSessionRef.current || viewCompletionPendingRef.current) return;
    let watchedSeconds = 0;
    for (let index = 0; index < video.played.length; index += 1) {
      watchedSeconds += video.played.end(index) - video.played.start(index);
    }
    if (watchedSeconds >= 4) {
      viewCompletionPendingRef.current = true;
      const completed = await recordValidView(vibe.id, viewSessionRef.current);
      if (completed) viewSessionRef.current = null;
      viewCompletionPendingRef.current = false;
    }
  };

  const closeMenu = useCallback(() => {
    if (!menuOpen && !menuClosing) return;
    setMenuClosing(true);
    setSpeedMenuOpen(false);
    window.setTimeout(() => {
      setMenuOpen(false);
      setMenuClosing(false);
    }, 180);
  }, [menuClosing, menuOpen]);

  const toggleMenu = () => {
    if (menuOpen) {
      closeMenu();
    } else {
      setMenuClosing(false);
      setMenuOpen(true);
    }
  };

  const showUnavailableAction = (feature) => {
    setActionNotice(`${feature} is not available yet.`);
    closeMenu();
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
  }, [menuOpen, menuClosing, closeMenu]);

  useEffect(() => {
    if (videoRef.current) videoRef.current.playbackRate = playbackSpeed;
  }, [media, playbackSpeed, type]);

  useEffect(() => {
    if (!commentsOpen) return undefined;
    let active = true;
    postService.getComments(vibe.id)
      .then((comments) => {
        if (active) setPostComments(comments);
      })
      .catch((error) => {
        if (active) setCommentError(error.message || "Unable to load comments.");
      })
      .finally(() => {
        if (active) setCommentsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [commentsOpen, vibe.id]);

  return (
    <article className="vibe-card" id={`post-${vibe.id}`}>
      {type === "video" && !mediaError ? (
        <video
          ref={videoRef}
          src={media}
          className="vibe-card__media"
          controls
          playsInline
          onPlay={handleVideoPlay}
          onTimeUpdate={handleVideoTimeUpdate}
          onError={() => setMediaError(true)}
        />
      ) : media ? (
        <img src={media} alt="" className="vibe-card__media" />
      ) : (
        <div className="vibe-card__media vibe-card__text-media">{caption}</div>
      )}

      {repostToast && (
        <div className="vibe-card__repost-toast">
          <Repeat size={14} />
          <span>Repost updated</span>
        </div>
      )}

      {actionNotice && <p role="status" className="vibe-card__action-notice">{actionNotice}</p>}
      <div className="vibe-card__actions">
        <button
          type="button"
          className={`vibe-card__action ${liked ? "active" : ""}`}
          onClick={() => void toggleLike(vibe.id)}
          title="Like (1× PT)"
        >
          <Heart size={24} fill={liked ? "#ff4757" : "none"} color={liked ? "#ff4757" : "white"} />
          <span>{formatCount(likes)}</span>
        </button>

        <button
          type="button"
          className="vibe-card__action"
          onClick={openComments}
          title="Comments"
        >
          <MessageCircle size={24} />
          <span>{formatCount(comments)}</span>
        </button>

        <button
          type="button"
          className={`vibe-card__action ${reposted ? "reposted" : ""}`}
          onClick={() => void handleRepost()}
          title="Repost (5× League PT)"
        >
          <Repeat size={24} color={reposted ? "#2ed573" : "white"} />
          <span>{formatCount(reposts || 0)}</span>
        </button>

        <button
          type="button"
          className={`vibe-card__action ${saved ? "active" : ""}`}
          onClick={() => void toggleSave(vibe.id)}
          title="Save (5× League PT)"
        >
          <Bookmark size={24} fill={saved ? "#2d8cff" : "none"} color={saved ? "#2d8cff" : "white"} />
          <span>{formatCount(saves)}</span>
        </button>

        <button
          type="button"
          className="vibe-card__action"
          onClick={() => setShareOpen(true)}
          title="Share"
        >
          <Share2 size={24} />
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
          <button type="button" onClick={() => { hideVibe(vibe.id); closeMenu(); }}><EyeOff size={16} /> Not Interested (this visit)</button>
          <button type="button" onClick={() => { hideVibe(vibe.id); closeMenu(); }}><Flag size={16} /> Hide for this visit</button>
          <button type="button" onClick={() => showUnavailableAction("Collections")}><FolderPlus size={16} /> Save to Collection</button>
          <button type="button" onClick={() => { setShareOpen(true); closeMenu(); }}><Copy size={16} /> Copy Link</button>
          <button type="button" onClick={() => { setReportMessage(""); setReportOpen(true); closeMenu(); }}><Ban size={16} /> Report</button>
          <button type="button" onClick={() => showUnavailableAction("Blocking")}><Volume2 size={16} /> Block User</button>
          <button type="button" onClick={() => showUnavailableAction("Muting")}><Volume2 size={16} /> Mute User</button>
          {type === "video" && !mediaError && (
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
          )}
        </div>
      )}

      {commentsOpen && (
        <div className="vibe-card__sheet vibe-card__sheet--comments">
          <div className="vibe-card__sheet-header">
            <h3>Comments</h3>
            <button type="button" className="vibe-card__sheet-close" onClick={() => setCommentsOpen(false)}><X size={16} /></button>
          </div>
          <div className="vibe-card__comment-list">
            {commentsLoading && <p role="status">Loading comments…</p>}
            {commentError && <p role="alert">{commentError}</p>}
            {!commentsLoading && !commentError && postComments.length === 0 && <p>No comments yet.</p>}
            {postComments.map((comment) => (
              <div key={comment.id} className="vibe-card__comment-item">
                <div className="vibe-card__comment-main">
                  <strong>{comment.author.display_name}</strong>
                  <p>{comment.body}</p>
                  <time dateTime={comment.created_at}>{new Date(comment.created_at).toLocaleString()}</time>
                </div>
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
          {shareError && <p role="alert">{shareError}</p>}
          <div className="vibe-card__share-grid">
            <button type="button" onClick={() => void handleShare()}><Copy size={16} /> Share / Copy Link</button>
          </div>
          <button type="button" className="vibe-card__share-action vibe-card__share-action--secondary" onClick={() => setShareOpen(false)}>Cancel</button>
        </div>
      )}

      <Modal open={reportOpen} onClose={() => setReportOpen(false)} title="Report post">
        <div className="vibe-card__report-list">
          {reportMessage && <p role="status">{reportMessage}</p>}
          {['Spam', 'Violence', 'Harassment', 'False Information', 'Nudity', 'Other'].map((reason) => (
            <button key={reason} type="button" className="vibe-card__report-item" onClick={() => setReportMessage(`Reporting is not available yet. No report was sent for "${reason}".`)}>
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
              {user.verified && (
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
            <button type="button" className="vibe-card__mini" disabled title="Remix is not available yet">
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
