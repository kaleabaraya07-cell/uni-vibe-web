import { mockUsers } from "./mockUsers";

export const mockConversations = [
  {
    id: "c1",
    user: mockUsers[1],
    lastMessage: "See you at the hackathon!",
    time: "2m",
    unread: 2,
    messages: [
      { id: "m1", senderId: "u2", text: "Hey, are you coming to the hackathon?", time: "10:30 AM" },
      { id: "m2", senderId: "u1", text: "Yes! Already registered.", time: "10:32 AM" },
      { id: "m3", senderId: "u2", text: "See you at the hackathon!", time: "10:33 AM" },
    ],
  },
  {
    id: "c2",
    user: mockUsers[2],
    lastMessage: "The cultural day photos are amazing",
    time: "1h",
    unread: 0,
    messages: [
      { id: "m4", senderId: "u3", text: "Did you see the cultural day vibes?", time: "9:00 AM" },
      { id: "m5", senderId: "u1", text: "Yes! Hana's post was fire", time: "9:05 AM" },
      { id: "m6", senderId: "u3", text: "The cultural day photos are amazing", time: "9:10 AM" },
    ],
  },
  {
    id: "c3",
    user: mockUsers[3],
    lastMessage: "Good game yesterday!",
    time: "3h",
    unread: 1,
    messages: [
      { id: "m7", senderId: "u4", text: "Good game yesterday!", time: "7:00 AM" },
    ],
  },
];

export function getConversationById(id) {
  return mockConversations.find((c) => c.id === id);
}
