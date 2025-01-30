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
    // Si estamos editando un héroe, cargamos su información
    const heroId = this.route.snapshot.paramMap.get('id');
    if (heroId) {
      this.heroService.getHeroById(Number(heroId)).subscribe(hero => {
        this.hero = hero;
        this.heroForm.patchValue(hero);
      });
    }
  }

  onSubmit() {
    if (this.heroForm.valid) {
      if (this.hero) {
        // Si estamos editando un héroe, actualizamos
        const updatedHero = { ...this.hero, ...this.heroForm.value };
        this.heroService.updateHero(updatedHero);
      } else {
        // Si estamos agregando un nuevo héroe
        const newHero = { ...this.heroForm.value, id: this.generateNewId() }; // Generamos un ID para el nuevo héroe
        this.heroService.addHero(newHero);
      }

      // Redirigimos a la lista de héroes después de agregar o actualizar
      this.router.navigate(['/heroes']);
    }
  }

  onCancel() {
    this.cancel.emit();
    this.router.navigate(['/heroes']); // Redirige a la lista de héroes al cancelar
  }

  private generateNewId(): number {
    // Generamos un nuevo ID para el nuevo héroe basado en el mayor ID actual + 1
    const maxId = Math.max(...this.heroService.getHeroesSnapshot().map(hero => hero.id), 0); 
    return maxId + 1;
  }  
  
}