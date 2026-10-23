import apiClient from "./apiClient";
import universityService from "./universityService";

export const rankingService = {
  getSeasonInfo() {
    const year = new Date().getUTCFullYear();
    return Promise.resolve({ year, name: `Season ${year}` });
  },

  async getLeaderboard(seasonYear = new Date().getUTCFullYear()) {
    const [entries, universities] = await Promise.all([
      apiClient(`/rankings/universities?season_year=${seasonYear}`),
      universityService.getUniversities(),
    ]);
    const details = new Map(universities.map((university) => [university.id, university]));
    return entries.map((entry, index) => {
      const university = details.get(entry.university_id);
      return {
        universityId: entry.university_id,
        name: entry.name,
        shortName: university?.shortName || entry.university_id,
        location: university?.location || "",
        seasonPT: Number(entry.points),
        rank: index + 1,
      };
    });
  },

  async getTopContributors(seasonYear = new Date().getUTCFullYear()) {
    const [contributors, universities] = await Promise.all([
      apiClient(`/rankings/students?season_year=${seasonYear}&limit=20`),
      universityService.getUniversities(),
    ]);
    const names = new Map(universities.map((university) => [university.id, university.name]));
    return contributors.map((contributor, index) => ({
      rank: index + 1,
      user: {
        id: contributor.user_id,
        name: contributor.display_name,
        username: "",
        university: names.get(contributor.university_id) || "Uni Vibe Community",
      },
      studentPT: Number(contributor.points),
    }));
  },

  getUserLeagueInfo(userId, seasonYear = new Date().getUTCFullYear()) {
    return apiClient(
      `/rankings/students/${encodeURIComponent(userId)}?season_year=${seasonYear}`
    ).then((entry) => ({
      userId: entry.user_id,
      seasonYear: entry.season_year,
      points: Number(entry.points),
      rank: entry.rank,
      universityId: entry.university_id,
      universityRank: entry.university_rank,
      universityPoints: Number(entry.university_points),
    }));
  },
};

export default rankingService;
