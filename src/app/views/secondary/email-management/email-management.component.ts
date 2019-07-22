import { Component, OnInit,ViewChild } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
@Component({
  selector: 'app-email-management',
  templateUrl: './email-management.component.html',
  styleUrls: ['./email-management.component.scss']
})
export class EmailManagementComponent implements OnInit {
 itemList = [];
 selectedItems = [];
 healthplanid:number;
 ipaid:number;
 maildoms:any;
 settings = {};
 providerAll:any;
 memberAll:any;
 emailbody;any;
 emailsubject:any;
 mailid:number;
 isMeasure:boolean = false;
 fromemail:any;
 grpnme:any;
 nameparam={
    groupname:''
 }
 groupid:any;
 resultgrpnme:any;
 crtgroup:boolean=false;
  @ViewChild('userModal') public modal: ModalDirective;
  constructor(private commonService: CommonService) { }

  ngOnInit() {
  	 this.settings = {
      singleSelection: false,
      text: "Select Providers",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      badgeShowLimit: 12,
      labelKey: 'providername',
      primaryKey: 'providerid'
    };
    this.frommail();
    this.getProviders(true);
    this.getgroupname();
  }
  createGroup()
  {
  	this.emailbody='';
  	this.fromemail='';
  	this.groupid='';
  	this.grpnme='';
  	this.emailsubject='';
  	this.emailbody='';
  	this.selectedItems=[];
  	this.getProviders(true);
  	this.frommail();
  	this.crtgroup=true;
    this.modal.show()
  }

frommail()
{
	this.commonService.getMailDomains().subscribe(results=>{
		this.maildoms=results;
		console.log(this.maildoms[0])
	},err=>{})
}

getProviders(type){
	let id;
	this.itemList = [];
  this.selectedItems = [];
id=0;
type="suspected";
this.commonService.getProviders(id,type).subscribe(results => {
this.itemList = results;

// this.getSingleConvo(id);


	})
}

savegroup()
{

  let data = {
    'groupname':this.grpnme,
    'fromemail':this.fromemail,
    'providerid':this.selectedItems,
    
    'body':this.emailbody,
    'subject':this.emailsubject

    

  }
  this.commonService.emaildata(data).subscribe(res=>{
    this.modal.hide();
  	this.getgroupname();},err=>{});

}


postBulkmailDetails(){

    
  
  
  let data = {
    'groupname':this.grpnme,
    'fromemail':this.fromemail,
    'providerid':this.selectedItems,
    
    'body':this.emailbody,
    'subject':this.emailsubject

    

  }
  data['groupid']=this.groupid;
  this.commonService.emailmangmt(data).subscribe(res=>{
  	this.modal.hide();
  },err=>{});

  
}
getgroupname(){

	this.commonService.getname(this.nameparam).subscribe(res=>{
    this.resultgrpnme=res.body;
	},err=>{})
}

getgroupdetails(id){
	this.crtgroup=false;
	this.commonService.openeditemail(id).subscribe(res=>{

		this.grpnme=res.groupname;
		this.fromemail=res.fromemail;
		this.selectedItems=res.providerid;
		this.emailsubject=res.subject;
		this.emailbody=res.body;
		this.groupid=res.groupid;

	},err=>{});

	this.modal.show()

	
}
removegroup(id){
	let data={
       'groupid':id
	}
	 var r = confirm("Are you sure, you want to Delete this group?");
      if(r == true){
        this.commonService.deleteGroup(data).subscribe(res=>{    
          
                                this.modal.hide();
                                this.getgroupname();
                                                           },err=>{})
                   }
        else{
              this.modal.hide();
              this.getgroupname();
        }
    }
         
        
         
          
     
        
      
	
		
	

opengapmodaledit(id){
  this.commonService.openeditemail(id).subscribe(res=>{},err=>{})
}
onItemSelect(item: any) {
    // console.log(item);  
    // console.log(this.selectedItems);
  }
  OnItemDeSelect(item: any) {
    // console.log(item);
    // console.log(this.selectedItems);
  }
  onSelectAll(items: any) {
    // console.log(items);
  }
  onDeSelectAll(items: any) {
    // console.log(items);
  }
}
