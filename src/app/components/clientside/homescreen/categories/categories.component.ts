import { Component, OnInit } from '@angular/core';
import { Observable, of, take } from 'rxjs';
import { ApiserviceService } from 'src/app/apiservice.service';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
  Selectedcity: string = '';
  Selectednode: string = '';
  cityList$: Observable<any[]> = of();
  nodes$: Observable<any[]> = of();

  constructor(
    public auth: AuthService,
    public api: ApiserviceService,
    ) { }

  ngOnInit(): void {
    this.getallcity();
  }

  getallcity() {
    this.cityList$ = this.api.getcity().pipe(take(1));
  }

  citychange() {
    this.api
      .getNodeDataaspercity(this.Selectedcity)
      .pipe(take(1))
      .subscribe((data: any) => {
        this.nodes$ = of(data);
      });
  }
}
