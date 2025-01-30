import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Hero } from '../../models/superhero.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';

@Component({
  selector: 'app-hero-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule],
  templateUrl: './hero-form.component.html',
  styleUrl: './hero-form.component.scss'
})
export default class HeroFormComponent {
  @Input() hero: Hero | null = null;
  @Output() save = new EventEmitter<Hero>();
  @Output() cancel = new EventEmitter<void>();
  heroForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.heroForm = this.fb.group({
      name: ['', Validators.required],
      power: ['', Validators.required]
    });
  }

  ngOnInit() {
    if (this.hero) {
      this.heroForm.patchValue(this.hero);
    }
  }

  onSubmit() {
    if (this.heroForm.valid) {
      this.save.emit(this.heroForm.value);
    }
  }

  onCancel() {
    this.cancel.emit();
  }
}
