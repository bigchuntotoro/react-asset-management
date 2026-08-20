package com.example.asset.dto;

import java.math.BigDecimal;

public class BudgetStatusDto {
    private String yearMonth;
    private BigDecimal budgetAmount;
    private BigDecimal totalExpense;
    public Double achievementRate;

    public BudgetStatusDto(String yearMonth, BigDecimal budgetAmount, BigDecimal totalExpense, Double achievementRate) {
        this.yearMonth = yearMonth;
        this.budgetAmount = budgetAmount;
        this.totalExpense = totalExpense;
        this.achievementRate = achievementRate;
    }

    public String getYearMonth() { return yearMonth; }
    public BigDecimal getBudgetAmount() { return budgetAmount; }
    public BigDecimal getTotalExpense() { return totalExpense; }
    public Double getAchievementRate() { return achievementRate; }
}