package com.gestao.gestaosystem.config;

import com.zaxxer.hikari.HikariDataSource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.StringUtils;

import javax.sql.DataSource;

@Configuration
public class ManagedIdentityDataSourceConfig {

    @Bean
    @ConditionalOnMissingBean(DataSource.class)
    public DataSource dataSource(@Value("${spring.datasource.url}") String url,
                                 @Value("${spring.datasource.username}") String username,
                                 @Value("${spring.datasource.password:}") String password,
                                 @Value("${spring.datasource.driver-class-name:}") String driverClassName,
                                 @Value("${spring.datasource.hikari.maximum-pool-size:5}") int maximumPoolSize,
                                 @Value("${spring.datasource.azure.passwordless-enabled:false}") boolean passwordlessEnabled,
                                 @Value("${spring.cloud.azure.credential.managed-identity-enabled:false}") boolean managedIdentityEnabled) {
        HikariDataSource dataSource = new HikariDataSource();
        dataSource.setJdbcUrl(url);
        dataSource.setUsername(username);
        dataSource.setMaximumPoolSize(maximumPoolSize);

        if (StringUtils.hasText(driverClassName)) {
            dataSource.setDriverClassName(driverClassName);
        }

        if (passwordlessEnabled && managedIdentityEnabled) {
            dataSource.addDataSourceProperty("azure.passwordless-enabled", true);
        } else {
            dataSource.setPassword(password);
        }

        return dataSource;
    }
}
