import {
  mockUniversities,
  mockClubs,
  getUniversityById as getUniById,
  getDepartmentById as getDeptById,
  getClubById as getClbById,
  mockUniversityRequests,
  getDepartmentsByUniversity as getDeptsByUni,
} from "../data/mockUniversities";

/**
 * University, Department & Club Service
 */
export const universityService = {
  async getUniversities() {
    await new Promise((resolve) => setTimeout(resolve, 150));
    return [...mockUniversities];
  },

  async getUniversityById(id) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return getUniById(id) || null;
  },

  async getDepartmentsByUniversity(universityId) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return getDeptsByUni(universityId);
  },

  async getDepartmentById(id) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return getDeptById(id) || null;
  },

  async getClubsByUniversity(universityId) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return mockClubs.filter((c) => c.universityId === universityId);
  },

  async getClubById(id) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return getClbById(id) || null;
  },

  async submitUniversityRequest(data) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const request = {
      id: `req_${Date.now()}`,
      ...data,
      status: "pending",
      submittedAt: new Date().toISOString(),
    };
    mockUniversityRequests.push(request);
    return { success: true, request };
  },
};

export default universityService;
