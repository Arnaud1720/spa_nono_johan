import { Injectable, NgZone } from '@angular/core';

export interface ScrollObserverOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ScrollService {
  private observers: Map<HTMLElement, IntersectionObserver> = new Map();

  constructor(private ngZone: NgZone) {}

  /**
   * Observe an element and trigger callback when it enters viewport
   */
  observe(
    element: HTMLElement,
    callback: (entry: IntersectionObserverEntry) => void,
    options: ScrollObserverOptions = {}
  ): void {
    const {
      threshold = 0.1,
      rootMargin = '0px',
      triggerOnce = true
    } = options;

    this.ngZone.runOutsideAngular(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              this.ngZone.run(() => callback(entry));

              if (triggerOnce) {
                observer.unobserve(entry.target);
                this.observers.delete(element);
              }
            }
          });
        },
        { threshold, rootMargin }
      );

      observer.observe(element);
      this.observers.set(element, observer);
    });
  }

  /**
   * Add 'visible' class when element enters viewport
   */
  addVisibleClass(element: HTMLElement, options: ScrollObserverOptions = {}): void {
    this.observe(
      element,
      () => {
        element.classList.add('visible');
      },
      options
    );
  }

  /**
   * Observe multiple elements with staggered animation
   */
  observeMultiple(
    elements: HTMLElement[],
    callback: (entry: IntersectionObserverEntry, index: number) => void,
    options: ScrollObserverOptions = {}
  ): void {
    elements.forEach((element, index) => {
      this.observe(
        element,
        (entry) => callback(entry, index),
        options
      );
    });
  }

  /**
   * Add visible class with stagger delay
   */
  staggerVisible(elements: HTMLElement[], staggerDelay = 100, options: ScrollObserverOptions = {}): void {
    elements.forEach((element, index) => {
      this.observe(
        element,
        () => {
          setTimeout(() => {
            element.classList.add('visible');
          }, index * staggerDelay);
        },
        options
      );
    });
  }

  /**
   * Unobserve an element
   */
  unobserve(element: HTMLElement): void {
    const observer = this.observers.get(element);
    if (observer) {
      observer.unobserve(element);
      this.observers.delete(element);
    }
  }

  /**
   * Unobserve all elements
   */
  unobserveAll(): void {
    this.observers.forEach((observer, element) => {
      observer.unobserve(element);
    });
    this.observers.clear();
  }

  /**
   * Smooth scroll to element
   */
  scrollToElement(element: HTMLElement | string, offset = 0): void {
    const targetElement = typeof element === 'string'
      ? document.querySelector(element) as HTMLElement
      : element;

    if (targetElement) {
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }

  /**
   * Scroll to top
   */
  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  /**
   * Get scroll progress (0 to 1)
   */
  getScrollProgress(): number {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    return docHeight > 0 ? scrollTop / docHeight : 0;
  }
}
