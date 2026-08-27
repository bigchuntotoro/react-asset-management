import React, { useState, useEffect } from "react";

const TransactionForm = ({ defaultDate, onAddTransaction }) => {
  const [form, setForm] = useState({
    type: "EXPENSE",
    category: "식비",
    amount: "",
    transactionDate: defaultDate || new Date().toISOString().split("T")[0],
    memo: "",
  });

  // 조회 월(defaultDate) 변경 시 transactionDate 상태 동기화
  useEffect(() => {
    if (defaultDate) {
      setForm((prev) => ({
        ...prev,
        transactionDate: defaultDate,
      }));
    }
  }, [defaultDate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.amount || isNaN(form.amount)) return;
    onAddTransaction({ ...form, amount: Number(form.amount) });
    setForm({ ...form, amount: "", memo: "" });
  };

  const inputStyle = {
    padding: "8px 12px",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    fontSize: "14px",
    outline: "none",
    flex: "1 1 140px",
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        gap: "10px",
        marginBottom: "24px",
        flexWrap: "wrap",
        alignItems: "center",
      }}
    >
      <select
        name="type"
        value={form.type}
        onChange={handleChange}
        style={{ ...inputStyle, flex: "0 0 90px" }}
      >
        <option value="EXPENSE">지출</option>
        <option value="INCOME">수입</option>
      </select>
      <select
        name="category"
        value={form.category}
        onChange={handleChange}
        style={{ ...inputStyle, flex: "0 0 110px" }}
      >
        <option value="식비">식비</option>
        <option value="교통">교통</option>
        <option value="쇼핑">쇼핑</option>
        <option value="주거/통신">주거/통신</option>
        <option value="급여">급여</option>
        <option value="기타">기타</option>
      </select>
      <input
        type="date"
        name="transactionDate"
        value={form.transactionDate}
        onChange={handleChange}
        required
        style={{ ...inputStyle, flex: "0 0 130px" }}
      />
      <input
        type="number"
        name="amount"
        placeholder="금액"
        value={form.amount}
        onChange={handleChange}
        required
        style={inputStyle}
      />
      <input
        type="text"
        name="memo"
        placeholder="메모"
        value={form.memo}
        onChange={handleChange}
        style={inputStyle}
      />
      <button
        type="submit"
        style={{
          padding: "8px 16px",
          backgroundColor: "#2563eb",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          fontWeight: "500",
          cursor: "pointer",
        }}
      >
        등록
      </button>
    </form>
  );
};

export default TransactionForm;
