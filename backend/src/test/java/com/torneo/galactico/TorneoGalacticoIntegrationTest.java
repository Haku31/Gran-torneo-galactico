package com.torneo.galactico;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.torneo.galactico.application.service.CombatService;
import com.torneo.galactico.application.service.SpeciesService;
import com.torneo.galactico.domain.entity.Combat;
import com.torneo.galactico.domain.entity.Species;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@DisplayName("Torneo Galáctico - Integration Tests")
class TorneoGalacticoIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private SpeciesService speciesService;

    @Autowired
    private CombatService combatService;

    @Test
    @DisplayName("POST /api/species/ creates a new species")
    void createSpecies() throws Exception {
        Map<String, Object> body = Map.of(
                "name", "Kryptonian",
                "powerLevel", 9500,
                "specialAbility", "Solar Energy Absorption"
        );

        mockMvc.perform(post("/api/species/")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Kryptonian"))
                .andExpect(jsonPath("$.powerLevel").value(9500))
                .andExpect(jsonPath("$.victories").value(0));
    }

    @Test
    @DisplayName("GET /api/species/ returns list of species")
    void listSpecies() throws Exception {
        speciesService.create("TestSpecies", 100, "Nothing");

        mockMvc.perform(get("/api/species/"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    @DisplayName("POST /api/combats/ resolves combat and increments winner victories")
    void createCombat() throws Exception {
        Species s1 = speciesService.create("PowerfulOne_" + System.nanoTime(), 1000, "Laser");
        Species s2 = speciesService.create("WeakOne_" + System.nanoTime(), 10, "Pebble");

        Map<String, Object> body = Map.of(
                "species1Id", s1.getId(),
                "species2Id", s2.getId()
        );

        mockMvc.perform(post("/api/combats/")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.winnerId").value(s1.getId()))
                .andExpect(jsonPath("$.winnerName").value(s1.getName()));

        // Verify victories incremented
        Species updatedWinner = speciesService.findById(s1.getId());
        assertThat(updatedWinner.getVictories()).isEqualTo(1);
    }

    @Test
    @DisplayName("GET /api/ranking/ returns species ordered by victories desc")
    void getRanking() throws Exception {
        mockMvc.perform(get("/api/ranking/"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    @DisplayName("POST /api/species/ returns 400 when name is blank")
    void createSpeciesValidationError() throws Exception {
        Map<String, Object> body = Map.of(
                "name", "",
                "powerLevel", 100,
                "specialAbility", "Nothing"
        );

        mockMvc.perform(post("/api/species/")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isBadRequest());
    }
}
