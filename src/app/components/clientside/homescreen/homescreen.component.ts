import { Component, OnInit } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { ApiserviceService } from 'src/app/apiservice.service';


@Component({
  selector: 'app-homescreen',
  templateUrl: './homescreen.component.html',
  styleUrls: ['./homescreen.component.scss'],
})
export class HomescreenComponent implements OnInit {

  constructor(public api:ApiserviceService) {}

  ngOnInit(): void {
  }

  feedSection: Array<any> = [
    { feed: 'Top Feed', link: '/feedmodule' },
    { feed: 'Visit, recommend and earn', link: '/visitmodule' },
    { feed: 'Information slide', link: '/infoslide' },
    { feed: 'Brands in your neighbourhood', link: '/brands' },
    { feed: 'Homegrown brands on Refr', link: '/homebrands' },
    { feed: 'Brand spotlight', link: '/brandspotlight' },
    { feed: 'What’s new in your hood', link: '/newstoreinyourhood' },
    { feed: 'Top drops', link: '/dailydrops' },
    { feed: 'Categoryssss', link: '/Categories' },
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
