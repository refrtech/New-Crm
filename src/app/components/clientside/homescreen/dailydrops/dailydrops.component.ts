import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, of, take } from 'rxjs';
import { ApiserviceService } from 'src/app/apiservice.service';
import { DaildropsbrandsComponent } from './daildropsbrands/daildropsbrands.component';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-dailydrops',
  templateUrl: './dailydrops.component.html',
  styleUrls: ['./dailydrops.component.scss'],
})
export class DailydropsComponent implements OnInit {
  SectionTitle: string = '';
  SectionSTitle: string = '';
  editSubt: boolean = false;
  editTitle: boolean = false;
  Selectedcity: string = '';
  cityList$: Observable<any[]> = of();
  nodes$: Observable<any[]> = of();
  Selectednode: string = '';
  selectednodedata: any;
  dailydropmoduledata: any = [];
  alreadyCnodes$: Observable<any[]> = of();

  constructor(public dialog: MatDialog, public api: ApiserviceService, private auth:AuthService) {}

  ngOnInit(): void {
    this.getDailydropdata();
    this.getallcity();
  }

  allstores(creatednode?: any) {
    if (this.Selectedcity == '') {
      this.auth.resource.startSnackBar('please select city.');
    } else if (creatednode == undefined && this.Selectednode == '') {
      this.auth.resource.startSnackBar('please select node.');
    } else {
      const dialogRef = this.dialog.open(DaildropsbrandsComponent, {
        width: '90%',
        data: {
          node: this.selectednodedata,
          id: this.dailydropmoduledata.id,
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

  getDailydropdata() {
    this.api
      .getSectionData('DailyDrop')
      .pipe(take(1))
      .subscribe((daildropsdata: any) => {
        this.dailydropmoduledata = daildropsdata[0];
        this.SectionTitle = daildropsdata[0]?.Section_title;
        this.SectionSTitle = daildropsdata[0]?.Section_Stitle;
      });
  }

  updateSectionDetails(i: number) {
    if (i == 1 && !this.editTitle) {
      this.editTitle = !this.editTitle;
    } else if (i == 2 && !this.editSubt) {
      this.editSubt = !this.editSubt;
    } else if (
      i == 1 &&
      this.SectionTitle == this.dailydropmoduledata.Section_title
    ) {
      this.editTitle = !this.editTitle;
    } else if (
      i == 2 &&
      this.SectionSTitle == this.dailydropmoduledata.Section_Stitle
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
            this.dailydropmoduledata.SectionID,
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

  // updateNSIYHTitle() {
  //   if (!this.editTitle) {
  //     this.editTitle = !this.editTitle;
  //   } else if (this.DailydropTitle == this.dailydropmoduledata.DDrop_Title) {
  //     this.editTitle = !this.editTitle;
  //   } else {
  //     if (!this.DailydropTitle) {
  //       this.auth.resource.startSnackBar('please enter the Title.');
  //     } else {
  //       this.api
  //         .updateDailydroptitle(
  //           this.DailydropTitle,
  //           this.dailydropmoduledata.id
  //         )
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

  // updateNSIYHTSTitle() {
  //   if (!this.editSubt) {
  //     this.editSubt = !this.editSubt;
  //   } else if (this.DailydropSTitle == this.dailydropmoduledata.DDrop_STitle) {
  //     this.editSubt = !this.editSubt;
  //   } else {
  //     if (!this.DailydropSTitle) {
  //       this.auth.resource.startSnackBar('please enter the sub Title.');
  //     } else {
  //       this.api
  //         .updateDailydropStitle(
  //           this.DailydropSTitle,
  //           this.dailydropmoduledata.id
  //         )
  //         .then((data) => {
  //           if (data != undefined) {
  //           }
  //         })
  //         .catch(() => {
  //           return false;
  //         });
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
            .getstoreaspernode('DailydropSection', data[i].id)
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
