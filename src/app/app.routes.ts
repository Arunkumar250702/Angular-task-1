import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReceipeComponent } from './receipe/receipe.component';
import { DietPlanComponent } from './diet-plan/diet-plan.component';
import { NavbarComponent } from './navbar/navbar.component';
import { LoginComponent } from './login/login.component';
import { AddReceipeComponent } from './add-receipe/add-receipe.component';


// export const routes: Routes = [
//   { path: 'receipe', component: ReceipeComponent },
//   { path: 'add-receipe', component: AddReceipeComponent },
//   { path: 'add-receipe/:id', component: AddReceipeComponent },
//   { path: 'diet-plan', component: DietPlanComponent },
//   { path: 'navbar', component: NavbarComponent },
//   { path: '', component: LoginComponent },
//   { path: 'login', component: LoginComponent },
//   // { path: '', redirectTo: '/login', pathMatch: 'full' },
// ];

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  {
    path: '', component: NavbarComponent ,
    children:[
      { path: 'receipe', component: ReceipeComponent },
      { path: 'add-receipe', component: AddReceipeComponent },
      { path: 'add-receipe/:id', component: AddReceipeComponent },
      { path: 'diet-plan', component: DietPlanComponent },
      { path: 'diet-plan/:id', component: DietPlanComponent },
      // { path: 'navbar', component: NavbarComponent },
    ]
  }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
