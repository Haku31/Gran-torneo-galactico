package com.torneo.galactico.presentation.controller;

import jakarta.validation.constraints.NotNull;

public record CombatRequest(
        @NotNull(message = "species1Id is required")
        Long species1Id,

        @NotNull(message = "species2Id is required")
        Long species2Id
) {}
