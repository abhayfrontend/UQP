import { Component, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

// Import navigation elements
import { navigation } from './../../_nav';
import * as $ from 'jquery';
@Component({
  selector: 'app-sidebar-nav',
  template: `
    <nav class="sidebar-nav">
      <ul class="nav">
        <ng-template ngFor let-navitem [ngForOf]="navigation">
          <li *ngIf="isDivider(navitem)" class="nav-divider"></li>
          <ng-template [ngIf]="isTitle(navitem)">
            <app-sidebar-nav-title [title]='navitem'></app-sidebar-nav-title>
          </ng-template>
          <ng-template [ngIf]="!isDivider(navitem)&&!isTitle(navitem)">
            <app-sidebar-nav-item [item]='navitem'></app-sidebar-nav-item>
          </ng-template>
        </ng-template>
      </ul>
    </nav>`
})
export class AppSidebarNavComponent {
  navigation:any;
ngOnInit(): void {
  //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
  //Add 'implements OnInit' to the class.
  this.navigation=navigation;
}
  

  public isDivider(item) {
    return item.divider ? true : false
  }

  public isTitle(item) {
   
    return item.title ? true : false
  }

  constructor() { }
}

import { Router } from '@angular/router';
@Component({
  selector: 'app-sidebar-nav-item',
  template: `

    <li *ngIf="!isDropdown() && check(item.fname); else dropdown " [ngClass]="hasClass() ? 'nav-item ' + item.class : 'nav-item'">
    
      <app-sidebar-nav-link [link]='item'></app-sidebar-nav-link>
    </li>
    <ng-template #dropdown>
      <li *ngIf="check(item.fname);" [ngClass]="hasClass() ? 'nav-item nav-dropdown ' + item.class : 'nav-item nav-dropdown'"
          
          appNavDropdown>

        <app-sidebar-nav-dropdown [link]='item'></app-sidebar-nav-dropdown>
      </li>
    </ng-template>
    `
})

// [class.open]="isActive()"
//           routerLinkActive="open"
export class AppSidebarNavItemComponent {
  @Input() item: any;
  check(name){
  
    // return false;
    let perm = JSON.parse(localStorage.getItem('permission'));
    let status = false;
if(perm){
      for(let i=0;i<perm.length;i++){
      if(name == perm[i].func){
        // alert(name)
        if(perm[i].add == false && perm[i].edit == false && perm[i].view ==false){
          status = false;
          break;
        }else{
          status = true;
        }
      }else{
        status = true;
      }
      
    }
}

    return status;
  }

  public hasClass() {
    return this.item.class ? true : false
  }

  public isDropdown() {
    return this.item.children ? true : false
  }

  public thisUrl() {
    return this.item.url
  }

  public isActive() {
    return this.router.isActive(this.thisUrl(), false)
  }

  constructor( private router: Router )  { }
  ngOnInit() {
    $('.nav-link').click(function(){
      if($(this).hasClass('nav-dropdown-toggle')){
        return;
      }else{
        $(this).parents('body').removeClass('sidebar-mobile-show');
      }     
  });
    $('li.nav-dropdown ul.nav-dropdown-items').each(function(){
      // console.log($(this).children().length);
      // console.log($(this).children());
       if($(this).children().length === 0){
        $(this).closest('li.nav-dropdown').remove();
       }
  });

     $('li.nav-dropdown').each(function(){
       if($(this).children('.nav-dropdown-toggle').text().trim() == "Dummy"){
        $(this).remove();
       }
  });
    }
}

@Component({
  selector: 'app-sidebar-nav-link',
  template: `
    <a *ngIf="!isExternalLink(); else external"
      [ngClass]="hasVariant() ? 'nav-link nav-link-' + link.variant : 'nav-link hover-animation'"
      routerLinkActive="active"
      [routerLink]="[link.url]">
      <i *ngIf="isIcon()" class="material-icons">{{link.icon}}</i>
      {{ link.name }}
      <span *ngIf="isBadge()" [ngClass]="'badge badge-' + link.badge.variant">{{ link.badge.text }}</span>
    </a>
    <ng-template #external>
      <a [ngClass]="hasVariant() ? 'nav-link nav-link-' + link.variant : 'nav-link hover-animation'" href="{{link.url}}">
        <i *ngIf="isIcon()" class="material-icons">{{link.icon}}</i>
        {{ link.name }}
        <span *ngIf="isBadge()" [ngClass]="'badge badge-' + link.badge.variant">{{ link.badge.text }}</span>
      </a>
    </ng-template>
  `
})
export class AppSidebarNavLinkComponent {
  @Input() link: any;

  public hasVariant() {
    return this.link.variant ? true : false
  }

  public isBadge() {
    return this.link.badge ? true : false
  }

  public isExternalLink() {
    return this.link.url.substring(0, 4) === 'http' ? true : false
  }

  public isIcon() {
    return this.link.icon ? true : false
  }

  constructor() { }
}

@Component({
  selector: 'app-sidebar-nav-dropdown',
  template: `
    <a class="nav-link nav-dropdown-toggle hover-animation" href="javascript:void(0)" appNavDropdownToggle>
      <i *ngIf="isIcon()" class="material-icons">{{link.icon}}</i>
      {{ link.name }}
      <span *ngIf="isBadge()" [ngClass]="'badge badge-' + link.badge.variant">{{ link.badge.text }}</span>
    </a>
    <ul class="nav-dropdown-items">
      <ng-template ngFor let-child [ngForOf]="link.children">
        <app-sidebar-nav-item [item]='child'></app-sidebar-nav-item>
      </ng-template>
    </ul>
  `
})
export class AppSidebarNavDropdownComponent {
  @Input() link: any;

  public isBadge() {
    return this.link.badge ? true : false
  }

  public isIcon() {
    return this.link.icon ? true : false
  }

  constructor() { }
}

@Component({
  selector: 'app-sidebar-nav-title',
  template: ''
})
export class AppSidebarNavTitleComponent implements OnInit {
  @Input() title: any;

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  ngOnInit() {
    const nativeElement: HTMLElement = this.el.nativeElement;
    const li = this.renderer.createElement('li');
    const name = this.renderer.createText(this.title.name);

    this.renderer.addClass(li, 'nav-title');

    if ( this.title.class ) {
      const classes = this.title.class;
      this.renderer.addClass(li, classes);
    }

    if ( this.title.wrapper ) {
      const wrapper = this.renderer.createElement(this.title.wrapper.element);

      this.renderer.appendChild(wrapper, name);
      this.renderer.appendChild(li, wrapper);
    } else {
      this.renderer.appendChild(li, name);
    }
    this.renderer.appendChild(nativeElement, li)
  }
}

export const APP_SIDEBAR_NAV = [
  AppSidebarNavComponent,
  AppSidebarNavDropdownComponent,
  AppSidebarNavItemComponent,
  AppSidebarNavLinkComponent,
  AppSidebarNavTitleComponent
];
