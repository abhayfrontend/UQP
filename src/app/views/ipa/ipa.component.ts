import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-ipa',
  templateUrl: './ipa.component.html',
  styleUrls: ['./ipa.component.scss']
})
export class IpaComponent implements OnInit {
  rolename: string;
  roleid: any;
  ipa_list: any;
  //to store ipa dates and ipaid to give providerlist
  ipa_store:any = {};


  days: any;

  date = new Date();

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
  current_year = this.authS.getDates().current_year;
  current_month = this.authS.getDates().current_month;
  previous_month = this.authS.getDates().previous_month - 1;
  previous_month_full = this.authS.getDates().previous_month_full;

  current_date = {
    startdate: '',
    enddate: '',
    healthplanid:0,
    providerid:0
  }
  constructor(public authS: AuthService, private router: Router, private commonService: CommonService) { }

 


   ngOnInit() {
    this.rolename = this.authS.getUserRole();
    this.roleid = this.authS.getUserId();
    if (this.rolename == 'healthplan') {
      this.current_date.healthplanid = this.roleid; 
    }else if (this.rolename == 'provider') {
      this.current_date.providerid = this.roleid; 
    }
    this.getIpaByDate();
  }


  formatDate() {
    this.months.map((month) => {
      if (this.previous_month == Number(month.value)) {
        // this.selectedMonth = month.full;
        this.days = month.days;
      }
    });
    this.current_date.startdate = this.current_year + '-' + this.previous_month + '-01';
    this.current_date.enddate = this.current_year + '-' + this.previous_month + '-' + this.days;
  }



  getIpaByDate() {
    this.formatDate();
    this.commonService.getIpaByDate(this.current_date).subscribe(results => {
      this.ipa_list = results.body;
    }, err => {

    });
  }

  storeIpaId(ipa){
    this.ipa_store.startdate = this.current_date.startdate;
    this.ipa_store.enddate = this.current_date.enddate;
    this.ipa_store.ipaid = ipa.IPA_ID;
    this.ipa_store.IPA_Name = ipa.IPA_Name;
    localStorage.setItem('ipastore',JSON.stringify(this.ipa_store));
    this.router.navigate(['/provider/list']);
  }
}
