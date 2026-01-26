import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { gsap } from 'gsap';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
}

interface MatrixDrop {
  x: number;
  y: number;
  speed: number;
  chars: string[];
  length: number;
}

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
})
export class Hero implements AfterViewInit, OnDestroy {
  @ViewChild('canvasContainer') canvasContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('matrixCanvas') matrixCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('particleCanvas') particleCanvas!: ElementRef<HTMLCanvasElement>;

  private animationId!: number;
  private isBrowser: boolean;
  private particles: Particle[] = [];
  private matrixDrops: MatrixDrop[] = [];
  private mouse = { x: 0, y: 0 };
  private matrixCtx!: CanvasRenderingContext2D;
  private particleCtx!: CanvasRenderingContext2D;
  private glitchInterval: any;

  // Cyberpunk/Nerd colors
  private colors = {
    cyan: '#00f5ff',
    magenta: '#ff00ff',
    green: '#00ff41',
    purple: '#bd00ff',
    orange: '#ff6b35'
  };

  // Matrix characters (binary, hex, katakana-like)
  private matrixChars = '01アイウエオカキクケコサシスセソタチツテト0x1A2B3C4D5EFABCDEF</>{}[]';

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      this.initCanvas();
      this.initParticles();
      this.initMatrixRain();
      this.animate();
      this.initTextAnimations();
      this.initGlitchEffect();

