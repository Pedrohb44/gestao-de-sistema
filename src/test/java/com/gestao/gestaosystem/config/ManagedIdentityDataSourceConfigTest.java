package com.gestao.gestaosystem.config;

import com.zaxxer.hikari.HikariDataSource;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.runner.ApplicationContextRunner;

import javax.sql.DataSource;

import static org.assertj.core.api.Assertions.assertThat;

class ManagedIdentityDataSourceConfigTest {

    private final ApplicationContextRunner contextRunner = new ApplicationContextRunner()
            .withUserConfiguration(ManagedIdentityDataSourceConfig.class);

    @Test
    void shouldCreateHikariDataSourceForManagedIdentityConfiguration() {
        contextRunner
                .withPropertyValues(
                        "spring.datasource.url=jdbc:postgresql://example.postgres.database.azure.com:5432/appdb?sslmode=require",
                        "spring.datasource.username=test-user",
                        "spring.datasource.driver-class-name=org.postgresql.Driver",
                        "spring.datasource.azure.passwordless-enabled=true",
                        "spring.cloud.azure.credential.managed-identity-enabled=true",
                        "spring.cloud.azure.credential.client-id=test-client-id"
                )
                .run(context -> {
                    assertThat(context).hasSingleBean(DataSource.class);
                    DataSource dataSource = context.getBean(DataSource.class);
                    assertThat(dataSource).isInstanceOf(HikariDataSource.class);
                    assertThat(((HikariDataSource) dataSource).getUsername()).isEqualTo("test-user");
                });
    }

    @Test
    void shouldCreateLocalH2DataSourceWhenAzureSettingsAreNotEnabled() {
        contextRunner
                .withPropertyValues(
                        "spring.datasource.url=jdbc:h2:mem:gestao_local;DB_CLOSE_DELAY=-1;MODE=PostgreSQL",
                        "spring.datasource.username=sa",
                        "spring.datasource.driver-class-name=org.h2.Driver"
                )
                .run(context -> {
                    assertThat(context).hasSingleBean(DataSource.class);
                    DataSource dataSource = context.getBean(DataSource.class);
                    assertThat(dataSource).isInstanceOf(HikariDataSource.class);
                    try (java.sql.Connection connection = dataSource.getConnection()) {
                        assertThat(connection.isValid(5)).isTrue();
                    }
                });
    }
}
