import { Link } from "react-router-dom";
import { formatCount } from "../../../data/mockVibes";

function ImagePanel({ vibe }) {
  const { user, caption, location, hashtags } = vibe;
  return (
    <div className="st-panel">
      <div className="st-panel__header">
        <img src={user.avatar} alt={user.name} className="st-panel__avatar" />
        <div>
          <strong>{user.name}</strong>
          <p className="st-panel__meta">{user.university} • {user.department}</p>
        </div>
      </div>
      <p className="st-panel__caption">{caption}</p>
      {location && <p className="st-panel__meta">📍 {location}</p>}
      <div className="st-panel__tags">
        {hashtags?.map((tag) => <span key={tag} className="st-panel__tag">{tag}</span>)}
      </div>
      <div className="st-panel__stats">
        <span>{formatCount(vibe.likes)} likes</span>
        <span>{formatCount(vibe.comments)} comments</span>
      </div>
      <div className="st-panel__section">
        <h4>Related</h4>
        <Link to={`/profile/${user.id}`} className="st-panel__link">View creator profile →</Link>
        {vibe.eventId && <Link to={`/event/${vibe.eventId}`} className="st-panel__link">View event →</Link>}
      </div>
    </div>
  );
}

export default ImagePanel;
