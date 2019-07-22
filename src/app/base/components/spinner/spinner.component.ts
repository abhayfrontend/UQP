import { Component} from '@angular/core';
import { SpinnerService} from '../../../services/spinner.service';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent {
	// active: boolean;

  constructor(private spinner: SpinnerService) { 
    // alert("fref")
		// spinner.status$.subscribe(
		// 	status => {
  //     	this.active = status;
  //   	});
	}

}
