import { Directive, HostListener, Input } from '@angular/core';

/**
* Allows the aside to be toggled via click.
*/
@Directive({
  selector: '[appAsideMenuToggler]',
})
export class AsideToggleDirective {
  constructor() { }
  @Input() name: string;
  @HostListener('click', ['$event'])
  toggleOpen($event: any) {
  	console.log(this.name)
    $event.preventDefault();
    document.querySelector('body').classList.remove('aside-menu-hidden');
  }
}
