package com.torneo.galactico.domain.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "species")
public class Species {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String name;

    @Column(name = "power_level", nullable = false)
    private Integer powerLevel;

    @Column(name = "special_ability", nullable = false)
    private String specialAbility;

    @Column(nullable = false)
    private Integer victories = 0;

    public Species() {}

    public Species(String name, Integer powerLevel, String specialAbility) {
        this.name = name;
        this.powerLevel = powerLevel;
        this.specialAbility = specialAbility;
        this.victories = 0;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Integer getPowerLevel() { return powerLevel; }
    public void setPowerLevel(Integer powerLevel) { this.powerLevel = powerLevel; }

    public String getSpecialAbility() { return specialAbility; }
    public void setSpecialAbility(String specialAbility) { this.specialAbility = specialAbility; }

    public Integer getVictories() { return victories; }
    public void setVictories(Integer victories) { this.victories = victories; }

    public void incrementVictories() {
        this.victories = this.victories + 1;
    }
}
