import { Component, Input, Output, EventEmitter, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Species } from '../../../core/models/models';
import { AvatarService } from '../../../core/services/avatar.service';

@Component({
  selector: 'app-combat-arena',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './combat-arena.component.html',
  styleUrl: './combat-arena.component.scss'
})
export class CombatArenaComponent implements OnInit {
  @Input() fighter1!: Species;
  @Input() fighter2!: Species;
  @Input() winner: Species | null = null;
  @Output() animationComplete = new EventEmitter<void>();

  phase = signal<'intro' | 'tension' | 'clash' | 'result'>('intro');

  constructor(readonly avatar: AvatarService) {}

  get avatar1(): string { return this.avatar.getUrl(this.fighter1); }
  get avatar2(): string { return this.avatar.getUrl(this.fighter2); }
  get avatarWinner(): string { return this.winner ? this.avatar.getUrl(this.winner) : ''; }
  get loser(): Species { return this.winner?.id === this.fighter1.id ? this.fighter2 : this.fighter1; }

  ngOnInit() {
    setTimeout(() => this.phase.set('tension'), 800);
    setTimeout(() => this.phase.set('clash'), 1800);
    setTimeout(() => {
      if (this.winner) this.phase.set('result');
    }, 2500);
    setTimeout(() => this.animationComplete.emit(), 4500);
  }
}
