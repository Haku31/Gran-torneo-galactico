import {
  Component,
  signal,
  inject,
  AfterViewInit,
  ViewChild,
  ElementRef,
  OnDestroy
} from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

interface Star {
  x: number;
  y: number;
  originX: number;
  originY: number;
  radius: number;
  opacity: number;
  twinkle: number;
  vx: number;
  vy: number;
}

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent implements AfterViewInit, OnDestroy {
  private router = inject(Router);
  showWarp = signal(false);

  @ViewChild('starsCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  private animFrameId = 0;
  private resizeHandler!: () => void;
  private mouseMoveHandler!: (e: MouseEvent) => void;

  private mouse = { x: -9999, y: -9999 };
  private readonly REPEL_RADIUS = 120;
  private readonly CONNECT_RADIUS = 140;
  private readonly REPEL_FORCE = 6;

  ngAfterViewInit() {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d')!;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();

    const makeStars = (): Star[] =>
      Array.from({ length: 280 }, () => {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        return {
          x, y,
          originX: x,
          originY: y,
          radius: Math.random() * 2 + 0.5,
          opacity: Math.random(),
          twinkle: Math.random() * 0.02 + 0.005,
          vx: 0,
          vy: 0
        };
      });

    let stars = makeStars();

    this.resizeHandler = () => {
      resize();
      stars = makeStars();
    };
    window.addEventListener('resize', this.resizeHandler);

    this.mouseMoveHandler = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
    };
    canvas.addEventListener('mousemove', this.mouseMoveHandler);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const mx = this.mouse.x;
      const my = this.mouse.y;

      // Update star positions with repulsion + return-to-origin spring
      stars.forEach(star => {
        const dx = star.x - mx;
        const dy = star.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < this.REPEL_RADIUS && dist > 0) {
          const force = (this.REPEL_RADIUS - dist) / this.REPEL_RADIUS;
          star.vx += (dx / dist) * force * this.REPEL_FORCE;
          star.vy += (dy / dist) * force * this.REPEL_FORCE;
        }

        // Spring back to origin
        star.vx += (star.originX - star.x) * 0.04;
        star.vy += (star.originY - star.y) * 0.04;

        // Damping
        star.vx *= 0.85;
        star.vy *= 0.85;

        star.x += star.vx;
        star.y += star.vy;

        // Twinkle
        star.opacity += star.twinkle;
        if (star.opacity > 1 || star.opacity < 0.1) star.twinkle *= -1;
      });

      // Draw constellation lines between nearby stars near cursor
      for (let i = 0; i < stars.length; i++) {
        const s1 = stars[i];
        const toCursorX = s1.x - mx;
        const toCursorY = s1.y - my;
        const distToCursor = Math.sqrt(toCursorX * toCursorX + toCursorY * toCursorY);

        if (distToCursor > this.CONNECT_RADIUS * 2) continue;

        for (let j = i + 1; j < stars.length; j++) {
          const s2 = stars[j];
          const dx = s1.x - s2.x;
          const dy = s1.y - s2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < this.CONNECT_RADIUS) {
            const alpha = (1 - dist / this.CONNECT_RADIUS) * 0.6;
            const gradient = ctx.createLinearGradient(s1.x, s1.y, s2.x, s2.y);
            gradient.addColorStop(0, `rgba(180, 140, 255, ${alpha})`);
            gradient.addColorStop(0.5, `rgba(255, 215, 0, ${alpha * 0.8})`);
            gradient.addColorStop(1, `rgba(180, 140, 255, ${alpha})`);

            ctx.beginPath();
            ctx.moveTo(s1.x, s1.y);
            ctx.lineTo(s2.x, s2.y);
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Draw stars
      stars.forEach(star => {
        const dx = star.x - mx;
        const dy = star.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const nearCursor = dist < this.CONNECT_RADIUS * 2;

        // Glow for stars near cursor
        if (nearCursor) {
          const glowAlpha = (1 - dist / (this.CONNECT_RADIUS * 2)) * 0.6;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.radius * 4, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(200, 160, 255, ${glowAlpha * 0.3})`;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = nearCursor
          ? `rgba(255, 240, 180, ${Math.abs(star.opacity)})`
          : `rgba(255, 255, 255, ${Math.abs(star.opacity)})`;
        ctx.fill();
      });

      // Cursor aura
      if (mx > 0 && my > 0) {
        const aura = ctx.createRadialGradient(mx, my, 0, mx, my, 80);
        aura.addColorStop(0, 'rgba(150, 100, 255, 0.12)');
        aura.addColorStop(1, 'rgba(150, 100, 255, 0)');
        ctx.beginPath();
        ctx.arc(mx, my, 80, 0, Math.PI * 2);
        ctx.fillStyle = aura;
        ctx.fill();
      }

      this.animFrameId = requestAnimationFrame(animate);
    };

    animate();
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.animFrameId);
    window.removeEventListener('resize', this.resizeHandler);
    const canvas = this.canvasRef?.nativeElement;
    if (canvas) canvas.removeEventListener('mousemove', this.mouseMoveHandler);
  }

  onStart() {
    this.showWarp.set(true);
    setTimeout(() => this.router.navigate(['/ranking']), 2000);
  }
}
