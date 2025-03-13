import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private baseUrl = 'https://api.teknologiunggul.com';
  private recipeUrl = `${this.baseUrl}/entities/food_recipe`;

  constructor(private http: HttpClient) {}

  private getHeaders() {
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'orgID': 'intern_test',
        'Content-Type': 'application/json'
      })
    };
  }

  // Create  new recipe
  createRecipe(recipeData: any): Observable<any> {
    return this.http.post(this.recipeUrl, recipeData, this.getHeaders());
  }

  //Get  recipe id
  getRecipeById(recipeId: string): Observable<any> {
    return this.http.get(`${this.recipeUrl}/${recipeId}`, this.getHeaders());
  }

  // Update  recipe
  updateRecipe(recipeId: string, recipeData: any): Observable<any> {
    return this.http.put(`${this.recipeUrl}/${recipeId}`, recipeData, this.getHeaders());
  }

  // Upload image
  uploadImage(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    const headers = {
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      'orgID': 'intern_test'
    };

    return this.http.post<any>(
      'https://api.teknologiunggul.com/file/intern/Food',formData,{ headers }
    );
  }
}
