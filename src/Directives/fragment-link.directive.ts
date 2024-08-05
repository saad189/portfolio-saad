import { Directive, ElementRef, Renderer2, OnDestroy, OnInit, Input } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';

@Directive({
    selector: '[appFragmentLinkActive]'
})
export class FragmentLinkActiveDirective implements OnInit, OnDestroy {
    @Input('appFragmentLinkActive')
    fragment!: string;
    @Input() activeClass: string = 'focused';
    private subscription!: Subscription;

    constructor(private el: ElementRef, private renderer: Renderer2, private router: Router) { }

    ngOnInit() {
        this.subscription = this.router.events.subscribe(event => {

            if (event instanceof NavigationEnd) {
                this.updateActiveClass();
            }
        });
        this.updateActiveClass();
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    private updateActiveClass() {
        const urlTree = this.router.parseUrl(this.router.url);
        console.log(this.router.url, { thiFragment: this.fragment, urlTreeFragment: urlTree.fragment });
        if (urlTree.fragment === this.fragment) {
            this.renderer.addClass(this.el.nativeElement, this.activeClass);
        } else {
            this.renderer.removeClass(this.el.nativeElement, this.activeClass);
        }
    }
}
