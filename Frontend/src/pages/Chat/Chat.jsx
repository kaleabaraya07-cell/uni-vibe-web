import { Link } from "react-router-dom";
import { useLocale } from "../../context/LocaleContext";
import { useChat } from "../../context/ChatContext";
import { Search, Pin, MessageCircleMore } from "lucide-react";
import "./Chat.css";

function Chat() {
  const { t } = useLocale();
  const { conversations } = useChat();

  return (
    <div className="chat-page">
      <div className="chat-page__header">
        <div>
          <h1>{t("chat.title")}</h1>
          <p className="chat-page__sub">Campus channels, clubs, and direct chats</p>
        </div>
        <label className="chat-page__search">
          <Search size={16} />
          <input placeholder="Search messages" />
        </label>
      </div>
      <div className="chat-page__chip-row">
        <span className="chat-page__chip">Pinned <Pin size={12} /></span>
        <span className="chat-page__chip">Groups</span>
        <span className="chat-page__chip">University</span>
        <span className="chat-page__chip">Clubs</span>
      </div>
      <ul className="chat-list">
        {conversations.map((c) => (
          <Link key={c.id} to={`/chat/${c.id}`} className="chat-list__item">
            <img src={c.user.avatar} alt={c.user.name} />
            <div className="chat-list__info">
              <strong>{c.user.name}</strong>
              <p>{c.lastMessage}</p>
            </div>
            <span className="chat-list__time">{c.time}</span>
            {c.unread > 0 ? <span className="chat-list__unread">{c.unread}</span> : <MessageCircleMore size={14} className="chat-list__icon" />}
          </Link>
        ))}
      </ul>
    </div>
  );
}

export default Chat;
