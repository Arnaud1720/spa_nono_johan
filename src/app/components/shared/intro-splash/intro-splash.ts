import { Component, OnInit, OnDestroy, Output, EventEmitter, PLATFORM_ID, Inject, HostListener } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { gsap } from 'gsap';

@Component({
  selector: 'app-intro-splash',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './intro-splash.html',
  styleUrl: './intro-splash.scss',
})
export class IntroSplash implements OnInit, OnDestroy {
  @Output() animationComplete = new EventEmitter<void>();

  private isBrowser: boolean;
  private timeline: gsap.core.Timeline | null = null;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    this.skipIntro();
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        this.initAnimation();
      }, 100);
    }
  }

  ngOnDestroy(): void {
    if (this.timeline) {
      this.timeline.kill();
    }
  }

  private initAnimation(): void {
    this.timeline = gsap.timeline({
      onComplete: () => {
        // Fade out the splash screen
        gsap.to('.intro-splash', {
          opacity: 0,
          duration: 0.5,
          ease: 'power2.inOut',
          onComplete: () => {
            this.animationComplete.emit();
          }
        });
      }
    });

    // Initial state - letters are rotated and invisible
    gsap.set('.logo-letter', {
      rotateY: -90,
      rotateX: 20,
      opacity: 0,
      transformPerspective: 1000,
      transformOrigin: 'center center'
    });

    gsap.set('.logo-dot', {
      scale: 0,
      opacity: 0
    });

    gsap.set('.intro-tagline', {
      y: 20,
      opacity: 0
    });

    // Animate each letter with stagger
    this.timeline
      .to('.logo-letter', {
        rotateY: 0,
        rotateX: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: 'back.out(1.7)'
      })
      // Add subtle floating animation
      .to('.logo-letter', {
        y: -5,
        duration: 0.3,
        stagger: 0.05,
        ease: 'power2.out'
      }, '-=0.3')
      .to('.logo-letter', {
        y: 0,
        duration: 0.3,
        stagger: 0.05,
        ease: 'power2.in'
      })
      // Animate the dot
      .to('.logo-dot', {
        scale: 1,
        opacity: 1,
        duration: 0.4,
        ease: 'elastic.out(1, 0.5)'
      }, '-=0.2')
      // Glow pulse on letters
      .to('.logo-letter, .logo-dot', {
        textShadow: '0 0 30px rgba(0, 245, 255, 0.8), 0 0 60px rgba(255, 0, 255, 0.5)',
        duration: 0.3,
        ease: 'power2.in'
      })
      .to('.logo-letter, .logo-dot', {
        textShadow: '0 0 15px rgba(0, 245, 255, 0.5), 0 0 30px rgba(255, 0, 255, 0.3)',
        duration: 0.3,
        ease: 'power2.out'
      })
      // Show tagline
      .to('.intro-tagline', {
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: 'power3.out'
      }, '-=0.2')
      // Hold for a moment
      .to({}, { duration: 0.8 });
  }

  skipIntro(): void {
    if (this.timeline) {
      this.timeline.kill();
    }
    gsap.to('.intro-splash', {
      opacity: 0,
      duration: 0.3,
      onComplete: () => {
        this.animationComplete.emit();
      }
    });
  }
}
