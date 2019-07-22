import { Component, OnInit } from '@angular/core';

import { CommonService } from '../../../services/common.service';
import { AuthService } from '../../../services/auth.service';

// converting html to canvas and then pdf
import * as jsPDF from 'jspdf';

@Component({
  selector: 'app-trends',
  templateUrl: './trends.component.html',
  styleUrls: ['./trends.component.scss']
})
export class TrendsComponent implements OnInit {



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

  years: string[] = [];
  date: any;
  days: any;
  current_date = new Date();
  // current_month = this.authS.getDates().current_month;
  // previous_month = this.authS.getDates().previous_month;
  // previous_month_full = this.authS.getDates().previous_month_full;
  current_year = this.authS.getDates().current_year;

  current_month = this.authS.getDates().current_month;
  previous_month = this.authS.getDates().previous_month;
  previous_month_full = this.authS.getDates().previous_month_full;


  member_trend = {
    "enddate": "",
    "startdate": "",
    "name": "totalmembers",
    "range": "6",
    "healthplanid": 1
  }

  ipa_trend = {
    "enddate": "",
    "startdate": "",
    "range": "6",
    "name": "totalmembers"
  }

  mra_trend = {
    "name": "mrapopulation",
    "mrascore": 3,
    "year": this.authS.current_year
  }

  nohcc_trend = {
    "name": "nohcc",
    "minage": 80,
    "maxage": 100
  }
  measure_trend = {

    "year": this.authS.current_year,
    "ipaid": 2,
    "month": this.current_month,
    "name": "compliant"
  }


  ipa_list: any;

  member_trend_graph: boolean = false;
  mra_trend_graph: boolean = false;
  ipa_trend_graph: boolean = false;
  measure_trend_graph: boolean = false;
  nohcc_trend_graph: boolean = false;


  hedis_trend_view: boolean = true;
  mra_trend_view: boolean = false;
  nohcc_trend_view: boolean = false;



  // lineChart
  public memberTrendData: Array<any> = [

  ];
  public memberTrendLabels: Array<any> = [];
  public memberChartOptions: any = {
    animation: false,
    responsive: true,
    maintainAspectRatio: false,

    scales: {
      yAxes: [{

        scaleLabel: {
          display: true,
          labelString: 'Member Count',
          fontSize: 14
        }
      }],
      xAxes: [{

        scaleLabel: {
          display: true,
          labelString: 'Months',
          fontSize: 14
        }
      }]
    }
  };

  public MRAChartOptions: any = {
    animation: false,
    responsive: true,
    maintainAspectRatio: false,


    // tooltips: {
    //      mode: 'dataset',
    //   },

    // hover: {
    //    onHover: function(e) {
    //       var point = this.getElementAtEvent(e);
    //       if (point.length) e.target.style.cursor = 'pointer';
    //       else e.target.style.cursor = 'default';
    //    }
    // },

    scales: {
      yAxes: [{


        scaleLabel: {
          display: true,
          labelString: 'Member Count',
          fontSize: 14
        }
      }],
      xAxes: [{

        barPercentage: 0.4,
        scaleLabel: {
          display: true,
          labelString: 'Healthplan',
          fontSize: 14
        }
      }]
    }
  };

  public IPAChartOptions: any = {

    animation: false,
    responsive: true,
    maintainAspectRatio: false,

    scales: {
      yAxes: [{

        scaleLabel: {
          display: true,
          labelString: 'Member Count',
          fontSize: 14
        }
      }],
      xAxes: [{

        scaleLabel: {
          display: true,
          labelString: 'Months',
          fontSize: 14
        }
      }]
    }
  };

  public nohccChartOptions: any = {

    animation: false,
    responsive: true,
    maintainAspectRatio: false,

    scales: {
      yAxes: [{

        scaleLabel: {
          display: true,
          labelString: 'Member Count',
          fontSize: 14
        }
      }],
      xAxes: [{
        barPercentage: 0.2,
        scaleLabel: {
          display: true,
          labelString: 'Year',
          fontSize: 14
        }
      }]
    }
  };

  // public lineChartOptions: any = {
  //   animation: false,
  //   responsive: true,
  //   scales: {
  //           yAxes: [{
  //               stacked: false
  //           }]
  //       }
  // };


