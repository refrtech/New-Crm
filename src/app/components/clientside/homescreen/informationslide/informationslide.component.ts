import { Component, OnInit } from '@angular/core';
import { AddinfoslideComponent } from './addinfoslide/addinfoslide.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/auth.service';
import { ApiserviceService } from 'src/app/apiservice.service';
import { ConfirmationPopupComponent } from '../confirmation-popup/confirmation-popup.component';

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

  constructor(
    private dailog: MatDialog,
    public auth: AuthService,
    private api: ApiserviceService
  ) {
    this.getVideo();
  }

  ngOnInit(): void {}

  addSlide() {
    if (this.getVideoData?.Videos.length >= 1) {
      this.auth.resource.startSnackBar('Max. limit 1 video.');
    } else {
      this.dailog.open(AddinfoslideComponent, {
        width: '50%',
        data: {
          id: this.getVideoData.id,
          infoVideos: this.getVideoData.Videos,
        },
        hasBackdrop: true,
        disableClose: true,
        panelClass: 'thanksscreen',
      });
    }
  }

  async getVideo() {
    await this.api.getSectionsdata('InformationVideo').subscribe((data) => {
      this.getVideoData = data[0];
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
          let i = this.getVideoData.Videos.findIndex((x: any) => {
            x.fileName == id;
          });
          this.getVideoData.Videos.splice(i, 1);
          this.api
            .UpdateVideo(this.getVideoData.id, this.getVideoData.Videos)
            .then((data: any) => {});
        }
      });
    }
  }
}
