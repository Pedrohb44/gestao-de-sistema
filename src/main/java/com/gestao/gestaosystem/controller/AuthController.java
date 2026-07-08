package com.gestao.gestaosystem.controller;

import com.gestao.gestaosystem.dto.AuthResponse;
import com.gestao.gestaosystem.dto.LoginRequest;
import com.gestao.gestaosystem.dto.RegisterRequest;
import com.gestao.gestaosystem.service.AuthService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public AuthResponse register(@RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @GetMapping("/me")
    public Map<String, String> me(@AuthenticationPrincipal UserDetails userDetails) {
        return Map.of("username", userDetails.getUsername());
    }
}
