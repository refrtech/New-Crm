import { Camera } from '@capacitor/camera';
import { CameraResultType } from '@capacitor/camera/dist/esm/definitions';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, of, take } from 'rxjs';
import { ApiserviceService } from 'src/app/apiservice.service';
import { AuthService } from 'src/app/auth.service';
import { CropperComponent } from 'src/app/placeholders/cropper/cropper.component';

@Component({
  selector: 'app-storesinhood',
  templateUrl: './storesinhood.component.html',
  styleUrls: ['./storesinhood.component.scss'],
})
export class StoresinhoodComponent implements OnInit {
  parameters: string = 'phone';
  operators: string = '==';
  searchvalue: string = '9833006431'; //9833006431
  isstorealreadyadded: boolean = false;

  ParaArr: Array<any> = [
    {
      Title: 'Store Phone Number',
      titvalue: 'phone',
    },
    {
      Title: 'Store Id',
      titvalue: 'id',
    },
  ];

  marchantColumns: string[] = [
    'MerchantId',
    'storename',
    'contact',
    'storetype',
    'city',
    'action',
  ];
  // storelist: Array<any> = [];
  MerchantdataSource!: MatTableDataSource<any>;
  storelist$: Observable<any[]> = of();

  constructor(
    public auth: AuthService,
    public api: ApiserviceService,
    public dialogRef: MatDialogRef<StoresinhoodComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // this.storelist =
    //   this.data.selectednode != undefined ? this.data.selectednode.stores : [];
  }

  ngOnInit(): void {
    console.log(this.data);
    if (this.data.selectednode != undefined) {
      this.api
        .getstoreaspernode('NSIYHsection', this.data.selectednode.id)
        .subscribe((data: any) => {
          this.storelist$ = of(data);
        });
    }

  }

  action(data: any) {
    // let i = this.storelist.findIndex((x) => x.id == data.id);
    // if (i < 0) {
    //   this.storelist.push(data);
    //   this.isstorealreadyadded = true;
    // } else {
    //   this.storelist.splice(i, i + 1);
    //   this.isstorealreadyadded = false;
    // }
    data.city_id = this.data.cityid;
    data.nodeid = this.data.selectednode == undefined ? this.data.node.id : this.data.selectednode.id;
    data.sectionname = 'NSIYHsection';
    this.api.addstorewithnodeid(data).then((data:any)=>{
      this.isstorealreadyadded = true;
      console.log("store added");
    });

  }

  close() {
    this.dialogRef.close();
  }

  ApplyFilter() {
    this.isstorealreadyadded = false;
    this.api
      .getRecentStores(
        1,
        false,
        this.parameters,
        this.operators,
        this.searchvalue
      )
      .pipe(take(1))
      .subscribe((recentStore: any) => {
        this.MerchantdataSource = new MatTableDataSource(recentStore);
        // this.isstorealreadyadded =
        //   this.storelist.findIndex((x) => x.id == recentStore[0].id) < 0
        //     ? false
        //     : true;
      });
  }

  // updatestore() {
  //   if (this.data.selectednode == undefined) {
  //     let data = {
  //       Nareas: this.data.node.Nareas,
  //       city: this.data.node.city,
  //       city_id: this.data.node.city_id,
  //       created_at: this.data.node.created_at,
  //       id: this.data.node.id,
  //       name: this.data.node.name,
  //       stores: this.storelist,
  //       updated_at: this.data.node.updated_at,
  //     };
  //     this.api.addNSIYHstores(data, this.data.id).then((data: any) => {
  //       if (!data) {
  //         this.dialogRef.close();
  //       }
  //     });
  //   } else {
  //     let index = this.data.creatednodes.findIndex(
  //       (x: any) => x.id == this.data.selectednode.id
  //     );
  //     this.data.creatednodes[index].stores = this.storelist;
  //     this.api
  //       .editNSIYHstores(this.data.creatednodes, this.data.id)
  //       .then((data: any) => {
  //         if (!data) {
  //           this.dialogRef.close();
  //         }
  //       });
  //   }
  // }

  async takePicture(type: string, id: string, item: any) {
    const image = await Camera.getPhoto({
      quality: 100,
      height: 300,
      width: 300,
      allowEditing: false,
      resultType: CameraResultType.Uri,
    });
    const imageUrl = image.webPath || '';
    if (imageUrl) {
      this.startCropper(imageUrl, type, id, item);
    }
  }

  async startCropper(webPath: string, type: string, id: string, item: any) {
    let isPhone = this.auth.resource.getWidth < 768;
    let w = isPhone ? this.auth.resource.getWidth + 'px' : '480px';
    const refDialog = this.auth.resource.dialog.open(CropperComponent, {
      width: w,
      minWidth: '320px',
      maxWidth: '480px',
      height: '360px',
      data: { webPath: webPath, type: type },
      disableClose: true,
      panelClass: 'dialogLayout',
    });
    refDialog.afterClosed().subscribe(async (result) => {
      if (!result.success) {
        if (result.info) {
          this.auth.resource.startSnackBar(result.info);
        }
      } else {
        if (type == 'banner') {
          this.api
            .updatestorewithnodebanner(id, result.croppedImage)
            .then((data: any) => {
              alert('banner uploaded');
            });
        }

        // if (type == 'banner') {
        //   let index = this.data.creatednodes.findIndex(
        //     (x: any) => x.id == this.data.selectednode.id
        //   );
        //   const cloudUpload = await this.api
        //     .cloudUpload(
        //       this.data.creatednodes[index].stores[sindex].id,
        //       result.croppedImage
        //     )
        //     .then((data) => {
        //       this.data.creatednodes[index].stores[sindex].homeBanners =
        //         data.url;
        //     });
        // }
      }
    });
  }

  deletestore(id: string) {
    this.api.deletestorefromnodes(id).then((data: any) => {
      alert('store deleted');
    });
  }
}
