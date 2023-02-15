import { NgModule } from '@angular/core';
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
import { NodemanagementComponent } from './components/clientside/nodemanagement/nodemanagement.component';
import { AddnodeComponent } from './components/clientside/nodemanagement/addnode/addnode.component';

// npm select
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { HomescreenComponent } from './components/clientside/homescreen/homescreen.component';
import { TopfeedmoduleComponent } from './components/clientside/homescreen/topfeedmodule/topfeedmodule.component';
import { FeedsectionComponent } from './components/clientside/homescreen/topfeedmodule/feedsection/feedsection.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { VisitsharemoduleComponent } from './components/clientside/homescreen/visitsharemodule/visitsharemodule.component';
import { VisitsharedetailsComponent } from './components/clientside/homescreen/visitsharemodule/visitsharedetails/visitsharedetails.component';
import { VisitallstoredetailsComponent } from './components/clientside/homescreen/visitsharemodule/visitallstoredetails/visitallstoredetails.component';
import { VisitaddstoredetailsComponent } from './components/clientside/homescreen/visitsharemodule/visitaddstoredetails/visitaddstoredetails.component';
import { VisiteditstoredetailsComponent } from './components/clientside/homescreen/visitsharemodule/visiteditstoredetails/visiteditstoredetails.component';
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

@NgModule({
  declarations: [
    AppComponent,
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
    VisitsharedetailsComponent,
    VisitallstoredetailsComponent,
    VisitaddstoredetailsComponent,
    VisiteditstoredetailsComponent,
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
  ],
  providers: [AngularFirestore],
  bootstrap: [AppComponent],
})
export class AppModule {}
