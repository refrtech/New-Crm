import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';


@Component({
  selector: 'app-hgbnodecatstores',
  templateUrl: './hgbnodecatstores.component.html',
  styleUrls: ['./hgbnodecatstores.component.scss']
})
export class HgbnodecatstoresComponent implements OnInit {

  storeBanner = '';
  Catstores: Array<any> = [{
    Sname: "Dinshaws Xpress cafe",
    Mdate: "23/2/2023",
    sCat: "Cafe",
  },
  {
    Sname: "Dinshaws Xpress cafe",
    Mdate: "23/2/2023",
    sCat: "Cafe",
  },
  {
    Sname: "Dinshaws Xpress cafe",
    Mdate: "23/2/2023",
    sCat: "Cafe",
  },
  {
    Sname: "Dinshaws Xpress cafe",
    Mdate: "23/2/2023",
    sCat: "Cafe",
  },
  {
    Sname: "Dinshaws Xpress cafe",
    Mdate: "23/2/2023",
    sCat: "Cafe",
  }]
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
