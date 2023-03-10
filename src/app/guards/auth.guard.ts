import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { map, Observable, take, tap } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    console.log('logged');

    return this.auth.user$.pipe(
      take(1),
      map((user) => {
        console.log('userz', user);
        return !!user;
      }), // <-- map to boolean
      tap((loggedIn) => {
        console.log('loggedIn', loggedIn);
        if (!loggedIn) {
          this.router.navigate(['']);
        }
      })
    );
  }
}
