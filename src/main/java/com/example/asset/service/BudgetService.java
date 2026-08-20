package com.example.asset.service;

import com.example.asset.dto.BudgetDto;
import com.example.asset.dto.BudgetStatusDto;
import com.example.asset.mapper.BudgetMapper;
import com.example.asset.mapper.StatsMapper;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
public class BudgetService {

    private final BudgetMapper budgetMapper;
    private final StatsMapper statsMapper;

    public BudgetService(BudgetMapper budgetMapper, StatsMapper statsMapper) {
        this.budgetMapper = budgetMapper;
        this.statsMapper = statsMapper;
    }

    public void saveOrUpdateBudget(BudgetDto budgetDto) {
        budgetMapper.upsertBudget(budgetDto);
    }

    public BudgetStatusDto getBudgetStatus(String yearMonth) {
        BudgetDto budget = budgetMapper.selectBudgetByMonth(yearMonth);
        BigDecimal budgetAmount = (budget != null) ? budget.getAmount() : BigDecimal.ZERO;
        BigDecimal totalExpense = statsMapper.selectTotalAmountByMonth(yearMonth, "EXPENSE");

        double achievementRate = 0.0;
        if (budgetAmount.compareTo(BigDecimal.ZERO) > 0) {
            achievementRate = totalExpense.divide(budgetAmount, 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100))
                    .doubleValue();
        }

        return new BudgetStatusDto(yearMonth, budgetAmount, totalExpense, achievementRate);
    }
}