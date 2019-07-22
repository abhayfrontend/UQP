import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, CanDeactivate } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router) {}

    canActivate() {
        if (localStorage.getItem('token')) {
            // logged in so return true
            return true;
        }else{
            // not logged in so redirect to login page
            this.router.navigate(['/']);
            return false;
        }
    }

}

