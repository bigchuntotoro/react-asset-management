package com.example.asset.mapper;

import com.example.asset.dto.StatsDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.math.BigDecimal;
import java.util.List;

@Mapper
public interface StatsMapper {
    List<StatsDto> selectCategoryStats(@Param("yearMonth") String yearMonth, @Param("type") String type);
    BigDecimal selectTotalAmountByMonth(@Param("yearMonth") String yearMonth, @Param("type") String type);
}