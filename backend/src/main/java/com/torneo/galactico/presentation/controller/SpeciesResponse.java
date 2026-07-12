package com.torneo.galactico.presentation.controller;

import com.torneo.galactico.domain.entity.Species;

public record SpeciesResponse(
        Long id,
        String name,
        Integer powerLevel,
        String specialAbility,
        Integer victories
) {
    public static SpeciesResponse from(Species species) {
        return new SpeciesResponse(
                species.getId(),
                species.getName(),
                species.getPowerLevel(),
                species.getSpecialAbility(),
                species.getVictories()
        );
    }
}
