import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Observable, of, take } from 'rxjs';
import { ApiserviceService } from 'src/app/apiservice.service';

@Component({
  selector: 'app-visitsharemodule',
  templateUrl: './visitsharemodule.component.html',
  styleUrls: ['./visitsharemodule.component.scss']
})
export class VisitsharemoduleComponent implements OnInit {
  VSATitle: string = "";
  VSASTitle: string = "";
  editSubt: boolean = false;
  editTitle: boolean = false;
  nodeColumns: string[] = ['node', 'no_stores', 'storename', 'date', 'action'];
  nodes!: MatTableDataSource<any>;
  cityList$: Observable<any[]> = of();
  nodes$: Observable<any[]> = of();
  Selectedcity: string = "";
  Selectednode: string = "";

  creatednodes: Array<any> = [];
  constructor(public router: Router, public api: ApiserviceService) { }

  ngOnInit(): void {
    this.getvsadata();
    this.getallcity();
  }

  getvsadata() {
    this.api.getVSAData().pipe(take(1)).subscribe((VSAdata: any) => {
      this.VSATitle = VSAdata[0].VSA_Title;
      this.VSASTitle = VSAdata[0].VSA_STitle;
      this.creatednodes = VSAdata[0].Nodes;
      console.log(VSAdata);
    });
  }

  getallcity() {
    this.cityList$ = this.api.getcity();
  }

  updateVSATitle() {

  }

  updateVSASTitle() {

  }

  allstores(store: any) {
    if (this.Selectedcity == "") {
      alert("please select city.")
    }
    else if (this.Selectednode == "") {
      alert("please select node.")
    }
    else {
      this.router.navigate(['/storedetails/' + store]);
    }
  }

  citychange() {
    this.api.getNodeDataaspercity(this.Selectedcity).subscribe((data: any) => {
      let nodearr: Array<any> = [];
      for (let i = 0; i < data.length; i++) {
        let index = this.creatednodes.findIndex((x: any) => x.id == data[i].id);
        if (index < 0) {
          nodearr.push(data[i]);
        }
      }
      this.nodes$ = of(nodearr);
    })
  }
}
