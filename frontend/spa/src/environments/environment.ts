// src/environments/environment.ts
export const environment = {
    production: false,
    protocol: 'http',
    baseUrl: 'localhost',
    port: 8000,
    suffix: '', // '/api',
    apiUrl: '',
    services: {
        catalog: {
            base: '/catalog',
            endpoints: {
                groups: '/groups',
                catalogs: '/catalogs',
            },
        },
        competencies: {
            base: '/api',
            endpoints: {
                root: '',
                staticFiles: '/static',
                users: '/users',
                playerAssignments: '/player-assignments',
                coachAssignments: '/coach-assignments',
                matches: '/matches',
                plannings: '/plannings',
                squads: '/squads',
                registrations: '/registrations',
                competences: '/competences',
                ruleCompetences: '/rule-competences',
                ruleDisciplines: '/rule-disciplines',
                disciplines: '/disciplines',
                competenceEditions: '/competence-editions',
                stages: '/stages',
                teams: '/teams',
                localities: '/localities',
                formats: '/formats',
            },
        },
        statistics: {
            base: "/api/estadisticas",
            endpoints: {
              teams: "/teams",
              matches: "/matches",
              competition: "/competition",
              upcomingMatches: "/upcomingMatches",
              leaderboards: "/leaderboards",
              players: "/players",
              generateTeamsPDF: "/generate-teams-pdf",
              generateMatchesPDF: "/generate-matches-pdf",
              generatePlayersPDF: "/generate-players-pdf",
              generateLeaderboardPDF: "/generate-leaderboard-pdf",
              getRecentPDFs: "/get-recent-pdfs",
            },
          },
    },
};

environment.apiUrl = `${environment.protocol}://${environment.baseUrl}:${environment.port}${environment.suffix}`;

// ms6-catalog
environment.services.catalog.base = `${environment.apiUrl}${environment.services.catalog.base}`;
environment.services.catalog.endpoints.groups = `${environment.services.catalog.base}${environment.services.catalog.endpoints.groups}`;
environment.services.catalog.endpoints.catalogs = `${environment.services.catalog.base}${environment.services.catalog.endpoints.catalogs}`;

// ms2-competencies
environment.services.competencies.base = `${environment.apiUrl}${environment.services.competencies.base}`;
environment.services.competencies.endpoints.root = `${environment.services.competencies.base}${environment.services.competencies.endpoints.root}`;
environment.services.competencies.endpoints.staticFiles = `${environment.services.competencies.base}${environment.services.competencies.endpoints.staticFiles}`;
environment.services.competencies.endpoints.users = `${environment.services.competencies.base}/users/`;
environment.services.competencies.endpoints.playerAssignments = `${environment.services.competencies.base}/player-assignments/`;
environment.services.competencies.endpoints.coachAssignments = `${environment.services.competencies.base}/coach-assignments/`;
environment.services.competencies.endpoints.matches = `${environment.services.competencies.base}/matches/`;
environment.services.competencies.endpoints.plannings = `${environment.services.competencies.base}/plannings/`;
environment.services.competencies.endpoints.squads = `${environment.services.competencies.base}/squads/`;
environment.services.competencies.endpoints.registrations = `${environment.services.competencies.base}/registrations/`;
environment.services.competencies.endpoints.competences = `${environment.services.competencies.base}/competences/`;
environment.services.competencies.endpoints.ruleCompetences = `${environment.services.competencies.base}/rule-competences/`;
environment.services.competencies.endpoints.ruleDisciplines = `${environment.services.competencies.base}/rule-disciplines/`;
environment.services.competencies.endpoints.disciplines = `${environment.services.competencies.base}/disciplines/`;
environment.services.competencies.endpoints.competenceEditions = `${environment.services.competencies.base}/competence-editions/`;
environment.services.competencies.endpoints.stages = `${environment.services.competencies.base}/stages/`;
environment.services.competencies.endpoints.teams = `${environment.services.competencies.base}/teams/`;
environment.services.competencies.endpoints.localities = `${environment.services.competencies.base}/localities/`;
environment.services.competencies.endpoints.formats = `${environment.services.competencies.base}/formats/`;

// ms4-statistics
environment.services.statistics.base = `${environment.apiUrl}${environment.services.statistics.base}`
environment.services.statistics.endpoints.teams = `${environment.services.statistics.base}${environment.services.statistics.endpoints.teams}`
environment.services.statistics.endpoints.matches = `${environment.services.statistics.base}${environment.services.statistics.endpoints.matches}`
environment.services.statistics.endpoints.competition = `${environment.services.statistics.base}${environment.services.statistics.endpoints.competition}`
environment.services.statistics.endpoints.upcomingMatches = `${environment.services.statistics.base}${environment.services.statistics.endpoints.upcomingMatches}`
environment.services.statistics.endpoints.leaderboards = `${environment.services.statistics.base}${environment.services.statistics.endpoints.leaderboards}`
environment.services.statistics.endpoints.players = `${environment.services.statistics.base}${environment.services.statistics.endpoints.players}`
environment.services.statistics.endpoints.generateTeamsPDF = `${environment.services.statistics.base}${environment.services.statistics.endpoints.generateTeamsPDF}`
environment.services.statistics.endpoints.generateMatchesPDF = `${environment.services.statistics.base}${environment.services.statistics.endpoints.generateMatchesPDF}`
environment.services.statistics.endpoints.generatePlayersPDF = `${environment.services.statistics.base}${environment.services.statistics.endpoints.generatePlayersPDF}`
environment.services.statistics.endpoints.generateLeaderboardPDF = `${environment.services.statistics.base}${environment.services.statistics.endpoints.generateLeaderboardPDF}`
environment.services.statistics.endpoints.getRecentPDFs = `${environment.services.statistics.base}${environment.services.statistics.endpoints.getRecentPDFs}`