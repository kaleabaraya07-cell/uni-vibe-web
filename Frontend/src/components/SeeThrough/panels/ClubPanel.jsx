import { Link } from "react-router-dom";
import { getClubById } from "../../../data/mockUniversities";

function ClubPanel({ vibe }) {
  const club = getClubById(vibe.clubId || vibe.id);
  if (!club) return null;
  return (
    <div className="st-panel">
      <img src={club.cover} alt={club.name} style={{ width: "100%", borderRadius: 12, marginBottom: 16 }} />
      <h3>{club.name}</h3>
      <p className="st-panel__meta">{club.members} members</p>
      <p className="st-panel__caption">{club.description}</p>
      <Link to={`/club/${club.id}`} className="st-panel__link">View club page →</Link>
    </div>
  );
}

export default ClubPanel;
