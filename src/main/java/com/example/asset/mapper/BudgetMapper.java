package com.example.asset.mapper;

import com.example.asset.dto.BudgetDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface BudgetMapper {
    BudgetDto selectBudgetByMonth(@Param("yearMonth") String yearMonth);
    int upsertBudget(BudgetDto budget);
}