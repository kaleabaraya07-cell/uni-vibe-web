import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { profileService } from "../../services/profileService";
import rankingService from "../../services/rankingService";
import ProfileHeader from "../../components/ProfileHeader/ProfileHeader";
import GlassPanel from "../../components/GlassPanel/GlassPanel";
import Modal from "../../components/ui/Modal/Modal";
import Input from "../../components/ui/Input/Input";
import Button from "../../components/ui/Button/Button";
import {
  Trophy,
  Bookmark,
  Heart,
  Grid,
  Video,
  Building2,
  Sparkles,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import "./Profile.css";

function Profile() {
  const { id } = useParams();
  const { user: authUser, updateProfile } = useAuth();
  const [user, setUser] = useState(null);
  const [vibes, setVibes] = useState([]);
  const [savedVibes, setSavedVibes] = useState([]);
  const [likedVibes, setLikedVibes] = useState([]);
  const [leagueInfo, setLeagueInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileError, setProfileError] = useState("");
  const isOwnProfile = authUser?.id === user?.id;

  const [following, setFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState("posts"); // 'posts' | 'saved' | 'liked' | 'media'

  // Edit Profile Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editDepartment, setEditDepartment] = useState("");

  const mediaVibes = vibes.filter((v) => v.type === "video" || v.type === "image");

  useEffect(() => {
    let active = true;
    Promise.all([
      profileService.getUserProfile(id),
      profileService.getUserPosts(id),
      authUser?.id === id ? profileService.getUserSavedPosts() : Promise.resolve([]),
      authUser?.id === id ? profileService.getUserLikedPosts() : Promise.resolve([]),
    ])
      .then(async ([profile, posts, savedPosts, likedPosts]) => {
        const league = profile.isStudent
          ? await rankingService.getUserLeagueInfo(profile.id)
          : null;
        if (!active) return;
        setProfileError("");
        setUser(profile);
        setVibes(posts);
        setSavedVibes(savedPosts);
        setLikedVibes(likedPosts);
        setLeagueInfo(league);
        setEditName(profile.name);
        setEditBio(profile.bio);
        setEditDepartment(profile.department || "");
      })
      .catch((error) => {
        if (active) setProfileError(error.message || "Unable to load this profile.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [authUser?.id, id]);

  const displayedVibes =
    activeTab === "saved"
      ? savedVibes
      : activeTab === "liked"
        ? likedVibes
        : activeTab === "media"
          ? mediaVibes
          : vibes;

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setProfileError("");
    try {
      const updatedUser = await updateProfile({
        name: editName,
        bio: editBio,
        department: editDepartment,
      });
      setUser(updatedUser);
      setIsEditModalOpen(false);
    } catch (error) {
      setProfileError(error.message || "Unable to update your profile.");
    }
  };

  if (profileError && (!user || user.id !== id)) return <div className="profile-page"><p role="alert">{profileError}</p></div>;
  if (loading || user?.id !== id) return <div className="profile-page"><p role="status">Loading profile…</p></div>;
  if (!user) return <div className="profile-page"><p>User not found.</p></div>;

  return (
    <div className="profile-page">
      {profileError && <p role="alert">{profileError}</p>}
      {/* Cover Image */}
      <div
        className="profile-page__cover"
        style={{
          backgroundImage: `url(${user.coverImage || "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&q=80"})`,
        }}
      />

      {/* Profile Header */}
      <ProfileHeader
        user={user}
        following={following}
        onFollow={() => setFollowing(!following)}
        onEditProfile={() => setIsEditModalOpen(true)}
      />

      {/* League Contribution Section (For University Students) */}
      {user.isStudent && (
        <GlassPanel className="profile-league-card">
          <div className="league-card-header">
            <div className="league-card-title">
              <Trophy size={18} className="trophy-icon" />
              <h4>Season {leagueInfo?.seasonYear || new Date().getUTCFullYear()} League Contribution</h4>
            </div>
            <Link to="/rankings" className="league-link">
              League Standings <ChevronRight size={14} />
            </Link>
          </div>

          <div className="league-card-grid">
            <div className="league-stat-box">
              <span className="stat-label">Personal PT</span>
              <span className="stat-value">{leagueInfo?.points.toFixed(2) || "0.00"} PT</span>
              <span className="stat-sub">From {vibes.length} season vibes</span>
            </div>

            <div className="league-stat-box">
              <span className="stat-label">Rank in {user.university || "EPSU"}</span>
              <span className="stat-value">{leagueInfo?.universityRank ? `#${leagueInfo.universityRank}` : "—"}</span>
              <span className="stat-sub">{leagueInfo?.universityPoints.toFixed(2) || "0.00"} university PT</span>
            </div>

            <div className="league-stat-box">
              <span className="stat-label">University Impact</span>
              <span className="stat-value">
                {leagueInfo?.universityPoints
                  ? `${((leagueInfo.points / leagueInfo.universityPoints) * 100).toFixed(1)}%`
                  : "0%"}
              </span>
              <span className="stat-sub">Of university PT</span>
            </div>
          </div>
        </GlassPanel>
      )}

      {/* My University Quick Card */}
      {user.isStudent && user.universityId && (
        <div className="profile-uni-bar">
          <div className="profile-uni-info">
            <Building2 size={18} className="uni-icon" />
            <div>
              <span className="uni-label">Representing Campus</span>
              <strong>{user.university} — {user.department}</strong>
            </div>
          </div>
          <Link to={`/university/${user.universityId}`} className="uni-visit-link">
            Campus Hub <ExternalLink size={14} />
          </Link>
        </div>
      )}

      {/* Profile Navigation Tabs */}
      <div className="profile-tabs">
        <button
          type="button"
          className={`profile-tab ${activeTab === "posts" ? "active" : ""}`}
          onClick={() => setActiveTab("posts")}
        >
          <Grid size={16} /> Posts ({vibes.length})
        </button>

        {isOwnProfile && (
          <button
            type="button"
            className={`profile-tab ${activeTab === "saved" ? "active" : ""}`}
            onClick={() => setActiveTab("saved")}
          >
            <Bookmark size={16} /> Saved ({savedVibes.length})
          </button>
        )}

        <button
          type="button"
          className={`profile-tab ${activeTab === "liked" ? "active" : ""}`}
          onClick={() => setActiveTab("liked")}
        >
          <Heart size={16} /> Liked
        </button>

        <button
          type="button"
          className={`profile-tab ${activeTab === "media" ? "active" : ""}`}
          onClick={() => setActiveTab("media")}
        >
          <Video size={16} /> Media
        </button>
      </div>

      {/* Vibes Grid */}
      {displayedVibes.length > 0 ? (
        <div className="profile-vibes">
          {displayedVibes.map((v) => (
            <div key={v.id} className="profile-vibes__thumb-wrap">
              <img src={v.media} alt="" className="profile-vibes__thumb" />
              <span className="profile-vibes__label">
                <Sparkles size={12} /> {v.category}
              </span>
              {v.type === "video" && (
                <span className="profile-vibes__video-tag">
                  <Video size={12} />
                </span>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="profile-empty-state">
          <p>No vibes found in this tab.</p>
        </div>
      )}

      {/* Edit Profile Modal */}
      <Modal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Campus Profile"
      >
        <form className="edit-profile-form" onSubmit={handleSaveProfile}>
          <Input
            label="Full Name"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            required
          />
          <Input
            label="Bio / Tagline"
            value={editBio}
            onChange={(e) => setEditBio(e.target.value)}
            placeholder="Share your campus story..."
          />
          {user.isStudent && (
            <>
              <Input
                label="Department"
                value={editDepartment}
                onChange={(e) => setEditDepartment(e.target.value)}
              />
            </>
          )}
          <Button type="submit" variant="primary" className="edit-profile-submit">
            Save Changes
          </Button>
        </form>
      </Modal>
    </div>
  );
}

export default Profile;
