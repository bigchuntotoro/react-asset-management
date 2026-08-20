package com.example.asset.controller;

import com.example.asset.dto.StatsDto;
import com.example.asset.service.StatsService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stats")
@CrossOrigin(origins = "*")
public class StatsController {

    private final StatsService statsService;

    public StatsController(StatsService statsService) {
        this.statsService = statsService;
    }

    @GetMapping("/category")
    public List<StatsDto> getCategoryStats(@RequestParam String yearMonth,
                                           @RequestParam(defaultValue = "EXPENSE") String type) {
        return statsService.getCategoryStats(yearMonth, type);
    }
}