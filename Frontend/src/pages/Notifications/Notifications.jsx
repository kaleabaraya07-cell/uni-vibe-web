import { useLocale } from "../../context/LocaleContext";
import { useNotifications } from "../../context/NotificationContext";
import NotificationItem from "../../components/NotificationItem/NotificationItem";
import Button from "../../components/ui/Button/Button";
import { BellRing, MessageCircle, Sparkles } from "lucide-react";
import "./Notifications.css";

function Notifications() {
  const { t } = useLocale();
  const { notifications, markAllRead } = useNotifications();

  return (
    <div className="notifications-page">
      <div className="notifications-page__header">
        <div>
          <h1>{t("notifications.title")}</h1>
          <p className="notifications-page__sub">Your campus updates and interactions</p>
        </div>
        <Button variant="ghost" onClick={markAllRead}>{t("notifications.markAll")}</Button>
      </div>
      <div className="notifications-page__summary">
        <div><BellRing size={16} /> 12 new alerts</div>
        <div><MessageCircle size={16} /> 4 mentions</div>
        <div><Sparkles size={16} /> 2 invites</div>
      </div>
      <ul className="notifications-list">
        {notifications.map((n) => (
          <NotificationItem key={n.id} notification={n} />
        ))}
      </ul>
    </div>
  );
}

export default Notifications;
