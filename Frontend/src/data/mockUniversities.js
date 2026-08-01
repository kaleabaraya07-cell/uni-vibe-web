export const mockUniversities = [
  {
    id: "uni1",
    name: "Ethiopian Premier State University",
    shortName: "EPSU",
    location: "Addis Ababa, Ethiopia",
    population: 12500,
    ranking: 1,
    cover: "https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80",
    logo: "https://i.pravatar.cc/80?u=epsu",
    description: "Leading university in technology and innovation.",
    vibeScore: 28400,
    followers: 8900,
  },
  {
    id: "uni2",
    name: "Addis Ababa University",
    shortName: "AAU",
    location: "Addis Ababa, Ethiopia",
    population: 48000,
    ranking: 2,
    cover: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80",
    logo: "https://i.pravatar.cc/80?u=aau",
    description: "Ethiopia's oldest and largest university.",
    vibeScore: 22100,
    followers: 12400,
  },
];

export const mockDepartments = [
  {
    id: "dept1",
    name: "Software Engineering",
    universityId: "uni1",
    members: 340,
    head: "Dr. Abebe Kebede",
  },
  {
    id: "dept2",
    name: "Computer Science",
    universityId: "uni1",
    members: 420,
    head: "Dr. Selam Tadesse",
  },
  {
    id: "dept3",
    name: "Electrical Engineering",
    universityId: "uni1",
    members: 280,
    head: "Dr. Dawit Haile",
  },
  {
    id: "dept4",
    name: "Mechanical Engineering",
    universityId: "uni2",
    members: 510,
    head: "Dr. Yonas Mekonnen",
  },
];

export const mockClubs = [
  {
    id: "club1",
    name: "Tech Innovators Club",
    universityId: "uni1",
    members: 156,
    description: "Building the future through hackathons and workshops.",
    cover: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&q=80",
  },
  {
    id: "club2",
    name: "Cultural Society",
    universityId: "uni1",
    members: 89,
    description: "Celebrating diversity through art, music, and dance.",
    cover: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&q=80",
  },
  {
    id: "club3",
    name: "Sports Federation",
    universityId: "uni2",
    members: 234,
    description: "All things sports — football, basketball, athletics.",
    cover: "https://images.unsplash.com/photo-1574629810360-7efbc1953a68?w=400&q=80",
  },
];

export function getUniversityById(id) {
  return mockUniversities.find((u) => u.id === id);
}

export function getDepartmentById(id) {
  return mockDepartments.find((d) => d.id === id);
}

export function getClubById(id) {
  return mockClubs.find((c) => c.id === id);
}
