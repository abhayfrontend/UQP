import { Component, OnInit, OnDestroy, Input, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { CommonService } from '../../../services/common.service';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';
import { Observable, Subscription } from 'rxjs/Rx';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-caphs-survey',
  templateUrl: './caphs-survey.component.html',
  styleUrls: ['./caphs-survey.component.scss']
})
export class CaphsSurveyComponent implements OnInit {
  @ViewChild('userModal') public modal: ModalDirective;
  @ViewChild('user') public modals: ModalDirective;
  ticks = 0;
  private timer;
  minutes = 0;
  private sub: Subscription;
  questioncap: any;
  lengthquestion: any;
  vales: boolean = false;
  x: number = 0;
  result: any;
  one = {
    'questionid': 1
  }
  defaultquestion: any;
  answers: any;
  days: any;
  datea: any;
  apsn = 0;
  freetext: boolean = false;
  member_list: any;
  membername: string;
  subscriberid: any;
  aps = 0;
  min = 0;
  id = 0;
  showminutes: any;
  showseconds: any;
  hpnme: any;
  data: any = {};
  questionsanswered: any;
  name: any;
  healthplanname: any;
  showdate: any;
  subscriberidshow: any;
  member_show: any;
  comments: any;
  questionid = 0;
  currentUser: any;
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
  memberoption: boolean = false;
  insurance_list; any;
  provider_name: any;
  members: any;
  memberCategory: any;
  showPanel: boolean = true;
  years: string[] = [];
  date: any = {
    // 'month':this.current_month,
    'month': "",
    'year': ""
  };
  listarray = [];
  answersheet = [];
  commentshow: any;
  params = {

    'providerid': '',
    'healthplanid': '',
    'quarter': 1,
    'response': ''

  }
  comment: any;
  showsave: boolean = false;
  previous_month = this.months[new Date().getMonth() - 3]["value"];
  current_date = new Date();
  current_month = this.authS.getDates().current_month;
  current_year = this.authS.getDates().current_year;
  constructor(public authS: AuthService, private commonService: CommonService, private route: ActivatedRoute, private router: Router, private userService: UserService) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  ngOnInit() {
    this.listarray = [];
    this.getMonthDateRange(2019, 1);
    this.route.params.subscribe(params => {
      this.memberCategory = params['term'];
    });
    // for (let year = Number(this.current_year); year > 2017; year -= 1) {
    //     this.years.push(year.toString());
    //   }
    // this.date = {
    //       // 'month':this.current_month,
    //       'month': this.previous_month,
    //       'year': this.current_year
    //     }
    // this.checkMonth(this.current_year)
    this.getAllHealthplans();

    this.memberlist()

    // subscribing to a observable returns a subscription object

    // const startOfMonth = moment().startOf('quarter').format('YYYY-MM-DD hh:mm');
    // const endOfMonth   = moment().endOf('quarter').format('YYYY-MM-DD hh:mm');

    // console.log(startOfMonth, endOfMonth)


  }

//timer of caphs
  tickerFunc(secs) {
    var sec_num = parseInt(secs, 10)
    var hours = Math.floor(sec_num / 3600) % 24
    this.min = Math.floor(sec_num / 60) % 60
    this.ticks = sec_num % 60
    // return [hours,minutes,seconds]
    //     .map(v => v < 10 ? "0" + v : v)
    //     .filter((v,i) => v !== "00" || i > 0)
    //     .join(":")
  }

  getMonthDateRange(year, month) {


    // month in moment is 0 based, so 9 is actually october, subtract 1 to compensate
    // array is 'year', 'month', 'day', etc
    month = Number(month)
    var startDate = moment([year, month - 1]);

    // Clone the value before .endOf()
    var endDate = moment([year, month - 1 + 2]).endOf('month');

    this.params['startdate'] = startDate.startOf('day');
    this.params['enddate'] = endDate.startOf('day');


  }

  ngOnDestroy() {

    // this.sub.unsubscribe();

  }
//coment box 
  showCommentBox() {
    this.showcomment();
    this.modals.hide();

    this.modal.show();

  }

//caphs question
  questions() {
    this.commonService.questioncaphs(this.hpnme, 'cahps').subscribe(results => {
      this.questioncap = results;


      this.start();
      this.questionnext(4, '54')



    }, err => { });
  }
  //timer 
  start() {
    this.timer = Observable.timer(1000, 1000);

    this.sub = this.timer.subscribe(t => this.tickerFunc(t));
  }
  getAllHealthplans() {
    this.commonService.getAllHealthplans().subscribe(results => {

      this.insurance_list = results;
    }, err => {

    });
  }
  // checkMonth(selectedYear) {
  //   this.formatDate();
  //   if (selectedYear == this.authS.getDates().actual_year) {

