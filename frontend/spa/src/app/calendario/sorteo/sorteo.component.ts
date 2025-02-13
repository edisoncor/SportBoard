import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamService } from '../../services/calendar/team.service';
import { Team } from '../../models/calendar/team.model';
import { Location } from '@angular/common'; // Importar Location para navegar hacia atrás
@Component({
    selector: 'app-sorteo',
    standalone: true,
    templateUrl: './sorteo.component.html',
    styleUrls: ['./sorteo.component.scss'],
    imports: [CommonModule],
})
export class SorteoComponent implements OnInit {
    groups: { [key: string]: string[] } = {};
    sortedGroups: { [key: string]: string[] } = {};
    sorted: boolean = false;
    selectedGroup: string | null = null;
    currentStage: string[][] = []; // Fase actual de la competencia
    champion: string | null = null; // Campeón final
    showStages: boolean = false;  // Controlar la visibilidad de las fases
    roundNumber: number = 1; // Número de la ronda actual

    constructor(private teamService: TeamService,private location: Location) {}

    ngOnInit() {
        this.cargarEquipos();
    }

    cargarEquipos() {
        this.teamService.getTeams().subscribe((teams: Team[]) => {
            this.groups = this.organizarPorGrupos(teams);
        });
    }

    organizarPorGrupos(teams: Team[]): { [key: string]: string[] } {
        const shuffledTeams = this.shuffle(teams.map(team => team.name));
        const groupNames = ['A', 'B', 'C', 'D'];
        const groups: { [key: string]: string[] } = {};

        groupNames.forEach(group => (groups[group] = []));
        shuffledTeams.forEach((team, index) => {
            const groupIndex = Math.floor(index / 4);
            if (groupIndex < groupNames.length) {
                groups[groupNames[groupIndex]].push(team);
            }
        });

        return groups;
    }

    sortear() {
        const allTeams = Object.values(this.groups).flat();
        const shuffledTeams = this.shuffle(allTeams);
        const groupKeys = Object.keys(this.groups);

        this.sortedGroups = groupKeys.reduce((acc, key) => {
            acc[key] = [];
            return acc;
        }, {} as { [key: string]: string[] });

        shuffledTeams.forEach((team, index) => {
            const groupKey = groupKeys[index % groupKeys.length];
            this.sortedGroups[groupKey].push(team);
        });

        this.sorted = true;

        // Inicializar fase de eliminación con los equipos sorteados
        this.currentStage = [shuffledTeams];
        this.champion = null;
        this.roundNumber = 1; // Reiniciar el número de ronda al hacer sorteo
    }

    predecir() {
        if (this.champion) return; // Si ya hay campeón, no continuar

        // Mostrar las fases del torneo cuando se haga la predicción
        this.showStages = true;

        // Si no hay rondas previas, se inicia la primera ronda
        if (this.currentStage.length === 0) {
            // Iniciar la ronda 1 con todos los equipos
            const allTeams = Object.values(this.groups).flat();
            this.currentStage = [allTeams]; // Agregar los equipos a la primera ronda
            this.roundNumber = 1; // Establecer la ronda inicial
        }

        // Si ya existe una ronda (y no es la final), predecimos la siguiente
        else if (this.currentStage.length === 1) {
            const previousStage = this.currentStage[0];
            if (previousStage.length < 2) return;

            const nextStage: string[] = [];

            for (let i = 0; i < previousStage.length; i += 2) {
                if (i + 1 < previousStage.length) {
                    const winner = this.predecirGanador(previousStage[i], previousStage[i + 1]);
                    nextStage.push(winner);
                } else {
                    nextStage.push(previousStage[i]); // Equipo que pasa sin jugar
                }
            }

            // Reemplazamos la ronda actual con la nueva (segunda ronda)
            this.currentStage = [nextStage];
            this.roundNumber = 2; // Actualizamos el número de ronda

            // Si solo queda un equipo, es el campeón
            if (nextStage.length === 1) {
                this.champion = nextStage[0];
            }
        }

        // Si hay más rondas, se siguen prediciendo
        else {
            const previousStage = this.currentStage[this.currentStage.length - 1];
            if (previousStage.length < 2) return;

            const nextStage: string[] = [];

            for (let i = 0; i < previousStage.length; i += 2) {
                if (i + 1 < previousStage.length) {
                    const winner = this.predecirGanador(previousStage[i], previousStage[i + 1]);
                    nextStage.push(winner);
                } else {
                    nextStage.push(previousStage[i]); // Equipo que pasa sin jugar
                }
            }

            // Reemplazamos la ronda anterior con la nueva (tercera ronda)
            this.currentStage.push(nextStage);
            this.roundNumber++; // Incrementamos el número de ronda

            // Si solo queda un equipo, es el campeón
            if (nextStage.length === 1) {
                this.champion = nextStage[0];
            }
        }
    }

    predecirGanador(team1: string, team2: string): string {
        return Math.random() > 0.5 ? team1 : team2;
    }

    reset() {
        this.sorted = false;
        this.selectedGroup = null;
        this.sortedGroups = {};
        this.currentStage = [];
        this.champion = null;
        this.showStages = false;  // Ocultar fases cuando se resetea
        this.roundNumber = 1; // Reiniciar el número de ronda
    }

    private shuffle(array: string[]): string[] {
        return array.sort(() => Math.random() - 0.5);
    }

    selectGroup(groupKey: string) {
        this.selectedGroup = this.selectedGroup === groupKey ? null : groupKey;
    }

    get matches() {
        if (!this.selectedGroup) return [];
        const teams = this.sortedGroups[this.selectedGroup];
        if (teams.length < 4) return [];

        return [
            { home: teams[0], away: teams[1] },
            { home: teams[2], away: teams[3] },
        ];
    }
    volver() {
        this.location.back(); // Esto te lleva a la vista anterior
    }
}
