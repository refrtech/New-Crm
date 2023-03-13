import { Component, OnInit } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { FeedsectionComponent } from './feedsection/feedsection.component';
import { MatDialog } from '@angular/material/dialog';
import { ApiserviceService } from 'src/app/apiservice.service';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-topfeedmodule',
  templateUrl: './topfeedmodule.component.html',
  styleUrls: ['./topfeedmodule.component.scss'],
})
export class TopfeedmoduleComponent implements OnInit {
  slide: boolean = false;
  currentSlide: any[] = [];
  getVideoData: any;
  id: string = '';
  videoData: any = '';
  //

  constructor(
    private dailog: MatDialog,
    public api: ApiserviceService,
    private http: HttpClient,
    public auth: AuthService
  ) {
    // this.getVideo();
  }

  ngOnInit(): void {}

  addSlide(id: number, data?: any) {
    const dialogRef = this.dailog.open(FeedsectionComponent, {
      width: '50%',
      data: { id: id, videoData: data },
      hasBackdrop: true,
      disableClose: true,
      panelClass: 'thanksscreen',
    });
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

  // getVideo() {
  //   this.api.getuploadVideo().subscribe((data: any) => {
  //     this.getVideoData = data;
  //   });
  // }

  deleteVid(id: any) {
    if (id == undefined) {
      alert('invalid data');
    } else {
      this.api.deleteVideo(id).then((data: any) => {
        alert('area deleted');
      });
    }
  }

  // getVideo() {
  //   const url = 'http://localhost:3000/upload-video';
  // }
}
