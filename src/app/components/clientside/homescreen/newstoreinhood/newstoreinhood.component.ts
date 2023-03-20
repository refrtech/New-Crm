import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, of, take } from 'rxjs';
import { ApiserviceService } from 'src/app/apiservice.service';
import { StoresinhoodComponent } from './storesinhood/storesinhood.component';

@Component({
  selector: 'app-newstoreinhood',
  templateUrl: './newstoreinhood.component.html',
  styleUrls: ['./newstoreinhood.component.scss'],
})
export class NewstoreinhoodComponent implements OnInit {
  nodeColumns: string[] = ['node', 'no_stores', 'storename', 'date', 'action'];
  NSIYHTitle: string = "";
  NSIYHSTitle: string = "";
  editSubt: boolean = false;
  editTitle: boolean = false;
  Selectedcity: string = "";
  cityList$: Observable<any[]> = of();
  nodes$: Observable<any[]> = of();
  alreadyCnodes$: Observable<any[]> = of();

  Selectednode: string = "";
  creatednodes$: Array<any> = [];
  selectednodedata: any;
  NSIYHmoduledata:any = [];

  constructor(
    public dialog: MatDialog,
    public api: ApiserviceService,
  ) {}

  ngOnInit(): void {
    this.getNSIYHdata();
    this.getallcity();
  }

  allstores(creatednode?: any) {
    if (this.Selectedcity == "") {
      alert("please select city.");
    }
    else if (creatednode == undefined && this.Selectednode == "") {
      alert("please select node.")
    }
    else {
      this.dialog.open(StoresinhoodComponent, {
        width: "90%",
        data: { node: this.selectednodedata, id: this.NSIYHmoduledata.id, selectednode: creatednode,
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

  getNSIYHdata() {
    this.api.getNSIYHData().pipe(take(1)).subscribe((NSIYNdata: any) => {
      this.NSIYHmoduledata = NSIYNdata[0];
      this.NSIYHTitle = NSIYNdata[0].NSIYH_Title;
      this.NSIYHSTitle = NSIYNdata[0].NSIYH_STitle;
      // this.creatednodes = NSIYNdata[0].Nodes;
    });
  }

  updateNSIYHTitle() {
    if (!this.editTitle) {
      this.editTitle = !this.editTitle;
    }
    else if (this.NSIYHTitle == this.NSIYHmoduledata.NSIYH_Title) {
      this.editTitle = !this.editTitle;
    }
    else {
      if (!this.NSIYHTitle) {
        alert("please enter the Title.");
      }
      else {
        this.api.updateNSIYHtitle(this.NSIYHTitle, this.NSIYHmoduledata.id).then((data) => {
          if (data != undefined) {
            this.editTitle = !this.editTitle;
          }
        }).catch(() => {
          return false;
        });
      }
    }
  }

  updateNSIYHTSTitle() {
    if (!this.editSubt) {
      this.editSubt = !this.editSubt;
    }
    else if (this.NSIYHSTitle == this.NSIYHmoduledata.NSIYH_STitle) {
      this.editSubt = !this.editSubt;
    }
    else {
      if (!this.NSIYHSTitle) {
        alert("please enter the sub Title.");
      }
      else {
        this.api.updateNSIYHStitle(this.NSIYHSTitle, this.NSIYHmoduledata.id).then((data) => {
          if (data != undefined) {
          }
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
            .getstorecount('NSIYHsection', this.Selectedcity, data[i].id)
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
