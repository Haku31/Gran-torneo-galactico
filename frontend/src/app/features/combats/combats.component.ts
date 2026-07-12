import { Component, OnInit, inject, signal } from '@angular/core';
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
import { Species, Combat } from '../../core/models/models';

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
    MatChipsModule
  ],
  templateUrl: './combats.component.html',
  styleUrl: './combats.component.scss'
})
export class CombatsComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly fb = inject(FormBuilder);
  private readonly snackBar = inject(MatSnackBar);

  species = signal<Species[]>([]);
  combats = signal<Combat[]>([]);
  lastCombat = signal<Combat | null>(null);
  loading = signal(false);
  combating = signal(false);
  randomCombating = signal(false);

  displayedColumns: string[] = ['species1Name', 'species2Name', 'winnerName', 'fightDate'];

  combatForm: FormGroup = this.fb.group({
    species1Id: [null, Validators.required],
    species2Id: [null, Validators.required]
  });

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

    const { species1Id, species2Id } = this.combatForm.value;

    if (species1Id === species2Id) {
      this.snackBar.open('¡Debes seleccionar dos especies diferentes!', 'Cerrar', { duration: 3000 });
      return;
    }

    this.combating.set(true);
    this.api.startCombat({ species1Id: Number(species1Id), species2Id: Number(species2Id) }).subscribe({
      next: (combat) => {
        this.lastCombat.set(combat);
        this.combats.update(list => [...list, combat]);
        this.combatForm.reset();
        this.combating.set(false);
        this.snackBar.open(`¡Combate finalizado! Ganador: ${combat.winnerName}`, 'OK', { duration: 4000 });
      },
      error: (err) => {
        console.error('Error al iniciar combate:', err);
        this.snackBar.open('Error al iniciar el combate. Intente nuevamente.', 'Cerrar', { duration: 5000 });
        this.combating.set(false);
      }
    });
  }

  onRandomCombat(): void {
    this.randomCombating.set(true);
    this.api.randomCombat().subscribe({
      next: (combat) => {
        this.lastCombat.set(combat);
        this.combats.update(list => [...list, combat]);
        this.randomCombating.set(false);
        this.snackBar.open(`¡Combate aleatorio! ${combat.species1Name} vs ${combat.species2Name} → Ganador: ${combat.winnerName}`, 'OK', {
          duration: 5000
        });
      },
      error: (err) => {
        console.error('Error en combate aleatorio:', err);
        this.snackBar.open('Error al ejecutar combate aleatorio. Asegúrese de tener al menos 2 especies registradas.', 'Cerrar', {
          duration: 5000
        });
        this.randomCombating.set(false);
      }
    });
  }

  getSpeciesName(id: number): string {
    const s = this.species().find(sp => sp.id === id);
    return s ? s.name : `Especie #${id}`;
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
}
