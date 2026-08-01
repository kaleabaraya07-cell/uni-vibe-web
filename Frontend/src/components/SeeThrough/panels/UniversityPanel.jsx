import { Link } from "react-router-dom";
import { getUniversityById } from "../../../data/mockUniversities";

function UniversityPanel({ vibe }) {
  const uni = getUniversityById(vibe.universityId || vibe.id);
  if (!uni) return null;
  return (
    <div className="st-panel">
      <img src={uni.cover} alt={uni.name} style={{ width: "100%", borderRadius: 12, marginBottom: 16 }} />
      <h3>{uni.name}</h3>
      <p className="st-panel__meta">{uni.location}</p>
      <div className="st-panel__stats">
        <span>{uni.population.toLocaleString()} students</span>
        <span>Rank #{uni.ranking}</span>
      </div>
      <p className="st-panel__caption">{uni.description}</p>
      <Link to={`/university/${uni.id}`} className="st-panel__link">View university page →</Link>
    </div>
  );
}

export default UniversityPanel;
