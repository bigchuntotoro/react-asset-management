package com.example.asset.service;

import com.example.asset.dto.StatsDto;
import com.example.asset.mapper.StatsMapper;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
public class StatsService {

    private final StatsMapper statsMapper;

    public StatsService(StatsMapper statsMapper) {
        this.statsMapper = statsMapper;
    }

    public List<StatsDto> getCategoryStats(String yearMonth, String type) {
        List<StatsDto> statsList = statsMapper.selectCategoryStats(yearMonth, type);
        BigDecimal total = statsMapper.selectTotalAmountByMonth(yearMonth, type);

        if (total.compareTo(BigDecimal.ZERO) > 0) {
            for (StatsDto dto : statsList) {
                double rate = dto.getTotalAmount()
                        .divide(total, 4, RoundingMode.HALF_UP)
                        .multiply(BigDecimal.valueOf(100))
                        .doubleValue();
                dto.setPercentage(rate);
            }
        }
        return statsList;
    }
}