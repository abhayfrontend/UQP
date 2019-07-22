import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';
@Component({
  selector: 'app-401',
  templateUrl: './401.component.html',
  styleUrls: ['./401.component.scss']
})
export class UnauthorizedComponent implements OnInit {

  constructor(private _location: Location) { }

  ngOnInit() {
  }
  clearStorage(){
  	localStorage.clear();
  }
  goBack(){
  	this._location.back();
  }
}
