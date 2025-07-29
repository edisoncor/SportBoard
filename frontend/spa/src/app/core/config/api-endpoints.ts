/**
 * Configuración centralizada de endpoints de la API
 * Los endpoints están configurados para funcionar con Kong API Gateway
 */
import { environment } from '../../../environments/environment';

export const API_ENDPOINTS = {
  // URL base apunta a Kong API Gateway
  BASE_URL: environment.apiUrl,

  CATALOG: {
    CATEGORIES: '/catalog/categories/',
    ITEMS: '/catalog/items/'
  },

  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh'
  },

  COMPETENCIES: {
    BASE: '/competencies',
    CATALOGUES: '/competencies/catalogues/',
    RULES: '/competencies/rules/',
    GAME_STATES: '/competencies/gamestates/',
    USERS: '/competencies/users/',
    ATHLETES: '/competencies/athletes/',
    ADMINISTRATIONS: '/competencies/administrations/',
    CATEGORIES: '/competencies/categories/',
    TEAMS: '/competencies/teams/',
    COMPETITIONS: '/competencies/competitions/',
    SEASONS: '/competencies/seasons/',
    PHASES: '/competencies/phases/',
    OFFERS: '/competencies/offers/',
    GAMES: '/competencies/games/',
    MARKERS: '/competencies/markers/',
    POSITION_TABLES: '/competencies/positiontables/',
    TABLE_RATINGS: '/competencies/tableratings/'
  },

  STATISTICS: {
    BASE: '/statistics'
  }
} as const;

/**
 * Helper para construir URLs completas
 */
export class ApiUrlBuilder {
  static buildUrl(endpoint: string): string {
    // Asegurar que no hay barras dobles
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const baseUrl = API_ENDPOINTS.BASE_URL.endsWith('/') ?
      API_ENDPOINTS.BASE_URL.slice(0, -1) :
      API_ENDPOINTS.BASE_URL;

    return `${baseUrl}${cleanEndpoint}`;
  }

  static getCategoriesUrl(): string {
    return this.buildUrl(API_ENDPOINTS.CATALOG.CATEGORIES);
  }

  static getItemsUrl(): string {
    return this.buildUrl(API_ENDPOINTS.CATALOG.ITEMS);
  }

  // Competencies endpoints
  static getCataloguesUrl(): string {
    return this.buildUrl(API_ENDPOINTS.COMPETENCIES.CATALOGUES);
  }

  static getRulesUrl(): string {
    return this.buildUrl(API_ENDPOINTS.COMPETENCIES.RULES);
  }

  static getGameStatesUrl(): string {
    return this.buildUrl(API_ENDPOINTS.COMPETENCIES.GAME_STATES);
  }

  static getUsersUrl(): string {
    return this.buildUrl(API_ENDPOINTS.COMPETENCIES.USERS);
  }

  static getAthletesUrl(): string {
    return this.buildUrl(API_ENDPOINTS.COMPETENCIES.ATHLETES);
  }

  static getAdministrationsUrl(): string {
    return this.buildUrl(API_ENDPOINTS.COMPETENCIES.ADMINISTRATIONS);
  }

  static getCompetencyCategoriesUrl(): string {
    return this.buildUrl(API_ENDPOINTS.COMPETENCIES.CATEGORIES);
  }

  static getTeamsUrl(): string {
    return this.buildUrl(API_ENDPOINTS.COMPETENCIES.TEAMS);
  }

  static getCompetitionsUrl(): string {
    return this.buildUrl(API_ENDPOINTS.COMPETENCIES.COMPETITIONS);
  }

  static getSeasonsUrl(): string {
    return this.buildUrl(API_ENDPOINTS.COMPETENCIES.SEASONS);
  }

  static getPhasesUrl(): string {
    return this.buildUrl(API_ENDPOINTS.COMPETENCIES.PHASES);
  }

  static getOffersUrl(): string {
    return this.buildUrl(API_ENDPOINTS.COMPETENCIES.OFFERS);
  }

  static getGamesUrl(): string {
    return this.buildUrl(API_ENDPOINTS.COMPETENCIES.GAMES);
  }

  static getMarkersUrl(): string {
    return this.buildUrl(API_ENDPOINTS.COMPETENCIES.MARKERS);
  }

  static getPositionTablesUrl(): string {
    return this.buildUrl(API_ENDPOINTS.COMPETENCIES.POSITION_TABLES);
  }

  static getTableRatingsUrl(): string {
    return this.buildUrl(API_ENDPOINTS.COMPETENCIES.TABLE_RATINGS);
  }
}
