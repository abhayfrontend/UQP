import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appNavDropdown]'
})
export class NavDropdownDirective {

  constructor(private el: ElementRef) { }

  toggle() {
    let list = document.querySelectorAll('.nav-dropdown');
    let cc = this.el.nativeElement.classList.contains('open')
    for(let i=0;i<list.length;i++){  
        list[i].classList.remove('open') 
    }
    if(!cc){
      this.el.nativeElement.classList.toggle('open'); 
    }
  }
}

/**
* Allows the dropdown to be toggled via click.
*/
@Directive({
  selector: '[appNavDropdownToggle]'
})
export class NavDropdownToggleDirective {
  constructor(private dropdown: NavDropdownDirective) {}

  @HostListener('click', ['$event'])
  toggleOpen($event: any) {
    $event.preventDefault();
    this.dropdown.toggle();
  }
}

export const NAV_DROPDOWN_DIRECTIVES = [NavDropdownDirective, NavDropdownToggleDirective];
