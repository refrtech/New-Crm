import { Component, OnInit } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-homescreen',
  templateUrl: './homescreen.component.html',
  styleUrls: ['./homescreen.component.scss'],
})
export class HomescreenComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  // todo = [
  //   '',
  //   'Visit, recommend and earn',
  //   'Scan QR',
  //   'Brands in your neighbourhood',
  //   'Homegrown brands on Refr',
  //   'Brand spotlight',
  //   'What’s new in your hood',
  //   'Top drops',
  //   'Student special',
  // ];

  feedSection: Array<any> = [
    { feed: 'Top Feed', link: '/feedmodule' },
    { feed: 'Visit, recommend and earn', link: '/visitmodule' },
    { feed: 'Information slide', link: '/infoslide' },
    { feed: 'Scan QR', link: '/' },
    { feed: 'Brands in your neighbourhood', link: '/brands' },
    { feed: 'Homegrown brands on Refr', link: '/homebrands' },
    { feed: 'Brand spotlight', link: '/' },
    { feed: 'What’s new in your hood', link: '/newstoreinyourhood' },
    { feed: 'Top drops', link: '/' },
    { feed: 'Student special', link: '/' },
  ];

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }
}
