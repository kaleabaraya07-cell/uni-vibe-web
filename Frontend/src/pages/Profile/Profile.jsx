import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUserById, currentUser, mockUsers } from "../../data/mockUsers";
import { mockVibes } from "../../data/mockVibes";
import ProfileHeader from "../../components/ProfileHeader/ProfileHeader";
import StoryRing from "../../components/StoryRing/StoryRing";
import { Award, Bookmark, Camera, PlayCircle, Settings, Sparkles } from "lucide-react";
import "./Profile.css";

function Profile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = getUserById(id);
  const [following, setFollowing] = useState(false);
  const vibes = mockVibes.filter((v) => v.user.id === id);
  const storyUsers = [currentUser, ...mockUsers.filter((person) => person.id !== currentUser.id)].slice(0, 5);

  if (!user) return <p>User not found</p>;

  return (
    <div className="profile-page">
      <div className="profile-page__cover" />
      <ProfileHeader user={user} following={following} onFollow={() => setFollowing(!following)} />

      <div className="profile-page__stats-grid">
        <div className="profile-page__card"><Award size={18} /><span>Achievements</span><strong>12</strong></div>
        <div className="profile-page__card"><Bookmark size={18} /><span>Saved</span><strong>8</strong></div>
        <div className="profile-page__card"><Camera size={18} /><span>Photos</span><strong>17</strong></div>
        <div className="profile-page__card"><PlayCircle size={18} /><span>Videos</span><strong>5</strong></div>
      </div>

      <div className="profile-page__toolbar">
        <span className="profile-page__toolbar-pill">Stories</span>
        <span className="profile-page__toolbar-pill">Events</span>
        <span className="profile-page__toolbar-pill">Clubs</span>
        <span className="profile-page__toolbar-pill"><Settings size={14} /> Settings</span>
      </div>

      <div className="profile-page__story-strip">
        {storyUsers.map((person) => (
          <StoryRing key={person.id} user={person} onProfileClick={() => navigate(`/profile/${person.id}`)} compact />
        ))}
      </div>

      <div className="profile-vibes">
        {vibes.map((v) => (
          <div key={v.id} className="profile-vibes__thumb-wrap">
            <img src={v.media} alt="" className="profile-vibes__thumb" />
            <span className="profile-vibes__label"><Sparkles size={12} /> {v.category}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Profile;
