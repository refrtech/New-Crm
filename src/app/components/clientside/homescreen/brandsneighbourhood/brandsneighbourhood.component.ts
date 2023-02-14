import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ApiserviceService } from 'src/app/apiservice.service';

@Component({
  selector: 'app-brandsneighbourhood',
  templateUrl: './brandsneighbourhood.component.html',
  styleUrls: ['./brandsneighbourhood.component.scss'],
})
export class BrandsneighbourhoodComponent implements OnInit {
  nodes!: MatTableDataSource<any>;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  nodeColumns: string[] = ['node', 'no_stores', 'storename', 'date', 'action'];

  node: Array<any> = [
    {
      Title: 'Cities',
      titvalue: '',
    },
    {
      Title: '1',
      titvalue: 'mumbai',
    },
    {
      Title: '2',
      titvalue: 'kalyan',
    },
  ];

  constructor(
    public as: ApiserviceService,
    public router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.execute();
    }, 1000);
  }

  allstores(store: any) {
    if (this.router.url == '/brands') {
      this.router.navigate(['/storedetails/' + store]);
    }
  }

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
      Title: 'Kalyan',
      titvalue: 'kalyan',
    },
  ];

  execute() {
    const users = [
      {
        node: '1',
        no_stores: '10',
        storedetail: [
          { storename: 'Akkad Bakkad Bombay Boom' },
          { storename: 'asdadsasd' },
          { storename: 'Dal tadka' },
          { storename: 'asdadsasd' },
          { storename: 'Dal tadka' },
          { storename: 'asdadsasd' },
          { storename: 'Dal tadka' },
          { storename: 'asdadsasd' },
        ],
        date: new Date(),
      },
    ];
    // this.nodes = new MatTableDataSource(this.as.nodeList);
    this.nodes = new MatTableDataSource(users);
    this.nodes.paginator = this.paginator;
    this.nodes.sort = this.sort;
    // this.auth.getStoreList(100).subscribe((users: any) => {
    //   console.log('List: ', users);
    //   this.dataSource = new MatTableDataSource(users);
    //   this.dataSource.paginator = this.paginator;
    //   this.dataSource.sort = this.sort;
    // });
  }
}
