import { NavLink } from "react-router-dom";
import { Home, Trophy, Megaphone, Plus, MessageCircle, User } from "lucide-react";
import { useAuth } from "../../context/useAuth";
import { useLocale } from "../../context/LocaleContext";
import { useUpload } from "../../context/UploadContext";
import { bottomNavItems } from "../../data/mockData";
import "./BottomNav.css";

const iconMap = { Home, Trophy, Megaphone, Plus, MessageCircle, User };
const labelKeys = {
  home: "nav.home",
  "uni-vibe": "app.name",
  opportunities: "nav.opportunities",
  chat: "nav.chat",
  me: "nav.profile",
};

function BottomNav() {
  const { user } = useAuth();
  const { t } = useLocale();
  const { openUpload } = useUpload();

  return (
    <div className="bottom-nav">
      {bottomNavItems.map((item) => {
        const Icon = iconMap[item.icon] || Home;
        if (item.primary) {
          return (
            <button
              key={item.id}
              type="button"
              className="bottom-nav__create"
              aria-label="Create Post"
              onClick={openUpload}
            >
              <Plus size={28} strokeWidth={2.5} />
            </button>
          );
        }
        const path = item.id === "me" ? (user ? `/profile/${user.id}` : "/login") : item.path;
        return (
          <NavLink
            key={item.id}
            to={path}
            end={path === "/"}
            className={({ isActive }) => `bottom-nav__item ${isActive ? "active" : ""}`}
          >
            <Icon size={22} />
            <span>{t(labelKeys[item.id] || item.label || item.id)}</span>
          </NavLink>
        );
      })}
    </div>
  );
}

export default BottomNav;
