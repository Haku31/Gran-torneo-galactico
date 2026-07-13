package com.torneo.galactico.application.service;

import com.torneo.galactico.domain.entity.Combat;
import com.torneo.galactico.domain.entity.Species;
import com.torneo.galactico.infrastructure.repository.CombatRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@Service
@Transactional
public class CombatService {

    private final CombatRepository combatRepository;
    private final SpeciesService speciesService;
    private final Random random = new Random();

    public CombatService(CombatRepository combatRepository, SpeciesService speciesService) {
        this.combatRepository = combatRepository;
        this.speciesService = speciesService;
    }

    public Combat fight(Long species1Id, Long species2Id) {
        if (species1Id.equals(species2Id)) {
            throw new IllegalArgumentException("A species cannot fight against itself.");
        }

        Species species1 = speciesService.findById(species1Id);
        Species species2 = speciesService.findById(species2Id);

        Species winner = determineWinner(species1, species2);
        speciesService.incrementVictories(winner);

        Combat combat = new Combat(
                species1.getId(),
                species2.getId(),
                winner.getId(),
                species1.getName(),
                species2.getName(),
                winner.getName(),
                LocalDateTime.now()
        );

        return combatRepository.save(combat);
    }

    public Combat fightRandom() {
        List<Species> all = speciesService.findAll();
        if (all.size() < 2) {
            throw new IllegalStateException("At least 2 species are required for a random combat.");
        }

        int idx1 = random.nextInt(all.size());
        int idx2;
        do {
            idx2 = random.nextInt(all.size());
        } while (idx2 == idx1);

        return fight(all.get(idx1).getId(), all.get(idx2).getId());
    }

    @Transactional(readOnly = true)
    public List<Combat> findAll() {
        return combatRepository.findAll();
    }

    // Tie-breaking by alphabetical order is a deliberate game rule, not just a fallback.
    // Higher powerLevel always wins; equal powerLevel favors the lexicographically earlier name.
    public Species determineWinner(Species s1, Species s2) {
        if (s1.getPowerLevel() > s2.getPowerLevel()) {
            return s1;
        } else if (s2.getPowerLevel() > s1.getPowerLevel()) {
            return s2;
        } else {
            int cmp = s1.getName().compareToIgnoreCase(s2.getName());
            return cmp <= 0 ? s1 : s2;
        }
    }
}
