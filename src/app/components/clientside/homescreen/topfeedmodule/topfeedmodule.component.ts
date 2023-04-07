import { Component, OnInit } from '@angular/core';
import { FeedsectionComponent } from './feedsection/feedsection.component';
import { MatDialog } from '@angular/material/dialog';
import { ApiserviceService } from 'src/app/apiservice.service';
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
  url: any;
  //

  constructor(
    private dailog: MatDialog,
    public api: ApiserviceService,
    public auth: AuthService,
  ) {
    this.getVideo(this.id);
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

  deleteVid(id: any) {
    if (id == undefined) {
      alert('invalid data');
    } else {
      this.auth.deleteVideo(id).then((data: any) => {
        alert('deleted');
      });
    }
  }

  async getVideo(id: any) {
    (await this.auth.getFeedVideos()).subscribe((d) => {
      this.getVideoData = d;
    });
  }

  openUrl(id: any) {
    this.auth.addVideo(this.url).then((ref) => {
      this.url = id;
    });
  }
}
