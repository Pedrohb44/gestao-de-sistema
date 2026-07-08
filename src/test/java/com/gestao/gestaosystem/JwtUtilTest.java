package com.gestao.gestaosystem;

import com.gestao.gestaosystem.security.JwtUtil;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class JwtUtilTest {

    @Test
    void shouldCreateAndValidateToken() {
        JwtUtil jwtUtil = new JwtUtil("test-secret-key-1234567890");

        String token = jwtUtil.generateToken("admin");

        assertTrue(jwtUtil.isTokenValid(token, "admin"));
        assertEquals("admin", jwtUtil.extractUsername(token));
    }
}
