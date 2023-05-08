import { Component, OnInit } from '@angular/core';
import { FeedsectionComponent } from './feedsection/feedsection.component';
import { MatDialog } from '@angular/material/dialog';
import { ApiserviceService } from 'src/app/apiservice.service';
import { AuthService } from 'src/app/auth.service';
import { ConfirmationPopupComponent } from '../confirmation-popup/confirmation-popup.component';

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
    public auth: AuthService
  ) {
    this.getVideo();
  }

  ngOnInit(): void {}

  addSlide() {
    const dialogRef = this.dailog.open(FeedsectionComponent, {
      width: '50%',
      data: { id: this.getVideoData.id,FeedVideos:this.getVideoData.Videos },
      hasBackdrop: true,
      disableClose: true,
      panelClass: 'thanksscreen',
    });
  }

  deleteVid(id: any) {
    if (id == undefined) {
      this.auth.resource.startSnackBar('invalid data');
    } else {
      let isPhone = this.auth.resource.getWidth < 768;
      let w = isPhone ? this.auth.resource.getWidth + 'px' : '480px';
      const refDialog = this.auth.resource.dialog.open(
        ConfirmationPopupComponent,
        {
          width: w,
          minWidth: '320px',
          maxWidth: '480px',
          height: '200px',
          data: 'Video',
          disableClose: true,
          panelClass: 'dialogLayout',
        }
      );
      refDialog.afterClosed().subscribe((result) => {
        if (!result.success) {
          if (result.info) {
            this.auth.resource.startSnackBar(result.info);
          }
        } else {
          let i = this.getVideoData.Videos.findIndex((x:any)=>{
            x.fileName == id
          });
          this.getVideoData.Videos.splice(i,1);
          this.api.UpdateVideo(this.getVideoData.id,this.getVideoData.Videos).then((data: any) => {});
        }
      });
    }
  }

  async getVideo() {
    await this.api.getSectionsdata('TopFeedVideos').subscribe((data) => {
      this.getVideoData = data[0];
    });
  }

  // openUrl(id: any) {
  //   this.auth.addVideo(this.url).then((ref) => {
  //     this.url = id;
  //   });
  // }
}
