import { Injectable } from '@angular/core';
import { Superhero } from '../models/superhero.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SuperheroService {
  private superheroes: Superhero[] = [];
  private superheroSubject = new BehaviorSubject<Superhero[]>(this.superheroes);
  superheroes$ = this.superheroSubject.asObservable();
  private nextId = 1;

  constructor() {}

  getAllSuperheroes() {
    return this.superheroSubject.asObservable();
  }

  getSuperheroById(id: number) {
    return this.superheroes.find(hero => hero.id === id);
  }

  searchSuperheroes(name: string) {
    return this.superheroes.filter(hero => hero.name.toLowerCase().includes(name.toLowerCase()));
  }

  addSuperhero(superhero: Superhero) {
    superhero.id = this.nextId++;
    this.superheroes.push(superhero);
    this.superheroSubject.next(this.superheroes);
  }

  updateSuperhero(updatedHero: Superhero) {
    const index = this.superheroes.findIndex(hero => hero.id === updatedHero.id);
    if (index !== -1) {
      this.superheroes[index] = updatedHero;
      this.superheroSubject.next(this.superheroes);
    }
  }

  deleteSuperhero(id: number) {
    this.superheroes = this.superheroes.filter(hero => hero.id !== id);
    this.superheroSubject.next(this.superheroes);
  }
}