
import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';

import { NotFoundComponent } from './404/404.component';
import { UnauthorizedComponent } from './401/401.component';
import { UserRoutingModule } from './user-routing.module';
import { UserRoleComponent } from './user-role/user-role.component';
import { UsersListComponent } from './users-list/users-list.component';
import { UserViewComponent } from './user-view/user-view.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

import { BaseModule } from '../../base/base.module';

@NgModule({
  imports: [ UserRoutingModule, BaseModule ],
  declarations: [
    UserRoleComponent,
    UsersListComponent,
    UserViewComponent,
    ChangePasswordComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    NotFoundComponent, UnauthorizedComponent

  ],
  exports:[NotFoundComponent]
})
export class UserModule { }
