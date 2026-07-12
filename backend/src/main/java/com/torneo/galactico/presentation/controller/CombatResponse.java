package com.torneo.galactico.presentation.controller;

import com.torneo.galactico.domain.entity.Combat;

import java.time.LocalDateTime;

public record CombatResponse(
        Long id,
        Long species1Id,
        Long species2Id,
        Long winnerId,
        String species1Name,
        String species2Name,
        String winnerName,
        LocalDateTime fightDate
) {
    public static CombatResponse from(Combat combat) {
        return new CombatResponse(
                combat.getId(),
                combat.getSpecies1Id(),
                combat.getSpecies2Id(),
                combat.getWinnerId(),
                combat.getSpecies1Name(),
                combat.getSpecies2Name(),
                combat.getWinnerName(),
                combat.getFightDate()
        );
    }
}
