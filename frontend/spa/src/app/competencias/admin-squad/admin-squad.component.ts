import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SharedModule } from '../../shared/shared.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CreateUserDialogComponent } from './create-user-dialog/create-user-dialog.component';
import { SquadService } from '../../services/competencies/squad.service';
import { TeamService } from '../../services/competencies/team.service';
import { Team } from '../../models/competencies/team.model';
import { User } from '../../models/competencies/user.model';
import { FlashMessageComponent } from '../../shared/flash-message/flash-message.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { UserService } from '../../services/competencies/user.service';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Squad } from '../../models/competencies/squad.model';
import { UserDetailsDialogComponent } from './user-details-dialog/user-details-dialog.component';
import { MatSelectionList } from '@angular/material/list';
import { BreadcrumbCompetenciasComponent } from '../breadcrumb-competencias/breadcrumb-competencias.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-squad',
  standalone: true,
  imports: [
    SharedModule, 
    MatDialogModule, 
    MatIconModule, 
    MatButtonModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    BreadcrumbCompetenciasComponent,
  ],
  templateUrl: './admin-squad.component.html',
  styleUrls: ['./admin-squad.component.scss']
})
export class AdminSquadComponent implements OnInit {
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('playerList') playerList!: MatSelectionList;
  @ViewChild('coachList') coachList!: MatSelectionList;
  dataSource!: MatTableDataSource<Squad>;
  displayedColumns: string[] = ['team', 'players_count', 'coaches_count'];
  existingPlayers: User[] = [];
  existingCoaches: User[] = [];
  searchText: string = '';
  squads: Squad[] = [];
  form: FormGroup;
  teams: Team[] = [];
  tempPlayers: User[] = [];
  tempCoaches: User[] = [];
  selectedPlayers: User[] = [];
  selectedCoaches: User[] = [];
  isLoading = false;
  selectedSquad: Squad | null = null;
  isDeleteMode: boolean = false;  // Añadir esta propiedad
  currentRoute: string = '';

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private squadService: SquadService,
    private teamService: TeamService,
    private userService: UserService,
    private router: Router
  ) {
    this.form = this.fb.group({
      team: ['', Validators.required]
    });
    this.currentRoute = this.router.url;
  }

  ngOnInit(): void {
    this.loadTeams();
    this.loadSquads();
    this.loadExistingUsers();
  }

  loadTeams(): void {
    this.isLoading = true;
    this.teamService.getTeams().subscribe({
      next: (data) => this.teams = data,
      error: (error) => this.handleError(error),
      complete: () => this.isLoading = false
    });
  }

  loadSquads(): void {
    this.isLoading = true;
    this.squadService.getSquads().subscribe({
      next: (data) => {
        this.squads = data;
        this.dataSource = new MatTableDataSource(this.squads);
        this.dataSource.sort = this.sort;
      },
      error: (error) => this.handleError(error),
      complete: () => this.isLoading = false
    });
  }

  loadExistingUsers(): void {
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.existingPlayers = users.filter(user => user.role === 'Player');
        this.existingCoaches = users.filter(user => user.role === 'Coach');
        
        // Si hay un squad seleccionado, actualizar las selecciones
        if (this.selectedSquad) {
          this.updateSelectionLists();
        }
      },
      error: (error) => this.handleError(error)
    });
  }

  openCreateUserDialog(role: 'Player' | 'Coach'): void {
    const dialogRef = this.dialog.open(CreateUserDialogComponent, {
      width: '500px',
      data: { role }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // En lugar de crear el usuario, lo guardamos temporalmente
        if (role === 'Player') {
          this.tempPlayers.push(result);
          this.selectedPlayers.push(result);
        } else {
          this.tempCoaches.push(result);
          this.selectedCoaches.push(result);
        }
      }
    });
  }

  togglePlayerSelection(player: User): void {
    const index = this.selectedPlayers.findIndex(p => p === player);
    if (index === -1) {
      this.selectedPlayers.push(player);
    } else {
      this.selectedPlayers.splice(index, 1);
    }
  }

  toggleCoachSelection(coach: User): void {
    const index = this.selectedCoaches.findIndex(c => c === coach);
    if (index === -1) {
      this.selectedCoaches.push(coach);
    } else {
      this.selectedCoaches.splice(index, 1);
    }
  }

  onSubmit(): void {
    if (this.form.valid && (this.selectedPlayers.length > 0 || this.selectedCoaches.length > 0)) {
      this.isLoading = true;
      const squadData = {
        team: this.form.value.team,
        players: this.selectedPlayers.map(player => {
          return player.id ? player.id : player;
        }),
        coaches: this.selectedCoaches.map(coach => {
          return coach.id ? coach.id : coach;
        }),
        new_players: this.selectedPlayers.filter(player => !player.id),
        new_coaches: this.selectedCoaches.filter(coach => !coach.id)
      };

      const operation = this.selectedSquad
        ? this.squadService.updateSquad(this.selectedSquad.id, squadData)
        : this.squadService.createSquad(squadData);

      operation.subscribe({
        next: (updatedSquad) => {
          // Actualizar las listas con los usuarios creados
          this.loadExistingUsers();
          this.openFlashMessage(
            `Squad ${this.selectedSquad ? 'actualizado' : 'creado'} exitosamente`,
            'success'
          );
          this.loadSquads();
          this.resetForm();
        },
        error: (error) => this.handleError(error),
        complete: () => this.isLoading = false
      });
    } else {
      this.markFormGroupTouched(this.form);
      this.openFlashMessage('Por favor complete todos los campos requeridos', 'warning');
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  resetForm(): void {
    this.form.reset();
    this.form.enable();  // Añadir esta línea
    
    // Habilitar las listas de selección
    if (this.playerList) {
      this.playerList.disabled = false;
    }
    if (this.coachList) {
      this.coachList.disabled = false;
    }
    
    // Habilitar los botones de acción de usuarios usando cast correcto
    const buttons = document.querySelectorAll('.users-section button');
    buttons.forEach(button => {
      (button as HTMLButtonElement).disabled = false;
    });
    
    this.tempPlayers = [];
    this.tempCoaches = [];
    this.selectedPlayers = [];
    this.selectedCoaches = [];
    this.selectedSquad = null;
    this.isDeleteMode = false;  // Añadir esta línea
  }

  private handleError(error: any): void {
    let errorMessage = 'Ha ocurrido un error';
    if (error.error?.message) {
      errorMessage = error.error.message;
    }
    this.openFlashMessage(errorMessage, 'error');
  }

  private openFlashMessage(message: string, type: 'success' | 'error' | 'info' | 'warning'): void {
    const dialogRef = this.dialog.open(FlashMessageComponent, {
      width: '400px',
      data: { message, type, duration: 3000, position: 'top-right' }
    });

    setTimeout(() => {
      dialogRef.close();
    }, 3000);
  }

  openUserDetails(user: User): void {
    this.dialog.open(UserDetailsDialogComponent, {
      width: '400px',
      data: { user }
    });
  }

  editUser(user: User): void {
    const dialogRef = this.dialog.open(CreateUserDialogComponent, {
      width: '500px',
      data: { role: user.role, user }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const index = this.tempPlayers.findIndex(p => p === user);
        if (index !== -1) {
          this.tempPlayers[index] = { ...user, ...result };
        }
        const coachIndex = this.tempCoaches.findIndex(c => c === user);
        if (coachIndex !== -1) {
          this.tempCoaches[coachIndex] = { ...user, ...result };
        }
      }
    });
  }

  deleteUser(user: User): void {
    if (confirm('¿Está seguro de que desea eliminar este usuario de la lista?')) {
      // Si es un usuario temporal
      const playerIndex = this.tempPlayers.findIndex(p => p === user);
      if (playerIndex !== -1) {
        this.tempPlayers.splice(playerIndex, 1);
        this.selectedPlayers = this.selectedPlayers.filter(p => p !== user);
      }

      const coachIndex = this.tempCoaches.findIndex(c => c === user);
      if (coachIndex !== -1) {
        this.tempCoaches.splice(coachIndex, 1);
        this.selectedCoaches = this.selectedCoaches.filter(c => c !== user);
      }
    }
  }

  private resetSelections(): void {
    if (this.playerList) {
      this.playerList.deselectAll();
    }
    if (this.coachList) {
      this.coachList.deselectAll();
    }
  }

  onSelect(squad: Squad): void {
    this.resetSelections();
    
    this.selectedSquad = squad;
    this.isDeleteMode = false;
    
    // Cargar el equipo en el formulario
    this.form.patchValue({
      team: squad.team.id
    });
    
    // Actualizar jugadores y entrenadores seleccionados
    this.selectedPlayers = [];
    this.selectedCoaches = [];

    // Identificar y marcar jugadores existentes
    squad.players.forEach(squadPlayer => {
      const existingPlayer = this.existingPlayers.find(p => p.id === squadPlayer.id);
      if (existingPlayer) {
        this.selectedPlayers.push(existingPlayer);
      }
    });

    // Identificar y marcar entrenadores existentes
    squad.coaches.forEach(squadCoach => {
      const existingCoach = this.existingCoaches.find(c => c.id === squadCoach.id);
      if (existingCoach) {
        this.selectedCoaches.push(existingCoach);
      }
    });

    // Aplicar las selecciones a las listas después de que Angular actualice la vista
    setTimeout(() => {
      this.updateSelectionLists();
    });

    // Desplazar la vista al formulario en dispositivos móviles
    if (window.innerWidth < 992) {
      const formElement = document.querySelector('.form-container-fixed');
      formElement?.scrollIntoView({ behavior: 'smooth' });
    }
  }

  private updateSelectionLists(): void {
    // Actualizar lista de jugadores
    if (this.playerList) {
      this.playerList.options.forEach(option => {
        const isSelected = this.selectedPlayers.some(p => p.id === option.value?.id);
        option.selected = isSelected;
      });
    }

    // Actualizar lista de entrenadores
    if (this.coachList) {
      this.coachList.options.forEach(option => {
        const isSelected = this.selectedCoaches.some(c => c.id === option.value?.id);
        option.selected = isSelected;
      });
    }
  }

  deleteSquad(squad: Squad): void {
    if (confirm('¿Está seguro de que desea eliminar este squad?')) {
      this.squadService.deleteSquad(squad.id).subscribe({
        next: () => {
          this.openFlashMessage('Squad eliminado exitosamente', 'success');
          this.loadSquads();
          this.resetForm();
        },
        error: (error) => this.handleError(error)
      });
    }
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.dataSource.filterPredicate = (data: Squad, filter: string) => {
      return data.team?.name.toLowerCase().includes(filter) ||
             data.players.some(p => 
               p.firstname.toLowerCase().includes(filter) || 
               p.lastname.toLowerCase().includes(filter)
             ) ||
             data.coaches.some(c => 
               c.firstname.toLowerCase().includes(filter) || 
               c.lastname.toLowerCase().includes(filter)
             );
    };
    this.dataSource.filter = filterValue;
  }

  sortData(sort: Sort): void {
    if (!sort.active || sort.direction === '') {
      return;
    }

    this.dataSource.data = this.dataSource.data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'team':
          return this.compare(a.team?.name || '', b.team?.name || '', isAsc);
        case 'players_count':
          return this.compare(a.players?.length || 0, b.players?.length || 0, isAsc);
        case 'coaches_count':
          return this.compare(a.coaches?.length || 0, b.coaches?.length || 0, isAsc);
        default:
          return 0;
      }
    });
  }

  private compare(a: string | number, b: string | number, isAsc: boolean): number {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  create(): void {
    this.resetSelections();
    this.selectedSquad = null;
    this.form.enable();
    this.form.reset();
    this.tempPlayers = [];
    this.tempCoaches = [];
    this.selectedPlayers = [];
    this.selectedCoaches = [];
    this.isDeleteMode = false;
  }

  delete(): void {
    if (this.selectedSquad) {
      this.isDeleteMode = true;
      this.form.disable();
      
      // Deshabilitar las listas de selección
      if (this.playerList) {
        this.playerList.disabled = true;
      }
      if (this.coachList) {
        this.coachList.disabled = true;
      }
      
      // Deshabilitar los botones de acción de usuarios usando cast correcto
      const buttons = document.querySelectorAll('.users-section button');
      buttons.forEach(button => {
        (button as HTMLButtonElement).disabled = true;
      });
    }
  }

  confirmDelete(): void {
    if (this.selectedSquad) {
      this.squadService.deleteSquad(this.selectedSquad.id).subscribe({
        next: () => {
          this.openFlashMessage('Squad eliminado exitosamente', 'success');
          this.loadSquads();
          this.resetForm();
        },
        error: (error) => this.handleError(error)
      });
    }
  }

  refresh(): void {
    const selectedSquadId = this.selectedSquad?.id;
    this.isLoading = true;
    this.searchText = '';
    if (this.dataSource) {
      this.dataSource.filter = '';
    }
    
    this.loadSquads();
    
    // Mantener la selección después de recargar
    if (selectedSquadId) {
      this.squadService.getSquad(selectedSquadId).subscribe({
        next: (squad) => {
          this.onSelect(squad);
        },
        error: () => this.resetForm(),
        complete: () => this.isLoading = false
      });
    }
  }
}
