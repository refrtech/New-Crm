import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { ApiserviceService } from 'src/app/apiservice.service';
import { NgForm } from '@angular/forms';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { take } from 'rxjs';

@Component({
  selector: 'app-addnode',
  templateUrl: './addnode.component.html',
  styleUrls: ['./addnode.component.scss'],
})
export class AddnodeComponent implements OnInit {
  selectedareas: Array<any> = [];
  selectedareas2: Array<any> = [];
  Areaspincodes:Array<any> = []
  dropdownSettings!: IDropdownSettings;
  searchvalue: any;
  valuetype: number = 2;
  Valuearr: Array<any> = [];
  cityarr: Array<any> = [];
  dropdownList: Array<any> = [];
  cityindex?: number;
  Nodename: string = '';
  @ViewChild('nodeForm') nodeForm?: NgForm;
  selectedareafiltered: Array<any> = [];
  selectedcity: any;
  isselectdisable: boolean = false;
  nodeid: string = '';
  constructor(
    public api: ApiserviceService,
    public dialogRef: MatDialogRef<AddnodeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (this.data.id == 2) {
      this.dropdownList = this.data.Areas;
      this.dropdownSettings = {
        singleSelection: false,
        idField: 'id',
        textField: 'Area_N',
        itemsShowLimit: 2,
        allowSearchFilter: true,
      };
    }
    if (this.data.id != 3) {
      if (this.data.id != undefined && this.data.selectedcityid != undefined) {
        this.selectedcity = this.data.selectedcityid;
      }
      if (this.data.id != undefined && this.data.nodedata != undefined) {
        this.selectedcity = this.data.nodedata.city_id;
        let a: string = this.data.nodedata.name;
        this.Nodename = a.substring(7, a.length);
        if (this.data.nodedata.Nareas != undefined) {
          for (let i = 0; i < this.data.nodedata.Nareas.length; i++) {
            this.selectedareas2.push(this.data.nodedata.Nareas[i]);
            this.Areaspincodes.push(this.data.nodedata.Nareas[i].Area_Pin);
            this.selectedareas.push({
              Area_N: this.data.nodedata.Nareas[i].Area_N,
              id: this.data.nodedata.Nareas[i].id,
            });
          }
          // this.dropdownList.push(this.data.nodedata.Nareas[i]);
        }
      }
    }
  }

  ngOnInit(): void {
    this.getallcity();
  }

  getallcity() {
    this.api
      .getcity()
      .pipe(take(1))
      .subscribe((data) => {
        this.cityarr = data;
        let index = this.cityarr.findIndex(
          (x: any) => x.id == this.data.selectedcityid
        );
        this.cityindex = index;
      });
  }

  addarea(event: any) {
    let index = this.dropdownList.findIndex((x: any) => x.id == event.id);
    this.selectedareas2.push(this.dropdownList[index]);
    this.Areaspincodes.push(this.dropdownList[index].Area_Pin);
  }

  removearea(event: any) {
    let index = this.selectedareas2.findIndex((x: any) => x.id == event.id);
    this.selectedareas2.splice(index, 1);
    this.Areaspincodes.splice(index, 1);
  }

  addnode() {
    let index = this.data.alreadyaddnodes.findIndex(
      (x: any) => x.name == 'Node - ' + this.Nodename.toUpperCase()
    );
    if (index >= 0) {
      alert('Node name already exist.');
    } else if (this.Nodename == undefined || this.Nodename == '') {
      alert('Please enter the node name.');
    } else if (this.cityindex == undefined || this.cityindex == -1) {
      alert('please select the city');
    } else {
      let datas = {
        city: this.cityarr[this.cityindex].CityN,
        city_id: this.cityarr[this.cityindex].id,
        name: 'Node - ' + this.Nodename.toUpperCase(),
        created_at: this.api.newTimestamp,
        updated_at: this.api.newTimestamp,
      };
      this.api.addnode(datas).then((data: any) => {
        this.dialogRef.close();
      });
    }
  }

  async updatenode() {
    if (this.Nodename == undefined) {
      alert('Please enter the node name.');
    } else if (this.cityindex == undefined) {
      alert('please select the city');
    } else if (this.selectedareas.length == 0) {
      alert('please select the areas.');
    } else {
      await this.updateareastatus();
      let datas = {
        id: this.data.nodedata.id,
        name: 'Node - ' + this.Nodename.toUpperCase(),
        updated_at: this.api.newTimestamp,
        Nareas: this.selectedareas2,
        Areaspincodes: this.Areaspincodes,
      };
      this.api
        .updateNodeData(datas)
        .then((data) => {
          if (data == undefined) {
            this.dialogRef.close();
            alert('Node updated');
          }
        })
        .catch(() => {
          return false;
        });
    }
  }

  updateareastatus() {
    for (let i = 0; i < this.selectedareas2.length; i++) {
      let index = -1;
      if (this.data.nodedata.Nareas != undefined) {
        index = this.data.nodedata.Nareas.findIndex(
          (x: any) => x.id == this.selectedareas2[i].id
        );
      }
      if (index < 0) {
        this.api.isareaAlreadyAdded(this.selectedareas2[i].id, true);
        this.selectedareas2[i].isaddedinNode = true;
      }
    }
    if (this.data.nodedata.Nareas != undefined) {
      for (let i = 0; i < this.data.nodedata.Nareas.length; i++) {
        let index = -1;

        if (this.selectedareas2 != undefined) {
          index = this.selectedareas2.findIndex(
            (x: any) => x.id == this.data.nodedata.Nareas[i].id
          );
        }
        if (index < 0) {
          this.api.isareaAlreadyAdded(this.data.nodedata.Nareas[i].id, false);
        }
      }
    }
  }

  cancel() {
    this.dialogRef.close({ success: false });
  }

  Deletenode() {
    this.api.deletenode(this.data.Nodeid).then((data: any) => {
      this.dialogRef.close({ success: true });
    });
  }
}
