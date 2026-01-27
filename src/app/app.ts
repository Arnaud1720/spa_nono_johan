import { Component, signal, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/layout/header/header';
import { Footer } from './components/layout/footer/footer';
import { IntroSplash } from './components/shared/intro-splash/intro-splash';
import { ThreeBackground } from './components/shared/three-background/three-background';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, Header, Footer, IntroSplash, ThreeBackground],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  title = 'Portfolio SPA';

  showIntro = signal(false);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      // Only show intro once per session
      const hasSeenIntro = sessionStorage.getItem('nojo-intro-seen');
      if (!hasSeenIntro) {
        this.showIntro.set(true);
      }
    }
  }

  onIntroComplete(): void {
    this.showIntro.set(false);
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.setItem('nojo-intro-seen', 'true');
    }
  }
}
