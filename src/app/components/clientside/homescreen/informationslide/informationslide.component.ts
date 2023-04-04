import { Component, OnInit } from '@angular/core';
import { AddinfoslideComponent } from './addinfoslide/addinfoslide.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/auth.service';

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
  videoData: any;
  videoPath: string = '';

  constructor(private dailog: MatDialog, public auth: AuthService) {
    this.getVideo();
  }

  ngOnInit(): void {}

  addSlide(id: number, data?: any) {
    const dialogRef = this.dailog.open(AddinfoslideComponent, {
      width: '50%',
      data: { id: id, videoData: data },
      hasBackdrop: true,
      disableClose: true,
      panelClass: 'thanksscreen',
    });
  }

  async getVideo() {
    (await this.auth.getInfoVideos()).subscribe((d) => {
      this.getVideoData = d;
    });
  }

  deleteVid(id: any) {
    if (id == undefined) {
      alert('invalid data');
    } else {
      this.auth.infodeleteVideo(id).then((data: any) => {
        alert('deleted');
      });
    }
  }
}
