package com.torneo.galactico.infrastructure.repository;

import com.torneo.galactico.domain.entity.Combat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CombatRepository extends JpaRepository<Combat, Long> {
}
