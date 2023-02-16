import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiserviceService } from 'src/app/apiservice.service';
@Component({
  selector: 'app-daildropsbrands',
  templateUrl: './daildropsbrands.component.html',
  styleUrls: ['./daildropsbrands.component.scss'],
})
export class DaildropsbrandsComponent implements OnInit {

  nodes!: MatTableDataSource<any>;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  nodeColumns: string[] = ['node', 'no_stores', 'storename', 'date', 'action'];
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
    private actRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.execute();
    }, 1000);
  }

  allstores(store: any) {
    // visit share earn
    if (this.router.url == '/visitdetails') {
      this.router.navigate(['/storedetails/' + store]);
    }
    // Brands in your neighbourhood
    if (this.router.url == '/nodebrands') {
      this.router.navigate(['/storedetails/' + store]);
    }
    // new in your hood
    if (this.router.url == '/newstoreinyourhooddetails') {
      this.router.navigate(['/storedetails/' + store]);
    }
    // daily drops
    if (this.router.url == '/dailydropsbrands') {
      this.router.navigate(['/storedetails/' + store]);
    }
  }

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
    this.nodes = new MatTableDataSource(users);
    this.nodes.paginator = this.paginator;
    this.nodes.sort = this.sort;
  }
}
