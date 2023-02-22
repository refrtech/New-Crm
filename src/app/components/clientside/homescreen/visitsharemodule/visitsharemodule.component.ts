import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Observable, of, take } from 'rxjs';
import { ApiserviceService } from 'src/app/apiservice.service';
import { VisitallstoredetailsComponent } from './visitallstoredetails/visitallstoredetails.component';

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
  VSAmoduledata: any = [];
  selectednodedata: any;
  constructor(public router: Router, public api: ApiserviceService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getvsadata();
    this.getallcity();
  }

  getvsadata() {
    this.api.getVSAData().pipe(take(1)).subscribe((VSAdata: any) => {
      console.log(VSAdata);
      this.VSAmoduledata = VSAdata[0];
      this.VSATitle = VSAdata[0].VSA_Title;
      this.VSASTitle = VSAdata[0].VSA_STitle;
      this.creatednodes = VSAdata[0].Nodes;
    });
  }

  getallcity() {
    this.cityList$ = this.api.getcity().pipe(take(1));
  }

  allstores(creatednode?: any) {
    console.log(creatednode);
    if (this.Selectedcity == "") {
      alert("please select city.")
    }
    else if (creatednode == undefined && this.Selectednode == "") {
      alert("please select node.")
    }
    else {
      const dialogRef = this.dialog.open(VisitallstoredetailsComponent, {
        width: "90%",
        data: { node: this.selectednodedata, id: this.VSAmoduledata.id, selectednode: creatednode, creatednodes: this.creatednodes },
        hasBackdrop: true,
        disableClose: true,
        panelClass: 'thanksscreen'
      });
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

  updateVSTitle() {
    if (!this.editTitle) {
      this.editTitle = !this.editTitle;
    }
    else if (this.VSATitle == this.VSAmoduledata.VSA_Title) {
      this.editTitle = !this.editTitle;
    }
    else {
      if (!this.VSATitle) {
        alert("please enter the Title.");
      }
      else {
        this.api.updateVSAtitle(this.VSATitle, this.VSAmoduledata.id).then((data) => {
          if (data != undefined) {
            this.editTitle = !this.editTitle;
            console.log("title updated");
          }
        }).catch(() => {
          return false;
        });
      }
    }
  }

  updateVSASTitle() {
    if (!this.editSubt) {
      this.editSubt = !this.editSubt;
    }
    else if (this.VSATitle == this.VSAmoduledata.VSA_STitle) {
      this.editSubt = !this.editSubt;
    }
    else {
      if (!this.VSATitle) {
        alert("please enter the sub Title.");
      }
      else {
        this.api.updateVSAStitle(this.VSATitle, this.VSAmoduledata.id).then((data) => {
          if (data != undefined) {
            console.log("Sub-title updated");
          }
        }).catch(() => {
          return false;
        });
      }
    }
  }
}
