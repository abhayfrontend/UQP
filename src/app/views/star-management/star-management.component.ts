import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-star-management',
  templateUrl: './star-management.component.html',
  styleUrls: ['./star-management.component.scss']
})
export class StarManagementComponent implements OnInit {
  userRolePerm = {
    func: '',
    add: true,
    edit: true,
    view: true
  }
  starLength: number = 5;
  stars: any = []
  star: any;

  save_add_form: boolean = false;
  scoreL = [];
  measures: any;
  measuresQ: any;
  scoreU = [];
  createStarObj = [];
  @ViewChild('starModal') public star_modal: ModalDirective;
  constructor(public authS: AuthService, private commonService: CommonService, private toastr: ToastrService) { }
  showSuccess(msg, title) {
    this.toastr.success(title, msg);
  }
  showDanger(msg, title) {
    this.toastr.error(title, msg);
  }
  ngOnInit() {

    let perm = this.authS.getPermission('STAR Values');
    if (perm) {
      this.userRolePerm = perm
    };
    this.getMeasures();
    for (let i = 1; i <= this.starLength; i++) {
      this.scoreU.push({
        "arr": []
      })
    }

    for (let i = 0; i <= 100; i++) {
      this.scoreL.push(i);

    }
    for (let j = 0; j < this.starLength; j++) {
      // console.log(this.scoreU[0].arr)
      for (let k = 1; k <= 100; k++) {
        this.scoreU[j].arr.push(k);

      }

    }


  }
  getMeasures() {
    this.commonService.getMeasures().subscribe(results => {

      this.measures = results;
      this.getStars();
    }, err => {

    });
  }
  getStars() {
    this.commonService.getStars().subscribe(results => {

      this.stars = results;
      let Mstar = this.stars;
      this.measures = this.measures.filter(function (o1) {
        return !Mstar.some(function (o2) {
          return o1.Measure_ID === o2.measureid;
        });
      })

      this.starLength = results[0].starscore.length;
      this.createStarObj = [];
      for (let i = 1; i <= this.starLength; i++) {
        this.createStarObj.push({

          "StarName": i,
          "StarLR": "",
          "StarUR": "",
          "description": "",
          "status": true

        })
      }
    }, err => {

    });
  }

  getStar(id) {
    this.commonService.getStar(id).subscribe(results => {

      this.star = results;
      $('.starTable tbody > tr:last-child > td:last-child select').attr('disabled', 'disabled');
    }, err => {

    });
  }
  check(val, num) {
    let newVal = val.value;
    let score;
    console.log("New val" + newVal);
    for (let i = num; i < this.starLength; i++) {
      this.star.starscore[i].StarLR = "";
      if (i < this.starLength - 1) {
        this.star.starscore[i].StarUR = "";
      }

      console.log("score" + i);
      // let t = "score"+i;
      // console.log(eval(this.t))
    }
    this.star.starscore[num].StarLR = Number(newVal);
    this.scoreU[num].arr = [];
    for (let i = 0; i <= 100; i++) {
      this.scoreU[num].arr.push(i);

    }
    this.scoreU[num].arr.splice(0, Number(newVal) + 1)
    // console.log("Score"+this.score)
  }


  addStar(valid) {

    if (valid) {
      this.commonService.addStar(this.star).subscribe(
        res => {
          this.getStars();
          this.star_modal.hide();
          this.showSuccess('Add star values', this.star.measurename + ' star values created successfully')
          if (res.status == 200) {
            //
          }
        },
        err => {
          this.showDanger('Add star values', this.star.measurename + ' star values creation failed')
        }
      )
    }
  }

  updateStar(id, star, valid) {
    if (valid) {
      this.commonService.updateStar(id, star).subscribe(results => {
        // this.hideme[id]=!this.hideme[id]
        // this.users = results;
        this.getStars();
        this.star_modal.hide();
        this.showSuccess('Update star values', star.measurename + ' star values updated successfully')
      }, err => {
        this.showDanger('Update star values', star.measurename + ' star values update failed')
      });
    }

  }

  editStar(id) {
    this.save_add_form = false;
    this.getStar(id);
    this.star_modal.show()
    setTimeout(() => {
      $('.starTable tbody > tr:last-child > td:last-child select').attr('disabled', 'disabled');
    }, 300)

  }
  createStar() {

    this.save_add_form = true;
    this.star = {
      // "measurename":"",
      "measureid": "",

      "starscore": this.createStarObj

    }
    this.star.starscore[0].StarLR = 0;
    this.star.starscore[this.starLength - 1].StarUR = 100;
    this.star_modal.show();
    setTimeout(() => {
      $('.starTable tbody > tr:last-child > td:last-child select').attr('disabled', 'disabled');
    }, 100)
  }

}
