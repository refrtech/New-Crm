import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ApiserviceService } from 'src/app/apiservice.service';
import { AddcityAndAreaComponent } from './addcity-and-area/addcity-and-area.component';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})
export class SettingComponent implements OnInit {
  cityarr: Array<any> = [];
  areaarr: Array<any> = [];

  constructor(public api: ApiserviceService,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.getcity();
    this.getarea();
  }

  getarea() {
    this.api.getarea().subscribe((data: any) => {
      this.areaarr = [];
      this.areaarr = data;
    });
  }

  deletecity(id: any) {
    if (id == undefined) {
      alert("invalid data");
    }
    else {
      this.api.deletecity(id).then((data: any) => {
        alert("store deleted");
      });
    }
  }

  deletearea(id: any) {
    if (id == undefined) {
      alert("invalid data");
    }
    else {
      this.api.deletearea(id).then((data: any) => {
        alert("area deleted");
      });
    }
  }

  getcity() {
    this.api.getcity().subscribe((data: any) => {
      this.cityarr = [];
      this.cityarr = data;
    });
  }

  addUpdateCAA(id: number, data?: any) {
    const dialogRef = this.dialog.open(AddcityAndAreaComponent, {
      width: "50%",
      data: { id: id, citydata: data },
      hasBackdrop: true,
      disableClose: false,
      panelClass: 'thanksscreen'
    });
  }
}
