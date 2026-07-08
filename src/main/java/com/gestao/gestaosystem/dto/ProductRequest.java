package com.gestao.gestaosystem.dto;

import java.math.BigDecimal;

public record ProductRequest(String name, String description, Integer quantity, BigDecimal price, String category) {
}
