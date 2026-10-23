import { mockEvents, getEventById as getEvById } from "../data/mockEvents";

/**
 * Campus Events Service
 */
export const eventService = {
  async getEvents({ universityId = null } = {}) {
    await new Promise((resolve) => setTimeout(resolve, 150));
    if (universityId) {
      return mockEvents.filter((e) => e.universityId === universityId);
    }
    return [...mockEvents];
  },

  async getEventById(id) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return getEvById(id) || null;
  },
};

export default eventService;
