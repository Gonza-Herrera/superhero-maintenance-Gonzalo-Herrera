import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { HeroService } from '../../services/superhero.service';
import { Hero } from '../../models/superhero.model';
import { HeroFormComponent } from '../../forms/hero-form/hero-form.component';

@Component({
  selector: 'app-heroes-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatDialogModule,
    MatInputModule,
    HeroFormComponent
  ],
  templateUrl: './heroes-list.component.html',
  styleUrls: ['./heroes-list.component.css']
})
export class HeroesListComponent {
  heroes: Hero[] = [];
  filteredHeroes: Hero[] = [];
  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 5;
  displayedColumns: string[] = ['name', 'power', 'actions'];

  constructor(private heroService: HeroService, public dialog: MatDialog) {
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

  openForm(): void {
    const dialogRef = this.dialog.open(HeroFormComponent, {
      width: '400px',
      data: { hero: { id: 0, name: '', power: '' } }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.heroService.addHero(result);
    });
  }

  editHero(hero: Hero): void {
    const dialogRef = this.dialog.open(HeroFormComponent, {
      width: '400px',
      data: { hero: { ...hero } }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.heroService.updateHero(result);
    });
  }

  deleteHero(id: number): void {
    this.heroService.deleteHero(id);
    this.applyFilter();
  }
}
