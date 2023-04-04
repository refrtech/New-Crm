import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, of, take } from 'rxjs';
import { ApiserviceService } from 'src/app/apiservice.service';
import { DaildropsbrandsComponent } from './daildropsbrands/daildropsbrands.component';

@Component({
  selector: 'app-dailydrops',
  templateUrl: './dailydrops.component.html',
  styleUrls: ['./dailydrops.component.scss'],
})
export class DailydropsComponent implements OnInit {
  DailydropTitle: string = '';
  DailydropSTitle: string = '';
  editSubt: boolean = false;
  editTitle: boolean = false;
  Selectedcity: string = '';
  cityList$: Observable<any[]> = of();
  nodes$: Observable<any[]> = of();
  Selectednode: string = '';
  selectednodedata: any;
  dailydropmoduledata: any = [];
  alreadyCnodes$: Observable<any[]> = of();

  constructor(public dialog: MatDialog, public api: ApiserviceService) {}

  ngOnInit(): void {
    this.getDailydropdata();
    this.getallcity();
  }

  allstores(creatednode?: any) {
    if (this.Selectedcity == '') {
      alert('please select city.');
    } else if (creatednode == undefined && this.Selectednode == '') {
      alert('please select node.');
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
      .getDailydropdata()
      .pipe(take(1))
      .subscribe((daildropsdata: any) => {
        this.dailydropmoduledata = daildropsdata[0];
        this.DailydropTitle = daildropsdata[0].DDrop_Title;
        this.DailydropSTitle = daildropsdata[0].DDrop_STitle;
      });
  }

  updateNSIYHTitle() {
    if (!this.editTitle) {
      this.editTitle = !this.editTitle;
    } else if (this.DailydropTitle == this.dailydropmoduledata.DDrop_Title) {
      this.editTitle = !this.editTitle;
    } else {
      if (!this.DailydropTitle) {
        alert('please enter the Title.');
      } else {
        this.api
          .updateDailydroptitle(
            this.DailydropTitle,
            this.dailydropmoduledata.id
          )
          .then((data) => {
            if (data != undefined) {
              this.editTitle = !this.editTitle;
            }
          })
          .catch(() => {
            return false;
          });
      }
    }
  }

  updateNSIYHTSTitle() {
    if (!this.editSubt) {
      this.editSubt = !this.editSubt;
    } else if (this.DailydropSTitle == this.dailydropmoduledata.DDrop_STitle) {
      this.editSubt = !this.editSubt;
    } else {
      if (!this.DailydropSTitle) {
        alert('please enter the sub Title.');
      } else {
        this.api
          .updateDailydropStitle(
            this.DailydropSTitle,
            this.dailydropmoduledata.id
          )
          .then((data) => {
            if (data != undefined) {
            }
          })
          .catch(() => {
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
            .getstorecount('dailydropsection', this.Selectedcity, data[i].id)
            .then((datas: any) => {
              if (datas > 0) {
                data[i].storecount = datas;
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
