package com.example.asset.mapper;

import com.example.asset.dto.TransactionDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

@Mapper
public interface AccountBookMapper {
    List<TransactionDto> selectTransactionsByMonth(@Param("yearMonth") String yearMonth);
    int insertTransaction(TransactionDto transaction);
    int deleteTransaction(@Param("id") Long id);
}