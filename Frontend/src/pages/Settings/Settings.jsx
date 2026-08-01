import { useAuth } from "../../context/AuthContext";
import { useLocale } from "../../context/LocaleContext";
import Button from "../../components/ui/Button/Button";
import { useNavigate } from "react-router-dom";
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
        <p>{user?.name} ({user?.email})</p>
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
        <label className="settings-toggle"><input type="checkbox" defaultChecked /> Private account</label>
      </section>

      <section className="settings-section">
        <h2>{t("settings.notifications")}</h2>
        <label className="settings-toggle"><input type="checkbox" defaultChecked /> Push notifications</label>
        <label className="settings-toggle"><input type="checkbox" defaultChecked /> Email digest</label>
      </section>

      <Button variant="secondary" onClick={handleLogout}>{t("auth.logout")}</Button>
    </div>
  );
}

export default Settings;
