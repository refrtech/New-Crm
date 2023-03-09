import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrandSpotlightComponent } from './components/clientside/homescreen/brand-spotlight/brand-spotlight.component';
import { BrandsdetailComponent } from './components/clientside/homescreen/brandsneighbourhood/brandsdetail/brandsdetail.component';
import { BrandsneighbourhoodComponent } from './components/clientside/homescreen/brandsneighbourhood/brandsneighbourhood.component';
import { BrandsstoreComponent } from './components/clientside/homescreen/brandsneighbourhood/brandsstore/brandsstore.component';
import { DaildropsbrandsComponent } from './components/clientside/homescreen/dailydrops/daildropsbrands/daildropsbrands.component';
import { DailydropsComponent } from './components/clientside/homescreen/dailydrops/dailydrops.component';
import { HomegrowbrandsComponent } from './components/clientside/homescreen/homegrowbrands/homegrowbrands.component';
import { HbnodescatComponent } from './components/clientside/homescreen/homegrowbrands/internalsection/hbnodescat/hbnodescat.component';
import { HgbcreatecategoryComponent } from './components/clientside/homescreen/homegrowbrands/internalsection/hgbcreatecategory/hgbcreatecategory.component';
import { HgbnodecatstoresComponent } from './components/clientside/homescreen/homegrowbrands/internalsection/hgbnodecatstores/hgbnodecatstores.component';
import { HomescreenComponent } from './components/clientside/homescreen/homescreen.component';
import { AddinfoslideComponent } from './components/clientside/homescreen/informationslide/addinfoslide/addinfoslide.component';
import { InformationslideComponent } from './components/clientside/homescreen/informationslide/informationslide.component';
import { NewstoredetailsComponent } from './components/clientside/homescreen/newstoreinhood/newstoredetails/newstoredetails.component';
import { NewstoreinhoodComponent } from './components/clientside/homescreen/newstoreinhood/newstoreinhood.component';
import { FeedsectionComponent } from './components/clientside/homescreen/topfeedmodule/feedsection/feedsection.component';
import { TopfeedmoduleComponent } from './components/clientside/homescreen/topfeedmodule/topfeedmodule.component';
import { VisitaddstoredetailsComponent } from './components/clientside/homescreen/visitsharemodule/visitaddstoredetails/visitaddstoredetails.component';
import { VisitallstoredetailsComponent } from './components/clientside/homescreen/visitsharemodule/visitallstoredetails/visitallstoredetails.component';
import { VSAnodecatstoresComponent } from './components/clientside/homescreen/visitsharemodule/visitallstoredetails/vsanodescat/vsanodecatstores/vsanodecatstores.component';
import { VSAnodescatComponent } from './components/clientside/homescreen/visitsharemodule/visitallstoredetails/vsanodescat/vsanodescat.component';
import { VisiteditstoredetailsComponent } from './components/clientside/homescreen/visitsharemodule/visiteditstoredetails/visiteditstoredetails.component';
import { VisitsharemoduleComponent } from './components/clientside/homescreen/visitsharemodule/visitsharemodule.component';
import { NodemanagementCitysComponent } from './components/clientside/nodemanagement-citys/nodemanagement-citys.component';
import { AddnodeComponent } from './components/clientside/nodemanagement-citys/nodemanagement/addnode/addnode.component';
import { NodemanagementComponent } from './components/clientside/nodemanagement-citys/nodemanagement/nodemanagement.component';
import { AddcityAndAreaComponent } from './components/clientside/setting/addcity-and-area/addcity-and-area.component';
import { SettingComponent } from './components/clientside/setting/setting.component';
import { CategorysectioninternalComponent } from './components/internalsection/homegrownbrands/categorysectioninternal/categorysectioninternal.component';
import { HomegrownbrandsComponent } from './components/internalsection/homegrownbrands/homegrownbrands.component';
import { InternalsectionComponent } from './components/internalsection/internalsection.component';
import { VisitshareinternalComponent } from './components/internalsection/visitshareinternal/visitshareinternal.component';
import { DashboardComponent } from './components/tabs/dashboard/dashboard.component';
import { MerchantsProfileComponent } from './components/tabs/merchants/merchants-profile/merchants-profile.component';
import { MerchantsComponent } from './components/tabs/merchants/merchants.component';
import { NotificationComponent } from './components/tabs/notification/notification.component';
import { OrdersComponent } from './components/tabs/orders/orders.component';
import { RedeemreqComponent } from './components/tabs/redeemreq/redeemreq.component';
import { TabsComponent } from './components/tabs/tabs.component';
import { TransactionComponent } from './components/tabs/transaction/transaction.component';
import { UserProfileComponent } from './components/tabs/users/user-profile/user-profile.component';
import { UsersComponent } from './components/tabs/users/users.component';
import { WebsiteformComponent } from './components/tabs/websiteform/websiteform.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', component: WelcomeComponent },

  {
    path: '',
    component: TabsComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: '/dash', pathMatch: 'full' },
      { path: 'dash', component: DashboardComponent, canActivate: [AuthGuard] },

      {
        path: 'websiteform',
        component: WebsiteformComponent,
        canActivate: [AuthGuard],
      },
      { path: 'orders', component: OrdersComponent, canActivate: [AuthGuard] },
      {
        path: 'merchant',
        component: MerchantsComponent,
        canActivate: [AuthGuard],
      },
      { path: 'users', component: UsersComponent, canActivate: [AuthGuard] },
      {
        path: 'merchantProfile/:id',
        component: MerchantsProfileComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'userProfile/:id',
        component: UserProfileComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'Redeemreq',
        component: RedeemreqComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'transaction',
        component: TransactionComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'Notification',
        component: NotificationComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'nodemanage/:id',
        component: NodemanagementComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'addnode/:id',
        component: AddnodeComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'homescreen',
        component: HomescreenComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'feedmodule',
        component: TopfeedmoduleComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'feedsection',
        component: FeedsectionComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'visitmodule',
        component: VisitsharemoduleComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'storedetails/:id',
        component: VisitallstoredetailsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'addstore',
        component: VisitaddstoredetailsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'visit_editstore',
        component: VisiteditstoredetailsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'brands',
        component: BrandsneighbourhoodComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'homebrands',
        component: HomegrowbrandsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'internalsec',
        component: InternalsectionComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'homegrownintsec',
        component: HomegrownbrandsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'categorysec',
        component: CategorysectioninternalComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'settings',
        component: SettingComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'addcityarea/:id',
        component: AddcityAndAreaComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'visitshareinternal',
        component: VisitshareinternalComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'infoslide',
        component: InformationslideComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'addinfoslide',
        component: AddinfoslideComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'brandspotlight',
        component: BrandSpotlightComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'nodebrands',
        component: BrandsdetailComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'storebrands',
        component: BrandsstoreComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'newstoreinyourhood',
        component: NewstoreinhoodComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'newstoreinyourhooddetails',
        component: NewstoredetailsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'dailydrops',
        component: DailydropsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'dailydropsbrands',
        component: DaildropsbrandsComponent,
        canActivate: [AuthGuard],
      },
      { path: 'Nodecity', component: NodemanagementCitysComponent },
      {
        path: 'VSAcat',
        component: VSAnodescatComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'VSAcatstores',
        component: VSAnodecatstoresComponent,
        canActivate: [AuthGuard],
      },

      {
        path: 'HGBcat',
        component: HbnodescatComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'HGBcreatecat',
        component: HgbcreatecategoryComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'HGBcreatecat',
        component: HgbcreatecategoryComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'HGBcatstores',
        component: HgbnodecatstoresComponent,
        canActivate: [AuthGuard],
      },
    ],
  },

  // { path: 'welcome', component: WelcomeComponent },
  // { path: '404', component: WelcomeComponent },
  // { path: '**', redirectTo: '/404' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
