package com.gestao.gestaosystem;

import com.gestao.gestaosystem.security.JwtUtil;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class JwtUtilTest {

    @Test
    void shouldCreateAndValidateToken() {
        // Use a cryptographically strong key: 32+ characters for HS256 (256 bits minimum)
        JwtUtil jwtUtil = new JwtUtil("test-secret-key-12345678901234567890abcdefgh");

        String token = jwtUtil.generateToken("admin");

        assertTrue(jwtUtil.isTokenValid(token, "admin"));
        assertEquals("admin", jwtUtil.extractUsername(token));
    }
}
