import { currentUser, mockUsers } from "./mockUsers";

export const mockStories = [
  {
    id: "s1",
    user: currentUser,
    type: "image",
    media: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=900&q=80",
    text: "Campus sunsets and football energy",
    expiresAt: Date.now() + 1000 * 60 * 60 * 12,
    viewed: false,
  },
  {
    id: "s2",
    user: mockUsers[1],
    type: "video",
    media: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=900&q=80",
    text: "Hackathon countdown starts now",
    expiresAt: Date.now() + 1000 * 60 * 60 * 20,
    viewed: true,
  },
  {
    id: "s3",
    user: mockUsers[2],
    type: "text",
    text: "Cultural day prep is looking bright ✨",
    expiresAt: Date.now() + 1000 * 60 * 60 * 6,
    viewed: false,
  },
  {
    id: "s4",
    user: mockUsers[3],
    type: "image",
    media: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=900&q=80",
    text: "Game day energy at the stadium",
    expiresAt: Date.now() - 1000 * 60 * 60 * 2,
    viewed: true,
  },
];
