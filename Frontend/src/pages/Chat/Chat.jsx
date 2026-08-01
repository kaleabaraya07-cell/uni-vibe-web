import { Link } from "react-router-dom";
import { useLocale } from "../../context/LocaleContext";
import { useChat } from "../../context/ChatContext";
import "./Chat.css";

function Chat() {
  const { t } = useLocale();
  const { conversations } = useChat();

  return (
    <div className="chat-page">
      <h1>{t("chat.title")}</h1>
      <ul className="chat-list">
        {conversations.map((c) => (
          <Link key={c.id} to={`/chat/${c.id}`} className="chat-list__item">
            <img src={c.user.avatar} alt={c.user.name} />
            <div className="chat-list__info">
              <strong>{c.user.name}</strong>
              <p>{c.lastMessage}</p>
            </div>
            <span className="chat-list__time">{c.time}</span>
            {c.unread > 0 && <span className="chat-list__unread">{c.unread}</span>}
          </Link>
        ))}
      </ul>
    </div>
  );
}

export default Chat;
