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

  ngAfterViewInit() {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d')!;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();

    const stars = Array.from({ length: 300 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 2 + 0.5,
      opacity: Math.random(),
      speed: Math.random() * 0.5 + 0.1,
      twinkle: Math.random() * 0.02 + 0.005
    }));

    this.resizeHandler = () => {
      resize();
      stars.forEach(star => {
        star.x = Math.random() * canvas.width;
        star.y = Math.random() * canvas.height;
      });
    };

    window.addEventListener('resize', this.resizeHandler);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach(star => {
        star.opacity += star.twinkle;
        if (star.opacity > 1 || star.opacity < 0) star.twinkle *= -1;

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.abs(star.opacity)})`;
        ctx.fill();
      });
      this.animFrameId = requestAnimationFrame(animate);
    };

    animate();
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.animFrameId);
    window.removeEventListener('resize', this.resizeHandler);
  }

  onStart() {
    this.showWarp.set(true);
    setTimeout(() => this.router.navigate(['/ranking']), 2000);
  }
}
