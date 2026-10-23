import apiClient from "./apiClient";
import { mapApiUser } from "./authService";
import { mapApiPost } from "./postService";
import { mapUniversity } from "./universityService";

export const searchService = {
  async search(query, limit = 20, { signal } = {}) {
    const params = new URLSearchParams({ query, limit: String(limit) });
    const result = await apiClient(`/search?${params}`, { signal });
    return {
      vibes: result.vibes.map(mapApiPost),
      people: result.people.map(mapApiUser),
      universities: result.universities.map(mapUniversity),
    };
  },
};

export default searchService;
