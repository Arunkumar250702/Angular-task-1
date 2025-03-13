import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app.component';  
import { InterceptorService } from './services/interceptor.service';

@NgModule({
  
  imports: [
    BrowserModule, 
    FormsModule, 
    HttpClientModule,
    AppComponent,  
  ],
  // providers: [
  //   { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true }
  // ],
  bootstrap: [] 
})
export class AppModule {}
