package com.example.asset.dto;

import java.math.BigDecimal;

public class BudgetDto {
    private Long id;
    private String yearMonth;
    private BigDecimal amount;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getYearMonth() { return yearMonth; }
    public void setYearMonth(String yearMonth) { this.yearMonth = yearMonth; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
}