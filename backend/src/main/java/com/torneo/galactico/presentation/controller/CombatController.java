package com.torneo.galactico.presentation.controller;

import com.torneo.galactico.application.service.CombatService;
import com.torneo.galactico.domain.entity.Combat;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/combats")
@Tag(name = "Combats", description = "Endpoints for initiating and listing combats")
public class CombatController {

    private final CombatService combatService;

    public CombatController(CombatService combatService) {
        this.combatService = combatService;
    }

    @PostMapping({"", "/"})
    @Operation(summary = "Start a combat between two species")
    public ResponseEntity<CombatResponse> fight(@Valid @RequestBody CombatRequest request) {
        Combat combat = combatService.fight(request.species1Id(), request.species2Id());
        return ResponseEntity.status(HttpStatus.CREATED).body(CombatResponse.from(combat));
    }

    @PostMapping("/random")
    @Operation(summary = "Start a combat between two randomly selected species")
    public ResponseEntity<CombatResponse> fightRandom() {
        Combat combat = combatService.fightRandom();
        return ResponseEntity.status(HttpStatus.CREATED).body(CombatResponse.from(combat));
    }

    @GetMapping({"", "/"})
    @Operation(summary = "List all combats")
    public ResponseEntity<List<CombatResponse>> findAll() {
        List<CombatResponse> responses = combatService.findAll()
                .stream()
                .map(CombatResponse::from)
                .toList();
        return ResponseEntity.ok(responses);
    }
}
