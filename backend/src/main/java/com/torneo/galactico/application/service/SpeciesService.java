package com.torneo.galactico.application.service;

import com.torneo.galactico.domain.entity.Species;
import com.torneo.galactico.infrastructure.repository.SpeciesRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class SpeciesService {

    private final SpeciesRepository speciesRepository;

    public SpeciesService(SpeciesRepository speciesRepository) {
        this.speciesRepository = speciesRepository;
    }

    @Transactional(readOnly = true)
    public List<Species> findAll() {
        return speciesRepository.findAll();
    }

    public Species create(String name, Integer powerLevel, String specialAbility) {
        if (speciesRepository.existsByNameIgnoreCase(name)) {
            throw new IllegalArgumentException("A species with name '" + name + "' already exists.");
        }
        Species species = new Species(name, powerLevel, specialAbility);
        return speciesRepository.save(species);
    }

    @Transactional(readOnly = true)
    public Species findById(Long id) {
        return speciesRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Species not found with id: " + id));
    }

    @Transactional(readOnly = true)
    public List<Species> findAllByVictoriesDesc() {
        return speciesRepository.findAllByOrderByVictoriesDesc();
    }

    /**
     * Determines the winner between two species.
     * - Higher powerLevel wins.
     * - On tie, alphabetically first name wins (case-insensitive).
     */
    public Species determineWinner(Species s1, Species s2) {
        if (s1.getPowerLevel() > s2.getPowerLevel()) {
            return s1;
        } else if (s2.getPowerLevel() > s1.getPowerLevel()) {
            return s2;
        } else {
            // Tie: alphabetically first name wins (case-insensitive)
            int cmp = s1.getName().compareToIgnoreCase(s2.getName());
            return cmp <= 0 ? s1 : s2;
        }
    }

    public void incrementVictories(Species winner) {
        winner.incrementVictories();
        speciesRepository.save(winner);
    }

    @Transactional(readOnly = true)
    public List<Species> findAllSpecies() {
        return speciesRepository.findAll();
    }
}
