import { Component, ViewChild, ChangeDetectorRef, HostListener } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { HttpClient } from '@angular/common/http';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
// import { AngularEditorModule } from '@kolkov/angular-editor';
// import { AngularEditorConfig } from '@kolkov/angular-editor';

import { DietPlanService } from './diet-plan.service';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-diet-plan',
  standalone: true,
  imports: [
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    MatCheckboxModule,
    MatButtonModule,
    MatSidenavModule,
    CommonModule,
    MatGridListModule,
    MatIconModule,
    MatMenuModule
  ],
  templateUrl: './diet-plan.component.html',
  styleUrl: './diet-plan.component.css'
})


export class DietPlanComponent {
  @ViewChild('drawer', { static: false }) drawer!: MatSidenav;
  selectedFoodType: string | null = null;
  selectedMeal: string | null = null;
  imageMatrix: { url: string; name: string; unit_of_measurement: string; quantity: number }[][] = [];
  meals: string[] = ['Breakfast', 'Lunch', 'Snacks', 'Dinner'];
  selectedMealImages: { [key: string]: { url: string; name: string; unit_of_measurement: string; quantity: number }[] } = {
    'Breakfast': [],
    'Lunch': [],
    'Snacks': [],
    'Dinner': []
  };
  Description!: string;
  Name!: string;

  constructor(private dietPlanService: DietPlanService, private cdr: ChangeDetectorRef) {}

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    if (this.drawer?.opened) {
      const clickedInsideSidenav = (event.target as HTMLElement).closest('.example-sidenav');
      if (!clickedInsideSidenav) {
        this.drawer.close();
      }
    }
  }

  toggleFoodType(foodType: string, event: any) {
    this.selectedFoodType = event.checked ? foodType : null;
  }

  selectMeal(meal: string) {
    this.selectedMeal = meal;
    this.fetchImages();
  }

  toggleImageSelection(item: { url: string; name: string; unit_of_measurement: string; quantity?: number }) {
    if (!this.selectedMeal) return;

    const mealImages = this.selectedMealImages[this.selectedMeal] ?? [];

    const existingIndex = mealImages.findIndex(i => i.url === item.url);

    if (existingIndex !== -1) {
      mealImages.splice(existingIndex, 1);
    } else {
      mealImages.push({
        url: item.url,
        name: item.name,
        unit_of_measurement: item.unit_of_measurement || 'CUP',
        quantity: item.quantity ?? 1
      });
    }
    // ---l
    this.updateSavedMealsList();
  }

  updateQuantity(meal: string, index: number, newQuantity: number) {
    if (newQuantity < 1) return;
    this.selectedMealImages[meal][index].quantity = newQuantity;
    this.cdr.detectChanges();
  }

  isImageSelected(item: { url: string }): boolean {
    return !!this.selectedMeal && this.selectedMealImages[this.selectedMeal].some(i => i.url === item.url);
  }



  
  fetchImages() {
    this.dietPlanService.fetchImages().subscribe(
      (response) => {
        console.log('API raw response:', response);
  
        const items = response ?? [];
        console.log('Filtered items before filtering:', items);
  
        let filteredList = items;
  
        // Apply selected food type filter
        if (this.selectedFoodType) {
          filteredList = filteredList.filter((item: any) => {
            const itemType = item.type?.toLowerCase() || '';
            return (
              (this.selectedFoodType === 'veg' && itemType.includes('vegetarian')) ||
              (this.selectedFoodType === 'nonveg' && itemType.includes('non vegetarian')) ||
              (this.selectedFoodType === 'cookies' &&
                (itemType.includes('deserts') || itemType.includes('cookies')))
            );
          });
        }
  
        // Apply meal type filter
        if (this.selectedMeal) {
          const selectedMealLower = this.selectedMeal.toLowerCase();
          filteredList = filteredList.filter((item: any) => {
            return !item.meal_time || item.meal_time.toLowerCase().includes(selectedMealLower);
          });
        }
  
        const imageList = filteredList.slice(0, 10).map((item: any) => {
          console.log('Image URL raw:', item.content_Asset_Url); // ✅ Correct casing!
  
          return {
            url: item.content_Asset_Url ?? 'assets/default-image.png',
            name: item.name || 'Unnamed',
            unit_of_measurement: item.unit_of_measurement || 'grams',
            quantity: item.quantity ?? 1
          };
        });
  
        console.log('Mapped image list:', imageList);
        console.log('Each item:', filteredList);
  
        this.imageMatrix = this.chunkArray(imageList, 3);
        console.log('Image matrix for display:', this.imageMatrix);
  
        if (this.drawer) {
          if (this.imageMatrix.length > 0) {
            setTimeout(() => {
              this.drawer.open();
              this.cdr.detectChanges();
            }, 200);
          } else {
            this.drawer.close();
          }
        } else {
          console.warn('Drawer not defined!');
        }
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }
  
  
  

  saveDietPlan() {
    if (!this.Name || !this.Description) {
      console.error('Name and Description are required');
      alert('name and description are required')
      return;
    }

    const dietPlan = Object.keys(this.selectedMealImages).flatMap(meal =>
      this.selectedMealImages[meal].map(item => ({
        content_id: this.extractContentId(item.url),
        unit_of_measurement: item.unit_of_measurement,
        meal_of_day: meal.toLowerCase(),
        quantity: item.quantity
      }))
    );

    const body = {
      name: this.Name,
      description: this.Description,
      items: dietPlan // <-- change from diet_plan
    };

    if (this.editMode && this.editingPlanId) {
      this.dietPlanService.updateDietPlan(this.editingPlanId, body).subscribe(
        () => {
          alert("Diet Plan updated successfully!");
          this.resetForm();
          this.showSavedMealsList = true;
          this.fetchSavedDietPlan();
          this.editMode = false; // Exit edit mode
        },
        (error) => {
          alert(`Failed to update diet plan: ${error.statusText}`);
        }
      );
    } else {
      this.dietPlanService.saveDietPlan(body).subscribe(
        (response) => {
          alert("Diet Plan saved successfully!");
          this.resetForm();
          this.showSavedMealsList = true;
          this.fetchSavedDietPlan();
        },
        (error) => {
          alert(`Failed to save diet plan: ${error.statusText}`);
        }
      );
    }
    
  }

  fetchSavedDietPlan() {
    this.dietPlanService.fetchSavedDietPlan().subscribe(
      (response) => {
        if (response?.data?.length > 0) {
          const lastSavedPlan = response.data[response.data.length - 1];
          console.log('Last saved diet plan:', lastSavedPlan);

          this.Name = lastSavedPlan.name || '';
          this.Description = lastSavedPlan.description || '';

          this.selectedMealImages = {};
          lastSavedPlan.diet_plan.forEach((item: any) => {
            const meal = item.meal_of_day.charAt(0).toUpperCase() + item.meal_of_day.slice(1);
            if (!this.selectedMealImages[meal]) this.selectedMealImages[meal] = [];
            this.selectedMealImages[meal].push({
              url: `https://api.teknologiunggul.com/content/${item.content_id}`,
              name: `Item ${item.content_id}`,
              unit_of_measurement: item.unit_of_measurement,
              quantity: item.quantity
            });
          });

          this.cdr.detectChanges();
        }
        
      },
      (error) => {
        console.error('Error fetching saved diet plan:');
      }
    );
  }

  extractContentId(url: string): number {
    const match = url.match(/\/(\d+)(?!.*\d)/); // Extract last number in the URL
    return match ? parseInt(match[1], 10) : 0;
  }

  ngOnInit() {
    this.fetchSavedDietPlan();
  }

  resetForm() {
    this.Name = '';
    this.Description = '';
    this.selectedMealImages = {
      'Breakfast': [],
      'Lunch': [],
      'Snacks': [],
      'Dinner': []
    };
    this.cdr.detectChanges();
  }

  cancelDietPlan() {
    this.resetForm();
  }

  chunkArray(arr: any[], size: number) {
    const result: any[][] = [];
    for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size));
    }
    return result;
  }

  // --------------
  showSavedMealsList: boolean = false; // Hide list initially
  savedMealsList: {
    id: any; no: number; url: string; name: string; mealType: string 
}[] = [];

  updateSavedMealsList() {
    this.savedMealsList = [];
    let counter = 1;
  
    Object.keys(this.selectedMealImages).forEach(meal => {
      this.selectedMealImages[meal].forEach(item => {
        const contentId = this.extractContentId(item.url); // Extract content_id from URL
  
        this.savedMealsList.push({
          id: contentId, // Ensure the ID is available
          no: counter++,
          url: item.url,
          name: item.name,
          mealType: meal
        });
      });
    });
  
  
    this.cdr.detectChanges();
  }
   
  // function to remove a meal from the saved list
  removeSavedMeal(index: number) {
    const planId = this.savedMealsList[index].id; 
  
    if (!confirm('Are you sure you want to delete this recipe?')) {
      return;
    }
  
    this.dietPlanService.deleteDietPlan(planId).subscribe(
      () => {
        alert('Recipe deleted successfully!');
        this.savedMealsList.splice(index, 1); // Remove from UI
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error deleting diet plan:', error);
        alert('Failed to delete recipe');
      }
    );
  }
  
  // ------------------.
