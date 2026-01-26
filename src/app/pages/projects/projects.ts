import { Component, AfterViewInit, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProjectCard, Project } from '../../components/shared/project-card/project-card';
import { ScrollService } from '../../services/scroll';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, RouterLink, ProjectCard],
  templateUrl: './projects.html',
  styleUrl: './projects.scss',
})
export class Projects implements AfterViewInit {
  @ViewChildren('animatedItem') animatedItems!: QueryList<ElementRef>;

  selectedFilter = 'all';

  filters = [
    { key: 'all', label: 'Tous' },
    { key: 'restaurant', label: 'Restaurant' },
    { key: 'artisan', label: 'Artisan' },
    { key: 'webapp', label: 'Web App' }
  ];

  allProjects: (Project & { filterKey: string })[] = [
    {
      id: 1,
      title: 'Les Allées',
      category: 'Restaurant & Brasserie',
      video: '/videos/les-allees.mp4',
      description: 'Site vitrine moderne pour un restaurant-brasserie situé à Audenge, au cœur du Bassin d\'Arcachon. Design élégant avec réservation en ligne.',
      tech: ['Angular', 'SCSS', 'GSAP', 'Responsive'],
      filterKey: 'restaurant'
    },
    {
      id: 2,
      title: 'A.E.V Multi-Services',
      category: 'Artisan BTP',
      video: '/videos/aev-multiservices.mp4',
      description: 'Application desktop cross-platform avec Tauri pour un artisan multi-services en Gironde. Gestion de devis et suivi de chantiers.',
      tech: ['Angular', 'Tauri', 'Rust', 'SQLite'],
      filterKey: 'artisan'
    },
    {
      id: 3,
      title: 'Romain Deschamps Multiservice',
      category: 'Multiservice',
      video: '/videos/romain-deschamps.mp4',
      description: 'SPA ultra-optimisée avec score Lighthouse 100%. PWA installable avec mode hors-ligne pour présentation commerciale.',
      tech: ['Angular', 'PWA', 'Service Workers', 'Lighthouse 100%'],
      filterKey: 'artisan'
    },
    {
      id: 4,
      title: 'Portfolio Créatif',
      category: 'Site Vitrine',
      video: '/videos/portfolio-creatif.mp4',
      description: 'Portfolio artistique avec animations Three.js, effets parallax et transitions de page fluides.',
      tech: ['Angular', 'Three.js', 'GSAP', 'WebGL'],
      filterKey: 'webapp'
    },
    {
      id: 5,
      title: 'Projet Démo',
      category: 'Maquette SPA',
      video: '/videos/projet-5.mp4',
      description: 'Démonstration de nos capacités en création de maquettes SPA modernes avec animations avancées.',
      tech: ['Angular', 'SCSS', 'Animations'],
      filterKey: 'webapp'
    }
  ];

  get filteredProjects() {
    if (this.selectedFilter === 'all') {
      return this.allProjects;
    }
    return this.allProjects.filter(p => p.filterKey === this.selectedFilter);
  }

  constructor(private scrollService: ScrollService) {}

  ngAfterViewInit(): void {
    this.animatedItems.forEach((item, index) => {
      this.scrollService.observe(
        item.nativeElement,
        () => {
          setTimeout(() => {
            item.nativeElement.classList.add('visible');
          }, index * 100);
        },
        { threshold: 0.1 }
      );
    });
  }

  setFilter(key: string): void {
    this.selectedFilter = key;
  }

  getFilterCount(key: string): number {
    if (key === 'all') {
      return this.allProjects.length;
    }
    return this.allProjects.filter(p => p.filterKey === key).length;
  }
}
