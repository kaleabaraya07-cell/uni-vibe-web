import { useLocale } from "../../context/LocaleContext";
import { useNotifications } from "../../context/NotificationContext";
import NotificationItem from "../../components/NotificationItem/NotificationItem";
import Button from "../../components/ui/Button/Button";
import "./Notifications.css";

function Notifications() {
  const { t } = useLocale();
  const { notifications, markAllRead } = useNotifications();

  return (
    <div className="notifications-page">
      <div className="notifications-page__header">
        <h1>{t("notifications.title")}</h1>
        <Button variant="ghost" onClick={markAllRead}>{t("notifications.markAll")}</Button>
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
