import { Component, OnInit } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { ApiserviceService } from 'src/app/apiservice.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { take } from 'rxjs';

@Component({
  selector: 'app-vsanodecatstores',
  templateUrl: './vsanodecatstores.component.html',
  styleUrls: ['./vsanodecatstores.component.scss'],
})
export class VSAnodecatstoresComponent implements OnInit {
  storeBanner = '';
  nodeId: string = '';

  parameters: string = 'phone';
  parameters1: string = 'phone';

  operators: string = '==';
  operators1: string = '==';

  searchvalue: string = '9833006431'; //9833006431
  searchvalue1: string = '9833006431'; //9833006431

  isstorealreadyadded: boolean = false;
  isstorealreadyadded1: boolean = false;

  MerchantdataSource!: MatTableDataSource<any>;
  MerchantdataSource1!: MatTableDataSource<any>;

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

  ParaArr1: Array<any> = [
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

  PChoiceStores: Array<any> = [];
  trendingStores: Array<any> = [];
  catarray:Array<any> = [];
  constructor(
    private router:Router,
    private api: ApiserviceService,
    private actRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.api
    .getnodeinterdata(this.actRoute.snapshot.params['nodeid'])
    .pipe(take(1))
    .subscribe((data: any) => {
        this.catarray = data[0].Catbanners != undefined ? data[0].Catbanners : [];
    });

    this.api.getPeoplechoiceCatstores(this.actRoute.snapshot.params['nodeid'],this.actRoute.snapshot.params['catid']).subscribe((data:any)=>{
      this.PChoiceStores = data;
    });
    this.api.gettrendingCatstores(this.actRoute.snapshot.params['nodeid'],this.actRoute.snapshot.params['catid']).subscribe((data:any)=>{
      this.trendingStores = data;
    });
  }

  ApplyFilter(i: number) {
    this.isstorealreadyadded = false;
    this.isstorealreadyadded1 = false;
    this.api
      .getRecentStores(
        1,
        false,
        i == 1 ? this.parameters : this.parameters1,
        i == 1 ? this.operators : this.operators1,
        i == 1 ? this.searchvalue :this.searchvalue1
      )
      .pipe(take(1))
      .subscribe((recentStore: any) => {
        if (i == 1) {
          this.MerchantdataSource = new MatTableDataSource(recentStore);
          this.isstorealreadyadded =
            this.PChoiceStores.findIndex((x) => x.id == recentStore[0].id) < 0
              ? false
              : true;
        } else {
          this.MerchantdataSource1 = new MatTableDataSource(recentStore);
          this.isstorealreadyadded =
            this.trendingStores.findIndex((x) => x.id == recentStore[0].id) < 0
              ? false
              : true;
        }
      });
  }

  action(i: number, Data: any) {
    if (i == 1) {
      Data.Nodeid = this.actRoute.snapshot.params['nodeid'];
      Data.catId = this.actRoute.snapshot.params['catid'];
      Data.iscat_subCatstore = 'Cat';
      this.api.addstoretoPeoplechoice(Data).then((data: any) => {
        this.isstorealreadyadded = true;
        this.PChoiceStores.push(Data);
        console.log(this.PChoiceStores);
        console.log('Store has been added in People choice section.');
      });
    } else {
      Data.Nodeid = this.actRoute.snapshot.params['nodeid'];
      Data.catId = this.actRoute.snapshot.params['catid'];
      Data.iscat_subCatstore = 'Cat';
      this.api.addstoretoTrendingStore(Data).then((data: any) => {
        this.isstorealreadyadded1 = true;
        this.trendingStores.push(Data);
        console.log(this.trendingStores);
        console.log('Store has been added in trending section.');
      });
    }
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

  gotointernal(){
    this.router.navigateByUrl("/VSAsubcatstores/"+this.actRoute.snapshot.params['nodeid']+"/"+this.actRoute.snapshot.params['catid'])
  }

  deletestore(i: number, id: string) {
    console.log(i);
    console.log(id);
    if (i == 1) {
      this.api.deletestorefrompeopleStore(id).then((data:any)=>{
        this.MerchantdataSource= new MatTableDataSource();
      });
    }
    else {
      this.api.deletestorefromTrendingStore(id).then((data:any)=>{
        this.MerchantdataSource1= new MatTableDataSource();
      });
    }
  }
}
