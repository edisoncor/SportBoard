import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of, EMPTY } from 'rxjs';
import { catchError, map, retry, mergeMap, expand, reduce, tap } from 'rxjs/operators';

import { ApiResponse, ApiPaginationResponse } from '../../models/api-response';
import { ApiUrlBuilder } from '../../config/api-endpoints';
import {
  Catalogue, CreateCatalogueDto, UpdateCatalogueDto,
  Rule, CreateRuleDto, UpdateRuleDto,
  GameState, CreateGameStateDto, UpdateGameStateDto,
  User, CreateUserDto, UpdateUserDto,
  Athlete, CreateAthleteDto, UpdateAthleteDto,
  Administration, CreateAdministrationDto, UpdateAdministrationDto,
  Category, CreateCategoryDto, UpdateCategoryDto,
  Team, CreateTeamDto, UpdateTeamDto,
  Competition, CreateCompetitionDto, UpdateCompetitionDto,
  Season, CreateSeasonDto, UpdateSeasonDto,
  Phase, CreatePhaseDto, UpdatePhaseDto,
  Offer, CreateOfferDto, UpdateOfferDto,
  Game, CreateGameDto, UpdateGameDto,
  Marker, CreateMarkerDto, UpdateMarkerDto,
  PositionTable, CreatePositionTableDto, UpdatePositionTableDto,
  TableRating, CreateTableRatingDto, UpdateTableRatingDto
} from '../../models/competencies';

/**
 * Servicio para gestionar operaciones de competencias
 * Maneja todas las entidades del microservicio ms-competencies a través de Kong API Gateway
 */
@Injectable({
  providedIn: 'root'
})
export class CompetenciesService {

  constructor(private http: HttpClient) {}

  // ==================== HELPERS ====================

  /**
   * Obtiene todas las páginas de un endpoint paginado
   */
  private getAllPages<T>(url: string): Observable<T[]> {
    return this.http.get<ApiPaginationResponse<T>>(url).pipe(
      expand((response: ApiPaginationResponse<T>) => 
        response.meta.pagination.next ? 
          this.http.get<ApiPaginationResponse<T>>(response.meta.pagination.next) : 
          EMPTY
      ),
      reduce((acc: T[], response: ApiPaginationResponse<T>) => [...acc, ...response.data], []),
      catchError(this.handleError)
    );
  }

