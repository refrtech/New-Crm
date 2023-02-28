import { Component, OnInit } from '@angular/core';
import { AddinfoslideComponent } from './addinfoslide/addinfoslide.component';
import { MatDialog } from '@angular/material/dialog';
import { ApiserviceService } from 'src/app/apiservice.service';

@Component({
  selector: 'app-informationslide',
  templateUrl: './informationslide.component.html',
  styleUrls: ['./informationslide.component.scss'],
})
export class InformationslideComponent implements OnInit {
  slide: boolean = false;
  currentSlide: any[] = [];
  getVideoData: any;
  id: string = '';
  videoData: string = '';
  videoPath: string = '';

  constructor(private dailog: MatDialog, public api: ApiserviceService) {}

  ngOnInit(): void {
    this.getVideo();
  }

  addSlide(id: number, data?: any) {
    const dialogRef = this.dailog.open(AddinfoslideComponent, {
      width: '50%',
      data: { id: id, videoData: data },
      hasBackdrop: true,
      disableClose: true,
      panelClass: 'thanksscreen',
    });
  }

  getVideo() {
    this.api.infogetuploadVideo().subscribe((data: any) => {
      this.getVideoData = data;
      console.log('get data', data);
    });
  }

  deleteVid(id: any) {
    if (id == undefined) {
      alert('invalid data');
    } else {
      this.api.infodeleteVideo(id).then((data: any) => {
        alert('area deleted');
      });
    }
  }

  view(data?: any) {
    const dialogRef = this.dailog.open(AddinfoslideComponent, {
      width: '50%',
      data: { videoData: data },
      hasBackdrop: true,
      disableClose: false,
      panelClass: 'thanksscreen',
    });
  }
}
