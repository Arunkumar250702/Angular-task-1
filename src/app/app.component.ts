import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppModule } from './app.module';
import { HttpClientModule } from '@angular/common/http';



@Component({
  selector: 'app-root',
  standalone:true,
  imports: [HttpClientModule,RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'task1';
}
