import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';
import { ApiserviceService } from 'src/app/apiservice.service';
import { AddnodeComponent } from './addnode/addnode.component';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-nodemanagement',
  templateUrl: './nodemanagement.component.html',
  styleUrls: ['./nodemanagement.component.scss'],
})
export class NodemanagementComponent implements OnInit {
  cityID: string = '';
  parameters: string = '';
  searchvalue: any;
  valuetype: number = 2;
  Valuearr: Array<any> = [];
  nodes!: MatTableDataSource<any>;
  dropdownList: Array<any> = [];
  nodesarr: Array<any> = [];
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  nodeColumns: string[] = ['node', 'area', 'action'];
  constructor(
    public api: ApiserviceService,
    public rs: Router,
    private dialog: MatDialog,
    private actRoute: ActivatedRoute,
    private auth:AuthService
  ) {
    this.cityID = this.actRoute.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.getAreasbycity(this.cityID);
    this.getallnode();
  }

  getallnode() {
    this.api
      .getNodeDataaspercity(this.cityID)
      .pipe(take(1))
      .subscribe((data: any) => {
        this.nodesarr = data;
        this.nodes = new MatTableDataSource(data);
        this.nodes.paginator = this.paginator;
        this.nodes.sort = this.sort;
      });
  }

  getAreasbycity(id: any) {
    this.api
      .getareabycity(id)
      .pipe(take(1))
      .subscribe((Data: any) => {
        this.dropdownList = Data;
      });
  }

  opennode(id: any, data?: any) {
    if (data != undefined && data.Nareas != undefined ) {
      for (let i = 0; i < data.Nareas.length; i++) {
        this.dropdownList.unshift(data.Nareas[i]);
      }
    }
    const dialogRef = this.dialog.open(AddnodeComponent, {
      width: '50%',
      data: {
        id: id,
        nodedata: data,
        selectedcityid: this.cityID,
        alreadyaddnodes: this.nodesarr,
        Areas: this.dropdownList,
      },
      hasBackdrop: true,
      disableClose: false,
      panelClass: 'thanksscreen',
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.getAreasbycity(this.cityID);
      this.getallnode();
    });
  }

  deletenode(data: any) {
    if (data == undefined) {
      this.auth.resource.startSnackBar('invalid data');
    } else {

      const dialogRef = this.dialog.open(AddnodeComponent, {
        width: '30%',
        data: {
          id: 3,
          Nodedata: data
        }
      })
      dialogRef.afterClosed().subscribe((result) => {
        if(result.success == true){
          this.getAreasbycity(this.cityID);
        this.getallnode();
        }
      })
    }
  }
}
