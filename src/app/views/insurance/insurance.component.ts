import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-insurance',
  templateUrl: './insurance.component.html',
  styleUrls: ['./insurance.component.scss']
})
export class InsuranceComponent implements OnInit {
  rolename: string;
  roleid: any;
  insurance_list: any;
  days: any;
  months = [{ "full": "January", "value": "01", "days": "31" },
      { "full": "February", "value": "02", "days": "28" },
      { "full": "March", "value": "03", "days": "31" },
      { "full": "April", "value": "04", "days": "30" },
      { "full": "May", "value": "05", "days": "31" },
      { "full": "June", "value": "06", "days": "30" },
      { "full": "July", "value": "07", "days": "31" },
      { "full": "August", "value": "08", "days": "31" },
      { "full": "September", "value": "09", "days": "30" },
      { "full": "October", "value": "10", "days": "31" },
      { "full": "November", "value": "11", "days": "30" },
      { "full": "December", "value": "12", "days": "31" }
      ];

  date = new Date();
  current_year = this.authS.getDates().current_year;
  current_month = this.authS.getDates().current_month;
  previous_month = this.authS.getDates().previous_month - 1;
  previous_month_full = this.authS.getDates().previous_month_full;

  current_date = {
    startdate: '',
    enddate: '',
    healthplanid:0,
    providerid:0,
    ipaid:0
  }

  // previous_month = this.current_date.date.getMonth();
  // current_year = this.current_date.date.getFullYear();
  // Input : new Date().toISOString().slice(0,10),
  constructor(public authS: AuthService, private router: Router,
    private route: ActivatedRoute, private commonService: CommonService) { }

  ngOnInit() {

    this.rolename = this.authS.getUserRole();
    this.roleid = this.authS.getUserId();
    if (this.rolename == 'healthplan') {
      this.current_date.healthplanid = this.roleid; 
    }else if (this.rolename == 'provider') {
      this.current_date.providerid = this.roleid; 
    }else if (this.rolename == 'ipa') {
      // this.current_date.ipaid = this.roleid; 
    }

    this.getAllInsurance();
  }

  storeplans(plan,hpid) {

// alert(hpid)
    localStorage.setItem('plan', plan);
    localStorage.setItem('subplanhpid', hpid);
    localStorage.setItem('subplan', 'true');
    // this.router.navigate(['/member/list']);
  }
  getAllInsurance() {
    this.formatDate();

    this.commonService.getAllInsurance(this.current_date).subscribe(results => {
      // console.log(results)
      this.insurance_list = results;

    }, err => {

    });
  }


  formatDate() {
    this.months.map((month) => {
      if (this.previous_month == Number(month.value)) {
        // this.selectedMonth = month.full;
        this.days = month.days;
      }
    });
    this.current_date.startdate = this.current_year + '/' + this.previous_month + '/01';
    // this.current_date.startdate = 2016 + '/'+this.previous_month+'/01';
    // this.current_date.startdate = '2018/02/01';
    this.current_date.enddate = this.current_year + '/' + this.previous_month + '/' + this.days;
    // this.current_date.enddate ='2018/02/28';
  }
}