  public lineChartColours: Array<any> = [
    { // grey
      backgroundColor: '#a1dddd',
      // borderColor: 'rgba(148,159,177,1)',
      // pointBackgroundColor: 'rgba(148,159,177,1)',
      // pointBorderColor: '#fff',
      // pointHoverBackgroundColor: '#fff',
      // pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { // dark grey
      backgroundColor: '#8bcaf4',

    },
    { // grey
      backgroundColor: '#ffdb80',

    },
    { // grey
      backgroundColor: '#d4d7dd',

    },
    { // dark grey
      backgroundColor: '#ff99af',

    },
    { // grey
      backgroundColor: '#bad2de',

    }
  ];

  public lineChartColoursRed: Array<any> = [
    {
      backgroundColor: '#ff99af',
    },
  ];

  public lineChartLegend = true;
  public MemberChartType = 'bar';
  public MRAChartType = 'bar';
  public IPAChartType = 'bar';
  public MeasureChartType = 'horizontalBar';
  public nohccChartType = 'bar';


  // barChart
  public MeasureChartOptions: any = {
    animation: false,
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      yAxes: [{

        scaleLabel: {
          display: true,
          labelString: 'Measure Name',
          fontSize: 14
        }
      }],
      xAxes: [{

        scaleLabel: {
          display: true,
          labelString: 'Compliant Percentage',
          fontSize: 14
        }
      }]
    }
  };
  public nohccChartLabels: string[] = [];

  public mraChartLabels: string[] = [];
  public barChartType = 'bar';
  public barChartLegend = true;

  public mraChartData: any[] = [];


  // ipa chart
  public ipaChartLabels: string[] = [];
  // public barChartType = 'bar';
  public ipaChartLegend = true;

  public ipaChartData: any[] = [];

  //measurechart
  public measureChartLabels: string[] = [];
  // public barChartType = 'bar';
  public measureChartLegend = true;

  public measureChartData: any[] = [];
  public nohccChartData: any[] = [];


  // events
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }
  constructor(private commonService: CommonService, private authS: AuthService) {
    this.memberChartOptions.legend = this.IPAChartOptions.legend = this.MeasureChartOptions.legend = this.MRAChartOptions.legend = {
      onHover: function (e) {
        e.target.style.cursor = 'pointer';
      }
    }
  }

  ngOnInit() {
    this.graph_range_calc(6, "member");
    this.graph_range_calc(6, "ipa")
    // this.getMemberTrends();
    this.getMRATrend();
    this.getIPATrend();
    this.getAllIPA();
    this.getMeasureTrend();
    this.getnohccTrend();
  }


  getMemberTrends() {
    this.commonService.getMemberTrends(this.member_trend).subscribe(results => {
      this.member_trend_graph = true;
      console.log(results.membercount);
      this.memberTrendData = results.membercount.map((data) => {
        // data.lineTension = 0;
        data.fill = false;
        return data;
      });
      this.memberTrendLabels = results.months;

    }, err => {
    });
  }

  graph_range_calc(count, name) {
    var d = new Date();
    d.setMonth(d.getMonth() - 1);
    console.log(d.toLocaleDateString());
    if (name == "member") {
      this.member_trend_graph = false;
      this.member_trend.enddate = d.toLocaleDateString();
    } else {
      this.ipa_trend.enddate = d.toLocaleDateString();
      this.ipa_trend_graph = false;
    }

    d.setMonth(d.getMonth() - count + 1);
    //sets the day to 1st
    d.setDate(1)
    console.log(d.toLocaleDateString());
    if (name == "member") {
      this.member_trend.startdate = d.toLocaleDateString();
      this.getMemberTrends();
    } else {
      this.ipa_trend.startdate = d.toLocaleDateString();
      this.getIPATrend();
    }

  }

  checkyear(year) {
    this.measure_trend_graph = false;
    if (year != this.authS.current_year) {
      this.measure_trend.month = 12;
    } else {
      this.measure_trend.month = this.current_month;
    }

    this.getMeasureTrend()
  }

  getMRATrend() {
    if (this.mra_trend.name == 'providerscore') {
      this.MRAChartOptions.scales.yAxes[0].scaleLabel.labelString = "Score";
      this.MRAChartOptions.scales.xAxes[0].scaleLabel.labelString = "Provider Name";
    } else if (this.mra_trend.name == 'tophcc') {
      this.MRAChartOptions.scales.yAxes[0].scaleLabel.labelString = "Member Count";
      this.MRAChartOptions.scales.xAxes[0].scaleLabel.labelString = "HCC Condition";
    } else {
      this.MRAChartOptions.scales.yAxes[0].scaleLabel.labelString = "Member Count";
      this.MRAChartOptions.scales.xAxes[0].scaleLabel.labelString = "Healthplan";
    }

    this.MeasureChartOptions.scales.xAxes[0].scaleLabel.labelString = "Compliant Percentage";
    this.commonService.getMRATrend(this.mra_trend).subscribe(results => {
      this.mra_trend_graph = true;
      console.log(results.membercount);
      this.mraChartData = results.membercount.map((data) => {
        data.lineTension = 0;
        data.fill = false;
        if (this.mra_trend.name == 'riskscore') {
          data.label = Number(data.label)
        }
        if (this.mra_trend.name == 'providerscore') {
          data.label = Number(data.label)
        }

        for (let i = 0; i < data.data.length; i++) {
          data.data[i] = data.data[i].toFixed(2);
        }

        return data;
      });
      console.log(this.mraChartData)
      if (this.mra_trend.name == 'tophcc') {
        this.MRAChartType = 'bar'
      } else {
        this.MRAChartType = 'bar'
      }
      this.mraChartLabels = results.months;

    }, err => {
    });
  }

  getnohccTrend() {

    this.commonService.getMRATrend(this.nohcc_trend).subscribe(results => {
      this.nohcc_trend_graph = true;

      this.nohccChartData = results.membercount.map((data) => {
        data.lineTension = 0;
        data.fill = false;


        return data;
      });

      this.nohccChartLabels = results.months;

    }, err => {
    });
  }


  getIPATrend() {
    if (this.ipa_trend.name == 'healthplans') {
      this.IPAChartOptions.scales.yAxes[0].scaleLabel.labelString = "Health Plan Count";
    } else if (this.ipa_trend.name == 'providers') {
      this.IPAChartOptions.scales.yAxes[0].scaleLabel.labelString = "Provider Count";
    } else {
      this.IPAChartOptions.scales.yAxes[0].scaleLabel.labelString = "Member Count";
    }
    this.commonService.getIPATrend(this.ipa_trend).subscribe(results => {
      this.ipa_trend_graph = true;
      console.log(results.membercount);
      this.ipaChartData = results.membercount.map((data) => {
        // data.lineTension = 0;
        data.fill = false;
        return data;
      });
      this.ipaChartLabels = results.months;

    }, err => {
    });
  }
  //compliant and non compliant %
  getMeasureTrend() {
    if (this.measure_trend.name == 'compliant') {
      this.MeasureChartOptions.scales.xAxes[0].scaleLabel.labelString = "Compliant Percentage";
    } else {
      this.MeasureChartOptions.scales.xAxes[0].scaleLabel.labelString = "Non Compliant Percentage";
    }
    this.commonService.getMeasureTrend(this.measure_trend).subscribe(results => {
      this.measure_trend_graph = true;

      this.measureChartData = results.membercount.map((data) => {
        // data.lineTension = 0;
        data.fill = false;
        for (let i = 0; i < data.data.length; i++) {
          data.data[i] = data.data[i].toFixed(2);
        }
        console.log(data)
        return data;


      });
      this.measureChartLabels = results.months;

    }, err => {
    });

  }
  //pdf generation
  GeneratePDF(element): void {
    // $('#dashboard').append("<p class='pdf-elem' style='margin: 0;font-size: 18px;text-align: center;color:#59669d'><b>Downloaded from UQP</b></p>.");
    const elementToPrint = document.getElementById(element); //The html element to become a pdf
    // // const pdf = new jsPDF('p', 'pt', 'a4');
    var pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'in',
      format: [14, 12]
    })
    pdf.addHTML(elementToPrint, () => {
      pdf.save(`${element}.pdf`);

    });

  }
  //get ipa data0
  getAllIPA() {
    this.commonService.getAllIPA().subscribe(results => {

      this.ipa_list = results;
    }, err => {

    });
  }
}
