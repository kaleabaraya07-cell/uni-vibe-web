export { currentUser, mockUsers, mockCredentials, getUserById } from "./mockUsers";
export { mockVibes, formatCount, getVibeById } from "./mockVibes";
export {
  mockUniversities,
  mockDepartments,
  mockClubs,
  getUniversityById,
  getDepartmentById,
  getClubById,
} from "./mockUniversities";
export { mockEvents, getEventById } from "./mockEvents";
export { mockConversations, getConversationById } from "./mockChat";
export { mockNotifications } from "./mockNotifications";
export { mockOpportunities, mockLiveStreams, getOpportunityById } from "./mockOpportunities";

export const universityStudents = [
  { id: 1, avatar: "https://i.pravatar.cc/80?u=s1" },
  { id: 2, avatar: "https://i.pravatar.cc/80?u=s2" },
  { id: 3, avatar: "https://i.pravatar.cc/80?u=s3" },
  { id: 4, avatar: "https://i.pravatar.cc/80?u=s4" },
];

export const topContributors = [
  { rank: 1, name: "Mesay T.", points: "2.8K", avatar: "https://i.pravatar.cc/80?u=mesay" },
  { rank: 2, name: "Hana M.", points: "2.1K", avatar: "https://i.pravatar.cc/80?u=hana" },
  { rank: 3, name: "Abel G.", points: "1.9K", avatar: "https://i.pravatar.cc/80?u=abel" },
];

export const upcomingEvent = {
  title: "Cultural Day",
  location: "EPSU Main Campus",
  date: "JUN 01",
  time: "10:00 AM",
  image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=200&q=80",
};

export const navItems = [
  { id: "home", label: "Home", icon: "Home", path: "/" },
  { id: "live", label: "Live Events", icon: "Radio", path: "/live" },
  { id: "universities", label: "Universities", icon: "Building2", path: "/university/uni1" },
  { id: "clubs", label: "Clubs", icon: "Users", path: "/club/club1" },
  { id: "opportunities", label: "Opportunities", icon: "Megaphone", path: "/opportunities" },
  { id: "ranking", label: "Ranking", icon: "Trophy", path: "/rankings" },
  { id: "saved", label: "Saved", icon: "Bookmark", path: "/saved" },
];

export const bottomNavItems = [
  { id: "uni-vibe", label: "Uni Vibe", icon: "Trophy", path: "/" },
  { id: "opportunities", label: "Opportunities", icon: "Megaphone", path: "/opportunities" },
  { id: "create", label: "Create Post", icon: "Plus", primary: true },
  { id: "chat", label: "Chat", icon: "MessageCircle", path: "/chat" },
  { id: "me", label: "Me", icon: "User", path: "/profile/u1" },
];

export const featuredVibe = null;
