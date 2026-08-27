import React, { useState, useEffect } from "react";
import { getCurrentYearMonth } from "../utils/formatters";
import { getBudgetStatus, saveBudget } from "../api/budgetApi";
import { getCategoryStats } from "../api/statsApi";
import {
  getTransactions,
  createTransaction,
  deleteTransaction,
} from "../api/accountBookApi";
import BudgetProgressBar from "../components/BudgetProgressBar";
import CategoryChart from "../components/CategoryChart";
import TransactionForm from "../components/TransactionForm";
import TransactionList from "../components/TransactionList";

const DashboardPage = () => {
  const [yearMonth, setYearMonth] = useState(getCurrentYearMonth());
  const [budgetStatus, setBudgetStatus] = useState(null);
  const [stats, setStats] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const loadData = async () => {
    try {
      const [budgetRes, statsRes, txRes] = await Promise.all([
        getBudgetStatus(yearMonth),
        getCategoryStats(yearMonth, "EXPENSE"),
        getTransactions(yearMonth),
      ]);
      setBudgetStatus(budgetRes.data);
      setStats(statsRes.data);
      setTransactions(txRes.data);
    } catch (error) {
      console.error("데이터 조회 오류:", error);
    }
  };

  useEffect(() => {
    loadData();
  }, [yearMonth]);

  const handleSaveBudget = async (amount) => {
    await saveBudget({ yearMonth, amount });
    loadData();
  };

  const handleAddTransaction = async (data) => {
    await createTransaction(data);
    loadData();
  };

  const handleDeleteTransaction = async (id) => {
    await deleteTransaction(id);
    loadData();
  };

  const cardStyle = {
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "24px",
    marginBottom: "24px",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
  };

  // 선택된 yearMonth(YYYY-MM)를 기반으로 해당 월의 1일 날짜(YYYY-MM-01) 생성
  const defaultDate = `${yearMonth}-01`;

  return (
    <div style={{ maxWidth: "880px", margin: "40px auto", padding: "0 20px" }}>
      {/* 상단 헤더 & 조회 연월 */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "28px",
        }}
      >
        <h2 style={{ fontSize: "22px", fontWeight: "700" }}>
          자산 / 가계부 관리 Dashboard
        </h2>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <label
            style={{ fontSize: "14px", fontWeight: "500", color: "#4b5563" }}
          >
            조회 월:
          </label>
          <input
            type="month"
            value={yearMonth}
            onChange={(e) => setYearMonth(e.target.value)}
            style={{
              padding: "6px 12px",
              borderRadius: "6px",
              border: "1px solid #d1d5db",
              outline: "none",
            }}
          />
        </div>
      </div>

      {/* 예산 달성률 바 */}
      <div style={cardStyle}>
        <BudgetProgressBar
          budgetStatus={budgetStatus}
          onSaveBudget={handleSaveBudget}
        />
      </div>

      {/* 카테고리 지출 통계 차트 */}
      <div style={cardStyle}>
        <h3
          style={{ fontSize: "16px", fontWeight: "600", marginBottom: "16px" }}
        >
          월별 카테고리 지출 비율
        </h3>
        <CategoryChart data={stats} />
      </div>

      {/* 거래 기록 입력 및 목록 */}
      <div style={cardStyle}>
        <h3
          style={{ fontSize: "16px", fontWeight: "600", marginBottom: "16px" }}
        >
          수입 / 지출 내역 관리
        </h3>
        {/* key={yearMonth}를 추가하여 조회월 변경 시 폼 내부 날짜 state 재초기화 */}
        <TransactionForm
          key={yearMonth}
          defaultDate={defaultDate}
          onAddTransaction={handleAddTransaction}
        />
        <TransactionList
          transactions={transactions}
          onDeleteTransaction={handleDeleteTransaction}
        />
      </div>
    </div>
  );
};

export default DashboardPage;
