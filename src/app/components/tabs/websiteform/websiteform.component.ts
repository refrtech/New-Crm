import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ApiserviceService } from 'src/app/apiservice.service';

@Component({
  selector: 'app-websiteform',
  templateUrl: './websiteform.component.html',
  styleUrls: ['./websiteform.component.scss'],
})
export class WebsiteformComponent implements OnInit {
  dates = { seconds: 1668609733, nanoseconds: 654000000 };
  selected = 'option2';
  formtype: string = 'EXPLORE-BETA';
  WebdataSource!: MatTableDataSource<any>;
  @ViewChild(MatSort) sort!: MatSort;

  marchantColumns: string[] = [
    'serial',
    'Type',
    'From',
    'Name',
    'Phone',
    'Pincode',
    'State',
    'EmailId',
    'Link',
    'Description',
  ];

  constructor(
    private apiservice: ApiserviceService,
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    setTimeout(() => {
      this.execute();
    }, 1000);
  }

  execute(tabChangeEvent?: MatTabChangeEvent) {
    if (tabChangeEvent != undefined) {
      if (tabChangeEvent.index == 0) {
        this.formtype = '';
      } else if (tabChangeEvent.index == 1) {
        this.formtype = 'EXPLORE-BETA';
      } else if (tabChangeEvent.index == 2) {
        this.formtype = 'VENDOR';
      } else if (tabChangeEvent.index == 3) {
        this.formtype = 'CLIENT';
      } else if (tabChangeEvent.index == 4) {
        this.formtype = 'M-Inquiry';
      }
    }
    this.apiservice.getFormData(
        20,
        this.formtype,
        tabChangeEvent?.index == 0 || tabChangeEvent == undefined ? false : true
      )
      .subscribe((websiteform: any) => {
        this.WebdataSource = new MatTableDataSource(websiteform);
        this.WebdataSource.sort = this.sort;
      });
  }

  converttodate(date: any) {
    return (
      new Date(date.seconds * 1000).getHours() +
      ':' +
      new Date(date.seconds * 1000).getMinutes() +
      '  ' +
      new Date(date.seconds * 1000).toDateString()
    );
  }
}
