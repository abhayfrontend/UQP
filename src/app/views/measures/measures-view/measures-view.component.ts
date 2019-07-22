import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from '../../../services/common.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-measures-view',
  templateUrl: './measures-view.component.html',
  styleUrls: ['./measures-view.component.scss']
})
export class MeasuresViewComponent implements OnInit {
  id: number;
  measure: any = {
    Measure_Name: '',
    Measure_Description: '',
    Numerator_Detail: '',
    Denominator_Detail: '',
    Exclusion_Detail: '',
    Weightage: '',
    Status: '',

  };
  constructor(private router: Router,
    private route: ActivatedRoute, private commonService: CommonService, private toastr: ToastrService) { }
  showSuccess(msg, title) {
    this.toastr.success(title, msg);
  }
  showDanger(msg, title) {
    this.toastr.error(title, msg);
  }
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['id'];
    });
    this.getMeasure(this.id);
  }
  getMeasure(id) {
    this.commonService.getMeasure(id).subscribe(results => {

      this.measure = results;
    }, err => {

    });
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

}
