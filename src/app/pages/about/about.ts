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

  guarantees = [
    {
      icon: 'rocket',
      title: 'Livraison Rapide',
      description: 'Votre projet livré en 2 à 4 semaines, sans compromis sur la qualité.'
    },
    {
      icon: 'shield',
      title: 'Performance Garantie',
      description: 'Score Lighthouse 100% ou on optimise gratuitement jusqu\'à l\'atteindre.'
    },
    {
      icon: 'check',
      title: 'Zéro Surprise',
      description: 'Devis détaillé et fixe. Pas de frais cachés, pas de mauvaises surprises.'
    },
    {
      icon: 'headphones',
      title: 'Support Inclus',
      description: '30 jours de support et corrections inclus après la livraison.'
    }
  ];

  metrics = [
    {
      value: '100%',
      label: 'Lighthouse Score',
      description: 'Performance maximale garantie'
    },
    {
      value: '<24h',
      label: 'Temps de réponse',
      description: 'Réactivité assurée'
    },
    {
      value: '2-4',
      label: 'Semaines de livraison',
      description: 'Délais courts et tenus'
    },
    {
      value: '0€',
      label: 'Frais cachés',
      description: 'Prix transparent et fixe'
    }
  ];

  process = [
    {
      number: '01',
      title: 'Appel Découverte',
      description: 'On échange sur votre projet, vos objectifs et vos contraintes. Gratuit, sans engagement.'
    },
    {
      number: '02',
      title: 'Proposition & Devis',
      description: 'Vous recevez une proposition détaillée avec maquettes, planning et prix fixe.'
    },
    {
      number: '03',
      title: 'Développement',
      description: 'Création de votre SPA avec points d\'étape réguliers pour valider l\'avancement.'
    },
    {
      number: '04',
      title: 'Livraison & Support',
      description: 'Déploiement de votre projet + 30 jours de support et corrections inclus.'
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
