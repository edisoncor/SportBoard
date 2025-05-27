import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sorteo',
  standalone: true,
  templateUrl: './sorteo.component.html',
  styleUrls: ['./sorteo.component.scss'],
  imports: [CommonModule],

})
export class SorteoComponent {
  // Grupos iniciales con equipos predefinidos
  groups: { [key: string]: string[] } = {
    A: ['Real Madrid', 'Juventus', 'PSV', 'Young Boys'],
    B: ['Manchester City', 'Milan', 'Celtic', 'Monaco'],
    C: ['FC Barcelona', 'Aston Villa', 'Lille', 'Girona'],
    D: ['Bayern Munich', 'Arsenal', 'Estrella Roja', 'Bolonia'],
  };

  sortedGroups: { [key: string]: string[] } = {}; // Grupos tras el sorteo
  sorted: boolean = false; // Estado del sorteo
  selectedGroup: string | null = null; // Grupo seleccionado para mostrar enfrentamientos

  // Método para sortear equipos
  sortear() {
    const allTeams = Object.values(this.groups).flat(); // Combina todos los equipos
    const shuffledTeams = this.shuffle(allTeams); // Baraja los equipos
    const groupKeys = Object.keys(this.groups); // Obtiene las claves de los grupos

    // Distribuye equipos aleatoriamente entre los grupos
    this.sortedGroups = groupKeys.reduce((acc, key) => {
      acc[key] = [];
      return acc;
    }, {} as { [key: string]: string[] });

    shuffledTeams.forEach((team, index) => {
      const groupKey = groupKeys[index % groupKeys.length];
      this.sortedGroups[groupKey].push(team);
    });

    this.sorted = true; // Cambia el estado a sorteado
  }

  // Genera enfrentamientos para el grupo seleccionado
  get matches() {
    if (!this.selectedGroup) return [];
    const teams = this.sortedGroups[this.selectedGroup];
    if (teams.length < 4) return []; // Asegura que haya suficientes equipos para enfrentamientos

    return [
      { home: teams[0], away: teams[1] },
      { home: teams[2], away: teams[3] },
    ];
  }

  // Selecciona o deselecciona un grupo
  selectGroup(groupKey: string) {
    this.selectedGroup = this.selectedGroup === groupKey ? null : groupKey;
  }

  // Resetea el sorteo y vuelve a la tabla inicial
  reset() {
    this.sorted = false;
    this.selectedGroup = null;
    this.sortedGroups = {};
  }

  // Función para barajar los equipos
  private shuffle(array: string[]): string[] {
    return array.sort(() => Math.random() - 0.5);
  }
}
