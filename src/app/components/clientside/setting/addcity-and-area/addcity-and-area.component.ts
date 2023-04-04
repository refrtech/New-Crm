import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ApiserviceService } from 'src/app/apiservice.service';

@Component({
  selector: 'app-addcity-and-area',
  templateUrl: './addcity-and-area.component.html',
  styleUrls: ['./addcity-and-area.component.scss'],
})
export class AddcityAndAreaComponent implements OnInit {
  CityN: string = '';
  CitySN: string = '';
  dropdownList: any = [];
  selectedareas: any = [];
  AreaPIN: string = '';
  AreaN: string = '';
  dropdownSettings!: IDropdownSettings;
  selectedareafiltered: Array<any> = [];
  Areass: Array<any> = []

  constructor(
    private httpClient: HttpClient,
    public api: ApiserviceService,
    public dialogRef: MatDialogRef<AddcityAndAreaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngOnInit(): void {
    for (let i = 0; i < this.Areass.length; i++) {
      this.cratearea(this.Areass[i]);
    }
  }

  async cratearea(datass: any) {
    await this.httpClient
      .get('https://api.postalpincode.in/pincode/' + datass.Area_pin + '')
      .subscribe((data: any) => {
        if ((data[0].Status = 'Success')) {
          let datas = {
            Area_N: datass.Area_N.toUpperCase(),
            Area_Pin: datass.Area_pin,
            CDateTime: this.api.newTimestamp,
            City_id: '2ll96ci1eU5g2mBrPimG',
            isaddedinNode: false,
          };
          this.api
            .addarea(datas)
            .then((data) => {
              if (data != undefined) {
              }
            })
            .catch(() => {
              return false;
            });
        } else {
          alert('No pin record found.');
        }
      });
  }
}
