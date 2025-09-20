package com.rada;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;

import java.sql.Connection;
import java.sql.SQLException;

public class Database {
    private static HikariDataSource ds;

    public static void init() {
        HikariConfig cfg = new HikariConfig();
        cfg.setJdbcUrl(System.getenv().getOrDefault("DATABASE_URL", "jdbc:postgresql://localhost:5432/rada"));
        cfg.setUsername(System.getenv().getOrDefault("DB_USER", ""));
        cfg.setPassword(System.getenv().getOrDefault("DB_PASSWORD", ""));
        cfg.setMaximumPoolSize(10);
        ds = new HikariDataSource(cfg);
    }

    public static Connection getConnection() throws SQLException {
        if (ds == null) init();
        return ds.getConnection();
    }
}