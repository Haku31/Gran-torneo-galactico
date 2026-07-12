package com.torneo.galactico.infrastructure.config;

import com.zaxxer.hikari.HikariDataSource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;

@Configuration
public class DatabaseConfig {

    @Value("${DATABASE_URL:jdbc:postgresql://localhost:5432/torneo_galactico}")
    private String databaseUrl;

    @Value("${DATABASE_USERNAME:torneo_user}")
    private String username;

    @Value("${DATABASE_PASSWORD:torneo_pass}")
    private String password;

    @Bean
    @Primary
    public DataSource dataSource() {
        String jdbcUrl = databaseUrl.startsWith("jdbc:")
                ? databaseUrl
                : "jdbc:" + databaseUrl;

        HikariDataSource ds = new HikariDataSource();
        ds.setJdbcUrl(jdbcUrl);
        ds.setUsername(username);
        ds.setPassword(password);
        ds.setDriverClassName("org.postgresql.Driver");
        return ds;
    }
}
