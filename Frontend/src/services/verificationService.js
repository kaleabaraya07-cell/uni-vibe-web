import apiClient from "./apiClient";

export const verificationService = {
  submitRequest({ universityEmail, note = "" }) {
    return apiClient("/verification/requests", {
      method: "POST",
      body: JSON.stringify({
        university_email: universityEmail,
        note,
      }),
    });
  },
};

export default verificationService;
