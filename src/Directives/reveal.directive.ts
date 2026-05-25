import { Directive, ElementRef, OnInit, OnDestroy } from '@angular/core';

@Directive({ selector: '[appReveal]', standalone: true })
export class RevealDirective implements OnInit, OnDestroy {
  private observer!: IntersectionObserver;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.el.nativeElement.classList.add('reveal');
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const siblings = Array.from(el.parentElement?.children ?? []).filter(c =>
              c.classList.contains('reveal')
            );
            const idx = siblings.indexOf(el);
            setTimeout(() => el.classList.add('visible'), Math.max(0, idx) * 60);
            this.observer.unobserve(el);
          }
        });
      },
      { threshold: 0.05, rootMargin: '0px 0px -20px 0px' }
    );
    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }
}
