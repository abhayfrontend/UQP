import { Injectable } from '@angular/core';
import { 
  Router,
  CanActivate,
  ActivatedRouteSnapshot
} from '@angular/router';
import { AuthService } from '../../services/auth.service';
// import decode from 'jwt-decode';
@Injectable()
export class RoleGuard implements CanActivate {
 
    constructor(public auth: AuthService,private router: Router) { }
    checkPermission(name){
      console.log("Name"+name);
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
     canActivate(route: ActivatedRouteSnapshot): boolean {
        // this will be passed from the route config
        // on the data property

        const expectedName = route.data.name;
        console.log(route.data);
        const token = localStorage.getItem('token');
        if (!this.checkPermission(expectedName)) {
          this.router.navigate(['user/401']);
          return false;
        }
        return true;
      }
}


