package com.torneo.galactico;

import com.torneo.galactico.application.service.SpeciesService;
import com.torneo.galactico.domain.entity.Species;
import com.torneo.galactico.infrastructure.repository.SpeciesRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@DisplayName("SpeciesService - unit tests")
class SpeciesServiceTest {

    @Mock
    private SpeciesRepository speciesRepository;

    @InjectMocks
    private SpeciesService speciesService;

    private Species savedSpecies;

    @BeforeEach
    void setUp() {
        savedSpecies = new Species("Zorgon", 900, "Plasma Shield");
        savedSpecies.setId(1L);
    }

    @Test
    @DisplayName("create() throws when a species with the same name already exists")
    void createDuplicateNameThrows() {
        when(speciesRepository.existsByNameIgnoreCase("Zorgon")).thenReturn(true);

        assertThatThrownBy(() -> speciesService.create("Zorgon", 900, "Plasma Shield"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Zorgon");
    }

    @Test
    @DisplayName("create() persists and returns the new species")
    void createSucceeds() {
        when(speciesRepository.existsByNameIgnoreCase(anyString())).thenReturn(false);
        when(speciesRepository.save(any(Species.class))).thenReturn(savedSpecies);

        Species result = speciesService.create("Zorgon", 900, "Plasma Shield");

        assertThat(result.getName()).isEqualTo("Zorgon");
        assertThat(result.getPowerLevel()).isEqualTo(900);
        verify(speciesRepository).save(any(Species.class));
    }

    @Test
    @DisplayName("findById() throws when ID does not exist")
    void findByIdNotFoundThrows() {
        when(speciesRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> speciesService.findById(99L))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("99");
    }

    @Test
    @DisplayName("findById() returns the species when ID exists")
    void findByIdSuccess() {
        when(speciesRepository.findById(1L)).thenReturn(Optional.of(savedSpecies));

        Species result = speciesService.findById(1L);

        assertThat(result).isEqualTo(savedSpecies);
    }
}
