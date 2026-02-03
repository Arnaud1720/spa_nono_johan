import { Component, AfterViewInit, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ScrollService } from '../../services/scroll';
import { NLogo3D } from '../../components/three/n-logo-3d/n-logo-3d';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, NLogo3D],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements AfterViewInit {
  @ViewChildren('animatedSection') animatedSections!: QueryList<ElementRef>;

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
  }
}
