package com.example.asset.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class TransactionDto {
    private Long id;
    private String type;
    private String category;
    private BigDecimal amount;
    private LocalDate transactionDate;
    private String memo;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    public LocalDate getTransactionDate() { return transactionDate; }
    public void setTransactionDate(LocalDate transactionDate) { this.transactionDate = transactionDate; }
    public String getMemo() { return memo; }
    public void setMemo(String memo) { this.memo = memo; }
}