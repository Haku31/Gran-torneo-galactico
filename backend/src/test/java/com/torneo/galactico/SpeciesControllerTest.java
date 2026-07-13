package com.torneo.galactico;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.torneo.galactico.application.service.SpeciesService;
import com.torneo.galactico.domain.entity.Species;
import com.torneo.galactico.presentation.controller.SpeciesController;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Map;

import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(SpeciesController.class)
@DisplayName("SpeciesController - web layer tests")
class SpeciesControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private SpeciesService speciesService;

    @Test
    @DisplayName("GET /api/species returns 200 with the species list")
    void listSpeciesReturns200() throws Exception {
        Species s = new Species("Zorgon", 900, "Plasma Shield");
        s.setId(1L);
        when(speciesService.findAll()).thenReturn(List.of(s));

        mockMvc.perform(get("/api/species"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].name").value("Zorgon"));
    }

    @Test
    @DisplayName("POST /api/species with valid body returns 201")
    void createSpeciesReturns201() throws Exception {
        Species created = new Species("Zorgon", 900, "Plasma Shield");
        created.setId(1L);
        when(speciesService.create(anyString(), anyInt(), anyString())).thenReturn(created);

        Map<String, Object> body = Map.of(
                "name", "Zorgon",
                "powerLevel", 900,
                "specialAbility", "Plasma Shield"
        );

        mockMvc.perform(post("/api/species")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Zorgon"))
                .andExpect(jsonPath("$.powerLevel").value(900));
    }

    @Test
    @DisplayName("POST /api/species with a duplicate name returns 400")
    void createSpeciesDuplicateNameReturns400() throws Exception {
        when(speciesService.create(anyString(), anyInt(), anyString()))
                .thenThrow(new IllegalArgumentException("A species with name 'Zorgon' already exists."));

        Map<String, Object> body = Map.of(
                "name", "Zorgon",
                "powerLevel", 900,
                "specialAbility", "Plasma Shield"
        );

        mockMvc.perform(post("/api/species")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("POST /api/species with blank name returns 400 (validation)")
    void createSpeciesBlankNameReturns400() throws Exception {
        Map<String, Object> body = Map.of(
                "name", "",
                "powerLevel", 900,
                "specialAbility", "Plasma Shield"
        );

        mockMvc.perform(post("/api/species")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isBadRequest());
    }
}
