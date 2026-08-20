import api from "./axiosInstance";

export const getCategoryStats = (yearMonth, type = "EXPENSE") => {
  return api.get("/stats/category", { params: { yearMonth, type } });
};
