package com.torneo.galactico.infrastructure.repository;

import com.torneo.galactico.domain.entity.Species;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SpeciesRepository extends JpaRepository<Species, Long> {

    List<Species> findAllByOrderByVictoriesDesc();

    boolean existsByNameIgnoreCase(String name);
}
