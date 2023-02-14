import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ApiserviceService } from 'src/app/apiservice.service';
import { AddnodeComponent } from './addnode/addnode.component';

@Component({
  selector: 'app-nodemanagement',
  templateUrl: './nodemanagement.component.html',
  styleUrls: ['./nodemanagement.component.scss'],
})
export class NodemanagementComponent implements OnInit {
  parameters: string = '';
  searchvalue: any;
  valuetype: number = 2;
  Valuearr: Array<any> = [];
  nodes!: MatTableDataSource<any>;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  nodeColumns: string[] = ['node', 'area', 'used_in', 'action'];
  ParaArr: Array<any> = [
    {
      Title: 'Cities',
      titvalue: '',
    },
    {
      Title: 'Mumbai',
      titvalue: 'mumbai',
    },
    {
      Title: 'Andheri',
      titvalue: 'andheri',
    },
    {
      Title: 'Kalyan',
      titvalue: 'kalyan',
    },
  ];
  constructor(public api: ApiserviceService, public rs: Router, private dailog: MatDialog) {
    this.api.nodeList = this.api.nodesData;
  }

  ngOnInit(): void {
    this.getallnode();
  }

  getallnode() {
    this.api.getNodeData().subscribe((data: any) => {
      let dataN: Array<any> = [];
      for (let i = 0; i < data.length; i++) {
        if (data[i].city != undefined && data[i].city != '' && data[i].created_at != undefined && data[i].used_in != "")
          dataN.push(data[i]);
      }
      this.nodes = new MatTableDataSource(dataN);
      this.nodes.paginator = this.paginator;
      this.nodes.sort = this.sort;
    });
  }

  opennode(id: any, data?: any) {
    const dialogRef = this.dailog.open(AddnodeComponent, {
      width: "50%",
      data: { id: id, nodedata: data },
      hasBackdrop: true,
      disableClose: false,
      panelClass: 'thanksscreen'
    });
  }

  deletenode(id: any) {
    if (id == undefined) {
      alert("invalid data");
    }
    else {
      this.api.deletenode(id).then((data: any) => {
        alert("node deleted");
      });
    }
  }

}
