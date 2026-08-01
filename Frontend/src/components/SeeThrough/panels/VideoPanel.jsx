import { Link } from "react-router-dom";
import { formatCount } from "../../../data/mockVibes";

function VideoPanel({ vibe }) {
  const { user, caption, views, hashtags } = vibe;
  return (
    <div className="st-panel">
      <div className="st-panel__header">
        <img src={user.avatar} alt={user.name} className="st-panel__avatar" />
        <div>
          <strong>{user.name}</strong>
          <p className="st-panel__meta">{user.university}</p>
        </div>
      </div>
      <p className="st-panel__caption">{caption}</p>
      <div className="st-panel__stats">
        <span>{formatCount(views)} views</span>
        <span>{formatCount(vibe.likes)} likes</span>
      </div>
      <div className="st-panel__tags">
        {hashtags?.map((tag) => <span key={tag} className="st-panel__tag">{tag}</span>)}
      </div>
      <div className="st-panel__section">
        <h4>Comments preview</h4>
        <p className="st-panel__meta">320 comments — open vibe to see all</p>
        <Link to={`/profile/${user.id}`} className="st-panel__link">View creator →</Link>
      </div>
    </div>
  );
}

export default VideoPanel;
