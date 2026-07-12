package com.torneo.galactico.domain.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "combats")
public class Combat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "species1_id", nullable = false)
    private Long species1Id;

    @Column(name = "species2_id", nullable = false)
    private Long species2Id;

    @Column(name = "winner_id", nullable = false)
    private Long winnerId;

    @Column(name = "species1_name", nullable = false)
    private String species1Name;

    @Column(name = "species2_name", nullable = false)
    private String species2Name;

    @Column(name = "winner_name", nullable = false)
    private String winnerName;

    @Column(name = "fight_date", nullable = false)
    private LocalDateTime fightDate;

    public Combat() {}

    public Combat(Long species1Id, Long species2Id, Long winnerId,
                  String species1Name, String species2Name, String winnerName,
                  LocalDateTime fightDate) {
        this.species1Id = species1Id;
        this.species2Id = species2Id;
        this.winnerId = winnerId;
        this.species1Name = species1Name;
        this.species2Name = species2Name;
        this.winnerName = winnerName;
        this.fightDate = fightDate;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getSpecies1Id() { return species1Id; }
    public void setSpecies1Id(Long species1Id) { this.species1Id = species1Id; }

    public Long getSpecies2Id() { return species2Id; }
    public void setSpecies2Id(Long species2Id) { this.species2Id = species2Id; }

    public Long getWinnerId() { return winnerId; }
    public void setWinnerId(Long winnerId) { this.winnerId = winnerId; }

    public String getSpecies1Name() { return species1Name; }
    public void setSpecies1Name(String species1Name) { this.species1Name = species1Name; }

    public String getSpecies2Name() { return species2Name; }
    public void setSpecies2Name(String species2Name) { this.species2Name = species2Name; }

    public String getWinnerName() { return winnerName; }
    public void setWinnerName(String winnerName) { this.winnerName = winnerName; }

    public LocalDateTime getFightDate() { return fightDate; }
    public void setFightDate(LocalDateTime fightDate) { this.fightDate = fightDate; }
}
