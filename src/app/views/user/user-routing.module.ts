import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { UserRoleComponent } from './user-role/user-role.component';
import { UsersListComponent } from './users-list/users-list.component';
import { UserViewComponent } from './user-view/user-view.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { UnauthorizedComponent } from './401/401.component';
import { NotFoundComponent } from './404/404.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { AuthGuard } from '../../base/guards/auth.guard';
import { RoleGuard } from '../../base/guards/role.guard';
import { CanDeactivateGuard } from '../../base/guards/can-deactivate.guard';
const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Example Pages'
    },
    children: [
      
      {
        path: 'role',
        component: UserRoleComponent,
        canActivate: [AuthGuard,RoleGuard],
        data: {
          title: 'User Role',
          name: 'Role Management'
        }
      },
      {
        path: 'list',
        component: UsersListComponent,
        canActivate: [AuthGuard,RoleGuard],
        data: {
          title: 'User Role',
          name: 'User Management'
        }
      },
      {
        path: 'view/:id',
        component: UserViewComponent,
        // canActivate: [AuthGuard,RoleGuard],
        data: {
          title: 'User view',
          name: 'User Management'
        }
      },
      {
        path: 'change-password',
        component: ChangePasswordComponent,
        canActivate: [AuthGuard,RoleGuard],
        canDeactivate:[CanDeactivateGuard],
        data: {
          title: 'change-password'
        }
      },
      {
        path: 'forgot-password',
        component: ForgotPasswordComponent,
        data: {
          title: 'forgot-password'
        }
      },
      {
        path: '404',
        component: NotFoundComponent,
        data: {
          title: '404'
        }
      },
      {
        path: '401',
        component: UnauthorizedComponent,
        data: {
          title: 'forgot-password'
        }
      },
         {
    path: 'reset-password/:token',
    component: ResetPasswordComponent,
  }
      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule {}
