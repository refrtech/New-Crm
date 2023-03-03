import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';


@Component({
  selector: 'app-hgbcreatecategory',
  templateUrl: './hgbcreatecategory.component.html',
  styleUrls: ['./hgbcreatecategory.component.scss']
})
export class HgbcreatecategoryComponent implements OnInit {

  
  feedSection:Array<any>=[
    {dateAdded:'23/2/2023',storeName:'La French',Catname:"Food",},
    {dateAdded:'23/2/2023',storeName:'La French',Catname:"Fashion",},
    {dateAdded:'23/2/2023',storeName:'La French',Catname:"Healthcare",}];
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
