import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import { HeroService } from '../../services/superhero.service';
import { Hero } from '../../models/superhero.model';
import { FormsModule } from '@angular/forms';
import HeroFormComponent from '../../forms/hero-form/hero-form.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

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
    HeroFormComponent,
    MatPaginatorModule
  ],
  templateUrl: './heroes-list.component.html',
  styleUrls: ['./heroes-list.component.scss']
})
export default class HeroesListComponent implements AfterViewInit {
  heroes: Hero[] = [];
  filteredHeroes: Hero[] = [];
  searchTerm: string = '';
  displayedColumns: string[] = ['name', 'power', 'actions'];
  dataSource = new MatTableDataSource<Hero>(this.filteredHeroes);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private heroService: HeroService,
    private router: Router,
    public dialog: MatDialog
  ) {
    this.heroService.getHeroes().subscribe(heroes => {
      this.heroes = heroes;
      this.applyFilter();
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(): void {
    this.filteredHeroes = this.heroes.filter(hero =>
      hero.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.dataSource.data = this.filteredHeroes;
  }

  applyPagination(event: any): void {
    const start = event.pageIndex * event.pageSize;
    const end = start + event.pageSize;
    this.dataSource.data = this.filteredHeroes.slice(start, end);
  }
  

  deleteHero(hero: Hero): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { heroName: hero.name }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.heroService.deleteHero(hero.id);
        this.applyFilter();
      }
    });
  }

  openForm(): void {
    this.router.navigate(['/heroes/new']);
  }

  editHero(hero: Hero): void {
    this.router.navigate([`/heroes/edit/${hero.id}`]);
  }
}