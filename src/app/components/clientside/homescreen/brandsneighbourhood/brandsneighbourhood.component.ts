import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, of, take } from 'rxjs';
import { ApiserviceService } from 'src/app/apiservice.service';
import { BrandsstoreComponent } from './brandsstore/brandsstore.component';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-brandsneighbourhood',
  templateUrl: './brandsneighbourhood.component.html',
  styleUrls: ['./brandsneighbourhood.component.scss'],
})
export class BrandsneighbourhoodComponent implements OnInit {
  SectionTitle: string = '';
  SectionSTitle: string = '';
  editSubt: boolean = false;
  editTitle: boolean = false;
  cityList$: Observable<any[]> = of();
  nodes!: MatTableDataSource<any>;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  nodeColumns: string[] = ['node', 'no_stores', 'storename', 'date', 'action'];
  Selectedcity: string = '';
  nodes$: Observable<any[]> = of();
  alreadyCnodes$: Observable<any[]> = of();
  Selectednode: string = '';
  selectednodedata: any;
  BIYNmoduledata: any = [];

  constructor(
    public api: ApiserviceService,
    private dialog: MatDialog,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.getBNTdata();
    this.getallcity();
  }

  allstores(creatednode?: any) {
    if (this.Selectedcity == '') {
      this.auth.resource.startSnackBar('please select city.');
    } else if (creatednode == undefined && this.Selectednode == '') {
      this.auth.resource.startSnackBar('please select node.');
    } else {
      const dialogRef = this.dialog.open(BrandsstoreComponent, {
        width: '90%',
        data: {
          node: this.selectednodedata,
          id: this.BIYNmoduledata.id,
          selectednode: creatednode,
          cityid: this.Selectedcity,
        },
        hasBackdrop: true,
        disableClose: true,
        panelClass: 'thanksscreen',
      });
    }
  }

  getallcity() {
    this.cityList$ = this.api.getcity().pipe(take(1));
  }

  getBNTdata() {
    this.api
      .getSectionData('BIYNDetails')
      .pipe(take(1))
      .subscribe((BNdata: any) => {
        this.BIYNmoduledata = BNdata[0];
        this.SectionTitle = this.BIYNmoduledata.Section_title;
        this.SectionSTitle = this.BIYNmoduledata.Section_Stitle;
      });
  }

  updateSectionDetails(i: number) {
    if (i == 1 && !this.editTitle) {
      this.editTitle = !this.editTitle;
    } else if (i == 2 && !this.editSubt) {
      this.editSubt = !this.editSubt;
    } else if (
      i == 1 &&
      this.SectionTitle == this.BIYNmoduledata.Section_title
    ) {
      this.editTitle = !this.editTitle;
    } else if (
      i == 2 &&
      this.SectionSTitle == this.BIYNmoduledata.Section_Stitle
    ) {
      this.editSubt = !this.editSubt;
    } else {
      if (i == 1 && !this.SectionTitle) {
        this.auth.resource.startSnackBar('Please enter the Title.');
      } else if (i == 2 && !this.SectionSTitle) {
        this.auth.resource.startSnackBar('Please enter the sub Title.');
      } else {
        this.api
          .updateSectionData(
            i,
            this.BIYNmoduledata.SectionID,
            i == 1 ? this.SectionTitle : this.SectionSTitle
          )
          .then((data) => {
            if (data != undefined) {
              if (i == 1) {
                this.editTitle = !this.editTitle;
              } else {
                this.editSubt = !this.editSubt;
              }
            }
          })
          .catch(() => {
            return false;
          });
      }
    }
  }

  // updateBNTSTitle() {
  //   if (!this.editSubt) {
  //     this.editSubt = !this.editSubt;
  //   }
  //   else if (this.BIYNSTitle == this.BIYNmoduledata.BN_STitle) {
  //     this.editSubt = !this.editSubt;
  //   }
  //   else {
  //     if (!this.BIYNSTitle) {
  //       this.auth.resource.startSnackBar("please enter the sub Title.");
  //     }
  //     else {
  //       this.api.updateBIYNStitle(this.BIYNSTitle, this.BIYNmoduledata.id).then((data) => {
  //       }).catch(() => {
  //         return false;
  //       });
  //     }
  //   }
  // }

  citychange() {
    let alreadyCnode: Array<any> = [];
    let newnodes: Array<any> = [];
    this.api
      .getNodeDataaspercity(this.Selectedcity)
      .pipe(take(1))
      .subscribe((data: any) => {
        for (let i = 0; i < data.length; i++) {
          this.api
            .getstoreaspernode('BIYNSection', data[i].id)
            .pipe(take(1))
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
