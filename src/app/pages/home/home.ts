import { Component, AfterViewInit, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Hero } from '../../components/shared/hero/hero';
import { SkillsList } from '../../components/shared/skills-list/skills-list';
import { ScrollService } from '../../services/scroll';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, Hero, SkillsList],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements AfterViewInit {
  @ViewChildren('animatedSection') animatedSections!: QueryList<ElementRef>;

  featuredProjects = [
    {
      id: 1,
      title: 'Les Allées',
      category: 'Restaurant & Brasserie',
      video: '/videos/les-allees.mp4',
      description: 'Site vitrine élégant pour un restaurant-brasserie au cœur du Bassin d\'Arcachon. Design immersif avec réservation en ligne.',
      tech: ['Angular', 'SCSS', 'GSAP']
    },
    {
      id: 2,
      title: 'A.E.V Multi-Services',
      category: 'Application Desktop',
      video: '/videos/aev-multiservices.mp4',
      description: 'Application desktop cross-platform pour la gestion de devis et le suivi de chantiers. Interface intuitive et performante.',
      tech: ['Angular', 'Tauri', 'Rust']
    },
    {
      id: 3,
      title: 'Romain Deschamps',
      category: 'PWA Performance',
      video: '/videos/romain-deschamps.mp4',
      description: 'SPA ultra-optimisée avec score Lighthouse 100%. PWA installable avec mode hors-ligne pour présentation terrain.',
      tech: ['Angular', 'PWA', 'Service Workers']
    }
  ];

  processSteps = [
    {
      number: '01',
      title: 'Découverte & Analyse',
      description: 'Nous analysons vos besoins, votre audience cible et vos objectifs pour définir une stratégie digitale sur-mesure.'
    },
    {
      number: '02',
      title: 'Conception & Design',
      description: 'Création des maquettes UI/UX, wireframes et prototypes interactifs pour valider l\'expérience utilisateur.'
    },
    {
      number: '03',
      title: 'Développement',
      description: 'Code propre et performant avec Angular, animations GSAP, et architecture modulaire pour une maintenance facilitée.'
    },
    {
      number: '04',
      title: 'Tests & Optimisation',
      description: 'Tests rigoureux, optimisation des performances (Lighthouse 100%) et corrections avant mise en production.'
    },
    {
      number: '05',
      title: 'Livraison & Support',
      description: 'Déploiement, formation et support continu pour garantir le succès de votre projet digital.'
    }
  ];

  stats = [
    {
      value: '3+',
      label: 'Années d\'expérience',
      description: 'Une entreprise établie depuis plus de 3 ans'
    },
    {
      value: '3+',
      label: 'Projets livrés',
      description: 'Applications web et desktop déployées en production'
    },
    {
      value: '100%',
      label: 'Lighthouse Score',
      description: 'Performance, accessibilité et bonnes pratiques'
    },
    {
      value: '∞',
      label: 'Curiosité',
      description: 'Chaque projet est une opportunité d\'apprendre'
    }
  ];

  techStack = [
    { name: 'Angular', icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9.931 12.645h4.138l-2.07-4.908m0-7.737L0 3.451l1.858 16.163 10.07 5.385 10.071-5.385L23.999 3.45 11.999.001zM7.482 18.15l-1.717-4.313h2.988l.882 2.342h4.761l.879-2.342h2.988l-1.717 4.313H7.482z"/></svg>' },
    { name: 'TypeScript', icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z"/></svg>' },
    { name: 'GSAP', icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2.182c5.423 0 9.818 4.395 9.818 9.818S17.423 21.818 12 21.818 2.182 17.423 2.182 12 6.577 2.182 12 2.182z"/></svg>' },
    { name: 'Three.js', icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M.38 0a.268.268 0 0 0-.256.332l2.894 11.716a.268.268 0 0 0 .01.04l2.89 11.708a.268.268 0 0 0 .447.128L23.802 7.15a.268.268 0 0 0-.112-.45l-5.784-1.667a.268.268 0 0 0-.123-.035L6.38 1.715a.268.268 0 0 0-.144-.04L.533.01A.268.268 0 0 0 .38 0zm.374.654L5.71 2.08 1.99 5.664zM6.61 2.34l4.864 1.4-3.65 3.515zm-.522.12l1.217 4.926-4.136.054zm6.382 1.64l4.864 1.4-3.65 3.515zm-.522.12l1.217 4.926-4.136.054zm6.382 1.64l4.864 1.4-3.65 3.515zm-.522.12l1.217 4.926-4.136.054zM5.313 7.292l4.864 1.4-3.65 3.515zm-.522.12l1.217 4.926-4.136.054zm6.382 1.64l4.864 1.4-3.65 3.515zm-.522.12l1.217 4.926-4.136.054zm-5.86 4.286l4.864 1.4-3.65 3.515zm-.522.12l1.217 4.926-4.136.054zm6.382 1.64l4.864 1.4-3.65 3.515zm-.522.12l1.217 4.926-4.136.054z"/></svg>' },
    { name: 'Tauri', icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.912 0c-2.267.003-4.53.324-6.664 1.033a.631.631 0 0 0-.406.588v3.01c-1.986 1.016-3.532 2.674-4.365 4.718C1.205 12.17 1.524 15.4 3.164 17.88c1.64 2.48 4.326 3.99 7.238 4.07h.264c2.912-.078 5.6-1.588 7.24-4.068 1.64-2.48 1.96-5.71.688-8.532-.833-2.044-2.38-3.702-4.365-4.718V1.62a.631.631 0 0 0-.406-.587A18.185 18.185 0 0 0 13.912 0zM8.078 2.293a.631.631 0 0 0 .138.012h7.57a.631.631 0 0 0 .138-.012v1.92a9.357 9.357 0 0 0-3.922-.849 9.357 9.357 0 0 0-3.924.85zm3.924 2.33c4.207 0 7.623 3.416 7.623 7.623s-3.416 7.623-7.623 7.623-7.623-3.416-7.623-7.623 3.416-7.623 7.623-7.623zm0 1.263a6.36 6.36 0 0 0-6.36 6.36 6.36 6.36 0 0 0 6.36 6.36 6.36 6.36 0 0 0 6.36-6.36 6.36 6.36 0 0 0-6.36-6.36z"/></svg>' },
    { name: 'SCSS', icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c6.627 0 12 5.373 12 12s-5.373 12-12 12S0 18.627 0 12 5.373 0 12 0zM9.615 15.998c.175.645.156 1.248-.024 1.792l-.065.18c-.024.061-.052.12-.078.176-.14.29-.326.56-.555.81-.698.759-1.672 1.047-2.09.805-.45-.262-.226-1.335.584-2.19.871-.918 2.12-1.509 2.12-1.509v-.003l.108-.061zm9.911-10.861c-.542-2.133-4.077-2.834-7.422-1.645-1.989.707-4.144 1.818-5.693 3.267C4.568 8.48 4.275 9.98 4.396 10.607c.427 2.211 3.457 3.657 4.703 4.73v.006c-.367.18-3.056 1.529-3.686 2.925-.675 1.47.105 2.521.615 2.655 1.575.436 3.195-.36 4.065-1.649.84-1.261.766-2.881.404-3.676.496-.13 1.076-.195 1.816-.104 2.104.246 2.52 1.561 2.443 2.118-.075.556-.465.876-.596.975-.135.104-.176.135-.165.21.015.104.076.104.181.075.147-.045.939-.375.975-1.215.045-1.079-.989-2.295-2.805-2.265-.746.015-1.215.09-1.575.24a.128.128 0 0 0-.06-.045c-1.35-1.455-3.855-2.475-3.75-4.41.03-.705.285-2.565 4.8-4.814 3.705-1.846 6.661-1.335 7.171-.21.72 1.605-1.589 4.589-5.43 5.024-1.47.165-2.235-.405-2.43-.615-.21-.225-.24-.24-.315-.195-.12.06-.045.255 0 .375.119.3.585.825 1.395 1.095.704.225 2.43.359 4.515-.45 2.34-.899 4.17-3.404 3.63-5.505z"/></svg>' },
    { name: 'Firebase', icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3.89 15.672L6.255.461A.542.542 0 0 1 7.27.288l2.543 4.771zm16.794 3.692l-2.25-14a.54.54 0 0 0-.919-.295L3.316 19.365l7.856 4.427a1.621 1.621 0 0 0 1.588 0zM14.3 7.147l-1.82-3.482a.542.542 0 0 0-.96 0L3.53 17.984z"/></svg>' },
    { name: 'Git', icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.546 10.93L13.067.452c-.604-.603-1.582-.603-2.188 0L8.708 2.627l2.76 2.76c.645-.215 1.379-.07 1.889.441.516.515.658 1.258.438 1.9l2.658 2.66c.645-.223 1.387-.078 1.9.435.721.72.721 1.884 0 2.604-.719.719-1.881.719-2.6 0-.539-.541-.674-1.337-.404-1.996L12.86 8.955v6.525c.176.086.342.203.488.348.713.721.713 1.883 0 2.6-.719.721-1.889.721-2.609 0-.719-.719-.719-1.879 0-2.598.182-.18.387-.316.605-.406V8.835c-.217-.091-.424-.222-.6-.401-.545-.545-.676-1.342-.396-2.009L7.636 3.7.45 10.881c-.6.605-.6 1.584 0 2.189l10.48 10.477c.604.604 1.582.604 2.186 0l10.43-10.43c.605-.603.605-1.582 0-2.187"/></svg>' }
  ];

  constructor(private scrollService: ScrollService) {}

  ngAfterViewInit(): void {
    this.animatedSections.forEach((section) => {
      this.scrollService.addVisibleClass(section.nativeElement, {
        threshold: 0.15,
        rootMargin: '-50px'
      });
    });
  }
}
