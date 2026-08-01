import { useState } from "react";
import { useParams } from "react-router-dom";
import { getClubById } from "../../data/mockUniversities";
import { mockEvents } from "../../data/mockEvents";
import { useLocale } from "../../context/LocaleContext";
import Button from "../../components/ui/Button/Button";
import "../University/Entity.css";

function Club() {
  const { id } = useParams();
  const club = getClubById(id);
  const { t } = useLocale();
  const [joined, setJoined] = useState(false);
  if (!club) return <p>Club not found</p>;
  const events = mockEvents.filter((e) => e.clubId === id);

  return (
    <div className="entity-page">
      <img src={club.cover} alt="" className="entity-page__cover" />
      <h1>{club.name}</h1>
      <p className="entity-page__meta">{club.members} members</p>
      <p>{club.description}</p>
      <Button variant={joined ? "secondary" : "primary"} onClick={() => setJoined(!joined)}>
        {joined ? t("club.joined") : t("club.join")}
      </Button>
      <h3 style={{ marginTop: 20 }}>Events</h3>
      {events.map((e) => <div key={e.id} className="entity-list-item">{e.title} — {e.date}</div>)}
    </div>
  );
}

export default Club;
