import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { GameItem } from './game-item/game-item';
import { Category } from '../../category/model/category';
import { Game } from '../model/game';
import { GameService } from '../game.service';
import { CategoryService } from '../../category/category.service';
import { MatDialog } from '@angular/material/dialog';
import { GameEdit } from '../game-edit/game-edit';

@Component({
  selector: 'app-game-list',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    FormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    GameItem
  ],
  templateUrl: './game-list.html',
  styleUrl: './game-list.scss',
})
export class GameList implements OnInit {
  categories: Category[];
  games: Game[];
  filterCategory: Category;
  filterTitle: string;

  constructor(
    private gameService: GameService,
    private categoryService: CategoryService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.gameService.getGames().subscribe((games) => (this.games = games));

    this.categoryService
      .getCategories()
      .subscribe((categories) => (this.categories = categories));
  }

  onCleanFilter(): void {
    this.filterTitle = null;
    this.filterCategory = null;
    this.onSearch();
  }

  onSearch(): void {
    const title = this.filterTitle;
    const categoryId =
      this.filterCategory != null ? this.filterCategory.id : null;

    this.gameService
      .getGames(title, categoryId)
      .subscribe((games) => (this.games = games));
  }

  createGame() {
    const dialogRef = this.dialog.open(GameEdit, {
      data: {},
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.ngOnInit();
    });
  }

  editGame(game: Game) {
    const dialogRef = this.dialog.open(GameEdit, {
      data: { game: game },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.onSearch();
    });
  }
}
