import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrandsneighbourhoodComponent } from './components/clientside/homescreen/brandsneighbourhood/brandsneighbourhood.component';
import { HomegrowbrandsComponent } from './components/clientside/homescreen/homegrowbrands/homegrowbrands.component';
import { HomescreenComponent } from './components/clientside/homescreen/homescreen.component';
import { FeedsectionComponent } from './components/clientside/homescreen/topfeedmodule/feedsection/feedsection.component';
import { TopfeedmoduleComponent } from './components/clientside/homescreen/topfeedmodule/topfeedmodule.component';
import { VisitaddstoredetailsComponent } from './components/clientside/homescreen/visitsharemodule/visitaddstoredetails/visitaddstoredetails.component';
import { VisitallstoredetailsComponent } from './components/clientside/homescreen/visitsharemodule/visitallstoredetails/visitallstoredetails.component';
import { VisiteditstoredetailsComponent } from './components/clientside/homescreen/visitsharemodule/visiteditstoredetails/visiteditstoredetails.component';
import { VisitsharedetailsComponent } from './components/clientside/homescreen/visitsharemodule/visitsharedetails/visitsharedetails.component';
import { VisitsharemoduleComponent } from './components/clientside/homescreen/visitsharemodule/visitsharemodule.component';
import { AddnodeComponent } from './components/clientside/nodemanagement/addnode/addnode.component';
import { NodemanagementComponent } from './components/clientside/nodemanagement/nodemanagement.component';
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

const routes: Routes = [
  {
    path: '',
    component: TabsComponent,
    children: [
      { path: '', redirectTo: '/Dash', pathMatch: 'full' },
      { path: 'websiteform', component: WebsiteformComponent },
      { path: 'orders', component: OrdersComponent },
      { path: 'Dash', component: DashboardComponent },
      { path: 'merchant', component: MerchantsComponent },
      { path: 'users', component: UsersComponent },
      { path: 'merchantProfile/:id', component: MerchantsProfileComponent },
      { path: 'userProfile/:id', component: UserProfileComponent },
      { path: 'Redeemreq', component: RedeemreqComponent },
      { path: 'transaction', component: TransactionComponent },
      { path: 'Notification', component: NotificationComponent },
      { path: 'nodemanage',component: NodemanagementComponent},
      { path: 'addnode/:id', component: AddnodeComponent },
      { path: 'homescreen', component: HomescreenComponent },
      { path: 'feedmodule', component: TopfeedmoduleComponent },
      { path: 'feedsection', component: FeedsectionComponent },
      { path: 'visitmodule', component: VisitsharemoduleComponent },
      { path: 'visitdetails', component: VisitsharedetailsComponent },
      { path: 'storedetails/:id', component: VisitallstoredetailsComponent },
      { path: 'addstore', component: VisitaddstoredetailsComponent },
      { path: 'visit_editstore', component: VisiteditstoredetailsComponent },
      { path: 'brands', component: BrandsneighbourhoodComponent },
      { path: 'homebrands', component: HomegrowbrandsComponent },
      { path: 'internalsec', component: InternalsectionComponent },
      { path: 'homegrownintsec', component: HomegrownbrandsComponent },
      { path: 'categorysec', component: CategorysectioninternalComponent },
      { path: 'settings', component: SettingComponent },
      { path: 'addcityarea/:id', component: AddcityAndAreaComponent },
      { path: 'visitshareinternal', component: VisitshareinternalComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
