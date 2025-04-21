import { Component } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import { AngularEditorModule, AngularEditorConfig } from '@kolkov/angular-editor';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeService } from './recipe.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-add-receipe',
  imports: [MatInputModule, MatFormFieldModule, FormsModule,
    MatSelectModule, MatIconModule, HttpClientModule, AngularEditorModule, CommonModule],
  templateUrl: './add-receipe.component.html',
  styleUrl: './add-receipe.component.css'
})
export class AddReceipeComponent {
  isEditMode: boolean = false;
  selectedFile: File | null = null;
  previewImage: string | ArrayBuffer | null = null;
  contentAssetUrl: string = ''; // Store uploaded image URL
  recipeId: string | null | undefined;

  recipeData = {
    name: '',
    description: '',
    unit_of_measurement: '',
    calories: '',
    frequecy: '',
    quantity: '',
    type: ''
  };

  constructor(private recipeService: RecipeService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.recipeId = params.get('id');
      this.isEditMode = !!this.recipeId;
      if (this.recipeId) this.loadRecipeData(this.recipeId);
    });
  }

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: 'auto',
    placeholder: 'Enter text here...'
  };

  navigateToRecipe() {
    this.router.navigate(['/receipe']);
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => this.previewImage = reader.result;
      reader.readAsDataURL(file);
    }
  }

  uploadImage() {
    if (!this.selectedFile) {
      alert("Please select an image first.");
      return;
    }

    this.recipeService.uploadImage(this.selectedFile).subscribe(
      (response) => {
        if (response && response.url) {
          this.contentAssetUrl = `http://localhost:5209${response.url}`;
          alert("Image uploaded successfully!");
        } else {
          alert("Upload successful, but no image URL returned.");
        }
      },
      (error) => alert(`Failed to upload image: ${error.statusText}`)
    );
  }

  saveRecipe() {
    if (!this.recipeData.name || !this.recipeData.description || !this.recipeData.unit_of_measurement) {
      alert("Please fill in all required fields.");
      return;
    }

    const recipePayload = {
      content_asset_type: "image",
      content_asset_url: this.contentAssetUrl,
      name: this.recipeData.name,
      description: this.recipeData.description,
      unit_of_measurement: this.recipeData.unit_of_measurement,
      calories: Number(this.recipeData.calories) || 0,
      frequecy: Number(this.recipeData.frequecy) || 0,
      quantity: Number(this.recipeData.quantity) || 0,
      type: this.recipeData.type
    };

    if (this.isEditMode && this.recipeId) {
      this.recipeService.updateRecipe(this.recipeId, recipePayload).subscribe(
        () => {
          alert("Recipe updated successfully!");
          // this.generatePDF();
          this.router.navigate(['/receipe']);
        },
        (error) => alert(`Failed to update recipe: ${error.statusText}`)
      );
    } else {
      this.recipeService.createRecipe(recipePayload).subscribe(
        () => {
          alert("Recipe saved successfully!");
          // this.generatePDF();
          this.resetForm();
        },
        (error) => alert(`Failed to save recipe: ${error.statusText}`)
      );
    }
  }

  resetForm() {
    this.recipeData = { name: '', description: '', unit_of_measurement: '', calories: '', frequecy: '', quantity: '', type: '' };
    this.selectedFile = null;
    this.previewImage = null;
    this.contentAssetUrl = '';

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }

  loadRecipeData(recipeId: string) {
    this.recipeService.getRecipeById(recipeId).subscribe(
      (response) => {
        if (!response || !response.data) {
          alert("No recipe data found.");
          return;
        }
  
        let recipe = Array.isArray(response.data) ? response.data[0] : response.data;
  
        this.recipeData = {
          name: recipe.name || '',
          description: recipe.description || '',
          unit_of_measurement: recipe.unit_of_measurement || '',
          calories: recipe.calories?.toString() || '',
          frequecy: recipe.frequecy?.toString() || '',
          quantity: recipe.quantity?.toString() || '',
          type: recipe.type || ''
        };
  
        this.contentAssetUrl = recipe.content_asset_url || 'assets/default-image.png';
  
        // preview image for edit
        this.previewImage = this.contentAssetUrl;
      },
      () => alert("Error loading recipe data.")
    );
  }
  
  generatePDF() {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('Recipe Details', 10, 10);
    doc.setFontSize(12);

    doc.text(`Name: ${this.recipeData.name}`, 10, 20);
    doc.text(`Description: ${this.recipeData.description}`, 10, 30);
    doc.text(`Unit: ${this.recipeData.unit_of_measurement}`, 10, 40);
    doc.text(`Calories: ${this.recipeData.calories}`, 10, 50);
    doc.text(`Frequency: ${this.recipeData.frequecy}`, 10, 60);
    doc.text(`Quantity: ${this.recipeData.quantity}`, 10, 70);
    doc.text(`Type: ${this.recipeData.type}`, 10, 80);

    if (this.contentAssetUrl) {
      const img = new Image();
      img.src = this.contentAssetUrl;
      img.onload = () => {
        doc.addImage(img, 'PNG', 10, 90, 50, 50);
        doc.save(`${this.recipeData.name}.pdf`);
      };
    } else {
      doc.save(`${this.recipeData.name}.pdf`);
    }
  }
}
