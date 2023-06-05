import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Observable, of, take } from 'rxjs';
import { ApiserviceService } from 'src/app/apiservice.service';
import { VisitallstoredetailsComponent } from './visitallstoredetails/visitallstoredetails.component';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-visitsharemodule',
  templateUrl: './visitsharemodule.component.html',
  styleUrls: ['./visitsharemodule.component.scss'],
})
export class VisitsharemoduleComponent implements OnInit {
  SectionTitle: string = '';
  SectionSTitle: string = '';
  editSubt: boolean = false;
  editTitle: boolean = false;
  nodeColumns: string[] = ['node', 'no_stores', 'storename', 'date', 'action'];
  nodes!: MatTableDataSource<any>;
  cityList$: Observable<any[]> = of();
  nodes$: Observable<any[]> = of();
  alreadyCnodes$: Observable<any[]> = of();
  Selectedcity: string = '';
  Selectednode: string = '';
  VSAmoduledata: any = [];
  selectednodedata: any;
  constructor(
    public router: Router,
    public api: ApiserviceService,
    private dialog: MatDialog,
    private auth:AuthService
  ) {}

  ngOnInit(): void {
    this.getvsadata();
    this.getallcity();
  }

  getvsadata() {
    this.api
      .getSectionData('VisitShareEarn')
      .pipe(take(1))
      .subscribe((VSAdata: any) => {
        this.VSAmoduledata = VSAdata[0];
        this.SectionTitle = VSAdata[0]?.Section_title;
        this.SectionSTitle = VSAdata[0]?.Section_Stitle;
      });
  }

  getallcity() {
    this.cityList$ = this.api.getcity().pipe(take(1));
  }

  allstores(creatednode?: any) {
    if (this.Selectedcity == '') {
      this.auth.resource.startSnackBar('please select city.');
    } else if (creatednode == undefined && this.Selectednode == '') {
      this.auth.resource.startSnackBar('please select node.');
    } else {
      const dialogRef = this.dialog.open(VisitallstoredetailsComponent, {
        width: '90%',
        maxHeight: '90vh',
        data: {
          node: this.selectednodedata,
          id: this.VSAmoduledata.id,
          selectednode: creatednode,
          cityid: this.Selectedcity,
        },
        hasBackdrop: true,
        disableClose: true,
        panelClass: 'thanksscreen',
      })
      dialogRef.afterClosed().subscribe((result) => {
        this.citychange();
      });
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
            .getstoreaspernode('VSAExternalSection', data[i].id)
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

  // updateVSTitle() {
  //   if (!this.editTitle) {
  //     this.editTitle = !this.editTitle;
  //   } else if (this.VSATitle == this.VSAmoduledata.VSA_Title) {
  //     this.editTitle = !this.editTitle;
  //   } else {
  //     if (!this.VSATitle) {
  //       this.auth.resource.startSnackBar('please enter the Title.');
  //     } else {
  //       this.api
  //         .updateVSAtitle(this.VSATitle, this.VSAmoduledata.id)
  //         .then((data) => {
  //           if (data != undefined) {
  //             this.editTitle = !this.editTitle;
  //           }
  //         })
  //         .catch(() => {
  //           return false;
  //         });
  //     }
  //   }
  // }

  // updateVSASTitle() {
  //   if (!this.editSubt) {
  //     this.editSubt = !this.editSubt;
  //   } else if (this.VSASTitle == this.VSAmoduledata.VSA_STitle) {
  //     this.editSubt = !this.editSubt;
  //   } else {
  //     if (!this.VSASTitle) {
  //       this.auth.resource.startSnackBar('please enter the sub Title.');
  //     } else {
  //       this.api
  //         .updateVSAStitle(this.VSASTitle, this.VSAmoduledata.id)
  //         .then((data) => {
  //           this.editSubt = !this.editSubt;
  //         })
  //         .catch(() => {
  //           return false;
  //         });
  //     }
  //   }
  // }



  navigatetointernal(item: any) {
    this.router.navigateByUrl('/VSAcat/' + item.id + '/' + item.city_id);
  }

  updateSectionDetails(i: number) {
    if (i == 1 && !this.editTitle) {
      this.editTitle = !this.editTitle;
    } else if (i == 2 && !this.editSubt) {
      this.editSubt = !this.editSubt;
    } else if (
      i == 1 &&
      this.SectionTitle == this.VSAmoduledata.Section_title
    ) {
      this.editTitle = !this.editTitle;
    } else if (
      i == 2 &&
      this.SectionSTitle == this.VSAmoduledata.Section_Stitle
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
            this.VSAmoduledata.SectionID,
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
}
