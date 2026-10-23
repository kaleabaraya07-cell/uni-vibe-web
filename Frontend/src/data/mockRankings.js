import { mockUniversities } from "./mockUniversities";
import { mockUsers, currentUser } from "./mockUsers";

/**
 * Uni Vibe League Official Ranking Baseline & PT Calculation
 *
 * Season: UTC-based annual league (Jan 1, 00:00 UTC - Dec 31, 23:59:59 UTC)
 *
 * Post PT Formula:
 * - V = Valid views (watched >= 4 seconds)
 * - L = Likes, S = Saves, R = Reposts
 * - Like Rate   = (L / V) * 100
 * - Save Rate   = (S / V) * 100
 * - Repost Rate = (R / V) * 100
 * - Weighted Engagement = Like Rate + (Save Rate * 5) + (Repost Rate * 5)
 * - Confidence = sqrt(V) / (sqrt(V) + sqrt(1000))
 * - Post PT = Weighted Engagement * Confidence * 0.01
 *
 * University PT = Sum of all qualifying Post PT for that university during the season.
 */

export const CURRENT_SEASON = {
  year: "2026",
  name: "Season 2026",
  startDate: "2026-01-01T00:00:00Z",
  endDate: "2026-12-31T23:59:59Z",
  status: "LIVE",
  lastUpdated: "Just now",
};

export function calculatePostPT({ validViews = 0, likes = 0, saves = 0, reposts = 0 }) {
  if (validViews <= 0) return 0;
  const likeRate = (likes / validViews) * 100;
  const saveRate = (saves / validViews) * 100;
  const repostRate = (reposts / validViews) * 100;

  const weightedEngagement = likeRate + saveRate * 5 + repostRate * 5;
  const confidence = Math.sqrt(validViews) / (Math.sqrt(validViews) + Math.sqrt(1000));
  const postPT = weightedEngagement * confidence * 0.01;

  return Math.round(postPT * 100) / 100;
}

export const mockLeagueLeaderboard = [
  {
    rank: 1,
    previousRank: 1,
    movement: "same",
    movementValue: 0,
    universityId: "uni1",
    name: "Ethiopian Premier State University",
    shortName: "EPSU",
    location: "Addis Ababa",
    logo: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=120&q=80",
    cover: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&q=80",
    seasonPT: 1845.6,
    activeStudents: 4120,
    postsCount: 1240,
    trophies: ["Season 2025 Champion", "Campus Innovation Award"],
  },
  {
    rank: 2,
    previousRank: 3,
    movement: "up",
    movementValue: 1,
    universityId: "uni2",
    name: "Addis Ababa University",
    shortName: "AAU",
    location: "Addis Ababa",
    logo: "https://images.unsplash.com/photo-1562774053-701939374585?w=120&q=80",
    cover: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=1200&q=80",
    seasonPT: 1692.3,
    activeStudents: 3890,
    postsCount: 1105,
    trophies: ["Season 2024 Champion"],
  },
  {
    rank: 3,
    previousRank: 2,
    movement: "down",
    movementValue: 1,
    universityId: "uni5",
    name: "Jimma University",
    shortName: "JU",
    location: "Jimma",
    logo: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=120&q=80",
    cover: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&q=80",
    seasonPT: 1420.8,
    activeStudents: 2950,
    postsCount: 880,
    trophies: ["Community Impact 2025"],
  },
  {
    rank: 4,
    previousRank: 6,
    movement: "up",
    movementValue: 2,
    universityId: "uni6",
    name: "Hawassa University",
    shortName: "HU",
    location: "Hawassa",
    logo: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=120&q=80",
    cover: "https://images.unsplash.com/photo-1562774053-701939374585?w=1200&q=80",
    seasonPT: 1210.4,
    activeStudents: 2410,
    postsCount: 710,
    trophies: [],
  },
  {
    rank: 5,
    previousRank: 4,
    movement: "down",
    movementValue: 1,
    universityId: "uni3",
    name: "Addis Ababa Science and Technology University",
    shortName: "AASTU",
    location: "Addis Ababa",
    logo: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=120&q=80",
    cover: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&q=80",
    seasonPT: 1085.1,
    activeStudents: 2100,
    postsCount: 640,
    trophies: ["Tech Excellence 2025"],
  },
  {
    rank: 6,
    previousRank: 5,
    movement: "down",
    movementValue: 1,
    universityId: "uni7",
    name: "University of Gondar",
    shortName: "UoG",
    location: "Gondar",
    logo: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=120&q=80",
    cover: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=1200&q=80",
    seasonPT: 940.7,
    activeStudents: 1870,
    postsCount: 520,
    trophies: [],
  },
  {
    rank: 7,
    previousRank: 7,
    movement: "same",
    movementValue: 0,
    universityId: "uni4",
    name: "Adama Science and Technology University",
    shortName: "ASTU",
    location: "Adama",
    logo: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=120&q=80",
    cover: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&q=80",
    seasonPT: 815.2,
    activeStudents: 1620,
    postsCount: 430,
    trophies: [],
  },
];

export const mockLeagueHighlights = {
  currentLeader: {
    university: mockLeagueLeaderboard[0],
    highlight: "Leading with 1,845.6 PT and 1,240 season vibes",
  },
  fastestClimber: {
    university: mockLeagueLeaderboard[3], // Hawassa jumped +2
    highlight: "+2 ranks this week • +340 PT surge",
  },
  trendingUp: {
    university: mockLeagueLeaderboard[1], // AAU jumped +1
    highlight: "+15% engagement spike across sports & arts vibes",
  },
};

export const mockTopContributors = [
  {
    rank: 1,
    user: mockUsers[1], // Mesay
    studentPT: 48.6,
    postCount: 28,
    contributionPercentage: 2.6,
  },
  {
    rank: 2,
    user: currentUser, // Kalab
    studentPT: 42.2,
    postCount: 42,
    contributionPercentage: 2.3,
  },
  {
    rank: 3,
    user: mockUsers[2], // Hana
    studentPT: 34.5,
    postCount: 19,
    contributionPercentage: 1.9,
  },
  {
    rank: 4,
    user: mockUsers[3], // Abel
    studentPT: 29.8,
    postCount: 15,
    contributionPercentage: 1.6,
  },
  {
    rank: 5,
    user: mockUsers[4], // Selam
    studentPT: 24.1,
    postCount: 12,
    contributionPercentage: 1.3,
  },
];

export const mockUserUniversityLeagueInfo = {
  university: mockLeagueLeaderboard[0],
  userRankWithinUni: 2,
  userSeasonalPT: 42.2,
  userPostCount: 42,
  userContributionPercent: 2.3,
  topDepartment: "Software Engineering (480.2 PT)",
};