  /**
   * Manejo de errores HTTP
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ocurrió un error inesperado. Contacta al administrador si el problema persiste.';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error del cliente: ${error.error.message}`;
    } else {
      switch (error.status) {
        case 400:
          errorMessage = 'Por favor, completa todos los campos requeridos.';
          break;
        case 404:
          errorMessage = 'El recurso solicitado no fue encontrado.';
          break;
        case 409:
          errorMessage = 'No se puede eliminar este elemento porque está vinculado a otros registros. Elimina o actualiza las referencias primero.';
          break;
        case 500:
          errorMessage = 'Error de conexión con el servidor. Intenta nuevamente más tarde.';
          break;
        default:
          errorMessage = `Error del servidor: ${error.status} - ${error.message}`;
      }
    }
    
    console.error('Error en CompetenciesService:', error);
    return throwError(() => new Error(errorMessage));
  }

  // ==================== RULES ====================

  getRules(): Observable<Rule[]> {
    return this.getAllPages<Rule>(ApiUrlBuilder.getRulesUrl());
  }

  getRuleById(id: number): Observable<Rule> {
    return this.http.get<ApiResponse<Rule>>(`${ApiUrlBuilder.getRulesUrl()}${id}/`)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  createRule(ruleData: CreateRuleDto): Observable<Rule> {
    return this.http.post<ApiResponse<Rule>>(ApiUrlBuilder.getRulesUrl(), ruleData)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  updateRule(id: number, ruleData: UpdateRuleDto): Observable<Rule> {
    return this.http.patch<ApiResponse<Rule>>(`${ApiUrlBuilder.getRulesUrl()}${id}/`, ruleData)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  deleteRule(id: number): Observable<void> {
    return this.http.delete<void>(`${ApiUrlBuilder.getRulesUrl()}${id}/`)
      .pipe(catchError(this.handleError));
  }

  // ==================== GAME STATES ====================

  getGameStates(): Observable<GameState[]> {
    return this.getAllPages<GameState>(ApiUrlBuilder.getGameStatesUrl());
  }

  getGameStateById(id: number): Observable<GameState> {
    return this.http.get<ApiResponse<GameState>>(`${ApiUrlBuilder.getGameStatesUrl()}${id}/`)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  createGameState(gameStateData: CreateGameStateDto): Observable<GameState> {
    return this.http.post<ApiResponse<GameState>>(ApiUrlBuilder.getGameStatesUrl(), gameStateData)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  updateGameState(id: number, gameStateData: UpdateGameStateDto): Observable<GameState> {
    return this.http.patch<ApiResponse<GameState>>(`${ApiUrlBuilder.getGameStatesUrl()}${id}/`, gameStateData)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  deleteGameState(id: number): Observable<void> {
    return this.http.delete<void>(`${ApiUrlBuilder.getGameStatesUrl()}${id}/`)
      .pipe(catchError(this.handleError));
  }

  // ==================== USERS ====================

  getUsers(): Observable<User[]> {
    return this.getAllPages<User>(ApiUrlBuilder.getUsersUrl());
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<ApiResponse<User>>(`${ApiUrlBuilder.getUsersUrl()}${id}/`)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  createUser(userData: CreateUserDto): Observable<User> {
    return this.http.post<ApiResponse<User>>(ApiUrlBuilder.getUsersUrl(), userData)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  updateUser(id: number, userData: UpdateUserDto): Observable<User> {
    return this.http.patch<ApiResponse<User>>(`${ApiUrlBuilder.getUsersUrl()}${id}/`, userData)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${ApiUrlBuilder.getUsersUrl()}${id}/`)
      .pipe(catchError(this.handleError));
  }

  // ==================== ATHLETES ====================

  getAthletes(): Observable<Athlete[]> {
    return this.getAllPages<Athlete>(ApiUrlBuilder.getAthletesUrl());
  }

  getAthleteById(id: number): Observable<Athlete> {
    return this.http.get<ApiResponse<Athlete>>(`${ApiUrlBuilder.getAthletesUrl()}${id}/`)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  createAthlete(athleteData: CreateAthleteDto): Observable<Athlete> {
    return this.http.post<ApiResponse<Athlete>>(ApiUrlBuilder.getAthletesUrl(), athleteData)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  updateAthlete(id: number, athleteData: UpdateAthleteDto): Observable<Athlete> {
    return this.http.patch<ApiResponse<Athlete>>(`${ApiUrlBuilder.getAthletesUrl()}${id}/`, athleteData)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  deleteAthlete(id: number): Observable<void> {
    return this.http.delete<void>(`${ApiUrlBuilder.getAthletesUrl()}${id}/`)
      .pipe(catchError(this.handleError));
  }

  // ==================== ADMINISTRATIONS ====================

  getAdministrations(): Observable<Administration[]> {
    return this.getAllPages<Administration>(ApiUrlBuilder.getAdministrationsUrl());
  }

  getAdministrationById(id: number): Observable<Administration> {
    return this.http.get<ApiResponse<Administration>>(`${ApiUrlBuilder.getAdministrationsUrl()}${id}/`)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  createAdministration(adminData: CreateAdministrationDto): Observable<Administration> {
    return this.http.post<ApiResponse<Administration>>(ApiUrlBuilder.getAdministrationsUrl(), adminData)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  updateAdministration(id: number, adminData: UpdateAdministrationDto): Observable<Administration> {
    return this.http.patch<ApiResponse<Administration>>(`${ApiUrlBuilder.getAdministrationsUrl()}${id}/`, adminData)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  deleteAdministration(id: number): Observable<void> {
    return this.http.delete<void>(`${ApiUrlBuilder.getAdministrationsUrl()}${id}/`)
      .pipe(catchError(this.handleError));
  }

  // ==================== CATEGORIES ====================

  getCompetencyCategories(): Observable<Category[]> {
    return this.getAllPages<Category>(ApiUrlBuilder.getCompetencyCategoriesUrl());
  }

  getCompetencyCategoryById(id: number): Observable<Category> {
    return this.http.get<ApiResponse<Category>>(`${ApiUrlBuilder.getCompetencyCategoriesUrl()}${id}/`)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  createCompetencyCategory(categoryData: CreateCategoryDto): Observable<Category> {
    return this.http.post<ApiResponse<Category>>(ApiUrlBuilder.getCompetencyCategoriesUrl(), categoryData)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  updateCompetencyCategory(id: number, categoryData: UpdateCategoryDto): Observable<Category> {
    return this.http.patch<ApiResponse<Category>>(`${ApiUrlBuilder.getCompetencyCategoriesUrl()}${id}/`, categoryData)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  deleteCompetencyCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${ApiUrlBuilder.getCompetencyCategoriesUrl()}${id}/`)
      .pipe(catchError(this.handleError));
  }

  // ==================== TEAMS ====================

  getTeams(): Observable<Team[]> {
    return this.getAllPages<Team>(ApiUrlBuilder.getTeamsUrl());
  }

  getTeamById(id: number): Observable<Team> {
    return this.http.get<ApiResponse<Team>>(`${ApiUrlBuilder.getTeamsUrl()}${id}/`)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  createTeam(teamData: CreateTeamDto): Observable<Team> {
    return this.http.post<ApiResponse<Team>>(ApiUrlBuilder.getTeamsUrl(), teamData)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  updateTeam(id: number, teamData: UpdateTeamDto): Observable<Team> {
    return this.http.patch<ApiResponse<Team>>(`${ApiUrlBuilder.getTeamsUrl()}${id}/`, teamData)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  deleteTeam(id: number): Observable<void> {
    return this.http.delete<void>(`${ApiUrlBuilder.getTeamsUrl()}${id}/`)
      .pipe(catchError(this.handleError));
  }

  // ==================== COMPETITIONS ====================

  getCompetitions(): Observable<Competition[]> {
    return this.getAllPages<Competition>(ApiUrlBuilder.getCompetitionsUrl());
  }

  getCompetitionById(id: number): Observable<Competition> {
    return this.http.get<ApiResponse<Competition>>(`${ApiUrlBuilder.getCompetitionsUrl()}${id}/`)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  createCompetition(competitionData: CreateCompetitionDto): Observable<Competition> {
    return this.http.post<ApiResponse<Competition>>(ApiUrlBuilder.getCompetitionsUrl(), competitionData)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  updateCompetition(id: number, competitionData: UpdateCompetitionDto): Observable<Competition> {
    return this.http.patch<ApiResponse<Competition>>(`${ApiUrlBuilder.getCompetitionsUrl()}${id}/`, competitionData)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  deleteCompetition(id: number): Observable<void> {
    return this.http.delete<void>(`${ApiUrlBuilder.getCompetitionsUrl()}${id}/`)
      .pipe(catchError(this.handleError));
  }

  // ==================== SEASONS ====================

  getSeasons(): Observable<Season[]> {
    return this.getAllPages<Season>(ApiUrlBuilder.getSeasonsUrl());
  }

  getSeasonById(id: number): Observable<Season> {
    return this.http.get<ApiResponse<Season>>(`${ApiUrlBuilder.getSeasonsUrl()}${id}/`)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  createSeason(seasonData: CreateSeasonDto): Observable<Season> {
    return this.http.post<ApiResponse<Season>>(ApiUrlBuilder.getSeasonsUrl(), seasonData)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  updateSeason(id: number, seasonData: UpdateSeasonDto): Observable<Season> {
    return this.http.patch<ApiResponse<Season>>(`${ApiUrlBuilder.getSeasonsUrl()}${id}/`, seasonData)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  deleteSeason(id: number): Observable<void> {
    return this.http.delete<void>(`${ApiUrlBuilder.getSeasonsUrl()}${id}/`)
      .pipe(catchError(this.handleError));
  }

  // ==================== PHASES ====================

  getPhases(): Observable<Phase[]> {
    return this.getAllPages<Phase>(ApiUrlBuilder.getPhasesUrl());
  }

  getPhaseById(id: number): Observable<Phase> {
    return this.http.get<ApiResponse<Phase>>(`${ApiUrlBuilder.getPhasesUrl()}${id}/`)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  createPhase(phaseData: CreatePhaseDto): Observable<Phase> {
    return this.http.post<ApiResponse<Phase>>(ApiUrlBuilder.getPhasesUrl(), phaseData)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  updatePhase(id: number, phaseData: UpdatePhaseDto): Observable<Phase> {
    return this.http.patch<ApiResponse<Phase>>(`${ApiUrlBuilder.getPhasesUrl()}${id}/`, phaseData)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  deletePhase(id: number): Observable<void> {
    return this.http.delete<void>(`${ApiUrlBuilder.getPhasesUrl()}${id}/`)
      .pipe(catchError(this.handleError));
  }

  // ==================== OFFERS ====================

  getOffers(): Observable<Offer[]> {
    return this.getAllPages<Offer>(ApiUrlBuilder.getOffersUrl());
  }

  getOfferById(id: number): Observable<Offer> {
    return this.http.get<ApiResponse<Offer>>(`${ApiUrlBuilder.getOffersUrl()}${id}/`)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  createOffer(offerData: CreateOfferDto): Observable<Offer> {
    return this.http.post<ApiResponse<Offer>>(ApiUrlBuilder.getOffersUrl(), offerData)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  updateOffer(id: number, offerData: UpdateOfferDto): Observable<Offer> {
    return this.http.patch<ApiResponse<Offer>>(`${ApiUrlBuilder.getOffersUrl()}${id}/`, offerData)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  deleteOffer(id: number): Observable<void> {
    return this.http.delete<void>(`${ApiUrlBuilder.getOffersUrl()}${id}/`)
      .pipe(catchError(this.handleError));
  }

  // ==================== GAMES ====================

  getGames(): Observable<Game[]> {
    return this.getAllPages<Game>(ApiUrlBuilder.getGamesUrl());
  }

  getGameById(id: number): Observable<Game> {
    return this.http.get<ApiResponse<Game>>(`${ApiUrlBuilder.getGamesUrl()}${id}/`)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  createGame(gameData: CreateGameDto): Observable<Game> {
    return this.http.post<ApiResponse<Game>>(ApiUrlBuilder.getGamesUrl(), gameData)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  updateGame(id: number, gameData: UpdateGameDto): Observable<Game> {
    return this.http.patch<ApiResponse<Game>>(`${ApiUrlBuilder.getGamesUrl()}${id}/`, gameData)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  deleteGame(id: number): Observable<void> {
    return this.http.delete<void>(`${ApiUrlBuilder.getGamesUrl()}${id}/`)
      .pipe(catchError(this.handleError));
  }

  // ==================== MARKER OPERATIONS ====================

  getMarkers(): Observable<Marker[]> {
    return this.getAllPages<Marker>(ApiUrlBuilder.getMarkersUrl());
  }

  getMarkerById(id: number): Observable<Marker> {
    return this.http.get<ApiResponse<Marker>>(`${ApiUrlBuilder.getMarkersUrl()}${id}/`)
      .pipe(
        map(response => response.data),
        retry(3),
        catchError(this.handleError)
      );
  }

  createMarker(markerData: CreateMarkerDto): Observable<Marker> {
    return this.http.post<ApiResponse<Marker>>(ApiUrlBuilder.getMarkersUrl(), markerData)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  updateMarker(id: number, markerData: UpdateMarkerDto): Observable<Marker> {
    return this.http.patch<ApiResponse<Marker>>(`${ApiUrlBuilder.getMarkersUrl()}${id}/`, markerData)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  deleteMarker(id: number): Observable<void> {
    return this.http.delete<void>(`${ApiUrlBuilder.getMarkersUrl()}${id}/`)
      .pipe(catchError(this.handleError));
  }

  // ==================== POSITION TABLE OPERATIONS ====================

  getPositionTables(): Observable<PositionTable[]> {
    return this.getAllPages<PositionTable>(ApiUrlBuilder.getPositionTablesUrl());
  }

  getPositionTableById(id: number): Observable<PositionTable> {
    return this.http.get<ApiResponse<PositionTable>>(`${ApiUrlBuilder.getPositionTablesUrl()}${id}/`)
      .pipe(
        map(response => response.data),
        retry(3),
        catchError(this.handleError)
      );
  }

  createPositionTable(positionTableData: CreatePositionTableDto): Observable<PositionTable> {
    return this.http.post<ApiResponse<PositionTable>>(ApiUrlBuilder.getPositionTablesUrl(), positionTableData)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  updatePositionTable(id: number, positionTableData: UpdatePositionTableDto): Observable<PositionTable> {
    return this.http.patch<ApiResponse<PositionTable>>(`${ApiUrlBuilder.getPositionTablesUrl()}${id}/`, positionTableData)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  deletePositionTable(id: number): Observable<void> {
    return this.http.delete<void>(`${ApiUrlBuilder.getPositionTablesUrl()}${id}/`)
      .pipe(catchError(this.handleError));
  }

  // ==================== TABLE RATING OPERATIONS ====================

  getTableRatings(): Observable<TableRating[]> {
    return this.getAllPages<TableRating>(ApiUrlBuilder.getTableRatingsUrl());
  }

  getTableRatingById(id: number): Observable<TableRating> {
    return this.http.get<ApiResponse<TableRating>>(`${ApiUrlBuilder.getTableRatingsUrl()}${id}/`)
      .pipe(
        map(response => response.data),
        retry(3),
        catchError(this.handleError)
      );
  }

  createTableRating(tableRatingData: CreateTableRatingDto): Observable<TableRating> {
    return this.http.post<ApiResponse<TableRating>>(ApiUrlBuilder.getTableRatingsUrl(), tableRatingData)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  updateTableRating(id: number, tableRatingData: UpdateTableRatingDto): Observable<TableRating> {
    return this.http.patch<ApiResponse<TableRating>>(`${ApiUrlBuilder.getTableRatingsUrl()}${id}/`, tableRatingData)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  deleteTableRating(id: number): Observable<void> {
    return this.http.delete<void>(`${ApiUrlBuilder.getTableRatingsUrl()}${id}/`)
      .pipe(catchError(this.handleError));
  }

  // ==================== CATALOGUE OPERATIONS ====================

  getCatalogues(): Observable<Catalogue[]> {
    return this.getAllPages<Catalogue>(ApiUrlBuilder.getCataloguesUrl());
  }

  getCatalogueById(id: number): Observable<Catalogue> {
    return this.http.get<ApiResponse<Catalogue>>(`${ApiUrlBuilder.getCataloguesUrl()}${id}/`)
      .pipe(
        map(response => response.data),
        retry(3),
        catchError(this.handleError)
      );
  }

  createCatalogue(catalogueData: CreateCatalogueDto): Observable<Catalogue> {
    return this.http.post<ApiResponse<Catalogue>>(ApiUrlBuilder.getCataloguesUrl(), catalogueData)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  updateCatalogue(id: number, catalogueData: UpdateCatalogueDto): Observable<Catalogue> {
    return this.http.patch<ApiResponse<Catalogue>>(`${ApiUrlBuilder.getCataloguesUrl()}${id}/`, catalogueData)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  deleteCatalogue(id: number): Observable<void> {
    return this.http.delete<void>(`${ApiUrlBuilder.getCataloguesUrl()}${id}/`)
      .pipe(catchError(this.handleError));
  }

  // ==================== UTILITY METHODS ====================

  /**
   * Busca elementos por término de búsqueda
   */
  searchItems<T>(url: string, searchTerm: string): Observable<T[]> {
    const searchUrl = `${url}?search=${encodeURIComponent(searchTerm)}`;
    return this.getAllPages<T>(searchUrl);
  }

  /**
   * Obtiene elementos paginados
   */
  getPaginatedItems<T>(url: string, page: number = 1, pageSize: number = 10): Observable<ApiPaginationResponse<T>> {
    const paginatedUrl = `${url}?page=${page}&page_size=${pageSize}`;
    return this.http.get<ApiPaginationResponse<T>>(paginatedUrl)
      .pipe(catchError(this.handleError));
  }
}
