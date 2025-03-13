import { Component } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import { RouterOutlet } from '@angular/router';
// import { ReceipeComponent } from '../receipe/receipe.component';
// import { DietPlanComponent } from '../diet-plan/diet-plan.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone:true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule,MatSidenavModule,
    MatListModule,RouterOutlet],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
   constructor(private router:Router){}
  // showFiller = false;
  navigatereceipe(){
    this.router.navigate(['/receipe']);
  }
  navigatelogin(){
    this.router.navigate(['/login']);
  }
  navigatedietplan(){
    this.router.navigate(['/diet-plan']);
  }
}
