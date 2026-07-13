import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';

import { ApiService } from '../../core/services/api.service';
import { AvatarService } from '../../core/services/avatar.service';
import { Species, Combat } from '../../core/models/models';
import { CombatArenaComponent } from './combat-arena/combat-arena.component';

@Component({
  selector: 'app-combats',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDividerModule,
    MatChipsModule,
    CombatArenaComponent
  ],
  templateUrl: './combats.component.html',
  styleUrl: './combats.component.scss'
})
export class CombatsComponent implements OnInit {
  readonly displayedColumns: string[] = ['species1Name', 'species2Name', 'winnerName', 'fightDate'];

  species = signal<Species[]>([]);
  combats = signal<Combat[]>([]);
  lastCombat = signal<Combat | null>(null);
  loading = signal(false);
  combating = signal(false);
  randomCombating = signal(false);

  showArena = signal(false);
  arenaFighter1 = signal<Species | null>(null);
  arenaFighter2 = signal<Species | null>(null);
  arenaWinner = signal<Species | null>(null);

  private pendingCombat = signal<Combat | null>(null);

  combatForm: FormGroup;

  constructor(
    private readonly api: ApiService,
    private readonly fb: FormBuilder,
    private readonly snackBar: MatSnackBar,
    readonly avatarService: AvatarService
  ) {
    this.combatForm = this.fb.group({
      species1Id: [null, Validators.required],
      species2Id: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading.set(true);

    this.api.getSpecies().subscribe({
      next: (data) => this.species.set(data),
      error: (err) => {
        console.error('Error al cargar especies:', err);
        this.snackBar.open('Error al cargar especies.', 'Cerrar', { duration: 4000 });
      }
    });

    this.api.getCombats().subscribe({
      next: (data) => {
        this.combats.set(data);
        if (data.length > 0) {
          this.lastCombat.set(data[data.length - 1]);
        }
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error al cargar combates:', err);
        this.snackBar.open('Error al cargar historial de combates.', 'Cerrar', { duration: 4000 });
        this.loading.set(false);
      }
    });
  }

  onStartCombat(): void {
    if (this.combatForm.invalid) {
      this.combatForm.markAllAsTouched();
      return;
    }

    const { species1Id, species2Id } = this.combatForm.value as { species1Id: number; species2Id: number };

    if (species1Id === species2Id) {
      this.snackBar.open('¡Debes seleccionar dos especies diferentes!', 'Cerrar', { duration: 3000 });
      return;
    }

    const fighter1 = this.species().find(s => s.id === Number(species1Id));
    const fighter2 = this.species().find(s => s.id === Number(species2Id));

    if (!fighter1 || !fighter2) {
      this.snackBar.open('No se encontraron las especies seleccionadas.', 'Cerrar', { duration: 3000 });
      return;
    }

    this.combating.set(true);
    this.launchArena(fighter1, fighter2, () =>
      this.api.startCombat({ species1Id: Number(species1Id), species2Id: Number(species2Id) }).subscribe({
        next: (combat) => {
          const winner = this.species().find(s => s.name === combat.winnerName) ?? null;
          this.arenaWinner.set(winner);
          this.pendingCombat.set(combat);
          this.combatForm.reset();
        },
        error: (err) => {
          console.error('Error al iniciar combate:', err);
          this.closeArenaOnError('Error al iniciar el combate. Intente nuevamente.');
          this.combating.set(false);
        }
      })
    );
  }

  onRandomCombat(): void {
    const speciesList = this.species();
    if (speciesList.length < 2) {
      this.snackBar.open('Se necesitan al menos 2 especies registradas para un combate aleatorio.', 'Cerrar', { duration: 5000 });
      return;
    }

    const shuffled = [...speciesList].sort(() => Math.random() - 0.5);
    const fighter1 = shuffled[0];
    const fighter2 = shuffled[1];

    this.randomCombating.set(true);
    this.launchArena(fighter1, fighter2, () =>
      this.api.randomCombat().subscribe({
        next: (combat) => {
          const winner = this.species().find(s => s.name === combat.winnerName) ?? null;
          // The API may pick different fighters than our local shuffle, so sync the display
          const actualFighter1 = this.species().find(s => s.name === combat.species1Name) ?? fighter1;
          const actualFighter2 = this.species().find(s => s.name === combat.species2Name) ?? fighter2;
          this.arenaFighter1.set(actualFighter1);
          this.arenaFighter2.set(actualFighter2);
          this.arenaWinner.set(winner);
          this.pendingCombat.set(combat);
        },
        error: (err) => {
          console.error('Error en combate aleatorio:', err);
          this.closeArenaOnError('Error al ejecutar combate aleatorio. Asegúrese de tener al menos 2 especies registradas.');
          this.randomCombating.set(false);
        }
      })
    );
  }

  onArenaComplete(): void {
    this.showArena.set(false);

    const combat = this.pendingCombat();
    if (combat) {
      this.lastCombat.set(combat);
      this.combats.update(list => [...list, combat]);
      this.snackBar.open(`¡Combate finalizado! Ganador: ${combat.winnerName}`, 'OK', { duration: 4000 });
    }

    this.combating.set(false);
    this.randomCombating.set(false);
    this.pendingCombat.set(null);
  }

  getSpeciesName(id: number): string {
    const s = this.species().find(sp => sp.id === id);
    return s ? s.name : `Especie #${id}`;
  }

  getSpeciesByName(name: string): Species | undefined {
    return this.species().find(s => s.name === name);
  }

  formatDate(dateStr: string): string {
    try {
      return new Date(dateStr).toLocaleDateString('es-ES', {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
      });
    } catch {
      return dateStr;
    }
  }

  private launchArena(fighter1: Species, fighter2: Species, callApi: () => void): void {
    this.arenaFighter1.set(fighter1);
    this.arenaFighter2.set(fighter2);
    this.arenaWinner.set(null);
    this.pendingCombat.set(null);
    this.showArena.set(true);

    // Delay matches the arena intro+tension animation so the API result arrives right at the clash
    setTimeout(callApi, 1800);
  }

  private closeArenaOnError(message: string): void {
    this.showArena.set(false);
    this.snackBar.open(message, 'Cerrar', { duration: 5000 });
  }
}
