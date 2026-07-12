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

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(MockitoExtension.class)
@DisplayName("SpeciesService - Combat logic unit tests")
class SpeciesServiceTest {

    @Mock
    private SpeciesRepository speciesRepository;

    @InjectMocks
    private SpeciesService speciesService;

    private Species strongSpecies;
    private Species weakSpecies;
    private Species tieSpeciesA;
    private Species tieSpeciesB;

    @BeforeEach
    void setUp() {
        strongSpecies = new Species("Zorgon", 900, "Plasma Shield");
        weakSpecies   = new Species("Blobfish", 200, "Slimeball");
        tieSpeciesA   = new Species("Alpha", 500, "Teleport");
        tieSpeciesB   = new Species("Zeta",  500, "Fireball");
    }

    @Test
    @DisplayName("Higher powerLevel wins the combat")
    void testWinnerByPowerLevel() {
        Species winner = speciesService.determineWinner(strongSpecies, weakSpecies);
        assertThat(winner).isEqualTo(strongSpecies);
    }

    @Test
    @DisplayName("Higher powerLevel wins regardless of argument order")
    void testWinnerByPowerLevelReversed() {
        Species winner = speciesService.determineWinner(weakSpecies, strongSpecies);
        assertThat(winner).isEqualTo(strongSpecies);
    }

    @Test
    @DisplayName("On tie, alphabetically first name wins (case-insensitive)")
    void testWinnerByAlphabeticNameOnTie() {
        // "Alpha" < "Zeta" alphabetically, so Alpha should win
        Species winner = speciesService.determineWinner(tieSpeciesA, tieSpeciesB);
        assertThat(winner).isEqualTo(tieSpeciesA);
    }

    @Test
    @DisplayName("On tie, alphabetically first name wins regardless of argument order")
    void testWinnerByAlphabeticNameOnTieReversed() {
        Species winner = speciesService.determineWinner(tieSpeciesB, tieSpeciesA);
        assertThat(winner).isEqualTo(tieSpeciesA);
    }

    @Test
    @DisplayName("Same name on tie returns the first argument (equal comparison = 0 <= 0)")
    void testWinnerByAlphabeticNameExact() {
        Species clone = new Species("Alpha", 500, "Clone ability");
        Species winner = speciesService.determineWinner(tieSpeciesA, clone);
        assertThat(winner).isEqualTo(tieSpeciesA);
    }

    @Test
    @DisplayName("Tie comparison is case-insensitive")
    void testWinnerByNameCaseInsensitive() {
        Species upperAlpha = new Species("ALPHA", 500, "Upper Blast");
        Species lowerZeta  = new Species("zeta",  500, "Lower Zap");
        // "ALPHA".compareToIgnoreCase("zeta") → "alpha" < "zeta", so ALPHA wins
        Species winner = speciesService.determineWinner(upperAlpha, lowerZeta);
        assertThat(winner).isEqualTo(upperAlpha);
    }
}
