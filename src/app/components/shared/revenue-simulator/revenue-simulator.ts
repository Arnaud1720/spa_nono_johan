import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Service {
  id: string;
  category: string;
  name: string;
  hourlyRate: number;
  icon: string;
}

@Component({
  selector: 'app-revenue-simulator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './revenue-simulator.html',
  styleUrl: './revenue-simulator.scss',
})
export class RevenueSimulator {
  services: Service[] = [
    // Ménage
    { id: 'menage-simple', category: 'Ménage', name: 'Ménage simple du quotidien', hourlyRate: 22, icon: '🧹' },
    { id: 'grand-nettoyage', category: 'Ménage', name: 'Grand nettoyage', hourlyRate: 23, icon: '🧽' },
    { id: 'vitres', category: 'Ménage', name: 'Vitres', hourlyRate: 23, icon: '🪟' },
    { id: 'canape-literie', category: 'Ménage', name: 'Canapé / Fauteuil / Literie', hourlyRate: 25, icon: '🛋️' },
    { id: 'terrasse-balcon', category: 'Ménage', name: 'Terrasse / Balcon (karcher)', hourlyRate: 25, icon: '🏠' },
    { id: 'remise-etat', category: 'Ménage', name: 'Remise en état', hourlyRate: 27, icon: '✨' },
    // Animaux
    { id: 'garde-animaux', category: 'Animaux', name: 'Garde à domicile', hourlyRate: 17, icon: '🐕' },
    { id: 'promenade', category: 'Animaux', name: 'Promenade', hourlyRate: 14, icon: '🦮' },
    // Courses
    { id: 'courses-magasin', category: 'Courses', name: 'Courses en magasin', hourlyRate: 17, icon: '🛒' },
    { id: 'drive', category: 'Courses', name: 'Drive (retrait + livraison)', hourlyRate: 15, icon: '🚗' },
  ];

  categories = [...new Set(this.services.map(s => s.category))];

  selectedServiceId = signal<string>('menage-simple');
  hoursPerWeek = signal<number>(20);

  selectedService = computed(() =>
    this.services.find(s => s.id === this.selectedServiceId()) || this.services[0]
  );

  hourlyRate = computed(() => this.selectedService().hourlyRate);

  monthlyRevenue = computed(() => {
    // 4.33 semaines par mois en moyenne
    return Math.round(this.hoursPerWeek() * this.hourlyRate() * 4.33);
  });

  weeklyRevenue = computed(() => {
    return this.hoursPerWeek() * this.hourlyRate();
  });

  onServiceChange(serviceId: string): void {
    this.selectedServiceId.set(serviceId);
  }

  onHoursChange(event: Event): void {
    const value = (event.target as HTMLInputElement).valueAsNumber;
    this.hoursPerWeek.set(value);
  }

  getServicesByCategory(category: string): Service[] {
    return this.services.filter(s => s.category === category);
  }
}
