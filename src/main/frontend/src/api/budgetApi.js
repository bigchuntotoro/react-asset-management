import api from "./axiosInstance";

export const getBudgetStatus = (yearMonth) => {
  return api.get("/budgets/status", { params: { yearMonth } });
};

export const saveBudget = (data) => {
  return api.post("/budgets", data);
};
