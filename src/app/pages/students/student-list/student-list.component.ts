import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user.model';
import { Observable, map } from 'rxjs';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  heroPencilSquare,
  heroTrash,
  heroPlus,
  heroUserGroup,
  heroUser,
  heroMagnifyingGlass,
} from '@ng-icons/heroicons/outline';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [CommonModule, RouterLink, NgIconComponent, FormsModule],
  viewProviders: [
    provideIcons({
      heroPencilSquare,
      heroTrash,
      heroPlus,
      heroUserGroup,
      heroUser,
      heroMagnifyingGlass,
    }),
  ],
  templateUrl: './student-list.component.html',
  styleUrl: './student-list.component.css',
})
export class StudentListComponent implements OnInit {
  students$: Observable<User[]>;

  searchTerm: string = '';

  constructor(private userService: UserService) {
    this.students$ = this.userService.getUsers().pipe(
      map((users) =>
        users.filter((u) => {
          const matchesRole = u.role === 'student';
          const matchesSearch =
            !this.searchTerm ||
            u.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
            u.email.toLowerCase().includes(this.searchTerm.toLowerCase());
          return matchesRole && matchesSearch;
        })
      )
    );
  }

  onSearch(term: string) {
    this.searchTerm = term;
    this.students$ = this.userService.getUsers().pipe(
      map((users) =>
        users.filter((u) => {
          const matchesRole = u.role === 'student';
          const matchesSearch =
            !this.searchTerm ||
            u.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
            u.email.toLowerCase().includes(this.searchTerm.toLowerCase());
          return matchesRole && matchesSearch;
        })
      )
    );
  }

  ngOnInit(): void {}

  deleteStudent(id: number) {
    if (confirm('Tem certeza que deseja excluir este aluno?')) {
      this.userService.deleteUser(id).subscribe(() => {});
    }
  }
}
