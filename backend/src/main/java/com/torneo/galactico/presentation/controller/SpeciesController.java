package com.torneo.galactico.presentation.controller;

import com.torneo.galactico.application.service.SpeciesService;
import com.torneo.galactico.domain.entity.Species;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/species")
@Tag(name = "Species", description = "Endpoints for managing galactic species")
public class SpeciesController {

    private final SpeciesService speciesService;

    public SpeciesController(SpeciesService speciesService) {
        this.speciesService = speciesService;
    }

    @GetMapping({"", "/"})
    @Operation(summary = "List all species")
    public ResponseEntity<List<SpeciesResponse>> findAll() {
        List<SpeciesResponse> responses = speciesService.findAll()
                .stream()
                .map(SpeciesResponse::from)
                .toList();
        return ResponseEntity.ok(responses);
    }

    @PostMapping({"", "/"})
    @Operation(summary = "Create a new species")
    public ResponseEntity<SpeciesResponse> create(@Valid @RequestBody SpeciesRequest request) {
        Species created = speciesService.create(
                request.name(),
                request.powerLevel(),
                request.specialAbility()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(SpeciesResponse.from(created));
    }
}
