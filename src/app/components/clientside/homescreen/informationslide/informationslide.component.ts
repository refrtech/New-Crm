import { Component, OnInit } from '@angular/core';
import { AddinfoslideComponent } from './addinfoslide/addinfoslide.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/auth.service';
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
  videoData: any;
  videoPath: string = '';

  constructor(private dailog: MatDialog, public auth: AuthService,private api:ApiserviceService) {
    this.getVideo();
  }

  ngOnInit(): void {}

  addSlide(id: number, data?: any) {
    const dialogRef = this.dailog.open(AddinfoslideComponent, {
      width: '50%',
      data: { id: this.getVideoData.id,infoVideos: this.getVideoData.infoVideos},
      hasBackdrop: true,
      disableClose: true,
      panelClass: 'thanksscreen',
    });
  }

  async getVideo() {
    await this.api.getVideosdata('InformationVideo').subscribe((data) => {
      this.getVideoData = data[0];
    });
  }

  deleteVid(id: any) {
    if (id == undefined) {
      this.auth.resource.startSnackBar('invalid data');
    } else {
      let i = this.getVideoData.infoVideos.findIndex((x:any)=>{
        x.fileName == id
      });
      this.getVideoData.infoVideos.splice(i,1);
      this.api.UpdateVideo(this.getVideoData.id,this.getVideoData.infoVideos).then((data: any) => {
        this.auth.resource.startSnackBar('Video deleted');
      });
    }
  }
}
