import {
  Component, Input, Output, EventEmitter,
  OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Species } from '../../../core/models/models';
import { AvatarService } from '../../../core/services/avatar.service';

@Component({
  selector: 'app-slot-machine',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './slot-machine.component.html',
  styleUrl: './slot-machine.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SlotMachineComponent implements OnInit, OnDestroy {
  @Input() allSpecies: Species[] = [];
  @Input() fighter1: Species | null = null;
  @Input() fighter2: Species | null = null;
  @Output() selectionComplete = new EventEmitter<void>();

  // Índice actual mostrado en cada rodillo
  reel1Index = 0;
  reel2Index = 0;

  // Estado visual de cada rodillo
  reel1Stopped = false;
  reel2Stopped = false;
  showResult = false;

  private timers: ReturnType<typeof setTimeout>[] = [];
  private intervals: ReturnType<typeof setInterval>[] = [];

  constructor(
    private readonly avatarService: AvatarService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  getAvatar(species: Species): string {
    return this.avatarService.getUrl(species);
  }

  get currentReel1(): Species {
    return this.allSpecies[this.reel1Index % this.allSpecies.length];
  }

  get currentReel2(): Species {
    return this.allSpecies[this.reel2Index % this.allSpecies.length];
  }

  ngOnInit() {
    this.spin();
  }

  private spin() {
    const targetIndex1 = this.fighter1
      ? this.allSpecies.findIndex(s => s.id === this.fighter1!.id)
      : 0;
    const targetIndex2 = this.fighter2
      ? this.allSpecies.findIndex(s => s.id === this.fighter2!.id)
      : 1;

    // Empieza en posición aleatoria para que se vea que gira de verdad
    this.reel1Index = Math.floor(Math.random() * this.allSpecies.length);
    this.reel2Index = Math.floor(Math.random() * this.allSpecies.length);

    this.animateReel(
      (i) => { this.reel1Index = i; this.cdr.markForCheck(); },
      this.reel1Index,
      targetIndex1,
      50,    // intervalo inicial ms
      300,   // intervalo final ms (más lento al parar)
      2500,  // duración total ms
      () => {
        this.reel1Stopped = true;
        this.cdr.markForCheck();
        // Rodillo 2 para 1 segundo después
        this.animateReel(
          (i) => { this.reel2Index = i; this.cdr.markForCheck(); },
          this.reel2Index,
          targetIndex2,
          50,
          300,
          2000,
          () => {
            this.reel2Stopped = true;
            this.showResult = true;
            this.cdr.markForCheck();
            // Pausa dramática antes de pasar a la arena
            const t = setTimeout(() => this.selectionComplete.emit(), 1500);
            this.timers.push(t);
          }
        );
      }
    );
  }

  private animateReel(
    setter: (index: number) => void,
    startIndex: number,
    targetIndex: number,
    intervalStart: number,
    intervalEnd: number,
    duration: number,
    onComplete: () => void
  ) {
    const n = this.allSpecies.length;
    const start = Date.now();
    let current = startIndex;

    // Calcula cuántas vueltas dar para llegar al target de forma natural
    // Siempre avanza (no retrocede) y da al menos 2 vueltas completas
    const minSpins = 2 * n;
    const stepsToTarget = ((targetIndex - current) % n + n) % n;
    const totalSteps = minSpins + stepsToTarget;

    let stepsDone = 0;

    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out: empieza rápido, termina lento
      const eased = 1 - Math.pow(1 - progress, 3);
      const currentInterval = intervalStart + (intervalEnd - intervalStart) * eased;

      current = (current + 1) % n;
      stepsDone++;
      setter(current);

      if (stepsDone >= totalSteps) {
        // Forzar el valor exacto del target
        setter(targetIndex);
        onComplete();
        return;
      }

      const t = setTimeout(tick, currentInterval);
      this.timers.push(t);
    };

    const t = setTimeout(tick, intervalStart);
    this.timers.push(t);
  }

  ngOnDestroy() {
    this.timers.forEach(clearTimeout);
    this.intervals.forEach(clearInterval);
  }
}
