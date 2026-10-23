import { NavLink, Link } from "react-router-dom";
import GlassPanel from "../GlassPanel/GlassPanel";
import {
  Home, Radio, Building2, Users, Megaphone, Trophy, Bookmark, ChevronRight,
} from "lucide-react";
import { useAuth } from "../../context/useAuth";
import { useLocale } from "../../context/LocaleContext";
import { navItems } from "../../data/mockData";
import "./LeftSidebar.css";

const iconMap = { Home, Radio, Building2, Users, Megaphone, Trophy, Bookmark };
const labelKeys = {
  home: "nav.home", live: "nav.live", universities: "nav.universities",
  clubs: "nav.clubs", opportunities: "nav.opportunities", ranking: "nav.ranking", saved: "nav.saved",
};

function LeftSidebar() {
  const { user } = useAuth();
  const { t } = useLocale();

  return (
    <aside className="left-sidebar">
      <GlassPanel className="sidebar-profile">
        {user ? (
          <>
            <img src={user.avatar} alt={user.name} className="sidebar-profile__avatar" />
            <div className="sidebar-profile__info">
              <h3>{user.name}</h3>
              <p>{user.username}</p>
            </div>
            <Link to={`/profile/${user.id}`} className="sidebar-profile__link">
              {t("nav.viewProfile")} <ChevronRight size={16} />
            </Link>
          </>
        ) : (
          <>
            <div className="sidebar-profile__guest-avatar" aria-hidden="true">U</div>
            <div className="sidebar-profile__info">
              <h3>Explore Uni Vibe</h3>
              <p>Sign in to connect with campus communities.</p>
            </div>
            <div className="sidebar-profile__guest-actions">
              <Link to="/login" className="sidebar-profile__link">Log in</Link>
              <Link to="/signup" className="sidebar-profile__link">Sign up</Link>
            </div>
          </>
        )}
      </GlassPanel>

      <GlassPanel className="sidebar-nav">
        <nav>
          {navItems.map((item) => {
            const Icon = iconMap[item.icon];
            return (
              <NavLink
                key={item.id}
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) => `sidebar-nav__item ${isActive ? "active" : ""}`}
              >
                <Icon size={20} />
                <span>{t(labelKeys[item.id])}</span>
              </NavLink>
            );
          })}
        </nav>
      </GlassPanel>

      <GlassPanel className="sidebar-week">
        <div className="sidebar-week__icon"><Trophy size={28} /></div>
        <div className="sidebar-week__text">
          <h4>{t("nav.uniVibeWeek")}</h4>
          <Link to="/rankings" className="sidebar-week__link">
            {t("nav.viewNow")} <ChevronRight size={14} />
          </Link>
        </div>
      </GlassPanel>
    </aside>
  );
}

export default LeftSidebar;