  //     this.months.map((month) => {
  //       if (this.current_month == month.value) {
  //         this.months.splice(Number(month.value), 12)
  //       }
  //     })
  //   } else {
  //     this.months = [{ "full": "January", "value": "01", "days": "31" },
  //     { "full": "February", "value": "02", "days": "28" },
  //     { "full": "March", "value": "03", "days": "31" },
  //     { "full": "April", "value": "04", "days": "30" },
  //     { "full": "May", "value": "05", "days": "31" },
  //     { "full": "June", "value": "06", "days": "30" },
  //     { "full": "July", "value": "07", "days": "31" },
  //     { "full": "August", "value": "08", "days": "31" },
  //     { "full": "September", "value": "09", "days": "30" },
  //     { "full": "October", "value": "10", "days": "31" },
  //     { "full": "November", "value": "11", "days": "30" },
  //     { "full": "December", "value": "12", "days": "31" }
  //     ]
  //   }
  // }
  //  formatDate() {
  //     this.months.map((month) => {
  //       if (this.date.month == month.value) {
  //         // this.selectedMonth = month.full;
  //         if (month.value == '02' && this.date.year % 4 == 0) {
  //           this.days = '29';
  //         } else {
  //           // console.log(month.value)
  //           this.days = month.days;
  //         }

  //       }
  //     });
  //     // this.params.startdate = this.date.year + '-' + this.date.month + '-01';
  //     // this.params.enddate = this.date.year + '-' + this.date.month + '-' + this.days;


  //     // new Date("2015-03-25");
  //   }
//checking response and moving to next question
  questionnext(result, response) {

    if (result == 1 && this.params.response == 'Yes') {
      this.x = 1;
      this.freetext = false;
    }
    else if (result == 1 && this.params.response == 'No') {
      this.x = 38;
      this.freetext = true;
    }
    else if (result == 39) {
      this.result = 2;
      this.x = 2;
      this.freetext = false;
      console.log('a')
    }
    else if (result == 2 && this.params.response == 'No') {
      this.x = 3;
      this.freetext = false;
    }
    else if (result == 4 && this.params.response == 'No') {
      this.x = 5;
      this.freetext = false;
    }
    else if (result == 6 && this.params.response == 'None') {
      this.x = 8;
      this.freetext = false;
    }
    else if (result == 10 && this.params.response == 'None') {
      this.x = 14;
      this.freetext = false;
    }
    else if (result == 9 && this.params.response == 'No') {
      this.x = 15;
      this.freetext = false;
    }
    else if (result == 10 && this.params.response == 'None') {
      this.x = 14;
      this.freetext = false;
    }
    else if (result == 16 && this.params.response == 'No') {
      this.x = 19;
      this.freetext = false;
    }
    else if (result == 18 && this.params.response == 'None') {
      this.x = 19;
      this.freetext = false;
    }
    else if (result == 20 && this.params.response == 'No') {
      this.x = 22;
      this.freetext = false;
    }
    else if (result == 23 && this.params.response == 'No') {
      this.x = 24;
      this.freetext = false;
    }
    else if (result == 28 && this.params.response == 'No') {
      this.x = 29;
      this.freetext = false;
    }
    else if (result == 30 && this.params.response == 'No') {
      this.x = 31;
      this.freetext = false;
    }

    else {
      if (this.aps == 0) {
        this.x = 0;
        this.freetext = false;
        this.aps = this.aps + 1;
      }
      else {
        this.x = this.x + 1;
        this.freetext = false;
      }
    }
    this.questionid = result;
    this.postinarray();
    if (response == 'last') {
      this.showsave = true;
      this.params['minutes'] = this.min;
      this.params['seconds'] = this.ticks;
      this.answersposts();

    }
    this.checklast();
    console.log(this.x)

    this.result = this.questioncap[this.x];
    console.log(this.result)
    if (result == 39) {
      this.answers = this.questioncap[2].optionlist;
    }
    else {
      this.answers = this.questioncap[this.x].optionlist;
    }
    console.log(this.answers)
    this.params.response = '';

  }
  memberlist() {
    this.memberoption = false;
    // this.start();
    this.params['type'] = 'cahps';
    this.userService.memberquestion(this.params).subscribe(res => {
      this.member_list = res;
    }, err => { });
  }
  //pushing question and answer in a object
  postinarray() {
    if (this.apsn == 0) {
      this.apsn = this.apsn + 1;
    }
    else {
      console.log("answer res" + this.params.response);
      if (this.params.response) {
        this.answersheet.push({ 'questionid': this.questionid, 'answer': this.params.response })
      }

    }
  }
  //checking last question
  checklast() {
    if (this.questionid == 38) {
      this.showsave = true;
      this.params['minutes'] = this.min;
      this.params['seconds'] = this.ticks;

      this.answersposts();
    }
    else if (this.questionid == 36 && this.params.response == 'No') {
      this.showsave = true;
      this.params['minutes'] = this.min;
      this.params['seconds'] = this.ticks;
      this.answersposts();

    }

  }
  //open caphs report window function
  opengapmodal(member) {

    this.memberoption = true;
    this.showsave = false;
    this.freetext = false;
    this.x = 0;
    this.listarray.push(member.subscriberid);
    this.membername = member.lastname + "," + member.firstname;
    this.subscriberid = member.subscriberid;
    this.memberoption = true;
    this.hpnme = member.hpname;
    this.params['subscriberid'] = member.subscriberid;
    this.params['healthplanid'] = member.healthplanid;
    this.params['healthplanname'] = member.hpname;
    this.params['providerid'] = member.providerid;
    this.params['providerfirstname'] = member.Provider_FirstName;
    this.params['providerlastname'] = member.Provider_LastName;
    this.params['subscriberfirstname'] = member.firstname;
    this.params['subscriberlastname'] = member.lastname;
    this.questions();





  }
  //on open comment box
  showcomment() {
    this.modal.show();
    this.userService.getsummarybox(this.id).subscribe(res => {
      this.member_show = res;
      this.subscriberidshow = this.member_show[0].subscriberid;
      this.name = this.member_show[0].subscriberlastname + "," + this.member_show[0].subscriberfirstname;
      this.datea = this.member_show[0].submissiondate;
      this.healthplanname = this.member_show[0].healthplanname;
      this.questionsanswered = this.member_show[0].question_answered;
      this.showseconds = this.member_show[0].seconds;
      this.showminutes = this.member_show[0].minutes;
    }, err => { });
  }
  //comment box  function
  savecomment() {
    console.log(this.commentshow)
    this.data['surveyid'] = this.id;
    this.data['comment'] = this.commentshow;

    this.userService.savecommenta(this.data).subscribe(res => {
      this.modal.hide();
      this.commentshow = '';
    }, err => { });
  }
//answers posting

