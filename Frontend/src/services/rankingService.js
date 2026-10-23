import {
  CURRENT_SEASON,
  calculatePostPT,
  mockLeagueLeaderboard,
  mockLeagueHighlights,
  mockTopContributors,
  mockUserUniversityLeagueInfo,
} from "../data/mockRankings";

/**
 * Uni Vibe League & Ranking Service
 */
export const rankingService = {
  async getSeasonInfo() {
    await new Promise((resolve) => setTimeout(resolve, 80));
    return CURRENT_SEASON;
  },

  async getLeaderboard() {
    await new Promise((resolve) => setTimeout(resolve, 150));
    return [...mockLeagueLeaderboard];
  },

  async getLeagueHighlights() {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return { ...mockLeagueHighlights };
  },

  async getTopContributors() {
    await new Promise((resolve) => setTimeout(resolve, 120));
    return [...mockTopContributors];
  },

  async getUserLeagueInfo(_userId) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return { ...mockUserUniversityLeagueInfo };
  },

  calculatePT(metrics) {
    return calculatePostPT(metrics);
  },
};

export default rankingService;
