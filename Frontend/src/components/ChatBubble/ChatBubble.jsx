import "./ChatBubble.css";

function ChatBubble({ message, isOwn }) {
  return (
    <div className={`chat-bubble ${isOwn ? "chat-bubble--own" : ""}`}>
      <p>{message.text}</p>
      <span>{message.time}</span>
    </div>
  );
}

export default ChatBubble;
