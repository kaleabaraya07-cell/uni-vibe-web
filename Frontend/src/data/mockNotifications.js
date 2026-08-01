import { mockUsers } from "./mockUsers";

export const mockNotifications = [
  {
    id: "n1",
    type: "like",
    user: mockUsers[1],
    text: "liked your vibe",
    vibeId: "v1",
    time: "5m",
    read: false,
  },
  {
    id: "n2",
    type: "comment",
    user: mockUsers[2],
    text: "commented on your vibe",
    vibeId: "v1",
    time: "15m",
    read: false,
  },
  {
    id: "n3",
    type: "follow",
    user: mockUsers[3],
    text: "started following you",
    time: "1h",
    read: false,
  },
  {
    id: "n4",
    type: "event",
    user: null,
    text: "Cultural Day starts in 2 days",
    eventId: "ev1",
    time: "2h",
    read: true,
  },
  {
    id: "n5",
    type: "ranking",
    user: null,
    text: "EPSU moved to #1 in weekly rankings!",
    time: "1d",
    read: true,
  },
];
