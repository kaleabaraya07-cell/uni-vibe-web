import { useState } from "react";
import { useParams } from "react-router-dom";
import { getEventById } from "../../data/mockEvents";
import { mockVibes } from "../../data/mockVibes";
import { useLocale } from "../../context/LocaleContext";
import Button from "../../components/ui/Button/Button";
import "../University/Entity.css";

function Event() {
  const { id } = useParams();
  const event = getEventById(id);
  const { t } = useLocale();
  const [attending, setAttending] = useState(false);
  if (!event) return <p>Event not found</p>;
  const related = mockVibes.filter((v) => v.eventId === id);

  return (
    <div className="entity-page">
      <img src={event.image} alt="" className="entity-page__cover" />
      <h1>{event.title}</h1>
      <p className="entity-page__meta">{event.date} • {event.time} • {event.location}</p>
      <p>{event.description}</p>
      <p className="entity-page__meta">{event.rsvpCount} attending</p>
      <Button variant={attending ? "secondary" : "primary"} onClick={() => setAttending(!attending)}>
        {attending ? t("event.attending") : t("event.rsvp")}
      </Button>
      <h3 style={{ marginTop: 20 }}>Related Vibes</h3>
      <div className="entity-grid">
        {related.map((v) => <img key={v.id} src={v.media} alt="" />)}
      </div>
    </div>
  );
}

export default Event;
