import { getOpportunityById } from "../../../data/mockOpportunities";

function OpportunityPanel({ vibe }) {
  const opp = getOpportunityById(vibe.id);
  if (!opp) return null;
  return (
    <div className="st-panel">
      <span className="st-panel__tag">{opp.type}</span>
      <h3 style={{ marginTop: 12 }}>{opp.title}</h3>
      <p className="st-panel__meta">{opp.company} • {opp.location}</p>
      <p className="st-panel__caption">{opp.description}</p>
      <p className="st-panel__meta">Deadline: {opp.deadline}</p>
    </div>
  );
}

export default OpportunityPanel;
