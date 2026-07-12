import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ApiService } from '../../core/services/api.service';
import { Species } from '../../core/models/models';

@Component({
  selector: 'app-ranking',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatBadgeModule,
    MatTooltipModule
  ],
  templateUrl: './ranking.component.html',
  styleUrl: './ranking.component.scss'
})
export class RankingComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly snackBar = inject(MatSnackBar);

  ranking = signal<Species[]>([]);
  loading = signal(false);

  displayedColumns: string[] = ['position', 'name', 'powerLevel', 'specialAbility', 'victories'];

  rankingWithPosition = computed(() =>
    this.ranking().map((species, index) => ({ ...species, position: index + 1 }))
  );

  ngOnInit(): void {
    this.loadRanking();
  }

  loadRanking(): void {
    this.loading.set(true);
    this.api.getRanking().subscribe({
      next: (data) => {
        this.ranking.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error al cargar ranking:', err);
        this.snackBar.open('Error al cargar el ranking. Verifique la conexión con el servidor.', 'Cerrar', {
          duration: 5000,
          panelClass: ['error-snack']
        });
        this.loading.set(false);
      }
    });
  }

  getMedalIcon(position: number): string {
    switch (position) {
      case 1: return '🏆';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `#${position}`;
    }
  }

  getRowClass(position: number): string {
    switch (position) {
      case 1: return 'rank-first';
      case 2: return 'rank-second';
      case 3: return 'rank-third';
      default: return '';
    }
  }
}
