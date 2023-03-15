import { Component, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TabsComponent } from './components/tabs/tabs.component';
import { MatmodulesModule } from './materialmodules/matmodules/matmodules.module';
import { OrdersComponent } from './components/tabs/orders/orders.component';
import { DashboardComponent } from './components/tabs/dashboard/dashboard.component';
import { MerchantsComponent } from './components/tabs/merchants/merchants.component';
import { MerchantsProfileComponent } from './components/tabs/merchants/merchants-profile/merchants-profile.component';
import { UsersComponent } from './components/tabs/users/users.component';
import { UserProfileComponent } from './components/tabs/users/user-profile/user-profile.component';
import { RedeemreqComponent } from './components/tabs/redeemreq/redeemreq.component';
import { TransactionComponent } from './components/tabs/transaction/transaction.component';
import { TransactionDetailsComponent } from './components/tabs/transaction-details/transaction-details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {
  provideFirebaseApp,
  getApp,
  initializeApp,
  FirebaseApp,
} from '@angular/fire/app';
import { provideAuth, initializeAuth } from '@angular/fire/auth';
import {
  provideFirestore,
  getFirestore,
  enableIndexedDbPersistence,
  connectFirestoreEmulator,
} from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { getMessaging, provideMessaging } from '@angular/fire/messaging';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {
  indexedDBLocalPersistence,
  browserPopupRedirectResolver,
} from 'firebase/auth';
import { MatRadioModule } from '@angular/material/radio';
import { NotificationComponent } from './components/tabs/notification/notification.component';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { WebsiteformComponent } from './components/tabs/websiteform/websiteform.component';
import { QrViewerComponent } from './components/tabs/merchants/merchants-profile/qr-viewer/qr-viewer.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { NodemanagementComponent } from './components/clientside/nodemanagement-citys/nodemanagement/nodemanagement.component';
import { AddnodeComponent } from './components/clientside/nodemanagement-citys/nodemanagement/addnode/addnode.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { HomescreenComponent } from './components/clientside/homescreen/homescreen.component';
import { TopfeedmoduleComponent } from './components/clientside/homescreen/topfeedmodule/topfeedmodule.component';
import { FeedsectionComponent } from './components/clientside/homescreen/topfeedmodule/feedsection/feedsection.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { VisitsharemoduleComponent } from './components/clientside/homescreen/visitsharemodule/visitsharemodule.component';
import { VisitallstoredetailsComponent } from './components/clientside/homescreen/visitsharemodule/visitallstoredetails/visitallstoredetails.component';
import { VisitaddstoredetailsComponent } from './components/clientside/homescreen/visitsharemodule/visitaddstoredetails/visitaddstoredetails.component';
import { BrandsneighbourhoodComponent } from './components/clientside/homescreen/brandsneighbourhood/brandsneighbourhood.component';
import { HomegrowbrandsComponent } from './components/clientside/homescreen/homegrowbrands/homegrowbrands.component';
import { HomegrownbrandsComponent } from './components/internalsection/homegrownbrands/homegrownbrands.component';
import { InternalsectionComponent } from './components/internalsection/internalsection.component';
import { CategorysectioninternalComponent } from './components/internalsection/homegrownbrands/categorysectioninternal/categorysectioninternal.component';
import { VisitshareinternalComponent } from './components/internalsection/visitshareinternal/visitshareinternal.component';
import { SettingComponent } from './components/clientside/setting/setting.component';
import { AddcityAndAreaComponent } from './components/clientside/setting/addcity-and-area/addcity-and-area.component';
import { InformationslideComponent } from './components/clientside/homescreen/informationslide/informationslide.component';
import { AddinfoslideComponent } from './components/clientside/homescreen/informationslide/addinfoslide/addinfoslide.component';
import { BrandsdetailComponent } from './components/clientside/homescreen/brandsneighbourhood/brandsdetail/brandsdetail.component';
import { BrandsstoreComponent } from './components/clientside/homescreen/brandsneighbourhood/brandsstore/brandsstore.component';
import { NewstoreinhoodComponent } from './components/clientside/homescreen/newstoreinhood/newstoreinhood.component';
import { NewstoredetailsComponent } from './components/clientside/homescreen/newstoreinhood/newstoredetails/newstoredetails.component';
import { DailydropsComponent } from './components/clientside/homescreen/dailydrops/dailydrops.component';
import { DaildropsbrandsComponent } from './components/clientside/homescreen/dailydrops/daildropsbrands/daildropsbrands.component';
import { BrandSpotlightComponent } from './components/clientside/homescreen/brand-spotlight/brand-spotlight.component';
import { CropperComponent } from './placeholders/cropper/cropper.component';
import { ContentComponent } from './placeholders/content/content.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { NodemanagementCitysComponent } from './components/clientside/nodemanagement-citys/nodemanagement-citys.component';
import { StoresinhoodComponent } from './components/clientside/homescreen/newstoreinhood/storesinhood/storesinhood.component';
import { VSAnodescatComponent } from './components/clientside/homescreen/visitsharemodule/vsanodescat/vsanodescat.component';
import { VSAnodecatstoresComponent } from './components/clientside/homescreen/visitsharemodule/vsanodescat/vsanodecatstores/vsanodecatstores.component';
import { VSAnodesubcatstoresComponent } from './components/clientside/homescreen/visitsharemodule/vsanodescat/vsanodecatstores/vsanodesubcatstores/vsanodesubcatstores.component';
import { HgbcreatecategoryComponent } from './components/clientside/homescreen/homegrowbrands/internalsection/hgbcreatecategory/hgbcreatecategory.component';
import { HgbnodecatstoresComponent } from './components/clientside/homescreen/homegrowbrands/internalsection/hgbnodecatstores/hgbnodecatstores.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { SignComponent } from './components/welcome/sign/sign.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { AuthService } from './auth.service';
import { DependencyService } from './dependency.service';
import { ThemeService } from './theme.service';
import { take } from 'rxjs';
import { HgbnodesubcatstoresComponent } from './components/clientside/homescreen/homegrowbrands/internalsection/hgbnodecatstores/hgbnodesubcatstores/hgbnodesubcatstores.component';

