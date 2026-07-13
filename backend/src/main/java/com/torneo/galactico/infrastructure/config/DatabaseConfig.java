package com.torneo.galactico.infrastructure.config;

import com.zaxxer.hikari.HikariDataSource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;
import java.net.URI;

@Configuration
public class DatabaseConfig {

    private final String databaseUrl;
    private final String defaultUsername;
    private final String defaultPassword;

    public DatabaseConfig(
            @Value("${DATABASE_URL:jdbc:postgresql://localhost:5432/torneo_galactico}") String databaseUrl,
            @Value("${DATABASE_USERNAME:torneo_user}") String defaultUsername,
            @Value("${DATABASE_PASSWORD:torneo_pass}") String defaultPassword) {
        this.databaseUrl = databaseUrl;
        this.defaultUsername = defaultUsername;
        this.defaultPassword = defaultPassword;
    }

    @Bean
    @Primary
    public DataSource dataSource() throws Exception {
        String rawUrl = databaseUrl;
        if (rawUrl.startsWith("jdbc:")) {
            rawUrl = rawUrl.substring(5);
        }

        URI uri = new URI(rawUrl);
        String host = uri.getHost();
        int port = uri.getPort() == -1 ? 5432 : uri.getPort();
        String dbName = uri.getPath().replaceFirst("^/", "");

        String username = defaultUsername;
        String password = defaultPassword;

        // Credentials embedded in the URL (e.g. Heroku-style postgres:// URIs) take precedence
        // over the separate USERNAME/PASSWORD env vars.
        if (uri.getUserInfo() != null) {
            String[] userInfo = uri.getUserInfo().split(":", 2);
            username = userInfo[0];
            password = userInfo.length > 1 ? userInfo[1] : defaultPassword;
        }

        String jdbcUrl = "jdbc:postgresql://" + host + ":" + port + "/" + dbName;

        HikariDataSource ds = new HikariDataSource();
        ds.setJdbcUrl(jdbcUrl);
        ds.setUsername(username);
        ds.setPassword(password);
        ds.setDriverClassName("org.postgresql.Driver");
        return ds;
    }
}
