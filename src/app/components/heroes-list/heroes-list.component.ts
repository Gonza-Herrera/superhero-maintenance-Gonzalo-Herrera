import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import { HeroService } from '../../services/superhero.service';
import { Hero } from '../../models/superhero.model';
import { FormsModule } from '@angular/forms';
import HeroFormComponent from '../../forms/hero-form/hero-form.component';

@Component({
  selector: 'app-heroes-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatDialogModule,
    MatInputModule,
    FormsModule,
    MatIconModule,
    MatToolbarModule,
    HeroFormComponent
  ],
  templateUrl: './heroes-list.component.html',
  styleUrls: ['./heroes-list.component.scss']
})
export default class HeroesListComponent {
  heroes: Hero[] = [];
  filteredHeroes: Hero[] = [];
  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 5;
  displayedColumns: string[] = ['name', 'power', 'actions'];

  constructor(
    private heroService: HeroService,
    private router: Router
  ) {
    this.heroService.getHeroes().subscribe(heroes => {
      this.heroes = heroes;
      this.applyFilter();
    });
  }

  applyFilter(): void {
    this.filteredHeroes = this.heroes.filter(hero =>
      hero.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.currentPage = 1;
  }

  get paginatedHeroes(): Hero[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredHeroes.slice(start, start + this.itemsPerPage);
  }

  nextPage(): void {
    if ((this.currentPage * this.itemsPerPage) < this.filteredHeroes.length) {
      this.currentPage++;
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  deleteHero(id: number): void {
    this.heroService.deleteHero(id);
    this.applyFilter();
  }

   openForm(): void {
    this.router.navigate(['/heroes/new']);
  }
  
  editHero(hero: Hero): void {
    this.router.navigate([`/heroes/edit/${hero.id}`]);
  } 
}
