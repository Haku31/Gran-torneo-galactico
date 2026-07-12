export interface Species {
  id: number;
  name: string;
  powerLevel: number;
  specialAbility: string;
  victories: number;
}

export interface Combat {
  id: number;
  species1Name: string;
  species2Name: string;
  winnerName: string;
  fightDate: string;
}

export interface CreateSpeciesDto {
  name: string;
  powerLevel: number;
  specialAbility: string;
}
