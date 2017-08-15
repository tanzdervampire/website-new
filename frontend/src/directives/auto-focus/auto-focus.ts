import { AfterViewInit, Directive, ElementRef, Renderer } from '@angular/core';

@Directive({
    selector: '[auto-focus]',
})
export class AutoFocusDirective implements AfterViewInit {

    constructor(
        private renderer: Renderer,
        private ref: ElementRef,
    ) {
    }

    ngAfterViewInit() {
        const element = this.ref.nativeElement.querySelector('input');
        setTimeout(() => {
            this.renderer.invokeElementMethod(element, 'focus', []);
        }, 0);
    }

}