      window.addEventListener('resize', this.onWindowResize.bind(this));
      window.addEventListener('mousemove', this.onMouseMove.bind(this));
    }
  }

  ngOnDestroy(): void {
    if (this.isBrowser) {
      cancelAnimationFrame(this.animationId);
      clearInterval(this.glitchInterval);
      window.removeEventListener('resize', this.onWindowResize.bind(this));
      window.removeEventListener('mousemove', this.onMouseMove.bind(this));
    }
  }

  private initCanvas(): void {
    const container = this.canvasContainer.nativeElement;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Matrix canvas
    const matrixEl = this.matrixCanvas.nativeElement;
    matrixEl.width = width;
    matrixEl.height = height;
    this.matrixCtx = matrixEl.getContext('2d')!;

    // Particle canvas
    const particleEl = this.particleCanvas.nativeElement;
    particleEl.width = width;
    particleEl.height = height;
    this.particleCtx = particleEl.getContext('2d')!;
  }

  private initParticles(): void {
    const container = this.canvasContainer.nativeElement;
    const particleCount = Math.floor((container.clientWidth * container.clientHeight) / 8000);

    this.particles = [];
    const colorKeys = Object.keys(this.colors) as (keyof typeof this.colors)[];

    for (let i = 0; i < particleCount; i++) {
      this.particles.push({
        x: Math.random() * container.clientWidth,
        y: Math.random() * container.clientHeight,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1,
        color: this.colors[colorKeys[Math.floor(Math.random() * colorKeys.length)]],
        alpha: Math.random() * 0.5 + 0.3
      });
    }
  }

  private initMatrixRain(): void {
    const container = this.canvasContainer.nativeElement;
    const columns = Math.floor(container.clientWidth / 20);

    this.matrixDrops = [];
    for (let i = 0; i < columns; i++) {
      if (Math.random() > 0.7) { // Only 30% of columns have rain
        this.matrixDrops.push({
          x: i * 20,
          y: Math.random() * -500,
          speed: Math.random() * 3 + 2,
          chars: this.generateRandomChars(Math.floor(Math.random() * 15) + 5),
          length: Math.floor(Math.random() * 15) + 5
        });
      }
    }
  }

  private generateRandomChars(length: number): string[] {
    const chars: string[] = [];
    for (let i = 0; i < length; i++) {
      chars.push(this.matrixChars[Math.floor(Math.random() * this.matrixChars.length)]);
    }
    return chars;
  }

  private animate(): void {
    this.animationId = requestAnimationFrame(() => this.animate());

    this.drawMatrix();
    this.drawParticles();
  }

  private drawMatrix(): void {
    const ctx = this.matrixCtx;
    const canvas = this.matrixCanvas.nativeElement;

    // Fade effect
    ctx.fillStyle = 'rgba(10, 10, 15, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines
    this.drawGrid(ctx, canvas.width, canvas.height);

    // Draw matrix rain
    ctx.font = '14px "Courier New", monospace';

    this.matrixDrops.forEach((drop, index) => {
      // Draw each character in the drop
      drop.chars.forEach((char, charIndex) => {
        const y = drop.y - charIndex * 20;
        if (y > 0 && y < canvas.height) {
          // Gradient effect: brighter at the bottom
          const alpha = 1 - (charIndex / drop.chars.length);
          if (charIndex === 0) {
            ctx.fillStyle = this.colors.green;
            ctx.shadowBlur = 10;
            ctx.shadowColor = this.colors.green;
          } else {
            ctx.fillStyle = `rgba(0, 255, 65, ${alpha * 0.7})`;
            ctx.shadowBlur = 0;
          }
          ctx.fillText(char, drop.x, y);
        }
      });

      // Update position
      drop.y += drop.speed;

      // Reset when off screen
      if (drop.y - drop.length * 20 > canvas.height) {
        drop.y = Math.random() * -200;
        drop.chars = this.generateRandomChars(drop.length);
      }

      // Randomly change characters
      if (Math.random() > 0.98) {
        const randomIndex = Math.floor(Math.random() * drop.chars.length);
        drop.chars[randomIndex] = this.matrixChars[Math.floor(Math.random() * this.matrixChars.length)];
      }
    });

    ctx.shadowBlur = 0;
  }

  private drawGrid(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    ctx.strokeStyle = 'rgba(0, 245, 255, 0.03)';
    ctx.lineWidth = 1;

    // Vertical lines
    for (let x = 0; x < width; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Horizontal lines
    for (let y = 0; y < height; y += 50) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  }

  private drawParticles(): void {
    const ctx = this.particleCtx;
    const canvas = this.particleCanvas.nativeElement;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw particles
    this.particles.forEach((particle, i) => {
      // Mouse interaction
      const dx = this.mouse.x - particle.x;
      const dy = this.mouse.y - particle.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 150) {
        const force = (150 - dist) / 150;
        particle.vx -= (dx / dist) * force * 0.5;
        particle.vy -= (dy / dist) * force * 0.5;
      }

      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Friction
      particle.vx *= 0.99;
      particle.vy *= 0.99;

      // Bounce off walls
      if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

      // Keep in bounds
      particle.x = Math.max(0, Math.min(canvas.width, particle.x));
      particle.y = Math.max(0, Math.min(canvas.height, particle.y));

      // Draw particle with glow
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      ctx.fillStyle = particle.color;
      ctx.shadowBlur = 15;
      ctx.shadowColor = particle.color;
      ctx.globalAlpha = particle.alpha;
      ctx.fill();
      ctx.globalAlpha = 1;

      // Draw connections
      this.particles.slice(i + 1).forEach(other => {
        const dx = particle.x - other.x;
        const dy = particle.y - other.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 120) {
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(other.x, other.y);
          ctx.strokeStyle = particle.color;
          ctx.globalAlpha = (1 - distance / 120) * 0.3;
          ctx.lineWidth = 0.5;
          ctx.shadowBlur = 5;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      });
    });

    ctx.shadowBlur = 0;
  }

  private initGlitchEffect(): void {
    const title = document.querySelector('.hero__title-accent');
    if (!title) return;

    this.glitchInterval = setInterval(() => {
      if (Math.random() > 0.95) {
        title.classList.add('glitch-active');
        setTimeout(() => {
          title.classList.remove('glitch-active');
        }, 200);
      }
    }, 100);
  }

  private onWindowResize(): void {
    const container = this.canvasContainer.nativeElement;
    const width = container.clientWidth;
    const height = container.clientHeight;

    this.matrixCanvas.nativeElement.width = width;
    this.matrixCanvas.nativeElement.height = height;
    this.particleCanvas.nativeElement.width = width;
    this.particleCanvas.nativeElement.height = height;

    this.initParticles();
    this.initMatrixRain();
  }

  private onMouseMove(event: MouseEvent): void {
    const rect = this.canvasContainer.nativeElement.getBoundingClientRect();
    this.mouse.x = event.clientX - rect.left;
    this.mouse.y = event.clientY - rect.top;
  }

  private initTextAnimations(): void {
    gsap.from('.hero__title', {
      y: 100,
      opacity: 0,
      duration: 1,
      delay: 0.3,
      ease: 'power3.out'
    });

    gsap.from('.hero__subtitle', {
      y: 50,
      opacity: 0,
      duration: 0.8,
      delay: 0.6,
      ease: 'power3.out'
    });

    gsap.from('.hero__cta', {
      y: 30,
      opacity: 0,
      duration: 0.6,
      delay: 0.9,
      ease: 'power3.out'
    });

    gsap.from('.hero__scroll-indicator', {
      y: 20,
      opacity: 0,
      duration: 0.6,
      delay: 1.2,
      ease: 'power3.out'
    });

    // Terminal typing effect for subtitle
    gsap.from('.hero__terminal-line', {
      width: 0,
      duration: 0.5,
      stagger: 0.2,
      delay: 1.5,
      ease: 'none'
    });
  }
}
