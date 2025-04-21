import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DietPlanService {
  private baseUrl = 'http://localhost:5209/api';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      console.error('No auth token found in localStorage');
      return new HttpHeaders();
    }
    return new HttpHeaders({
      Authorization: `Bearer ${authToken}`,
      'Content-Type': 'application/json'
    });
  }

  fetchImages(): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/recipes/all`, {}, { headers: this.getHeaders() });
  }
  

  saveDietPlan(body: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/diet_plan/save`, body, { headers: this.getHeaders() });
  }

  fetchSavedDietPlan(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/diet_plan/all`, { headers: this.getHeaders() });
  }

  deleteDietPlan(planId: string): Observable<any> {
  return this.http.delete(`${this.baseUrl}/diet_plan/delete${planId}`, { headers: this.getHeaders() });
  }

  getRecipeById(planId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/diet_plan/${planId}`, { headers: this.getHeaders() });
  }
  

  // updateDietPlan(dietPlanId: string, dietPlanData: any): Observable<any> {
  //   return this.http.put(`https://api.teknologiunggul.com/entities/diet_plan/${dietPlanId}`, dietPlanData);
  // }
  updateDietPlan(planId: string, dietPlanData: any): Observable<any> {
      return this.http.put(`${this.baseUrl}/diet_plan/update/${planId}`, dietPlanData, { headers: this.getHeaders() });
    }
  

}