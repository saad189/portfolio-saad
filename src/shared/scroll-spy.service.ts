import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * ScrollSpyService — tracks which page section is currently in view using
 * IntersectionObserver and exposes the active fragment ID as an Observable.
 *
 * Sections register themselves by calling `observe(id)`. The service picks the
 * topmost visible section as the active one, which handles fast scrolling and
 * simultaneous entries correctly.
 */
@Injectable({ providedIn: 'root' })
export class ScrollSpyService implements OnDestroy {
  private _activeFragment = new BehaviorSubject<string>('');
  readonly activeFragment$ = this._activeFragment.asObservable();

  private observer: IntersectionObserver | null = null;
  /** Map from element → fragment id */
  private sectionMap = new Map<Element, string>();
  /** Tracks which sections are currently intersecting */
  private visibleSections = new Set<string>();

  constructor() {
    this.observer = new IntersectionObserver(
      (entries) => this.onIntersect(entries),
      {
        // Fire when section crosses the 20% mark from the top of the viewport.
        // rootMargin pushes the top edge down so a section is "active" when its
        // top is within the top 15% of the screen.
        rootMargin: '-15% 0px -70% 0px',
        threshold: 0,
      }
    );
  }

  /** Register a section element with its fragment id. */
  observe(id: string): void {
    const el = document.getElementById(id);
    if (!el || !this.observer) return;
    this.sectionMap.set(el, id);
    this.observer.observe(el);
  }

  /** Unregister a section (called on directive destroy). */
  unobserve(id: string): void {
    const el = document.getElementById(id);
    if (!el || !this.observer) return;
    this.observer.unobserve(el);
    this.sectionMap.delete(el);
    this.visibleSections.delete(id);
  }

  private onIntersect(entries: IntersectionObserverEntry[]): void {
    for (const entry of entries) {
      const id = this.sectionMap.get(entry.target);
      if (!id) continue;
      if (entry.isIntersecting) {
        this.visibleSections.add(id);
      } else {
        this.visibleSections.delete(id);
      }
    }
    this.pickActive();
  }

  /**
   * Pick the topmost visible section (by DOM order / scroll position).
   * Falls back to the last active one if nothing is intersecting.
   */
  private pickActive(): void {
    if (this.visibleSections.size === 0) return;

    // Sort visible sections by their top offset — topmost wins.
    const sorted = [...this.visibleSections].sort((a, b) => {
      const elA = document.getElementById(a);
      const elB = document.getElementById(b);
      if (!elA || !elB) return 0;
      return elA.getBoundingClientRect().top - elB.getBoundingClientRect().top;
    });

    this._activeFragment.next(sorted[0]);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
