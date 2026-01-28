import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Project {
  id: number;
  title: string;
  category: string;
  image?: string;
  video?: string;
  description: string;
  tech?: string[];
}

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './project-card.html',
  styleUrl: './project-card.scss',
})
export class ProjectCard {
  @Input() project!: Project;
  @Input() featured = false;
}
