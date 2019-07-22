import { Component, OnInit, OnDestroy, Input, ViewChild, ElementRef } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { CommonService } from '../../../services/common.service';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';
import { Observable, Subscription } from 'rxjs/Rx';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-hosp-survey',
  templateUrl: './hosp-survey.component.html',
  styleUrls: ['./hosp-survey.component.scss']
})
export class HospSurveyComponent implements OnInit {
  @ViewChild('userModal') public modal: ModalDirective;
  @ViewChild('user') public modals: ModalDirective;
  @ViewChild('term') input: ElementRef;
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
  initial = 0;
  showminutes: any;
  showseconds: any;
  hpnme: any;
  response: any;
  data: any = {};
  textfield: any;
  questionsanswered: any;
  name: any;
  questionone: any;
  healthplanname: any;
  showdate: any;
  subscriberidshow: any;
  member_show: any;
  comments: any;
  questionid = 0;
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
  listarray = [];
  provider_name: any;
  members: any;
  questionsidarray = [];
  temparray = [];
  memberCategory: any;
  showPanel: boolean = true;
  years: string[] = [];
  date: any = {
    // 'month':this.current_month,
    'month': "",
    'year': ""
  };
  answersheet = [];
  commentshow: any;
  responses: any;
  params = {

    'providerid': '',
    'healthplanid': '',
    'startdate': '',
    'enddate': '',
    'response': ''

  }
  answerarray = [];
  comment: any;

  showsave: boolean = false;
  previous_month = this.months[new Date().getMonth() - 3]["value"];
  current_date = new Date();
  current_month = this.authS.getDates().current_month;
  current_year = this.authS.getDates().current_year;
  currentUser: any;
  constructor(public authS: AuthService, private commonService: CommonService, private route: ActivatedRoute, private router: Router, private userService: UserService) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  ngOnInit() {
    this.listarray = [];
    this.route.params.subscribe(params => {
      this.memberCategory = params['term'];
    });
    //year logic
    for (let year = Number(this.current_year); year > 2017; year -= 1) {
      this.years.push(year.toString());
    }
    this.date = {
      // 'month':this.current_month,
      'month': this.previous_month,
      'year': this.current_year
    }
    this.checkMonth(this.current_year)
    this.getAllHealthplans();

    this.memberlist()

    // subscribing to a observable returns a subscription object




  }


  //timer stopped
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

  ngOnDestroy() {

    // this.sub.unsubscribe();

  }
  //open comment box
  showCommentBox() {
    this.showcomment();
    this.modals.hide();

    this.modal.show();

  }

  //hosp question
  questions() {

    this.commonService.questioncaphs(this.hpnme, 'hos').subscribe(results => {
      this.questioncap = results;


      this.start();

      this.questionnext(500, 'a', [])



    }, err => { });
  }
  //timer start
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
  //checking whic member survey has been done
  check(member) {

    for (let i = 0; i < this.listarray.length; i++) {
      if (member.subscriberid == this.listarray[i]) {
        return true;
      }

    }
    return false;
  }
  checkMonth(selectedYear) {
    this.formatDate();
    if (selectedYear == this.authS.getDates().actual_year) {

      this.months.map((month) => {
        if (this.current_month == month.value) {
          this.months.splice(Number(month.value), 12)
        }
      })
    } else {
      this.months = [{ "full": "January", "value": "01", "days": "31" },
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
      ]
    }
  }
  formatDate() {
    this.months.map((month) => {
      if (this.date.month == month.value) {
        // this.selectedMonth = month.full;
        if (month.value == '02' && this.date.year % 4 == 0) {
          this.days = '29';
        } else {
          // console.log(month.value)
          this.days = month.days;
        }

      }
    });
    this.params.startdate = this.date.year + '-' + this.date.month + '-01';
    this.params.enddate = this.date.year + '-' + this.date.month + '-' + this.days;


    // new Date("2015-03-25");
  }//pushing questionid and answer to array
  checkresponse(qid, aid, option) {


    this.temparray.push({ 'questionid': qid, 'answer': aid })


  }


