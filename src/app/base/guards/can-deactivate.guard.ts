import { Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

export interface CanComponentDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable()
export class CanDeactivateGuard implements CanDeactivate<CanComponentDeactivate> {

  canDeactivate(component: CanComponentDeactivate, route: ActivatedRouteSnapshot) {
    // console.log(route);
    // const expectedName = route.data.name;
    // console.log(expectedName);
    // if(expectedName == 'home'){
    //     return true;
    // }else{
    //   return component.canDeactivate ? component.canDeactivate() : true;  
    // }
    return component.canDeactivate ? component.canDeactivate() : true;  
  }

}