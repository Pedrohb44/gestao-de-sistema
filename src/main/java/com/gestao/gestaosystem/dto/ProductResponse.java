package com.gestao.gestaosystem.dto;

import java.math.BigDecimal;

public record ProductResponse(Long id, String name, String description, Integer quantity, BigDecimal price, String category) {
}
