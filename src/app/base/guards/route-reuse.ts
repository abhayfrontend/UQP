import { ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy } from '@angular/router';
export class CustomReuseStrategy implements RouteReuseStrategy {

  private handlers: {[key: string]: DetachedRouteHandle} = {};


  constructor() {

  }

  shouldDetach(route: ActivatedRouteSnapshot): boolean {
      if (!route.routeConfig || route.routeConfig.loadChildren) {
            return false;
        }
      return  (route.data as any).shouldDetach;
  }

  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
    this.handlers[route.url.join("/") || route.parent.url.join("/")] = handle;
  }




  shouldAttach(route: ActivatedRouteSnapshot): boolean {
      //clear handlers after logout or homepage
    if ((route.data as any).shouldclear) {
     this.handlers = {};
     return false;
   }else{
       return !!this.handlers[route.url.join("/") || route.parent.url.join("/")];
   }

    
  }

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
      if (!route.routeConfig) return null;
        if (route.routeConfig.loadChildren) return null;
    return this.handlers[route.url.join("/") || route.parent.url.join("/")];
  }




  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    return future.routeConfig === curr.routeConfig;
  }

}