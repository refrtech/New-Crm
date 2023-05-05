import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, of, take } from 'rxjs';
import { ApiserviceService } from 'src/app/apiservice.service';
import { StoresinhoodComponent } from './storesinhood/storesinhood.component';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-newstoreinhood',
  templateUrl: './newstoreinhood.component.html',
  styleUrls: ['./newstoreinhood.component.scss'],
})
export class NewstoreinhoodComponent implements OnInit {
  nodeColumns: string[] = ['node', 'no_stores', 'storename', 'date', 'action'];
  SectionTitle: string = '';
  SectionSTitle: string = '';
  editSubt: boolean = false;
  editTitle: boolean = false;
  Selectedcity: string = '';
  cityList$: Observable<any[]> = of();
  nodes$: Observable<any[]> = of();
  alreadyCnodes$: Observable<any[]> = of();
  Selectednode: string = '';
  creatednodes$: Array<any> = [];
  selectednodedata: any;
  NSIYHmoduledata: any = [];

  constructor(public dialog: MatDialog, public api: ApiserviceService,private auth:AuthService) {}

  ngOnInit(): void {
    this.getNSIYHdata();
    this.getallcity();
  }

  allstores(creatednode?: any) {
    if (this.Selectedcity == '') {
      this.auth.resource.startSnackBar('please select city.');
    } else if (creatednode == undefined && this.Selectednode == '') {
      this.auth.resource.startSnackBar('please select node.');
    } else {
      this.dialog.open(StoresinhoodComponent, {
        width: '90%',
        data: {
          node: this.selectednodedata,
          id: this.NSIYHmoduledata.id,
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

  getNSIYHdata() {
    this.api
      .getSectionData('NSIYH')
      .pipe(take(1))
      .subscribe((NSIYNdata: any) => {
        this.NSIYHmoduledata = NSIYNdata[0];
        this.SectionTitle = NSIYNdata[0].Section_title;
        this.SectionSTitle = NSIYNdata[0].Section_Stitle;
      });
  }

  updateSectionDetails(i: number) {
    if (i == 1 && !this.editTitle) {
      this.editTitle = !this.editTitle;
    } else if (i == 2 && !this.editSubt) {
      this.editSubt = !this.editSubt;
    } else if (
      i == 1 &&
      this.SectionTitle == this.NSIYHmoduledata.Section_title
    ) {
      this.editTitle = !this.editTitle;
    } else if (
      i == 2 &&
      this.SectionSTitle == this.NSIYHmoduledata.Section_Stitle
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
            this.NSIYHmoduledata.SectionID,
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
  //   } else if (this.NSIYHTitle == this.NSIYHmoduledata.NSIYH_Title) {
  //     this.editTitle = !this.editTitle;
  //   } else {
  //     if (!this.NSIYHTitle) {
  //       this.auth.resource.startSnackBar('please enter the Title.');
  //     } else {
  //       this.api
  //         .updateNSIYHtitle(this.NSIYHTitle, this.NSIYHmoduledata.id)
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
  //   } else if (this.NSIYHSTitle == this.NSIYHmoduledata.NSIYH_STitle) {
  //     this.editSubt = !this.editSubt;
  //   } else {
  //     if (!this.NSIYHSTitle) {
  //       this.auth.resource.startSnackBar('please enter the sub Title.');
  //     } else {
  //       this.api
  //         .updateNSIYHStitle(this.NSIYHSTitle, this.NSIYHmoduledata.id)
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
            .getstoreaspernode('NSIYHsection', data[i].id)
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
