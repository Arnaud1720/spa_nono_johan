import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Skill {
  name: string;
  level: number;
  category: string;
}

@Component({
  selector: 'app-skills-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skills-list.html',
  styleUrl: './skills-list.scss',
})
export class SkillsList {
  skills: Skill[] = [
    { name: 'Angular', level: 95, category: 'Frontend' },
    { name: 'TypeScript', level: 90, category: 'Languages' },
    { name: 'SCSS/CSS', level: 95, category: 'Styling' },
    { name: 'Three.js', level: 80, category: '3D/WebGL' },
    { name: 'GSAP', level: 85, category: 'Animation' },
    { name: 'Figma', level: 90, category: 'Design' },
  ];

  technologies = [
    'Angular', 'React', 'Vue.js', 'TypeScript', 'JavaScript',
    'SCSS', 'Tailwind CSS', 'GSAP', 'Three.js', 'Figma',
    'Adobe XD', 'Git', 'Node.js', 'REST API', 'GraphQL'
  ];
}
