import { createContext, useContext, useState, useCallback } from "react";
import { mockConversations } from "../data/mockChat";
import { useAuth } from "./AuthContext";

const ChatContext = createContext(null);

export function ChatProvider({ children }) {
  const { user } = useAuth();
  const [conversations, setConversations] = useState(mockConversations);

  const sendMessage = useCallback(
    (conversationId, text) => {
      if (!user || !text.trim()) return;
      const msg = {
        id: `m${Date.now()}`,
        senderId: user.id,
        text: text.trim(),
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setConversations((prev) =>
        prev.map((c) =>
          c.id === conversationId
            ? {
                ...c,
                lastMessage: text.trim(),
                time: "now",
                messages: [...c.messages, msg],
              }
            : c
        )
      );
    },
    [user]
  );

  return (
    <ChatContext.Provider value={{ conversations, sendMessage }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used within ChatProvider");
  return ctx;
}
