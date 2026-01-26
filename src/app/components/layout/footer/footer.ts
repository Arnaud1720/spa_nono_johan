import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  currentYear = new Date().getFullYear();

  socialLinks = [
    { name: 'LinkedIn', url: 'https://linkedin.com', icon: 'linkedin' },
    { name: 'Instagram', url: 'https://instagram.com', icon: 'instagram' },
    { name: 'Twitter', url: 'https://twitter.com', icon: 'twitter' },
    { name: 'GitHub', url: 'https://github.com', icon: 'github' },
  ];

  quickLinks = [
    { label: 'Accueil', path: '/' },
    { label: 'Projets', path: '/projets' },
    { label: 'À Propos', path: '/a-propos' },
    { label: 'Contact', path: '/contact' },
  ];
}
