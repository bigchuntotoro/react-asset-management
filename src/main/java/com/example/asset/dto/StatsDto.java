package com.example.asset.dto;

import java.math.BigDecimal;

public class StatsDto {
    private String category;
    private BigDecimal totalAmount;
    private Double percentage;

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
    public Double getPercentage() { return percentage; }
    public void setPercentage(Double percentage) { this.percentage = percentage; }
}