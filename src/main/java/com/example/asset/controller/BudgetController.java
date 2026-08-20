package com.example.asset.controller;

import com.example.asset.dto.BudgetDto;
import com.example.asset.dto.BudgetStatusDto;
import com.example.asset.service.BudgetService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/budgets")
@CrossOrigin(origins = "*")
public class BudgetController {

    private final BudgetService budgetService;

    public BudgetController(BudgetService budgetService) {
        this.budgetService = budgetService;
    }

    @PostMapping
    public void saveBudget(@RequestBody BudgetDto dto) {
        budgetService.saveOrUpdateBudget(dto);
    }

    @GetMapping("/status")
    public BudgetStatusDto getBudgetStatus(@RequestParam String yearMonth) {
        return budgetService.getBudgetStatus(yearMonth);
    }
}