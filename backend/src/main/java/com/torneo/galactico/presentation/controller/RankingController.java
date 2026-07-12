package com.torneo.galactico.presentation.controller;

import com.torneo.galactico.application.service.SpeciesService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ranking")
@Tag(name = "Ranking", description = "Endpoints for the galactic ranking")
public class RankingController {

    private final SpeciesService speciesService;

    public RankingController(SpeciesService speciesService) {
        this.speciesService = speciesService;
    }

    @GetMapping("/")
    @Operation(summary = "Get ranking of species ordered by victories descending")
    public ResponseEntity<List<SpeciesResponse>> getRanking() {
        List<SpeciesResponse> ranking = speciesService.findAllByVictoriesDesc()
                .stream()
                .map(SpeciesResponse::from)
                .toList();
        return ResponseEntity.ok(ranking);
    }
}
