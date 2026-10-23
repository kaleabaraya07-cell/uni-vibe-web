import apiClient from "./apiClient";

export function mapUniversity(university) {
  return {
    ...university,
    shortName: university.short_name,
    population: null,
    cover: "",
    logo: "",
  };
}

export const universityService = {
  async getUniversities() {
    const data = await apiClient("/universities?limit=200");
    return data.map(mapUniversity);
  },

  async getUniversityById(id) {
    return mapUniversity(await apiClient(`/universities/${encodeURIComponent(id)}`));
  },

  async getDepartmentsByUniversity() {
    return [];
  },

  async getDepartmentById() {
    return null;
  },

  async getClubsByUniversity() {
    return [];
  },

  async getClubById() {
    return null;
  },

  async submitUniversityRequest(data) {
    const request = await apiClient("/universities/requests", {
      method: "POST",
      body: JSON.stringify({
        name: data.name,
        location: data.location,
        website: data.website || null,
        applicant_email: data.applicantEmail || data.applicant_email,
      }),
    });
    return { success: true, request };
  },
};

export default universityService;
