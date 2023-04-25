import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, of, take } from 'rxjs';
import { ApiserviceService } from 'src/app/apiservice.service';
import { BrandsstoreComponent } from './brandsstore/brandsstore.component';

@Component({
  selector: 'app-brandsneighbourhood',
  templateUrl: './brandsneighbourhood.component.html',
  styleUrls: ['./brandsneighbourhood.component.scss'],
})
export class BrandsneighbourhoodComponent implements OnInit {
  BIYNTitle: string = "";
  BIYNSTitle: string = "";
  editSubt: boolean = false;
  editTitle: boolean = false;
  cityList$: Observable<any[]> = of();
  nodes!: MatTableDataSource<any>;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  nodeColumns: string[] = ['node', 'no_stores', 'storename', 'date', 'action'];
  Selectedcity: string = "";
  nodes$: Observable<any[]> = of();
  alreadyCnodes$: Observable<any[]> = of();
  Selectednode: string = "";
  selectednodedata: any;
  BIYNmoduledata: any = [];

  constructor(
    public api: ApiserviceService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getBNTdata();
    this.getallcity();
  }

  allstores(creatednode?: any) {
    if (this.Selectedcity == "") {
      alert("please select city.")
    }
    else if (creatednode == undefined && this.Selectednode == "") {
      alert("please select node.")
    }
    else {
      const dialogRef = this.dialog.open(BrandsstoreComponent, {
        width: "90%",
        data: { node: this.selectednodedata, id: this.BIYNmoduledata.id, selectednode: creatednode,
          cityid: this.Selectedcity },
        hasBackdrop: true,
        disableClose: true,
        panelClass: 'thanksscreen'
      });
    }
  }

  getallcity() {
    this.cityList$ = this.api.getcity().pipe(take(1));
  }

  getBNTdata() {
    this.api.getBIYNData().pipe(take(1)).subscribe((BNdata: any) => {
      this.BIYNmoduledata = BNdata[0];
      this.BIYNTitle = BNdata[0].BN_Title;
      this.BIYNSTitle = BNdata[0].BN_STitle;
    });
  }

  updateBNTitle() {
    if (!this.editTitle) {
      this.editTitle = !this.editTitle;
    }
    else if (this.BIYNTitle == this.BIYNmoduledata.BN_Title) {
      this.editTitle = !this.editTitle;
    }
    else {
      if (!this.BIYNTitle) {
        alert("please enter the Title.");
      }
      else {
        this.api.updateBIYNtitle(this.BIYNTitle, this.BIYNmoduledata.id).then((data) => {
          if (data != undefined) {
            this.editTitle = !this.editTitle;
          }
        }).catch(() => {
          return false;
        });
      }
    }
  }

  updateBNTSTitle() {
    if (!this.editSubt) {
      this.editSubt = !this.editSubt;
    }
    else if (this.BIYNSTitle == this.BIYNmoduledata.BN_STitle) {
      this.editSubt = !this.editSubt;
    }
    else {
      if (!this.BIYNSTitle) {
        alert("please enter the sub Title.");
      }
      else {
        this.api.updateBIYNStitle(this.BIYNSTitle, this.BIYNmoduledata.id).then((data) => {

        }).catch(() => {
          return false;
        });
      }
    }
  }

  citychange() {
    let alreadyCnode: Array<any> = [];
    let newnodes: Array<any> = [];
    this.api
      .getNodeDataaspercity(this.Selectedcity)
      .pipe(take(1))
      .subscribe((data: any) => {
        for (let i = 0; i < data.length; i++) {
          this.api
            .getstoreaspernode('BIYNSection', data[i].id).pipe(take(1))
            .subscribe((datas: any) => {
              if (datas.length > 0) {
                data[i].storecount = datas[0]?.Stores.length;
                alreadyCnode.push(data[i]);
              } else {
                newnodes.push(data[i]);
              }
            });
        }
        this.alreadyCnodes$ = of(alreadyCnode);
        this.nodes$ = of(newnodes);
      });
    }
}
