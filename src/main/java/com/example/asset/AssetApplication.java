package com.example.asset;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import javax.sql.DataSource;

@SpringBootApplication
public class AssetApplication {

    public static void main(String[] args) {
        SpringApplication.run(AssetApplication.class, args);
    }

    // 서버 시작 시 DB 연결 확인
    @Bean
    CommandLineRunner checkDatabaseConnection(DataSource dataSource) {
        return args -> {
            try (var connection = dataSource.getConnection()) {
                System.out.println("=================================");
                System.out.println("DB 연결 성공!");
                System.out.println("Database: "
                        + connection.getMetaData().getDatabaseProductName());
                System.out.println("URL: "
                        + connection.getMetaData().getURL());
                System.out.println("User: "
                        + connection.getMetaData().getUserName());
                System.out.println("=================================");
            }
        };
    }

}
