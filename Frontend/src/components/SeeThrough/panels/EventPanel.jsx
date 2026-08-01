import { Link } from "react-router-dom";
import { getEventById } from "../../../data/mockEvents";

function EventPanel({ vibe }) {
  const event = getEventById(vibe.eventId || vibe.id);
  if (!event) return null;
  return (
    <div className="st-panel">
      <img src={event.image} alt={event.title} style={{ width: "100%", borderRadius: 12, marginBottom: 16 }} />
      <h3>{event.title}</h3>
      <p className="st-panel__meta">{event.date} • {event.time}</p>
      <p className="st-panel__meta">📍 {event.location}</p>
      <p className="st-panel__caption">{event.description}</p>
      <div className="st-panel__stats"><span>{event.rsvpCount} attending</span></div>
      <Link to={`/event/${event.id}`} className="st-panel__link">View event →</Link>
    </div>
  );
}

export default EventPanel;