@NgModule({
  declarations: [
    AppComponent,
    HgbnodesubcatstoresComponent,
    TabsComponent,
    OrdersComponent,
    DashboardComponent,
    MerchantsComponent,
    MerchantsProfileComponent,
    UsersComponent,
    UserProfileComponent,
    RedeemreqComponent,
    TransactionComponent,
    WebsiteformComponent,
    TransactionDetailsComponent,
    QrViewerComponent,
    NotificationComponent,
    NodemanagementComponent,
    AddnodeComponent,
    HomescreenComponent,
    TopfeedmoduleComponent,
    FeedsectionComponent,
    VisitsharemoduleComponent,
    VisitallstoredetailsComponent,
    VisitaddstoredetailsComponent,
    BrandsneighbourhoodComponent,
    HomegrowbrandsComponent,
    HomegrownbrandsComponent,
    InternalsectionComponent,
    CategorysectioninternalComponent,
    VisitshareinternalComponent,
    SettingComponent,
    AddcityAndAreaComponent,
    InformationslideComponent,
    AddinfoslideComponent,
    BrandsdetailComponent,
    BrandsstoreComponent,
    NewstoreinhoodComponent,
    NewstoredetailsComponent,
    DailydropsComponent,
    DaildropsbrandsComponent,
    BrandSpotlightComponent,
    NodemanagementCitysComponent,
    CropperComponent,
    ContentComponent,
    StoresinhoodComponent,
    VSAnodescatComponent,
    VSAnodecatstoresComponent,
    VSAnodesubcatstoresComponent,
    HgbcreatecategoryComponent,
    HgbnodecatstoresComponent,
    WelcomeComponent,
    SignComponent,
  ],
  imports: [
    MatDialogModule,
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatmodulesModule,
    MatCheckboxModule,
    FormsModule,
    ReactiveFormsModule,
    MatRadioModule,
    MatExpansionModule,
    NgxDropzoneModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireModule,
    // 3. Initialize
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    //provideFirestore(() => getFirestore()),
    provideFirestore(() => {
      const firestore = getFirestore();
      //connectFirestoreEmulator(firestore, 'localhost', 8080);
      enableIndexedDbPersistence(firestore);
      return firestore;
    }),
    provideAuth(() =>
      initializeAuth(getApp(), {
        persistence: indexedDBLocalPersistence,
        popupRedirectResolver: browserPopupRedirectResolver,
      })
    ),
    provideStorage(() => getStorage()),
    provideMessaging(() => getMessaging()),
    NgMultiSelectDropDownModule.forRoot(),
    ImageCropperModule,
  ],
  providers: [AngularFirestore],
  bootstrap: [AppComponent],
})
export class AppModule {
  title = 'Refr';
  showWarn = false;

