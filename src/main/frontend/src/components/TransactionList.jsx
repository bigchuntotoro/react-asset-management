import React from "react";
import { formatCurrency } from "../utils/formatters";

const TransactionList = ({ transactions, onDeleteTransaction }) => {
  if (!transactions || transactions.length === 0) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "24px 0",
          color: "#9ca3af",
          fontSize: "14px",
        }}
      >
        등록된 내역이 없습니다.
      </div>
    );
  }

  return (
    <div style={{ overflowX: "auto" }}>
      <table
        style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}
      >
        <thead>
          <tr
            style={{
              backgroundColor: "#f9fafb",
              borderBottom: "1px solid #e5e7eb",
              color: "#6b7280",
            }}
          >
            <th style={{ padding: "12px 8px", textAlign: "left" }}>날짜</th>
            <th style={{ padding: "12px 8px", textAlign: "center" }}>분류</th>
            <th style={{ padding: "12px 8px", textAlign: "left" }}>카테고리</th>
            <th style={{ padding: "12px 8px", textAlign: "right" }}>금액</th>
            <th style={{ padding: "12px 8px", textAlign: "left" }}>메모</th>
            <th style={{ padding: "12px 8px", textAlign: "center" }}>관리</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((item) => (
            <tr key={item.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
              <td style={{ padding: "12px 8px" }}>{item.transactionDate}</td>
              <td style={{ padding: "12px 8px", textAlign: "center" }}>
                <span
                  style={{
                    padding: "2px 8px",
                    borderRadius: "12px",
                    fontSize: "12px",
                    fontWeight: "600",
                    backgroundColor:
                      item.type === "INCOME" ? "#d1fae5" : "#fee2e2",
                    color: item.type === "INCOME" ? "#047857" : "#b91c1c",
                  }}
                >
                  {item.type === "INCOME" ? "수입" : "지출"}
                </span>
              </td>
              <td style={{ padding: "12px 8px" }}>{item.category}</td>
              <td
                style={{
                  padding: "12px 8px",
                  textAlign: "right",
                  fontWeight: "600",
                }}
              >
                {formatCurrency(item.amount)}
              </td>
              <td style={{ padding: "12px 8px", color: "#6b7280" }}>
                {item.memo}
              </td>
              <td style={{ padding: "12px 8px", textAlign: "center" }}>
                <button
                  onClick={() => onDeleteTransaction(item.id)}
                  style={{
                    padding: "4px 8px",
                    backgroundColor: "#f3f4f6",
                    color: "#ef4444",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "12px",
                  }}
                >
                  삭제
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionList;
