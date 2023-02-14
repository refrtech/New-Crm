import { Component, OnInit } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-informationslide',
  templateUrl: './informationslide.component.html',
  styleUrls: ['./informationslide.component.scss'],
})
export class InformationslideComponent implements OnInit {
  slide: boolean = false;
  currentSlide: any[] = [];

  constructor() {}

  ngOnInit(): void {}

  feedSection: Array<any> = [
    { date: '23/2/2023', slides: 'Slide 1', link: '/addinfoslide' },
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