  constructor(
    public auth: AuthService,
    public depends: DependencyService,
    public themeService: ThemeService,
    private bottomSheet: MatBottomSheet
  ) {
    this.themeService.load();
    this.internetChecks();
  }

  async executeApp(cX: string) {
    // Hide the splash (you should do this on app launch)
    //await SplashScreen.hide();
    // Display content under transparent status bar (Android only)
    //StatusBar.setOverlaysWebView({ overlay: true });
    //await StatusBar.setStyle({ style: Style.Dark });
    // await StatusBar.setStyle({ style: Style.Light });
    //await StatusBar.setStyle({ style: Style.Default });
    // await StatusBar.setBackgroundColor({color:cX})
    //await StatusBar.hide();
  }

  internetChecks() {
    let firstTry = false;
    this.auth.resource
      .internetConnected()
      .then((res) => {
        if (!res) {
          this.showWarn = true;
          console.log('No Internet...');
          this.auth.resource.startSnackBar('No Internet...');
        } else {
          //this.showWarn = true;
          setTimeout(
            () => {
              this.showWarn = false;
              if (!firstTry) {
                firstTry = true;
                this.execute();
              }
            },
            !firstTry ? 1000 : 3000
          );
        }
      })
      .catch((err) => {
        console.log('No Internet...');
        this.auth.resource.startSnackBar('No Internet: ' + err);
      });
  }

  execute() {
    if (this.auth.resource.appMode && environment.production) {
      //this.executeApp("#512DA8");
    }
    // Setup Data for resources
    //this.auth.resource.onlineOffline().pipe(take(1)).subscribe(net => {
    //if( net ){
    this.depends
      .getState() /*.pipe(take(1))*/
      .subscribe((getStateRes: any) => {
        // {
        //   vr: 101.1,
        //   web:1.1, andi: 1.1, ios: 1.1,
        //   env: enviroment.prod,
        //   code:"Albatrosses", date: 1644195271637
        // }
        if (
          !getStateRes ||
          getStateRes.vr > environment.refrBot.vr ||
          (!this.auth.resource.appMode &&
            getStateRes.web > environment.refrBot.web) ||
          (this.auth.resource.appMode &&
            getStateRes.andi > environment.refrBot.andi)
          // getStateRes.ios > environment.ios
        ) {
          // vr check
          // device check
          // os check
          this.auth.resource.updateAvil = true;
          this.openBottomSheet(getStateRes);
          this.themeService.update(
            this.themeService.colorScheme == 'dark' ? 'light' : 'light'
          );
        } else {
          this.auth.resource.foreignMarks = getStateRes.markets;
          this.auth.resource.merchandiseList = getStateRes.merchandise;
          this.auth.resource.campaignPlans = getStateRes.campaignPlans;
          console.log('category1');

          this.auth
            .getCategoryList()
            .pipe(take(1))
            .subscribe((cat) => {
              console.log('category');
              console.log(cat);
              this.auth.resource.categoryList = cat;
            });
        }
      });
    //}else{

    //}
    //})
  }

  openBottomSheet(data: any): void {
    // let isPhone = this.auth.resource.getWidth < 768;
    // let w = isPhone ? this.auth.resource.getWidth + "px" : "480px";
    // let h = isPhone ? this.auth.resource.getHeight + "px" : "";

    this.bottomSheet.open(BottomSheetUpdate, {
      data: data,
      panelClass: 'bottomSheetClassUpdate',
      hasBackdrop: true,
      disableClose: true,
    });
  }
}

@Component({
  selector: 'bottom-sheet-update',
  templateUrl: './tasks/bottom-sheet-update.html',
})
export class BottomSheetUpdate {
  constructor(public auth: AuthService) {}
}
