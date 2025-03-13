import { Component, ChangeDetectorRef } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

export interface Receipe {
  position: number;
  image: string;
  name: string;
  id:string;
}

@Component({
  selector: 'app-receipe',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatMenuModule,MatIconModule,],
  templateUrl: './receipe.component.html',
  styleUrl: './receipe.component.css'
})
export class ReceipeComponent {
  displayedColumns: string[] = ['position', 'image', 'name', 'action'];
  dataSource: Receipe[] = [];
//   snackBar: any;
// deletereceipe: any;

  constructor(private http: HttpClient,
             private cdr: ChangeDetectorRef,
             private dialog: MatDialog,
             private router: Router) {}

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      console.error('No auth token found in localStorage');
      return;
    }

    const headers = {
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json'
    };

    console.log("Sending request with headers:", headers);

    this.http.post<any>('https://api.teknologiunggul.com/entities/filter/food_recipe', {}, { headers })
      .subscribe(
        (response) => {
          console.log('API Response:', response);

          if (!response || !response.data || response.data.length === 0) {
            console.warn('API returned null or empty data.');
            return;
          }

          const apiResponse = response.data[0]; // Get the first object inside "data" array
          if (!apiResponse.response || !Array.isArray(apiResponse.response)) {
            console.error(' Unexpected API response format. Expected an array inside data[0].response but got:', apiResponse);
            return;
          }

          // show only 10 list
          this.dataSource = apiResponse.response.slice(0, 10).map((item: any, index: number) => ({
            id: item._id,
            position: index + 1,
            image: item.content_asset_url || 'assets/default-image.png',
            name: item.name ?? 'Unknown Recipe'
          }));

          console.log(' Data successfully mapped:', this.dataSource);
        },
        (error) => {
          console.error(' Error fetching data:', error);
        }
      );
  }
   
   navigateToAddRecipe() {
    this.router.navigate(['/add-receipe']);
  }
  editRecipe(id: string) {
    this.router.navigate(['/add-receipe', id]);
  }
  deleteRecipe(recipeId: string) {
    if (!confirm('Are you sure you want to delete this recipe?')) {
      return;
    }
  
    const headers = {
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      'Content-Type': 'application/json'
    };
  
    this.http.delete(`https://api.teknologiunggul.com/entities/food_recipe/${recipeId}`, { headers })
      .subscribe(
        (response) => {
          console.log('deleted :', response);
          alert('Recipe deleted successfully!');
  
          //  Remove list in UI 
          this.dataSource = this.dataSource.filter(item => item.id !== recipeId);
          
          
          this.cdr.detectChanges();
        },
        (error) => {
          console.error('Error deleting recipe:', error);
          alert(`Failed to delete recipe: ${error.statusText}`);
        }
      );
  }
  
  
}
