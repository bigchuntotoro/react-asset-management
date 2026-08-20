// 통화 포맷팅 (예: 10000 -> 10,000원)
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return "0원";
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
  }).format(amount);
};

// 현재 년-월 반환 (YYYY-MM)
export const getCurrentYearMonth = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
};
