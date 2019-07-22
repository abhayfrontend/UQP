import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-measures',
  templateUrl: './measures.component.html',
  styleUrls: ['./measures.component.scss']
})
export class MeasuresComponent implements OnInit {
  userRolePerm = {
    func: '',
    add: true,
    edit: true,
    view: true
  }
  measures: any;
  weight = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  measure: any = {
    Measure_Name: '',
    Measure_Description: '',
    Numerator_Detail: '',
    Denominator_Detail: '',
    Exclusion_Detail: '',
    Weightage: '',
    Status: '',

  };
  measure_exist: boolean = false;
  save_add_form: boolean = false;

  search_text: string;

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
  current_month = this.authS.getDates().current_month;
  previous_month = this.authS.getDates().previous_month;
  previous_month_full = this.authS.getDates().previous_month_full;
  //to check measure name while editing if name is same
  temp_name:string = '';
  @ViewChild('editMeasureModal') public edit_modal: ModalDirective;
  // @ViewChild('addMeasure') public add_modal: ModalDirective;
  @ViewChild("EditMeasure")
  EditMeasure: NgForm;
  constructor(public authS: AuthService, private commonService: CommonService,
    private toastr: ToastrService) { }
  showSuccess(msg, title) {
    this.toastr.success(title, msg);
  }
  showDanger(msg, title) {
    this.toastr.error(title, msg);
  }
  ngOnInit() {
    this.getMeasures();
    let perm = this.authS.getPermission('Quality Measure');
    if (perm) {
      this.userRolePerm = perm
    };
  }

  getMeasures() {
    this.commonService.getMeasures().subscribe(results => {

      this.measures = results;
    }, err => {

    });
  }
  editMeasure(id) {
    this.resetForm();
    this.save_add_form = false;
    this.measure_exist = false;
    this.getMeasure(id);
    this.edit_modal.show()
    // this.commonService.getMeasure(id).subscribe(results => {

    //       this.measure = results;
    //       this.edit_modal.show()
    //     },err => {

    //     });

  }

      //Reset form
  resetForm() {
    // this.fSubmitted = false;
    // this.providerForm.submitted = false;
    this.EditMeasure.form.markAsPristine();
    this.EditMeasure.form.markAsUntouched();
    // this.providerForm.form.updateValueAndValidity();
    //to reset form to submiited = false
    this.EditMeasure.resetForm();
  }

  createMeasure() {
    this.resetForm();
    this.save_add_form = true;
    this.measure = {
      Measure_Name: '',
      Measure_Description: '',
      Numerator_Detail: '',
      Denominator_Detail: '',
      Exclusion_Detail: '',
      Weightage: '',
      Status: 'true'

    }
    this.measure_exist = false;
    this.edit_modal.show()
  }
  updateMeasure(id, measure, valid) {
    if (valid) {
      this.commonService.updateMeasure(id, measure).subscribe(results => {
        // this.hideme[id]=!this.hideme[id]
        // this.users = results;
        this.getMeasures();
        this.edit_modal.hide();
        this.showSuccess('Update Measure', measure.Measure_Name + ' updated successfully')
      }, err => {
        this.showDanger('Update Measure', measure.Measure_Name + ' update failed')
      });
    }

  }

  getMeasure(id) {
    this.commonService.getMeasure(id).subscribe(results => {

      this.measure = results;
      this.temp_name = this.measure.Measure_Name;
    }, err => {

    });
  }



	addMeasure(valid) {

    if (valid) {
      this.commonService.addMeasure(this.measure).subscribe(
        res => {
          this.getMeasures();
          this.edit_modal.hide();



          this.showSuccess('Add Measure', this.measure.Measure_Name + ' created successfully')


          if (res.status == 200) {
            //
          }
        },
        err => {
          this.showDanger('Add Measure', this.measure.Measure_Name + ' creation failed')
        }
      )
    }
	}

	checkMeasure(measure_name) {
    if(this.temp_name != measure_name){
      this.commonService.checkMeasure(measure_name).subscribe(
      res => {
        this.measure_exist = res;
      },
      err => {
        //
      }
    )
    }
		
	}

  updateMeasureStatus(id, status, name) {
    let fromStatus = status ? 'Active' : 'Inactive';
    let toStatus = !status ? 'Active' : 'Inactive';
    this.commonService.updateMeasureStatus(id, !status).subscribe(results => {
      this.showSuccess('Update Measure status', name + ' changed from ' + fromStatus + ' to ' + toStatus)

    }, err => {
      this.showDanger('Update Measure status', name + ' status update failed')
    });
  }

  search() {
    if (this.search_text.length > 2) {
      this.commonService.search_measure(this.search_text).subscribe(
        res => {
          this.measures = res;
        },
        err => {
          //
        }
      )
    } else if (this.search_text.length == 0) {
      this.getMeasures();
    }


  }

}
