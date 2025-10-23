package com.fiscal.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * Controller de teste para verificar se o backend está funcionando
 */
@RestController
@RequestMapping("/api/test")
public class TestController {
    
    @GetMapping("/health")
    public Map<String, Object> health() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "OK");
        response.put("timestamp", LocalDateTime.now());
        response.put("message", "Backend funcionando corretamente!");
        return response;
    }
    
    @GetMapping("/info")
    public Map<String, Object> info() {
        Map<String, Object> response = new HashMap<>();
        response.put("application", "App Fiscal");
        response.put("version", "1.0.0");
        response.put("description", "Sistema colaborativo para gerenciamento de prazos fiscais");
        response.put("java_version", System.getProperty("java.version"));
        response.put("spring_version", org.springframework.core.SpringVersion.getVersion());
        return response;
    }
}