  //checking response and moving to next question
  questionnext(result, reponse, list) {
    if (list) {

      if (this.temparray.length) {
        for (let i = 0; i < list.length; i++)//running loop in sub qid and sub aid
        {


          this.questionsidarray.push(list[i].questionid)//pushing question id from list which is coming from top


          var idx = this.temparray.slice().reverse().find((o) => o.questionid == this.questionsidarray[i]);//finding last index of  

          if (idx) {
            this.questionid = idx.questionid;


            this.params.response = idx.answer;
            this.apsn = 1;
            this.postinarray();

          }



        }
      }

    }
    if (this.textfield) {
      this.params.response = this.textfield;
      this.questionid = list[0].questionid;
      this.postinarray();
    }


    if (reponse == 'last') {
      this.showsave = true;
      this.params['minutes'] = this.min;
      this.params['seconds'] = this.ticks;
      this.answersposts();

    }


    console.log(this.params.response)

    if (result == 11) {
      this.x = 11;
      this.freetext = true;

    }
    else if (result == 12) {
      this.x = 12;
      this.freetext = true;
    }
    else if (result == 13) {
      this.x = 13;
      this.freetext = true;
    }

    else if (result == 34) {
      if (this.params.response == 'Yes') {
        this.x = 34;
      }
      else if (this.params.response == 'No') {
        this.x = 35;
      }
      else {
        this.x = 34;
      }


    }
    else if (result == 42) {
      if (this.params.response == 'Yes') {
        this.x = 42;
      }
      else if (this.params.response == 'No') {
        this.x = 45;
      }
      else {
        this.x = 42;
      }


    }

    else if (result == 46) {
      if (this.params.response == 'Yes') {
        this.x = 47;
      }
      else if (this.params.response == 'No') {
        this.x = 47;
      }
      else if (this.params.response == 'I had no visits in the past 12 months') {
        this.x = 48;
      }
      else {
        this.x = 47;
      }

    }
    else if (result == 54) {
      this.x = 54;
      this.freetext = true;
    }
    else if (result == 55) {
      this.x = 55;
      this.freetext = true;
    }
    else if (result == 64) {

      if (this.params.response == 'House, apartment, condominium or mobile home') {
        this.x = 64;
      }
      else if (this.params.response == 'Assisted living or board and care home') {
        this.x = 64;
      }
      else if (this.params.response == 'Nursing home') {
        this.x = 65;
      }
      else if (this.params.response == 'Other') {
        this.x = 65;
      }
      else {
        this.x = 64;
      }
    }
    else if (result == 66) {
      console.log(this.params.response)

      if (this.params.response == 'Person to whom survey was addressed') {
        this.x = 67;
        console.log('abhay')
      }
      else {
        this.x = 66;
        this.freetext = true;
      }
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
    this.checklast();


    this.result = this.questioncap[this.x];
    this.questionone = this.questioncap[this.x];

    console.log(this.questioncap[67])


    /*
  
    this.postinarray();
    this.checklast();
  
  
   this.result=this.questioncap[this.x];
   this.questionone=this.questioncap[this.x];
     if(this.questionone.mainquestion !=='')//checking that it is a sub question
     {
      if(this.temparray.length>0)//the array where subquestion id and sub answers ,i am inserting
      {
          for(let i=0;i<this.temparray.length;i++)//running loop in sub qid and sub aid
           {
                
                this.questionsidarray.push(list[i].questionid)//pushing question id from list which is coming from top
               
               var idx = this.temparray.length - 1 - this.temparray.slice().reverse().findIndex( (o) => o.questionid == this.questionsidarray[i] );//finding last index of  
               console.log(idx)
               this.questionid=this.temparray[idx].questionid;//taking questionid from temp array
  
               this.params.response=this.temparray[idx].answer;//taking answer from temp array
               this.aps=1;
              
            
           }
       }
       
    }
    this.temparray=[];
    this.questionsidarray=[];
   this.params.response= '';*/
    this.textfield = '';
    this.temparray = [];
    this.questionsidarray = [];
    this.params.response = '';

  }
  memberlist() {
    this.memberoption = false;
    // this.start();
    this.params['type'] = 'hos';
    this.userService.memberquestion(this.params).subscribe(res => {
      this.member_list = res;
    }, err => { });
  }//pushing question id and answer in a object
  postinarray() {
    if (this.apsn == 0) {
      this.apsn = this.apsn + 1;
    }
    else {

      if (this.params.response) {
        this.answersheet.push({ 'questionid': this.questionid, 'answer': this.params.response })

      }

    }
    console.log(this.answersheet)
  }
  //check last question
  checklast() {
    if (this.questionid == 68) {
      this.showsave = true;
      this.params['minutes'] = this.min;
      this.params['seconds'] = this.ticks;

      this.answersposts();
    }



  }

  //on opening hosp screen after saving comment
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
  //on save button of comment box
  savecomment() {

    this.data['surveyid'] = this.id;
    this.data['comment'] = this.commentshow;

    this.userService.savecommenta(this.data).subscribe(res => {
      this.modal.hide();
      this.commentshow = '';
    }, err => { });
  }

  //posting answer
  answersposts() {
    this.sub.unsubscribe();
    this.params['answerlist'] = this.answersheet;
    this.params['surveytype'] = 'hos';
    this.params['userid'] = this.currentUser.userid;
    this.params['name'] = this.currentUser.name;

    this.userService.answerpost(this.params).subscribe(res => {

      this.id = res;
      this.memberoption = false;
      this.params = {

        'providerid': '',
        'healthplanid': '',
        'startdate': '',
        'enddate': '',
        'response': ''

      }
      this.answersheet = [];
      this.provider_name = '';
      this.aps = 0;
      this.modals.show();
    }, err => { });
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

  //on reset button
  resetFilter() {
    this.params = {

      'providerid': '',
      'healthplanid': '',
      'startdate': '',
      'enddate': '',
      'response': ''

    }
    this.provider_name = '';

    this.memberlist();
  }
  //provider search function
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
