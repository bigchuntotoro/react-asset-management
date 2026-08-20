package com.example.asset.service;

import com.example.asset.dto.TransactionDto;
import com.example.asset.mapper.AccountBookMapper;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AccountBookService {

    private final AccountBookMapper accountBookMapper;

    public AccountBookService(AccountBookMapper accountBookMapper) {
        this.accountBookMapper = accountBookMapper;
    }

    public List<TransactionDto> getMonthlyTransactions(String yearMonth) {
        return accountBookMapper.selectTransactionsByMonth(yearMonth);
    }

    public void addTransaction(TransactionDto dto) {
        accountBookMapper.insertTransaction(dto);
    }

    public void removeTransaction(Long id) {
        accountBookMapper.deleteTransaction(id);
    }
}