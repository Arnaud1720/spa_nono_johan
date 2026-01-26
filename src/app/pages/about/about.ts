import { Component, AfterViewInit, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ScrollService } from '../../services/scroll';
import { SkillsList } from '../../components/shared/skills-list/skills-list';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterLink, SkillsList],
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class About implements AfterViewInit {
  @ViewChildren('animatedSection') animatedSections!: QueryList<ElementRef>;

  timeline = [
    {
      year: '2024',
      title: 'SPA Desktop avec Tauri',
      description: 'Création de SPAs encapsulées en applications desktop cross-platform performantes.'
    },
    {
      year: '2023',
      title: 'Spécialisation Animations SPA',
      description: 'Maîtrise de GSAP et Three.js pour des Single Page Applications immersives.'
    },
    {
      year: '2022',
      title: 'Premières SPA clients',
      description: 'Livraison de SPAs sur-mesure : sites vitrines, PWAs, applications métier.'
    },
    {
      year: '2020',
      title: 'Découverte Angular & SPA',
      description: 'Apprentissage du framework Angular et de l\'architecture Single Page Application.'
    }
  ];

  values = [
    {
      icon: 'code',
      title: 'Code Propre',
      description: 'Architecture modulaire, bonnes pratiques, code maintenable et documenté.'
    },
    {
      icon: 'zap',
      title: 'Performance',
      description: 'Optimisation poussée, Lighthouse 100%, temps de chargement minimal.'
    },
    {
      icon: 'heart',
      title: 'Passion',
      description: 'Chaque projet est une opportunité d\'apprendre et de créer quelque chose d\'unique.'
    },
    {
      icon: 'users',
      title: 'Collaboration',
      description: 'Communication claire, feedback régulier, implication du client à chaque étape.'
    }
  ];

  constructor(private scrollService: ScrollService) {}

  ngAfterViewInit(): void {
    this.animatedSections.forEach((section) => {
      this.scrollService.addVisibleClass(section.nativeElement, {
        threshold: 0.2,
        rootMargin: '-50px'
      });
    });
  }
}
