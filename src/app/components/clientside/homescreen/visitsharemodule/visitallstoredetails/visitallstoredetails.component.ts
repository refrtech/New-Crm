import { Camera } from '@capacitor/camera';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Observable, of, take } from 'rxjs';
import { ApiserviceService } from 'src/app/apiservice.service';
import { CameraResultType } from '@capacitor/camera/dist/esm/definitions';
import { CropperComponent } from 'src/app/placeholders/cropper/cropper.component';
import { AuthService } from 'src/app/auth.service';


@Component({
  selector: 'app-visitallstoredetails',
  templateUrl: './visitallstoredetails.component.html',
  styleUrls: ['./visitallstoredetails.component.scss'],
})
export class VisitallstoredetailsComponent implements OnInit {
  parameters: string = "phone";
  operators: string = "==";
  searchvalue: string = "9833006431";//9833006431
  isstorealreadyadded: boolean = false;
  ParaArr: Array<any> = [
    {
      Title: "Store Phone Number", titvalue: "phone",
    },
    {
      Title: "Store Id", titvalue: "id",
    }
  ];
  marchantColumns: string[] = [
    "MerchantId",
    "storename",
    "contact",
    "storetype",
    "city",
    "action"
  ];
  MerchantdataSource!: MatTableDataSource<any>;
  id: number = 0;
  nodestores$: Observable<any[]> = of();
  storelist: Array<any> = [];

  constructor(public router: Router, public api: ApiserviceService, public auth: AuthService,
    public dialogRef: MatDialogRef<VisitallstoredetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.storelist = this.data.selectednode != undefined ? this.data.selectednode.stores : [];
  }

  ngOnInit(): void { }

  ApplyFilter() {
    this.isstorealreadyadded = false;
    this.api.getRecentStores(1, false, this.parameters, this.operators, this.searchvalue).pipe(take(1)).subscribe((recentStore: any) => {
      this.MerchantdataSource = new MatTableDataSource(recentStore);
      this.isstorealreadyadded = this.storelist.findIndex((x) => x.id == recentStore[0].id) < 0 ? false : true;
    });
  }

  action(data: any) {
    let i = this.storelist.findIndex((x) => x.id == data.id);
    if (i < 0) {
      this.storelist.push(data);
      this.isstorealreadyadded = true;
    }
    else {
      this.storelist.splice(i, i + 1);
      this.isstorealreadyadded = false;
    }
  }

  close() {
    this.dialogRef.close();
  }

  updatestore() {
    if (this.data.selectednode == undefined) {
      let data = {
        Nareas: this.data.node.Nareas,
        city: this.data.node.city,
        city_id: this.data.node.city_id,
        created_at: this.data.node.created_at,
        id: this.data.node.id,
        name: this.data.node.name,
        stores: this.storelist,
        updated_at: this.data.node.updated_at,
      }
      console.log(this.data.selectednode);
console.log(this.data.id);
console.log(data);
      this.api.addVSAstores(data, this.data.id).then((data: any) => {
        if (!data) {
          this.dialogRef.close();
        }
      });
    }
    else {
      let index = this.data.creatednodes.findIndex((x: any) => x.id == this.data.selectednode.id);
      this.data.creatednodes[index].stores = this.storelist;
      this.api.editVSAstores(this.data.creatednodes, this.data.id).then((data: any) => {
        if (!data) {
          this.dialogRef.close();
        }
      });
    }
  }

  async takePicture(type: string, index: number, item: any) {
    const image = await Camera.getPhoto({
      quality: 100,
      height: 300,
      width: 300,
      allowEditing: false,
      resultType: CameraResultType.Uri,
    });
    const imageUrl = image.webPath || '';
    if (imageUrl) {
      this.startCropper(imageUrl, type, index, item);
    } else {
    }
  }

  async startCropper(webPath: string, type: string, index: number, item: any) {
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
          this.auth.resource.startSnackBar(result.info)
        }
      } else {
        if (type == 'banner') {
          let index = this.data.creatednodes.findIndex((x: any) => x.id == this.data.selectednode.id);
          const cloudUpload = await this.api.cloudUpload(this.data.creatednodes[index].stores[index].id, result.croppedImage);
        }
      }
    });
  }
}
