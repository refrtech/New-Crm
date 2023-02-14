import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Observable, of } from 'rxjs';
import { ApiserviceService } from 'src/app/apiservice.service';

@Component({
  selector: 'app-addcity-and-area',
  templateUrl: './addcity-and-area.component.html',
  styleUrls: ['./addcity-and-area.component.scss']
})
export class AddcityAndAreaComponent implements OnInit {
  CityN: string = "";
  CitySN: string = "";
  dropdownList: any = [];
  selectedareas: any = [];
  AreaPIN: string = "";
  AreaN: string = "";
  dropdownSettings!: IDropdownSettings;
  areas$: Observable<any[]> = of();
  selectedareafiltered: Array<any> = [];
  constructor(private actRoute: ActivatedRoute, private httpClient: HttpClient, public api: ApiserviceService,
    public dialogRef: MatDialogRef<AddcityAndAreaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (this.data.id != undefined && this.data.citydata != undefined) {
      this.CityN = this.data.citydata.CityN;
      this.CitySN = this.data.citydata.CitySN;
      for (let i = 0; i < this.data.citydata.Areas.length; i++) {
        this.selectedareas.push({
          Area_N: this.data.citydata.Areas[i].Area_N,
          id: this.data.citydata.Areas[i].id,
        })
      }
    }
  }

  ngOnInit(): void {
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'Area_N',
      enableCheckAll: false,
      itemsShowLimit: 2,
      allowSearchFilter: true,
    };
    this.execute();
  }

  execute() {
    if (this.data.id == 1) {
      this.getarea();
    }
  }

  cityanamechange() {
    if (this.CityN.length >= 3) {
      this.CitySN = this.CityN.slice(0, 3).toUpperCase();
    }
  }

  getarea() {
    this.api.getarea().subscribe((data: any) => {
      this.dropdownList = data;
    });
  }

  CreateCity() {
    if (this.CityN == undefined || this.CityN.length < 4) {
      alert("please enter the name of the City.")
    }
    else if (this.CitySN == undefined) {
      alert("please enter the Short id for City.")
    }
    else if (this.selectedareas.length == 0) {
      alert("please select the areas.");
    }
    else {
      for (let i = 0; i < this.selectedareas.length; i++) {
        let j = this.dropdownList.findIndex((a: any) => a.id == this.selectedareas[i].id);
        this.selectedareafiltered.push(this.dropdownList[j]);
      }

      let datas = {
        CityN: this.CityN,
        CitySN: this.CitySN,
        CDateTime: this.api.newTimestamp,
        MDateTime: this.api.newTimestamp,
        Areas: this.selectedareafiltered
      }
      this.api.addcity(datas).then((data) => {
        if (data != undefined) {
          this.dialogRef.close();
          alert("city added");
        }
      }).catch(() => {
        return false;
      });
    }
  }

  updateCity() {
    if (this.CityN == undefined || this.CityN.length < 4) {
      alert("please enter the name of the City.")
    }
    else if (this.CitySN == undefined) {
      alert("please enter the Short id for City.")
    }
    else if (this.selectedareas.length == 0) {
      alert("please select the areas.");
    }
    else {
      let datas = {
        CityN: this.CityN,
        CitySN: this.CitySN,
        MDateTime: this.api.newTimestamp,
        id: this.data.citydata.id
      }
      this.api.updatecity(datas).then((data) => {
        if (data != undefined) {
          this.dialogRef.close();
        }
      }).catch(() => {
        return false;
      });
    }
  }

  addarea(event: any) {
    let index = this.dropdownList.findIndex((x: any) =>
      x.id == event.id
    );
    let datas = {
      id: this.data.citydata.id,
      areadata: {
        Area_N: this.dropdownList[index].Area_N,
        Area_Pin: this.dropdownList[index].Area_Pin,
        CDateTime: this.dropdownList[index].CDateTime,
        MDateTime: this.dropdownList[index].MDateTime,
        id: this.dropdownList[index].id,
        isaddedincity: this.dropdownList[index].isaddedincity
      }
    }
    this.api.addcityarea(datas);
  }

  removearea(event: any) {
    let index = this.dropdownList.findIndex((x: any) =>
      x.id == event.id
    );
    let datas = {
      id: this.data.citydata.id,
      areadata: {
        Area_N: this.dropdownList[index].Area_N,
        Area_Pin: this.dropdownList[index].Area_Pin,
        CDateTime: this.dropdownList[index].CDateTime,
        MDateTime: this.dropdownList[index].MDateTime,
        id: this.dropdownList[index].id,
        isaddedincity: this.dropdownList[index].isaddedincity
      }
    }
    this.api.removecityarea(datas);
  }

  cratearea() {
    if (this.AreaN == undefined || this.AreaN.length < 4) {
      alert("please enter the name of the area")
    }
    else if (this.AreaPIN.length != 6) {
      alert("Please enter the valid PIN code.")
    }
    else {
      this.httpClient.get("https://api.postalpincode.in/pincode/" + this.AreaPIN + "").subscribe((data: any) => {
        if (data[0].Status = "Success") {
          let datas = {
            Area_N: this.AreaN,
            Area_Pin: this.AreaPIN,
            CDateTime: this.api.newTimestamp,
            MDateTime: this.api.newTimestamp,
            isaddedincity: false,
          }
          this.api.addarea(datas).then(data => {
            if (data != undefined) {
              this.dialogRef.close();
              alert("new area added");
            }
          }).catch(() => {
            return false;
          });
        }
        else {
          alert("No pin record found.");
        }
      });
    }
  }
}