import { Link } from "react-router-dom";
import { getUserById } from "../../../data/mockUsers";

function ProfilePanel({ vibe }) {
  const user = vibe.user || getUserById(vibe.id);
  if (!user) return null;
  return (
    <div className="st-panel">
      <div className="st-panel__header">
        <img src={user.avatar} alt={user.name} className="st-panel__avatar" />
        <div>
          <strong>{user.name}</strong>
          <p className="st-panel__meta">{user.username}</p>
        </div>
      </div>
      <p className="st-panel__caption">{user.bio}</p>
      <div className="st-panel__stats">
        <span>{user.vibeCount} vibes</span>
        <span>{user.followers} followers</span>
      </div>
      <p className="st-panel__meta">{user.university} • {user.department} • {user.year}</p>
      <Link to={`/profile/${user.id}`} className="st-panel__link">View full profile →</Link>
    </div>
  );
}

export default ProfilePanel;
