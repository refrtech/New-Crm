import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { AuthService } from 'src/app/auth.service';


@Component({
  selector: 'app-hgbcreatecategory',
  templateUrl: './hgbcreatecategory.component.html',
  styleUrls: ['./hgbcreatecategory.component.scss']
})
export class HgbcreatecategoryComponent implements OnInit {
  storeBanner = '';
  constructor( public auth : AuthService) {
   }

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