editMode: boolean = false;
editingPlanId: string | null = null;

editDietPlan(planId: string) {
  this.editMode = true;
  this.editingPlanId = planId;
  console.log("Fetching diet plan for ID:", planId);
  
  this.dietPlanService.getRecipeById(planId).subscribe(
    (response) => {
      console.log("Full API Response:", response);

      if (!response || !response.data) {  
        alert("No data found for this plan ID.");
        return;
      }

      let plan = Array.isArray(response.data) ? response.data[0] : response.data;

      this.Name = plan.name || '';
      this.Description = plan.description || '';

      this.selectedMealImages = {};
      plan.diet_plan.forEach((item: any) => {
        const meal = item.meal_of_day.charAt(0).toUpperCase() + item.meal_of_day.slice(1);
        if (!this.selectedMealImages[meal]) this.selectedMealImages[meal] = [];
        this.selectedMealImages[meal].push({
          url: `http://localhost:5209/api/diet_plan/all${item.content_id}`,
          name: `Item ${item.content_id}`,
          unit_of_measurement: item.unit_of_measurement,
          quantity: item.quantity
        });
      });
      this.updateSavedMealsList();
      this.cdr.detectChanges();
    },
    (error) => {
      console.error("Error fetching diet plan:", error);
      alert("Erroe loading diet plan.");
    }
  );
}




}