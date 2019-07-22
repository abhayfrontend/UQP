import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';
import * as $ from 'jquery';
@Component({
  selector: 'app-user-view',
  templateUrl: './user-view.component.html',
  styleUrls: ['./user-view.component.scss']
})
export class UserViewComponent implements OnInit {
  id: number;
  user_profile: any;
  userListPerm: any;
  // measure:any={
  //     Measure_Name:'',
  //   Measure_Description:'',
  //      Numerator_Detail:'',
  //       Denominator_Detail:'',
  //       Exclusion_Detail:'',
  //       Weightage:'',
  //       Status:'',

  // };
  constructor(private router: Router,
    private route: ActivatedRoute, private userService: UserService,
    public authS: AuthService) { }

  ngOnInit() {
    this.userListPerm = this.authS.getPermission('Users');

    this.route.params.subscribe(params => {
      this.id = params['id'];
    });
    this.getUserProfile(this.id);
  }
  getUserProfile(id) {
    this.userService.getUserProfile(id).subscribe(results => {

      this.user_profile = results;
    }, err => {

    });
  }
  //on test() add this class
  test() {
    $('.modal-backdrop').attr("style", "display: none !important")
  }

}
