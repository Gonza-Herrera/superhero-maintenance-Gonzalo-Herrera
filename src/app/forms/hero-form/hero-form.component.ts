import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Hero } from '../../models/superhero.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { ActivatedRoute, Router } from '@angular/router';
import { HeroService } from '../../services/superhero.service';

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

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private heroService: HeroService,
    private router: Router
  ) {
    this.heroForm = this.fb.group({
      name: ['', Validators.required],
      power: ['', Validators.required]
    });
  }

  ngOnInit() {
    const heroId = this.route.snapshot.paramMap.get('id');
    if (heroId) {
      this.heroService.getHeroById(Number(heroId)).subscribe(hero => {
        this.hero = hero;
        this.heroForm.patchValue(hero);
      });
    }
  }

  onSubmit() {
    if (this.heroForm.valid && this.hero) {
      // Actualizamos los datos del héroe en el HeroService
      const updatedHero = { ...this.hero, ...this.heroForm.value };
      this.heroService.updateHero(updatedHero);

      // Redirigimos a la lista de héroes después de la actualización
      this.router.navigate(['/heroes']);
    }
  }

  onCancel() {
    this.cancel.emit();
    this.router.navigate(['/heroes']);
  }
}