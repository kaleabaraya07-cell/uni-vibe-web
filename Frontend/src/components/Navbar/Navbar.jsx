import { Link, useNavigate, useLocation } from "react-router-dom";
import { Search, Bell } from "lucide-react";
import { useAuth } from "../../context/useAuth";
import { useLocale } from "../../context/LocaleContext";
import { useNotifications } from "../../context/NotificationContext";
import "./Navbar.css";

function Navbar() {
  const { user } = useAuth();
  const { t } = useLocale();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <header className="navbar">
      <Link to="/" className="logo">
        <div className="logo-icon">U</div>
        <h2>{t("app.name")}</h2>
      </Link>

      <div className="tabs">
        <button
          type="button"
          className={`tab tab--live ${location.pathname === "/live" ? "active" : ""}`}
          onClick={() => navigate("/live")}
        >
          <span className="live-dot" />
          {t("nav.liveTab")}
        </button>
        <button
          type="button"
          className={`tab ${location.pathname === "/feed" || location.pathname === "/" ? "active" : ""}`}
          onClick={() => navigate("/feed")}
        >
          {t("nav.forYou")}
        </button>
      </div>

      <div className="right">
        <button type="button" className="search-box" onClick={() => navigate("/search")}>
          <Search size={18} />
          <span>{t("common.search")}</span>
        </button>
        <Link to="/notifications" className="navbar__bell">
          <Bell size={22} />
          {unreadCount > 0 && <span className="navbar__badge">{unreadCount}</span>}
        </Link>
        <Link to={`/profile/${user?.id}`}>
          <img className="profile" src={user?.avatar} alt={user?.name} />
        </Link>
      </div>
    </header>
  );
}

export default Navbar;
