package com.torneo.galactico.presentation.controller;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record SpeciesRequest(
        @NotBlank(message = "Name is required")
        String name,

        @NotNull(message = "Power level is required")
        @Positive(message = "Power level must be positive")
        Integer powerLevel,

        @NotBlank(message = "Special ability is required")
        String specialAbility
) {}