  answersposts() {
    this.sub.unsubscribe();
    this.params['answerlist'] = this.answersheet;
    this.params['surveytype'] = 'cahps';
    this.params['userid'] = this.currentUser.userid;
    this.params['name'] = this.currentUser.name;

    this.userService.answerpost(this.params).subscribe(res => {
      this.modals.show();
      this.id = res;

      this.memberoption = false;
      this.params = {

        'providerid': '',
        'healthplanid': '',
        'quarter': 1,
        'response': ''

      }
      this.getMonthDateRange(2019, 1);
      this.answersheet = [];
      this.aps = 0;
      this.provider_name = '';
    }, err => { });
  }
  //checking member for highlighting
  check(member) {

    for (let i = 0; i < this.listarray.length; i++) {
      if (member.subscriberid == this.listarray[i]) {
        return true;
      }

    }
    return false;
  }
  getInsurance(member) {
    this.showPanel = false;
    this.provider_name = member.FirstName + ' ' + member.LastName;
    this.params.providerid = member.id;
    this.showPanel = false;
    // this.provider.uniqeproviderno = member.id;
    // this.commonService.getInsurance(member.id
    //   ).subscribe(results => {

    //     this.insurance_list = results;

    //   }, err => {

    //   });
  }

//on reset
  resetFilter() {
    this.params = {

      'providerid': '',
      'healthplanid': '',
      'quarter': 1,
      'response': ''

    }
    this.getMonthDateRange(2019, 1);
    this.provider_name = '';

    this.memberlist();
  }
//provider search
  searchProvider() {
    if (this.provider_name.length > 2) {
      this.showPanel = true;
      this.userService.search_provider(this.provider_name).subscribe(
        res => {
          this.members = res;
        },
        err => {
          //
        }
      )
    }
    if (this.provider_name.length == 0) {
      this.members = [];
      this.showPanel = false;
    }

  }

}

