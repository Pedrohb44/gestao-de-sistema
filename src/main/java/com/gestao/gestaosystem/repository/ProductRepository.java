package com.gestao.gestaosystem.repository;

import com.gestao.gestaosystem.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {
}
