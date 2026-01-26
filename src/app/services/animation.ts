import { Injectable } from '@angular/core';
import { gsap } from 'gsap';

@Injectable({
  providedIn: 'root',
})
export class AnimationService {

  /**
   * Fade in animation
   */
  fadeIn(element: HTMLElement | string, duration = 0.6, delay = 0): gsap.core.Tween {
    return gsap.fromTo(
      element,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration, delay, ease: 'power2.out' }
    );
  }

  /**
   * Fade out animation
   */
  fadeOut(element: HTMLElement | string, duration = 0.4): gsap.core.Tween {
    return gsap.to(element, {
      opacity: 0,
      y: -20,
      duration,
      ease: 'power2.in'
    });
  }

  /**
   * Slide in from left
   */
  slideInLeft(element: HTMLElement | string, duration = 0.6, delay = 0): gsap.core.Tween {
    return gsap.fromTo(
      element,
      { opacity: 0, x: -50 },
      { opacity: 1, x: 0, duration, delay, ease: 'power2.out' }
    );
  }

  /**
   * Slide in from right
   */
  slideInRight(element: HTMLElement | string, duration = 0.6, delay = 0): gsap.core.Tween {
    return gsap.fromTo(
      element,
      { opacity: 0, x: 50 },
      { opacity: 1, x: 0, duration, delay, ease: 'power2.out' }
    );
  }

  /**
   * Scale in animation
   */
  scaleIn(element: HTMLElement | string, duration = 0.6, delay = 0): gsap.core.Tween {
    return gsap.fromTo(
      element,
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration, delay, ease: 'back.out(1.7)' }
    );
  }

  /**
   * Stagger animation for multiple elements
   */
  staggerFadeIn(elements: HTMLElement[] | string, stagger = 0.1, duration = 0.6): gsap.core.Tween {
    return gsap.fromTo(
      elements,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration, stagger, ease: 'power2.out' }
    );
  }

  /**
   * Text reveal animation (character by character)
   */
  textReveal(element: HTMLElement, duration = 0.8): gsap.core.Timeline {
    const text = element.textContent || '';
    element.innerHTML = '';

    const chars = text.split('').map(char => {
      const span = document.createElement('span');
      span.textContent = char === ' ' ? '\u00A0' : char;
      span.style.display = 'inline-block';
      span.style.opacity = '0';
      element.appendChild(span);
      return span;
    });

    const tl = gsap.timeline();
    tl.to(chars, {
      opacity: 1,
      y: 0,
      duration: duration / chars.length,
      stagger: 0.03,
      ease: 'power2.out'
    });

    return tl;
  }

  /**
   * Parallax effect on scroll
   */
  parallax(element: HTMLElement | string, speed = 0.5): void {
    gsap.to(element, {
      yPercent: -50 * speed,
      ease: 'none',
      scrollTrigger: {
        trigger: element,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });
  }

  /**
   * Hover scale effect
   */
  hoverScale(element: HTMLElement, scale = 1.05): void {
    element.addEventListener('mouseenter', () => {
      gsap.to(element, { scale, duration: 0.3, ease: 'power2.out' });
    });

    element.addEventListener('mouseleave', () => {
      gsap.to(element, { scale: 1, duration: 0.3, ease: 'power2.out' });
    });
  }

  /**
   * Counter animation
   */
  animateCounter(element: HTMLElement, endValue: number, duration = 2): void {
    const obj = { value: 0 };
    gsap.to(obj, {
      value: endValue,
      duration,
      ease: 'power2.out',
      onUpdate: () => {
        element.textContent = Math.floor(obj.value).toString();
      }
    });
  }
}
