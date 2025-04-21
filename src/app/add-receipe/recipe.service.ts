import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private baseUrl = 'http://localhost:5209';
  private recipeUrl = `${this.baseUrl}/api/recipes/save`;
  // private recipeUrlupdate = `http://localhost:5209/api/recipes/update`;

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
  // getRecipeById(recipeId: string): Observable<any> {
  //   return this.http.get(`${this.recipeUrl}/${recipeId}`, this.getHeaders());
  // }
  getRecipeById(recipeId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/recipes/${recipeId}`, this.getHeaders());
  }
  
  

  // Update  recipe
  updateRecipe(recipeId: string, recipeData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/api/recipes/update/${recipeId}`, recipeData, this.getHeaders());
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
      'http://localhost:5209/api/recipes/upload-image',formData,{ headers }
    );
  }
}
