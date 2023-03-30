import { CdkDragDrop, moveItemInArray,transferArrayItem} from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs';
import { ApiserviceService } from 'src/app/apiservice.service';
import { AuthService } from 'src/app/auth.service';
import { CropperComponent } from 'src/app/placeholders/cropper/cropper.component';
import { Camera } from '@capacitor/camera';
import { CameraResultType } from '@capacitor/camera/dist/esm/definitions';


@Component({
  selector: 'app-vsanodescat',
  templateUrl: './vsanodescat.component.html',
  styleUrls: ['./vsanodescat.component.scss'],
})
export class VSAnodescatComponent implements OnInit {
  storeBanner = '';
  nodeId: string = '';
  id:any;
  constructor(
    public auth: AuthService,
    private api: ApiserviceService,
    private actRoute: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.nodeId = this.actRoute.snapshot.params['id'];
    this.api
      .getnodeinterdata(this.nodeId)
      .pipe(take(1))
      .subscribe((data: any) => {
        if (data.length == 0) {
          let Data = {
            created_at: this.api.newTimestamp,
            node_banner_url: '',
            node_id: this.nodeId,
          };
          this.api.addnodeinternal(Data);
        }
        else {
          this.id = data[0].id;
          this.storeBanner = data[0].node_banner_url;
        }
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

  async takePicture(ratio:string,type: string) {
    const image = await Camera.getPhoto({
      quality: 100,
      height: 300,
      width: 300,
      allowEditing: false,
      resultType: CameraResultType.Uri,
    });
    const imageUrl = image.webPath || '';
    if (imageUrl) {
      this.startCropper(ratio,imageUrl, type);
    }
  }

  startCropper(ratio:string,webPath: string, type: string) {
    let isPhone = this.auth.resource.getWidth < 768;
    let w = isPhone ? this.auth.resource.getWidth + 'px' : '480px';
    const refDialog = this.auth.resource.dialog.open(CropperComponent, {
      width: w,
      minWidth: '320px',
      maxWidth: '480px',
      height: '360px',
      data: { webPath: webPath, type: type ,ratio:ratio },
      disableClose: true,
      panelClass: 'dialogLayout',
    });
    refDialog.afterClosed().subscribe((result) => {
      if (!result.success) {
        if (result.info) {
          this.auth.resource.startSnackBar(result.info);
        }
      } else {
        if (type == 'homeBanner') {
          this.api
            .updateNodeinternalBanner(this.id, result.croppedImage)
            .then((ref) => {
              if (!ref || !ref.success) {
                this.auth.resource.startSnackBar('Upload Failed!');
              } else {
                this.storeBanner = ref.url;
                this.auth.resource.startSnackBar('Banner Update Under Review!');
              }
            });
        }
      }
    });
  }
}
