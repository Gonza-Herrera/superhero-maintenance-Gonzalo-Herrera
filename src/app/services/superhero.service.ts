import { Injectable } from '@angular/core';
import { Hero } from '../models/superhero.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HeroService {
  private heroes: Hero[] = [
    { id: 1, name: 'Spiderman', power: 'Web-slinging' },
    { id: 2, name: 'Superman', power: 'Super strength' },
    { id: 3, name: 'Manolito el fuerte', power: 'Indestructible' }
  ];
  
  private heroesSubject = new BehaviorSubject<Hero[]>(this.heroes);

  getHeroes(): Observable<Hero[]> {
    return this.heroesSubject.asObservable();
  }

  getHeroById(id: number): Hero | undefined {
    return this.heroes.find(hero => hero.id === id);
  }

  searchHeroes(query: string): Hero[] {
    return this.heroes.filter(hero => hero.name.toLowerCase().includes(query.toLowerCase()));
  }

  addHero(hero: Hero): void {
    this.heroes.push(hero);
    this.heroesSubject.next(this.heroes);
  }

  updateHero(updatedHero: Hero): void {
    const index = this.heroes.findIndex(h => h.id === updatedHero.id);
    if (index !== -1) {
      this.heroes[index] = updatedHero;
      this.heroesSubject.next(this.heroes);
    }
  }

  deleteHero(id: number): void {
    this.heroes = this.heroes.filter(hero => hero.id !== id);
    this.heroesSubject.next(this.heroes);
  }
}