package com.torneo.galactico;

import com.torneo.galactico.application.service.CombatService;
import com.torneo.galactico.application.service.SpeciesService;
import com.torneo.galactico.domain.entity.Combat;
import com.torneo.galactico.domain.entity.Species;
import com.torneo.galactico.infrastructure.repository.CombatRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@DisplayName("CombatService - unit tests")
class CombatServiceTest {

    @Mock
    private CombatRepository combatRepository;

    @Mock
    private SpeciesService speciesService;

    @InjectMocks
    private CombatService combatService;

    private Species strong;
    private Species weak;
    private Species tieA;
    private Species tieB;

    @BeforeEach
    void setUp() {
        strong = new Species("Zorgon", 900, "Plasma Shield");
        strong.setId(1L);

        weak = new Species("Blobfish", 200, "Slimeball");
        weak.setId(2L);

        tieA = new Species("Alpha", 500, "Teleport");
        tieA.setId(3L);

        tieB = new Species("Zeta", 500, "Fireball");
        tieB.setId(4L);
    }

    // --- determineWinner ---

    @Test
    @DisplayName("determineWinner() returns the species with the higher powerLevel")
    void determineWinnerByPowerLevel() {
        assertThat(combatService.determineWinner(strong, weak)).isEqualTo(strong);
        assertThat(combatService.determineWinner(weak, strong)).isEqualTo(strong);
    }

    @Test
    @DisplayName("determineWinner() on tie resolves alphabetically (case-insensitive)")
    void determineWinnerTieAlphabetical() {
        // "Alpha" < "Zeta" so Alpha wins regardless of argument order
        assertThat(combatService.determineWinner(tieA, tieB)).isEqualTo(tieA);
        assertThat(combatService.determineWinner(tieB, tieA)).isEqualTo(tieA);
    }

    @Test
    @DisplayName("determineWinner() tie comparison is case-insensitive")
    void determineWinnerTieCaseInsensitive() {
        Species upperAlpha = new Species("ALPHA", 500, "Upper Blast");
        Species lowerZeta  = new Species("zeta",  500, "Lower Zap");

        assertThat(combatService.determineWinner(upperAlpha, lowerZeta)).isEqualTo(upperAlpha);
    }

    // --- fight() ---

    @Test
    @DisplayName("fight() throws when a species ID does not exist")
    void fightUnknownSpeciesThrows() {
        when(speciesService.findById(99L))
                .thenThrow(new IllegalArgumentException("Species not found with id: 99"));

        assertThatThrownBy(() -> combatService.fight(1L, 99L))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("99");
    }

    @Test
    @DisplayName("fight() throws when both IDs are the same")
    void fightSameSpeciesThrows() {
        assertThatThrownBy(() -> combatService.fight(1L, 1L))
                .isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    @DisplayName("fight() persists a Combat with the correct winner")
    void fightPersistsCombat() {
        when(speciesService.findById(1L)).thenReturn(strong);
        when(speciesService.findById(2L)).thenReturn(weak);

        Combat expected = new Combat(1L, 2L, 1L, "Zorgon", "Blobfish", "Zorgon", LocalDateTime.now());
        expected.setId(10L);
        when(combatRepository.save(any(Combat.class))).thenReturn(expected);

        Combat result = combatService.fight(1L, 2L);

        assertThat(result.getWinnerId()).isEqualTo(1L);
        assertThat(result.getWinnerName()).isEqualTo("Zorgon");
    }

    // --- fightRandom() ---

    @Test
    @DisplayName("fightRandom() throws when fewer than 2 species exist")
    void fightRandomNotEnoughSpeciesThrows() {
        when(speciesService.findAll()).thenReturn(Collections.singletonList(strong));

        assertThatThrownBy(() -> combatService.fightRandom())
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("2 species");
    }

    @Test
    @DisplayName("fightRandom() throws when species list is empty")
    void fightRandomEmptyListThrows() {
        when(speciesService.findAll()).thenReturn(Collections.emptyList());

        assertThatThrownBy(() -> combatService.fightRandom())
                .isInstanceOf(IllegalStateException.class);
    }

    @Test
    @DisplayName("fightRandom() selects two distinct species and runs a fight")
    void fightRandomSucceeds() {
        when(speciesService.findAll()).thenReturn(List.of(strong, weak));
        when(speciesService.findById(strong.getId())).thenReturn(strong);
        when(speciesService.findById(weak.getId())).thenReturn(weak);

        Combat expected = new Combat(1L, 2L, 1L, "Zorgon", "Blobfish", "Zorgon", LocalDateTime.now());
        expected.setId(10L);
        when(combatRepository.save(any(Combat.class))).thenReturn(expected);

        Combat result = combatService.fightRandom();

        assertThat(result).isNotNull();
        assertThat(result.getSpecies1Id()).isNotEqualTo(result.getSpecies2Id());
    }
}
