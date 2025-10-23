package com.fiscal;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * Classe principal da aplicação Spring Boot
 * Padrão: Application Entry Point
 */
@SpringBootApplication
@EnableScheduling
public class AppFiscalApplication {

    public static void main(String[] args) {
        SpringApplication.run(AppFiscalApplication.class, args);
    }
}


