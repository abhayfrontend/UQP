import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GapAuditComponent } from './gap-audit/gap-audit.component';
import { AuthGuard } from '../../base/guards/auth.guard';
import { RoleGuard } from '../../base/guards/role.guard';
const routes: Routes = [{ path: '',
                         children: [
                          {path: 'gap-audit',component: GapAuditComponent,
                          canActivate: [AuthGuard,RoleGuard], 
                          data: {
					          title: 'Quality Audit',
					          name: 'Gap Audit'
					       }},
                          { path: '**', redirectTo: '/user/404'} 
                         ]
                      }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GapClosureRoutingModule { }
