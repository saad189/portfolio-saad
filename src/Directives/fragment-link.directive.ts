import {
  Directive,
  ElementRef,
  Renderer2,
  OnDestroy,
  OnInit,
  Input,
} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { ScrollSpyService } from '../shared/scroll-spy.service';

/**
 * appFragmentLinkActive — marks a nav link as active based on:
 *  1. The URL fragment after a router navigation (click-based)
 *  2. The scroll-spy service that tracks which section is in view (scroll-based)
 *
 * Usage:
 *   <a routerLink="/" [fragment]="'experience'" appFragmentLinkActive="experience">
 */
@Directive({
  selector: '[appFragmentLinkActive]',
})
export class FragmentLinkActiveDirective implements OnInit, OnDestroy {
  @Input('appFragmentLinkActive') fragment!: string;
  @Input() activeClass: string = 'active';

  private subs = new Subscription();

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private router: Router,
    private scrollSpy: ScrollSpyService
  ) {}

  ngOnInit() {
    // Register the section so the scroll-spy can observe it.
    this.scrollSpy.observe(this.fragment);

    // 1. Router navigation — keeps active state correct after clicking a nav link
    //    or on initial page load with a fragment in the URL.
    this.subs.add(
      this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.syncWithRouter();
        }
      })
    );
    this.syncWithRouter();

    // 2. Scroll-spy updates driven by IntersectionObserver.
    this.subs.add(
      this.scrollSpy.activeFragment$.subscribe((activeId) => {
        if (activeId === this.fragment) {
          this.renderer.addClass(this.el.nativeElement, this.activeClass);
        } else if (activeId) {
          // Only remove when the spy has an opinion — avoids flickering on init.
          this.renderer.removeClass(this.el.nativeElement, this.activeClass);
        }
      })
    );
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
    this.scrollSpy.unobserve(this.fragment);
  }

  private syncWithRouter(): void {
    const urlTree = this.router.parseUrl(this.router.url);
    if (urlTree.fragment === this.fragment) {
      this.renderer.addClass(this.el.nativeElement, this.activeClass);
    } else {
      this.renderer.removeClass(this.el.nativeElement, this.activeClass);
    }
  }
}
