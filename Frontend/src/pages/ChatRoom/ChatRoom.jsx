import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useLocale } from "../../context/LocaleContext";
import { useChat } from "../../context/ChatContext";
import { useAuth } from "../../context/AuthContext";
import { getConversationById } from "../../data/mockChat";
import ChatBubble from "../../components/ChatBubble/ChatBubble";
import { ChevronLeft } from "lucide-react";
import "./ChatRoom.css";

function ChatRoom() {
  const { id } = useParams();
  const { t } = useLocale();
  const { user } = useAuth();
  const { conversations, sendMessage } = useChat();
  const [text, setText] = useState("");
  const conv = conversations.find((c) => c.id === id) || getConversationById(id);

  if (!conv) return <p>Conversation not found</p>;

  const handleSend = (e) => {
    e.preventDefault();
    sendMessage(id, text);
    setText("");
  };

  return (
    <div className="chat-room">
      <div className="chat-room__header">
        <Link to="/chat"><ChevronLeft size={24} /></Link>
        <img src={conv.user.avatar} alt={conv.user.name} />
        <strong>{conv.user.name}</strong>
      </div>
      <div className="chat-room__messages">
        {conv.messages.map((m) => (
          <ChatBubble key={m.id} message={m} isOwn={m.senderId === user?.id} />
        ))}
      </div>
      <form className="chat-room__input" onSubmit={handleSend}>
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder={t("chat.placeholder")} />
        <button type="submit">{t("common.send")}</button>
      </form>
    </div>
  );
}

export default ChatRoom;
