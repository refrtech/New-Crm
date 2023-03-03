import { CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-vsanodescat',
  templateUrl: './vsanodescat.component.html',
  styleUrls: ['./vsanodescat.component.scss']
})
export class VSAnodescatComponent implements OnInit {
  feedSection:Array<any>=[{Catname:"Food"},{Catname:"Fashion"},{Catname:"Healthcare"}];
  storeBanner = '';

  constructor() { }

  ngOnInit(): void {
  }

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
