import { useState } from "react";
import { useParams } from "react-router-dom";
import { getUserById } from "../../data/mockUsers";
import { mockVibes } from "../../data/mockVibes";
import ProfileHeader from "../../components/ProfileHeader/ProfileHeader";
import "./Profile.css";

function Profile() {
  const { id } = useParams();
  const user = getUserById(id);
  const [following, setFollowing] = useState(false);
  const vibes = mockVibes.filter((v) => v.user.id === id);

  if (!user) return <p>User not found</p>;

  return (
    <div className="profile-page">
      <ProfileHeader user={user} following={following} onFollow={() => setFollowing(!following)} />
      <div className="profile-vibes">
        {vibes.map((v) => (
          <img key={v.id} src={v.media} alt="" className="profile-vibes__thumb" />
        ))}
      </div>
    </div>
  );
}

export default Profile;
