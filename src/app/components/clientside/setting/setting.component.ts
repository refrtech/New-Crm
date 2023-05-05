import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ApiserviceService } from 'src/app/apiservice.service';
import { AddcityAndAreaComponent } from './addcity-and-area/addcity-and-area.component';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})
export class SettingComponent implements OnInit {
  cityarr: Array<any> = [];
  areaarr: Array<any> = [];

  constructor(public api: ApiserviceService,
    private dialog: MatDialog,private auth:AuthService
  ) { }

  ngOnInit(): void {
    this.getcity();
  }

  deletecity(id: any) {
    if (id == undefined) {
      this.auth.resource.startSnackBar("invalid data");
    }
    else {
    }
  }

  deletearea(id: any) {
    if (id == undefined) {
      this.auth.resource.startSnackBar("invalid data");
    }
    else {
      this.api.deletearea(id).then((data: any) => {
        this.auth.resource.startSnackBar("Area deleted");
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
