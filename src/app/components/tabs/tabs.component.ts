import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
})
export class TabsComponent implements OnInit {
  title = 'Refr';
  infocus = false;
  showMenu = false;

  navRoutes = [
    { tit: 'Dashboard', link: '/dash' },
    { tit: 'Merchants', link: '/merchant' },
    { tit: 'Users', link: '/users' },
    { tit: 'Orders', link: '/orders' },
    { tit: 'Notification', link: '/Notification' },
    { tit: 'Web Site Enquiry', link: '/websiteform' },
    {
      tit: 'Client side',
      iconName: 'expand_more',
      isexpanded: false,
      childern: [
        { tit: 'Node management', link: '/Nodecity' },
        { tit: 'Homescreen', link: '/homescreen' },
      ],
    },
  ];

  constructor(public router: Router) {}

  ngOnInit(): void {}

  expand(index: any) {
    if (index == 6) {
      this.navRoutes[index].isexpanded = !this.navRoutes[index].isexpanded;
    }
  }
}
