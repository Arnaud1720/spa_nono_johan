import { Component, AfterViewInit, ElementRef, QueryList, ViewChildren, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ScrollService } from '../../services/scroll';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements AfterViewInit {
  @ViewChildren('animatedSection') animatedSections!: QueryList<ElementRef>;
  @ViewChild('desktopVideo') desktopVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('mobileVideo') mobileVideo!: ElementRef<HTMLVideoElement>;

  activeSolution: number | null = null;

  constructor(private scrollService: ScrollService) {}

  toggleSolution(index: number): void {
    this.activeSolution = this.activeSolution === index ? null : index;
  }

  ngAfterViewInit(): void {
    this.animatedSections.forEach((section) => {
      this.scrollService.addVisibleClass(section.nativeElement, {
        threshold: 0.15,
        rootMargin: '-50px'
      });
    });

    // Force video playback
    this.playVideos();
  }

  private playVideos(): void {
    const videos = [this.desktopVideo?.nativeElement, this.mobileVideo?.nativeElement];
    videos.forEach(video => {
      if (video) {
        video.play().catch(() => {
          // Autoplay blocked, try on user interaction
          document.addEventListener('click', () => video.play(), { once: true });
        });
      }
    });
  }
}
