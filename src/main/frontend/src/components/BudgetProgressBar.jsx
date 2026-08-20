import React, { useState } from "react";
import { formatCurrency } from "../utils/formatters";

const BudgetProgressBar = ({ budgetStatus, onSaveBudget }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputBudget, setInputBudget] = useState("");

  const {
    budgetAmount = 0,
    totalExpense = 0,
    achievementRate = 0,
  } = budgetStatus || {};

  const handleSave = () => {
    if (!inputBudget || isNaN(inputBudget)) return;
    onSaveBudget(Number(inputBudget));
    setIsEditing(false);
    setInputBudget("");
  };

  const getProgressColor = () => {
    if (achievementRate >= 100) return "#ef4444"; // Red
    if (achievementRate >= 80) return "#f59e0b"; // Yellow
    return "#10b981"; // Green
  };

  return (
    <div
      style={{
        padding: "20px",
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
        marginBottom: "20px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px",
        }}
      >
        <h3>월별 예산 현황</h3>
        {isEditing ? (
          <div>
            <input
              type="number"
              placeholder="예산 금액 입력"
              value={inputBudget}
              onChange={(e) => setInputBudget(e.target.value)}
              style={{ marginRight: "8px", padding: "4px 8px" }}
            />
            <button onClick={handleSave} style={{ marginRight: "4px" }}>
              저장
            </button>
            <button onClick={() => setIsEditing(false)}>취소</button>
          </div>
        ) : (
          <button onClick={() => setIsEditing(true)}>예산 설정</button>
        )}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "8px",
          fontSize: "14px",
        }}
      >
        <span>
          지출: {formatCurrency(totalExpense)} / 예산:{" "}
          {formatCurrency(budgetAmount)}
        </span>
        <span style={{ fontWeight: "bold" }}>
          {achievementRate.toFixed(1)}%
        </span>
      </div>

      {/* 프로그레스 바 */}
      <div
        style={{
          width: "100%",
          backgroundColor: "#e5e7eb",
          height: "16px",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${Math.min(achievementRate, 100)}%`,
            backgroundColor: getProgressColor(),
            height: "100%",
            transition: "width 0.3s ease-in-out",
          }}
        />
      </div>
    </div>
  );
};

export default BudgetProgressBar;
