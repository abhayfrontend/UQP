import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {Location} from '@angular/common';
import * as $ from 'jquery';
@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss']
})
export class HelpComponent implements OnInit {
showHelp:boolean = true;
dashboard:boolean = false;
measures:boolean = false;
role:boolean = false;
star:boolean = false;
acm:boolean = false;
hpscorecard:boolean = false;
ipascorecard:boolean = false;
providerscorecard:boolean = false;
providermaster:boolean = false;
ipamaster:boolean = false;
insurancemaster:boolean = false;
membermaster:boolean = false;
membershipreport:boolean = false;
overallreport:boolean = false;
lastvisitreport:boolean = false;
userlist:boolean = false;
notifications:boolean = false;
videos:boolean = false;
bulkmail:boolean = false;
audit:boolean = false;
other:boolean = false;

insurance:boolean = false;
snpMember:boolean = false;
dashboardmra:boolean = false;
hpscorecardmra:boolean = false;
membershipreportmra:boolean = false;
mragaps:boolean = false;

  constructor(private _location: Location, private router: Router) { }

  ngOnInit() {
  	let name = this.router.url;
  	if(name.includes('dashboard/mra')){
  		this.dashboardmra = true;
  	}else if(name.includes('dashboard')){
      this.dashboard = true;
    }else if(name.includes('/reports/mra/gaps')){
      this.mragaps = true;
    }else if(name.includes('measures')){
  		this.measures = true;
  	}else if(name.includes('role')){
  		this.role = true;
  	}else if(name.includes('star')){
      this.star = true;
    }else if(name.includes('acm')){
      this.acm = true;
    }else if(name.includes('/scorecard/healthplan')){
      this.hpscorecard = true;
    }else if(name.includes('/scorecard/mra/healthplan')){
      this.hpscorecardmra = true;
    }else if(name.includes('/scorecard/provider')){
      this.providerscorecard = true;
    }else if(name.includes('/scorecard/ipa')){
      this.ipascorecard = true;
    }else if(name.includes('/provider/list')){
      this.providermaster = true;
    }else if(name.includes('/IPA/list')){
      this.ipamaster = true;
    }else if(name.includes('/insurance/list')){
      this.insurance = true;
    }else if(name.includes('/member/list')){
      this.membermaster = true;
    }else if(name.includes('/reports/membership-roster')){
      this.membershipreport = true;
    }else if(name.includes('/reports/mra/members')){
      this.membershipreportmra = true;
    }

    else if(name.includes('/reports/non-compliant')){
      this.overallreport = true;
    }else if(name.includes('/reports/last-visit')){
      this.lastvisitreport = true;
    }else if(name.includes('/user/list')){
      this.userlist = true;
    }else if(name.includes('/notifications')){
      this.notifications = true;
    }else if(name.includes('/videos')){
      this.videos = true;
    }else if(name.includes('/bulk-mail')){
      this.bulkmail = true;
    }else if(name.includes('/gap-audit')){
      this.audit = true;
    }else if(name.includes('/member/list')){
      this.snpMember = true;
    }else{
      this.other = true;
    }


  }
   backClicked() {
        // this._location.back();
        $('app-help').addClass('d-none');
        // $('.custom-container,.dashboard').removeClass('d-none');
    }

}


// else if(name.includes('/education')){
//       this.bulkmail = true;
//     }else if(name.includes('/message')){
//       this.bulkmail = true;
//     }