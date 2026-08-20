package com.example.asset.controller;

import com.example.asset.dto.TransactionDto;
import com.example.asset.service.AccountBookService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "*")
public class AccountBookController {

    private final AccountBookService accountBookService;

    public AccountBookController(AccountBookService accountBookService) {
        this.accountBookService = accountBookService;
    }

    @GetMapping
    public List<TransactionDto> getTransactions(@RequestParam String yearMonth) {
        return accountBookService.getMonthlyTransactions(yearMonth);
    }

    @PostMapping
    public void createTransaction(@RequestBody TransactionDto dto) {
        accountBookService.addTransaction(dto);
    }

    @DeleteMapping("/{id}")
    public void deleteTransaction(@PathVariable Long id) {
        accountBookService.removeTransaction(id);
    }
}