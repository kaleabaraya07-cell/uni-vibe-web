import { mockConversations, getConversationById as getConvById } from "../data/mockChat";

/**
 * Chat and Messaging Service
 */
export const messageService = {
  async getConversations() {
    await new Promise((resolve) => setTimeout(resolve, 150));
    return [...mockConversations];
  },

  async getConversationById(id) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return getConvById(id) || null;
  },

  async sendMessage(conversationId, message) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    const conv = getConvById(conversationId);
    if (!conv) throw new Error("Conversation not found");

    const newMsg = {
      id: `m_${Date.now()}`,
      senderId: "u1",
      text: message.text || "",
      media: message.media || null,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isSelf: true,
    };

    conv.messages = conv.messages || [];
    conv.messages.push(newMsg);
    conv.lastMessage = newMsg.text || "Sent an attachment";
    conv.lastMessageTime = newMsg.timestamp;

    return newMsg;
  },
};

export default messageService;
