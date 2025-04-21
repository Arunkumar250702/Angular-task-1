import { Component, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

export interface Receipe {
  position: number;
  image: string;
  name: string;
  id: string;
  content_Asset_Url?: string;
}

@Component({
  selector: 'app-receipe',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatMenuModule, MatIconModule],
  templateUrl: './receipe.component.html',
  styleUrl: './receipe.component.css'
})
export class ReceipeComponent {
  displayedColumns: string[] = ['position', 'image', 'name', 'action'];
  dataSource: Receipe[] = [];

  private readonly apiUrl = 'http://localhost:5209';

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef, private dialog: MatDialog, private router: Router) {}

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) return console.error('No auth token found');
  
    const headers = { 'Authorization': `Bearer ${authToken}`, 'Content-Type': 'application/json' };
    this.http.post<any[]>('http://localhost:5209/api/recipes/all', {}, { headers })  // Change type to any[] if needed
      .subscribe(
        response => {
          console.log("API Response:", response); // Debugging log
  
          this.dataSource = response.map((item, index) => ({
            id: item.id ?? null,
            position: index + 1,
            image: item.content_Asset_Url || 'assets/default-image.png',  // Use the correct field
            name: item.name ?? 'Unknown Recipe'
          }));
  
          console.log("Processed Data:", this.dataSource); // Debugging log
        },
        error => console.error('Error fetching data:', error)
      );
  }
  

  navigateToAddRecipe() {
    this.router.navigate(['/add-receipe']);
  }

  editRecipe(id: string) {
    this.router.navigate(['/add-receipe', id]);
  }

  deleteRecipe(recipeId: any) {
    const idNumber = Number(recipeId);
    if (!recipeId || isNaN(idNumber) || !confirm('Are you sure you want to delete this receipe?')) return;

    const headers = { 'Authorization': `Bearer ${localStorage.getItem('authToken')}`, 'Content-Type': 'application/json' };
    this.http.delete(`${this.apiUrl}/api/recipes/delete/${idNumber}`, { headers })
      .subscribe(
        () => {
          this.dataSource = this.dataSource.filter(item => Number(item.id) !== idNumber);
          this.cdr.detectChanges();
          alert('Receipe deleted successfully!');
        },
        error => {
          console.error('Error deleting receipe:', error);
          alert(`Failed to delete receipe: ${error.statusText}`);
        }
      );
  }
}
