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
    website: "https://epsu.edu.et",
    verificationStatus: "verified", // "pending" | "verified" | "unverified"
    trophies: ["Uni Vibe of the Year — 2025"],
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
    website: "https://aau.edu.et",
    verificationStatus: "verified",
    trophies: [],
    followers: 12400,
  },
  {
    id: "uni3",
    name: "Jimma University",
    shortName: "JU",
    location: "Jimma, Ethiopia",
    population: 32000,
    ranking: 3,
    cover: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=800&q=80",
    logo: "https://i.pravatar.cc/80?u=jimma",
    description: "A research-intensive university known for health sciences and agriculture.",
    website: "https://ju.edu.et",
    verificationStatus: "verified",
    trophies: [],
    followers: 6800,
  },
  {
    id: "uni4",
    name: "Hawassa University",
    shortName: "HU",
    location: "Hawassa, Ethiopia",
    population: 28000,
    ranking: 4,
    cover: "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=800&q=80",
    logo: "https://i.pravatar.cc/80?u=hawassa",
    description: "Lakeside campus with a vibrant student community.",
    website: "https://hu.edu.et",
    verificationStatus: "verified",
    trophies: [],
    followers: 5200,
  },
  {
    id: "uni5",
    name: "Bahir Dar University",
    shortName: "BDU",
    location: "Bahir Dar, Ethiopia",
    population: 35000,
    ranking: 5,
    cover: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80",
    logo: "https://i.pravatar.cc/80?u=bahirdar",
    description: "One of the top universities near the source of the Blue Nile.",
    website: "https://bdu.edu.et",
    verificationStatus: "verified",
    trophies: [],
    followers: 7100,
  },
  {
    id: "uni6",
    name: "Mekelle University",
    shortName: "MU",
    location: "Mekelle, Ethiopia",
    population: 22000,
    ranking: 6,
    cover: "https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80",
    logo: "https://i.pravatar.cc/80?u=mekelle",
    description: "A prominent university in Northern Ethiopia advancing arid-zone agriculture.",
    website: "https://mu.edu.et",
    verificationStatus: "verified",
    trophies: [],
    followers: 4300,
  },
  {
    id: "uni7",
    name: "Adama Science and Technology University",
    shortName: "ASTU",
    location: "Adama, Ethiopia",
    population: 18000,
    ranking: 7,
    cover: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80",
    logo: "https://i.pravatar.cc/80?u=astu",
    description: "Focused on engineering and technology with strong industry partnerships.",
    website: "https://astu.edu.et",
    verificationStatus: "verified",
    trophies: [],
    followers: 3900,
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
  {
    id: "dept5",
    name: "Medicine",
    universityId: "uni3",
    members: 620,
    head: "Dr. Tigist Alemu",
  },
  {
    id: "dept6",
    name: "Civil Engineering",
    universityId: "uni2",
    members: 380,
    head: "Dr. Biruk Assefa",
  },
  {
    id: "dept7",
    name: "Business Administration",
    universityId: "uni4",
    members: 450,
    head: "Dr. Meron Hailu",
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

/**
 * Statuses for university requests made by users
 * when their university isn't listed.
 * "PENDING" | "UNDER_REVIEW" | "APPROVED" | "REJECTED" | "DUPLICATE"
 */
export const mockUniversityRequests = [
  {
    id: "req1",
    universityName: "Debre Markos University",
    requestedBy: "u5",
    status: "PENDING",
    submittedAt: "2026-09-15T10:30:00Z",
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

export function getDepartmentsByUniversity(universityId) {
  return mockDepartments.filter((d) => d.universityId === universityId);
}
