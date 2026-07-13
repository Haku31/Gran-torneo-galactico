import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ApiService } from '../../core/services/api.service';
import { AvatarService } from '../../core/services/avatar.service';
import { Species, CreateSpeciesDto } from '../../core/models/models';

@Component({
  selector: 'app-species',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDividerModule,
    MatTooltipModule
  ],
  templateUrl: './species.component.html',
  styleUrl: './species.component.scss'
})
export class SpeciesComponent implements OnInit {
  readonly displayedColumns: string[] = ['avatar', 'name', 'powerLevel', 'specialAbility', 'victories'];

  species = signal<Species[]>([]);
  loading = signal(false);
  submitting = signal(false);

  speciesForm: FormGroup;

  constructor(
    private readonly api: ApiService,
    private readonly fb: FormBuilder,
    private readonly snackBar: MatSnackBar,
    readonly avatarService: AvatarService
  ) {
    this.speciesForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      powerLevel: [null, [Validators.required, Validators.min(1), Validators.max(9999)]],
      specialAbility: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(200)]]
    });
  }

  ngOnInit(): void {
    this.loadSpecies();
  }

  loadSpecies(): void {
    this.loading.set(true);
    this.api.getSpecies().subscribe({
      next: (data) => {
        this.species.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error al cargar especies:', err);
        this.snackBar.open('Error al cargar las especies. Verifique que el servidor esté activo.', 'Cerrar', {
          duration: 5000,
          panelClass: ['error-snack']
        });
        this.loading.set(false);
      }
    });
  }

  onSubmit(): void {
    if (this.speciesForm.invalid) {
      this.speciesForm.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    const dto: CreateSpeciesDto = {
      name: (this.speciesForm.value.name as string).trim(),
      powerLevel: Number(this.speciesForm.value.powerLevel),
      specialAbility: (this.speciesForm.value.specialAbility as string).trim()
    };

    this.api.createSpecies(dto).subscribe({
      next: (newSpecies) => {
        this.species.update(list => [...list, newSpecies]);
        this.speciesForm.reset();
        this.submitting.set(false);
        this.snackBar.open(`Especie "${newSpecies.name}" registrada exitosamente 🚀`, 'OK', {
          duration: 3000
        });
      },
      error: (err) => {
        console.error('Error al crear especie:', err);
        this.snackBar.open('Error al registrar la especie. Intente nuevamente.', 'Cerrar', {
          duration: 5000,
          panelClass: ['error-snack']
        });
        this.submitting.set(false);
      }
    });
  }
}
