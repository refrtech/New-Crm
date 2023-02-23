import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiserviceService } from 'src/app/apiservice.service';
import { FormBuilder, NgForm } from '@angular/forms';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { AuthService } from 'src/app/auth.service';


// firebase
import {
  collection,
  CollectionReference,
  addDoc,
} from 'firebase/firestore';
import { Firestore } from '@angular/fire/firestore';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-addnode',
  templateUrl: './addnode.component.html',
  styleUrls: ['./addnode.component.scss'],
})
export class AddnodeComponent implements OnInit {
  selectedareas: any = [];
  dropdownSettings!: IDropdownSettings;
  searchvalue: any;
  valuetype: number = 2;
  Valuearr: Array<any> = [];
  cityarr: Array<any> = [];
  dropdownList: Array<any> = [];
  cityindex?: number;
  Nodename: string = "";
  @ViewChild('nodeForm') nodeForm?: NgForm;
  selectedareafiltered: Array<any> = [];
  selectedcity: any;
  isselectdisable: boolean = false;
  nodeid: string = "";
  constructor(
    public api: ApiserviceService,
    public dialogRef: MatDialogRef<AddnodeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (this.data.id != undefined && this.data.selectedcityid != undefined) {
      this.selectedcity = this.data.selectedcityid;
      this.isselectdisable = true;
    }
    if (this.data.id != undefined && this.data.nodedata != undefined) {
      this.Nodename = this.data.nodedata.name;
      this.selectedcity = this.data.nodedata.city_id;
      this.nodeid = this.data.nodedata.id;
      this.isselectdisable = true;
      for (let i = 0; i < this.data.nodedata.Nareas.length; i++) {
        this.selectedareas.push({
          Area_N: this.data.nodedata.Nareas[i].Area_N,
          id: this.data.nodedata.Nareas[i].id,
        })
      }
    }
  }

  ngOnInit(): void {
    this.getallcity();
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'Area_N',
      itemsShowLimit: 2,
      allowSearchFilter: true,
    };
  }

  addarea(event: any) {
    let index = this.dropdownList.findIndex((x: any) =>
      x.id == event.id
    );
    let data = {
      id: this.data.nodedata.id,
      areadata: {
        Area_N: this.dropdownList[index].Area_N,
        Area_Pin: this.dropdownList[index].Area_Pin,
        CDateTime: this.dropdownList[index].CDateTime,
        MDateTime: this.dropdownList[index].MDateTime,
        id: this.dropdownList[index].id,
        isaddedincity: this.dropdownList[index].isaddedincity,
      }
    }
    this.api.addnodearea(data);
  }

  removearea(event: any) {
    let index = this.dropdownList.findIndex((x: any) =>
      x.id == event.id
    );
    let data = {
      id: this.data.nodedata.id,
      areadata: {
        Area_N: this.dropdownList[index].Area_N,
        Area_Pin: this.dropdownList[index].Area_Pin,
        CDateTime: this.dropdownList[index].CDateTime,
        MDateTime: this.dropdownList[index].MDateTime,
        id: this.dropdownList[index].id,
        isaddedincity: this.dropdownList[index].isaddedincity,
      }
    }
    this.api.removenodearea(data);
  }

  citychange(i: number) {
    this.cityindex = i;
    this.dropdownList = this.cityarr[i].Areas;
  }

  getallcity() {
    this.api.getcity().subscribe((data: any) => {
      this.cityarr = [];
      this.cityarr = data;
      if (this.data.id != undefined && this.data.nodedata != undefined) {
        let index = this.cityarr.findIndex((x: any) =>
          x.id == this.data.nodedata.city_id
        );
        this.cityindex = index;
        this.dropdownList = this.cityarr[index].Areas;
      }
      else if (this.data.id != undefined && this.data.selectedcityid != undefined) {
        let index = this.cityarr.findIndex((x: any) =>
          x.id == this.data.selectedcityid
        );
        this.cityindex = index;
        this.dropdownList = this.cityarr[index].Areas;
      }
    });
  }

  addnode() {
    if (this.Nodename == undefined) {
      alert("Please enter the node name.")
    }
    else if (this.cityindex == undefined) {
      alert("please select the city");
    }
    else if (this.selectedareas.length == 0) {
      alert("please select the areas.")
    }
    else {
      for (let i = 0; i < this.selectedareas.length; i++) {
        let j = this.cityarr[this.cityindex].Areas.findIndex((a: any) => a.id == this.selectedareas[i].id);
        this.selectedareafiltered.push(this.cityarr[this.cityindex].Areas[j]);
      }
      let datas = {
        city: this.cityarr[this.cityindex].CityN,
        city_id: this.cityarr[this.cityindex].id,
        name: this.Nodename,
        Nareas: this.selectedareafiltered,
        created_at: this.api.newTimestamp,
        updated_at: this.api.newTimestamp,
      }
      this.api.addnode(datas).then((data) => {
        if (data == undefined) {
          this.dialogRef.close();
          alert("Node added");
        }
      }).catch(() => {
        return false;
      });
    }
  }

  updatenode() {
    if (this.Nodename == undefined) {
      alert("Please enter the node name.")
    }
    else if (this.cityindex == undefined) {
      alert("please select the city");
    }
    else if (this.selectedareas.length == 0) {
      alert("please select the areas.")
    }
    else {
      for (let i = 0; i < this.selectedareas.length; i++) {
        let j = this.cityarr[this.cityindex].Areas.findIndex((a: any) => a.id == this.selectedareas[i].id);
        this.selectedareafiltered.push(this.cityarr[this.cityindex].Areas[j]);
      }
      
      let datas = {
        name: this.Nodename,
        id: this.nodeid,
        Nareas: this.selectedareafiltered,
      }
      this.api.updateNodeData(datas).then((data) => {
        if (data == undefined) {
          this.dialogRef.close();
          alert("Node updated");
        }
      }).catch(() => {
        return false;
      });
    }
  }
}
