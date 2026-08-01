import { useNotifications } from "../../context/NotificationContext";
import "./NotificationItem.css";

function NotificationItem({ notification }) {
  const { markRead } = useNotifications();
  const { user, text, time, read } = notification;

  return (
    <li
      className={`notification-item ${read ? "" : "notification-item--unread"}`}
      onClick={() => markRead(notification.id)}
    >
      {user && <img src={user.avatar} alt={user.name} className="notification-item__avatar" />}
      <div className="notification-item__content">
        {user && <strong>{user.name} </strong>}
        <span>{text}</span>
        <time>{time}</time>
      </div>
    </li>
  );
}

export default NotificationItem;
