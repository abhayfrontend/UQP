import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRoute,
  ActivatedRouteSnapshot
} from '@angular/router';
import { AuthService } from '../../services/auth.service';

// import decode from 'jwt-decode';
@Injectable()
export class ReuseGuard implements CanActivate {
  constructor(public auth: AuthService, private router: Router, private activatedRoute: ActivatedRoute) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    // this will be passed from the route config
    const expectedName = route.data.name;
    let roleid = JSON.parse(localStorage.getItem('currentUser')).roleid;
    if (expectedName !== 'dashboard') {
      return true;
    }else{
      if (roleid == 48) {
        this.router.navigate(['dashboard/member']);
        return false;
      } else if (roleid == 51) {
        this.router.navigate(['dashboard/quality-audit']);
        return false;
      }
      return true;
    }

  }
}


