import { useAuth } from "../../context/useAuth";
import { useLocale } from "../../context/LocaleContext";
import Button from "../../components/ui/Button/Button";
import { useNavigate } from "react-router-dom";
import { Shield, Bell, MoonStar, Globe2, Lock, Download } from "lucide-react";
import "./Settings.css";

function Settings() {
  const { user, logout } = useAuth();
  const { t, locale, setLocale } = useLocale();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="settings-page">
      <h1>{t("settings.title")}</h1>

      <section className="settings-section">
        <h2>{t("settings.account")}</h2>
        <div className="settings-card">
          <p>{user?.name} ({user?.email})</p>
          <p className="settings-card__meta">Premium campus profile • Verified</p>
        </div>
      </section>

      <section className="settings-section">
        <h2>{t("settings.language")}</h2>
        <div className="settings-lang">
          <button type="button" className={locale === "en" ? "active" : ""} onClick={() => setLocale("en")}>
            {t("settings.english")}
          </button>
          <button type="button" className={locale === "am" ? "active" : ""} onClick={() => setLocale("am")}>
            {t("settings.amharic")}
          </button>
        </div>
      </section>

      <section className="settings-section">
        <h2>{t("settings.privacy")}</h2>
        <div className="settings-card settings-card--stacked">
          <label className="settings-toggle"><Shield size={16} /> Private account</label>
          <label className="settings-toggle"><Lock size={16} /> Two-factor enabled</label>
        </div>
      </section>

      <section className="settings-section">
        <h2>{t("settings.notifications")}</h2>
        <div className="settings-card settings-card--stacked">
          <label className="settings-toggle"><Bell size={16} /> Push notifications</label>
          <label className="settings-toggle"><MoonStar size={16} /> Dark mode</label>
          <label className="settings-toggle"><Globe2 size={16} /> Language updates</label>
          <label className="settings-toggle"><Download size={16} /> Download offline</label>
        </div>
      </section>

      <Button variant="secondary" onClick={handleLogout}>{t("auth.logout")}</Button>
    </div>
  );
}

export default Settings;
