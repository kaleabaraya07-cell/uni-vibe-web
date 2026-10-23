import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getUserById, currentUser, mockUsers } from "../../data/mockUsers";
import { mockVibes } from "../../data/mockVibes";
import { useAuth } from "../../context/useAuth";
import { useFeed } from "../../context/FeedContext";
import ProfileHeader from "../../components/ProfileHeader/ProfileHeader";
import StoryRing from "../../components/StoryRing/StoryRing";
import GlassPanel from "../../components/GlassPanel/GlassPanel";
import Modal from "../../components/ui/Modal/Modal";
import Input from "../../components/ui/Input/Input";
import Button from "../../components/ui/Button/Button";
import {
  Trophy,
  Flame,
  Award,
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
  const navigate = useNavigate();
  const { user: authUser, switchAccount } = useAuth();
  const { getSavedVibes } = useFeed();

  // Find user or default to currentUser
  const user = getUserById(id) || (id === authUser?.id ? authUser : currentUser);
  const isOwnProfile = authUser?.id === user?.id;

  const [following, setFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState("posts"); // 'posts' | 'saved' | 'liked' | 'media'

  // Edit Profile Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editBio, setEditBio] = useState(user.bio);
  const [editDepartment, setEditDepartment] = useState(user.department);
  const [editYear, setEditYear] = useState(user.year || "3rd Year");

  const vibes = mockVibes.filter((v) => v.user.id === user.id);
  const savedVibes = getSavedVibes();
  const likedVibes = mockVibes.slice(1, 4); // mock liked
  const mediaVibes = vibes.filter((v) => v.type === "video" || v.type === "image");

  const displayedVibes =
    activeTab === "saved"
      ? savedVibes
      : activeTab === "liked"
        ? likedVibes
        : activeTab === "media"
          ? mediaVibes
          : vibes;

  const storyUsers = [
    currentUser,
    ...mockUsers.filter((p) => p.id !== currentUser.id),
  ].slice(0, 5);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    user.name = editName;
    user.bio = editBio;
    user.department = editDepartment;
    user.year = editYear;
    setIsEditModalOpen(false);
  };

  if (!user) return <div className="profile-page"><p>User not found</p></div>;

  return (
    <div className="profile-page">
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
              <h4>Season 2026 League Contribution</h4>
            </div>
            <Link to="/rankings" className="league-link">
              League Standings <ChevronRight size={14} />
            </Link>
          </div>

          <div className="league-card-grid">
            <div className="league-stat-box">
              <span className="stat-label">Personal PT</span>
              <span className="stat-value">{user.leaguePT || 14.8} PT</span>
              <span className="stat-sub">From {vibes.length} season vibes</span>
            </div>

            <div className="league-stat-box">
              <span className="stat-label">Rank in {user.university || "EPSU"}</span>
              <span className="stat-value">#2</span>
              <span className="stat-sub">Top 1% contributor</span>
            </div>

            <div className="league-stat-box">
              <span className="stat-label">University Impact</span>
              <span className="stat-value">2.3%</span>
              <span className="stat-sub">Of total campus PT</span>
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
              <Input
                label="Academic Year"
                value={editYear}
                onChange={(e) => setEditYear(e.target.value)}
                placeholder="e.g. 3rd Year"
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
