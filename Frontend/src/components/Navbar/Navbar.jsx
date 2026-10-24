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

      <nav className="navbar__tabs" aria-label="Main feed">
        <button
          type="button"
          className={`tab tab--live ${location.pathname === "/live" ? "active" : ""}`}
          aria-current={location.pathname === "/live" ? "page" : undefined}
          onClick={() => navigate("/live")}
        >
          <span className="live-dot" />
          {t("nav.liveTab")}
        </button>
        <button
          type="button"
          className={`tab ${location.pathname === "/feed" || location.pathname === "/" ? "active" : ""}`}
          aria-current={location.pathname === "/feed" || location.pathname === "/" ? "page" : undefined}
          onClick={() => navigate("/feed")}
        >
          {t("nav.forYou")}
        </button>
      </nav>

      <div className="navbar__actions">
        <button type="button" className="search-box" aria-label={t("common.search")} onClick={() => navigate("/search")}>
          <Search size={18} />
          <span>{t("common.search")}</span>
        </button>
        <Link to="/notifications" className="navbar__bell">
          <Bell size={22} />
          {unreadCount > 0 && <span className="navbar__badge">{unreadCount}</span>}
        </Link>
        {user ? (
          <Link className="navbar__profile-link" to={`/profile/${user.id}`} aria-label="Your profile">
            <img className="profile" src={user.avatar} alt={user.name} />
          </Link>
        ) : (
          <Link to="/login" className="navbar__login">{t("auth.login")}</Link>
        )}
      </div>
    </header>
  );
}

export default Navbar;
