import api from "./axiosInstance";

// 월별 수입/지출 내역 조회
export const getTransactions = (yearMonth) => {
  return api.get("/transactions", { params: { yearMonth } });
};

// 내역 등록
export const createTransaction = (data) => {
  return api.post("/transactions", data);
};

// 내역 삭제
export const deleteTransaction = (id) => {
  return api.delete(`/transactions/${id}`);
};
