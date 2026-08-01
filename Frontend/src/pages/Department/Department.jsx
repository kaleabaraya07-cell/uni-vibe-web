import { useParams } from "react-router-dom";
import { getDepartmentById } from "../../data/mockUniversities";
import { mockUsers } from "../../data/mockUsers";
import { mockEvents } from "../../data/mockEvents";
import "../University/Entity.css";

function Department() {
  const { id } = useParams();
  const dept = getDepartmentById(id);
  if (!dept) return <p>Department not found</p>;
  const members = mockUsers.filter((u) => u.departmentId === id);
  const events = mockEvents.filter((e) => e.universityId === dept.universityId);

  return (
    <div className="entity-page">
      <h1>{dept.name}</h1>
      <p className="entity-page__meta">Head: {dept.head} • {dept.members} members</p>
      <h3>Members</h3>
      <div className="entity-members">
        {members.map((m) => (
          <div key={m.id} className="entity-member">
            <img src={m.avatar} alt={m.name} />
            <span>{m.name}</span>
          </div>
        ))}
      </div>
      <h3>Events</h3>
      {events.map((e) => <div key={e.id} className="entity-list-item">{e.title}</div>)}
    </div>
  );
}

export default Department;
