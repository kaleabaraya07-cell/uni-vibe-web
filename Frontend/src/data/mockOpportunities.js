export const mockOpportunities = [
  {
    id: "op1",
    type: "job",
    title: "Frontend Developer Intern",
    company: "TechHub Ethiopia",
    location: "Addis Ababa",
    deadline: "JUN 30, 2026",
    description: "Join our team building next-gen web apps for African startups.",
    saved: false,
  },
  {
    id: "op2",
    type: "scholarship",
    title: "STEM Excellence Scholarship",
    company: "EPSU Foundation",
    location: "EPSU",
    deadline: "AUG 15, 2026",
    description: "Full tuition scholarship for outstanding STEM students.",
    saved: false,
  },
  {
    id: "op3",
    type: "hackathon",
    title: "Africa Hack 2026",
    company: "Innovation Alliance",
    location: "Virtual + Addis Ababa",
    deadline: "JUL 01, 2026",
    description: "Build solutions for African challenges. $10K in prizes.",
    saved: false,
  },
  {
    id: "op4",
    type: "job",
    title: "Campus Ambassador",
    company: "Uni Vibe",
    location: "Remote",
    deadline: "Rolling",
    description: "Represent Uni Vibe on your campus. Earn rewards and swag.",
    saved: false,
  },
];

export const mockLiveStreams = [
  {
    id: "ls1",
    title: "Basketball Finals Live",
    user: { name: "EPSU Sports", avatar: "https://i.pravatar.cc/80?u=sports" },
    viewers: 1240,
    thumbnail: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&q=80",
    universityId: "uni1",
  },
  {
    id: "ls2",
    title: "Study With Me - Finals Week",
    user: { name: "Hana M.", avatar: "https://i.pravatar.cc/80?u=hana" },
    viewers: 89,
    thumbnail: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&q=80",
    universityId: "uni1",
  },
  {
    id: "ls3",
    title: "Campus Tour Live",
    user: { name: "AAU Official", avatar: "https://i.pravatar.cc/80?u=aau" },
    viewers: 456,
    thumbnail: "https://images.unsplash.com/photo-1562774053-701939374585?w=400&q=80",
    universityId: "uni2",
  },
];

export function getOpportunityById(id) {
  return mockOpportunities.find((o) => o.id === id);
}
