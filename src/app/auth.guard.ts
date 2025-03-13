// import { Injectable } from '@angular/core';
// import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

// @Injectable({
//   providedIn: 'root',
// })
// export class AuthGuard implements CanActivate {
//   constructor(private router: Router) {}

//   canActivate(
//     route: ActivatedRouteSnapshot,
//     state: RouterStateSnapshot
//   ): boolean {
//     const isAuthenticated = !!localStorage.getItem('token'); // Check if token exists

//     if (!isAuthenticated) {
//       this.router.navigate(['/login']); // Redirect to login if not authenticated
//       return false;
//     }

//     return true; // Allow access if authenticated
//   }
// }
