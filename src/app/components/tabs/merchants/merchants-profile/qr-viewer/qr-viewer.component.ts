import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';

import QRCodeStyling, { Extension } from 'qr-code-styling-new';
// import QRCodeStyling from 'qr-code-styling';

@Component({
  selector: 'app-qr-viewer',
  templateUrl: './qr-viewer.component.html',
  styleUrls: ['./qr-viewer.component.scss']
})
export class QrViewerComponent implements OnInit {

  @Input()
  qrLINK!: string;

  @Input()
  qrWhat!: string;

  @Input()
  id!: string;

  @Input()
  name!: string;
  
  @ViewChild('canvasX', { static: false })
  canvasX!: ElementRef;

  qrName:string = "";
  qrCode:any = null;
  showCode = false;

  constructor() { }

  ngOnInit(): void {
    this.qrName = this.qrWhat;
    this.execute(this.qrLINK)
  }

  async execute(x:string){
    if(x){
      this.qrCode = await new QRCodeStyling({
        width: 248,
        height: 248,
        type: "canvas",
        data: x,
        image:"assets/locate.svg",
        //image: 'https://firebasestorage.googleapis.com/v0/b/refr/o/locate.svg?alt=media&token=e23de5bd-4a26-4a9e-bb63-bc9e3a87b29c',
        margin: 0,
        qrOptions: {
          typeNumber: 0,
          mode: 'Byte',
          errorCorrectionLevel: 'Q'
        },
        dotsOptions: {
          color: '#000000',
          type: 'dots'
        },
        backgroundOptions: {
          color: "rgba(255, 255, 255, 0%)",
        },
        cornersSquareOptions: {
          color: '#512da8',
          type: 'square',
        },
        cornersDotOptions: {
          color: '#000000',
          type: 'square',
        }
      });
      setTimeout(() => {
        this.qrCode.append(this.canvasX?.nativeElement);
        this.showCode = true;
      }, 3000)
      }
  }

  download(extension:string, id:string, name:string) {
    if(extension){
      try{
        this.qrCode.download(
          { name: "store-" + name.split(" ").join("_").toLowerCase() + "-" + this.qrName, extension: "png" as Extension }
        ) ;
      }catch(err){
        console.log(err)
      }
    }
  }

}
