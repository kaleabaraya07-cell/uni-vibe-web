export const mockEvents = [
  {
    id: "ev1",
    title: "Cultural Day",
    location: "EPSU Main Campus",
    date: "JUN 01",
    time: "10:00 AM",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&q=80",
    universityId: "uni1",
    clubId: "club2",
    rsvpCount: 342,
    description: "Annual cultural celebration featuring music, dance, and food from across Ethiopia.",
    isLive: false,
  },
  {
    id: "ev2",
    title: "Inter-University Derby",
    location: "AAU Stadium",
    date: "JUN 15",
    time: "3:00 PM",
    image: "https://images.unsplash.com/photo-1574629810360-7efbc1953a68?w=400&q=80",
    universityId: "uni2",
    clubId: "club3",
    rsvpCount: 1200,
    description: "The biggest football match of the semester.",
    isLive: false,
  },
  {
    id: "ev3",
    title: "Hackathon 2026",
    location: "EPSU Innovation Lab",
    date: "JUL 10",
    time: "9:00 AM",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&q=80",
    universityId: "uni1",
    clubId: "club1",
    rsvpCount: 89,
    description: "48-hour coding marathon. Build something amazing.",
    isLive: false,
  },
];

export function getEventById(id) {
  return mockEvents.find((e) => e.id === id);
}
