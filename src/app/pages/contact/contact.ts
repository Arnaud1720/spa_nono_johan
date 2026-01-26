import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ContactForm {
  name: string;
  subject: string;
  message: string;
}

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class Contact {
  formData: ContactForm = {
    name: '',
    subject: '',
    message: ''
  };

  isSubmitting = signal(false);
  isSubmitted = signal(false);
  errorMessage = signal('');

  contactInfo = [
    {
      icon: 'mail',
      label: 'Email',
      value: 'contact@nono.dev',
      link: 'mailto:contact@nono.dev'
    },
    {
      icon: 'phone',
      label: 'Téléphone',
      value: '07 70 26 48 49',
      link: 'tel:+33770264849'
    }
  ];

  socialLinks = [
    { name: 'GitHub', url: 'https://github.com', icon: 'github' },
    { name: 'LinkedIn', url: 'https://linkedin.com', icon: 'linkedin' },
    { name: 'Twitter', url: 'https://twitter.com', icon: 'twitter' }
  ];

  async onSubmit(): Promise<void> {
    if (this.isSubmitting()) return;

    this.isSubmitting.set(true);
    this.errorMessage.set('');

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // In a real app, you would send the form data to a backend
    console.log('Form submitted:', this.formData);

    this.isSubmitting.set(false);
    this.isSubmitted.set(true);

    // Reset form
    this.formData = { name: '', subject: '', message: '' };
  }

  resetForm(): void {
    this.isSubmitted.set(false);
  }
}
