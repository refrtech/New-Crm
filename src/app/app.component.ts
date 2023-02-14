import { Component } from '@angular/core';
import { take } from 'rxjs';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'crm-main';
  constructor(private auth: AuthService) {
    this.getcat();
  }
  getcat() {
    this.auth.getCategoryList().pipe(take(1)).subscribe(cat => {
      this.auth.resource.categoryList = cat;
    })
  }
}
