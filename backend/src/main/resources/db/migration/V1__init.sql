-- Flyway migration V1: Initial schema for Torneo Galáctico

CREATE TABLE IF NOT EXISTS species (
    id              BIGSERIAL       PRIMARY KEY,
    name            VARCHAR(255)    NOT NULL UNIQUE,
    power_level     INTEGER         NOT NULL,
    special_ability VARCHAR(255)    NOT NULL,
    victories       INTEGER         NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS combats (
    id            BIGSERIAL        PRIMARY KEY,
    species1_id   BIGINT           NOT NULL,
    species2_id   BIGINT           NOT NULL,
    winner_id     BIGINT           NOT NULL,
    species1_name VARCHAR(255)     NOT NULL,
    species2_name VARCHAR(255)     NOT NULL,
    winner_name   VARCHAR(255)     NOT NULL,
    fight_date    TIMESTAMP        NOT NULL
);
