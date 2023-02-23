import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiserviceService } from 'src/app/apiservice.service';
import { AddnodeComponent } from './addnode/addnode.component';

@Component({
  selector: 'app-nodemanagement',
  templateUrl: './nodemanagement.component.html',
  styleUrls: ['./nodemanagement.component.scss'],
})
export class NodemanagementComponent implements OnInit {
  cityID: string = "";
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
  constructor(public api: ApiserviceService, public rs: Router, private dialog: MatDialog, private actRoute: ActivatedRoute) {
    this.cityID = this.actRoute.snapshot.params["id"];
  }

  ngOnInit(): void {
    this.getallnode();
  }

  getallnode() {
    this.api.getNodeDataaspercity(this.cityID).subscribe((data: any) => {
      this.nodes = new MatTableDataSource(data);
      this.nodes.paginator = this.paginator;
      this.nodes.sort = this.sort;
    });
  }

  opennode(id: any, data?: any) {
    const dialogRef = this.dialog.open(AddnodeComponent, {
      width: "50%",
      data: { id: id, nodedata: data, selectedcityid: this.cityID },
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
