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
                countries: '/countries',
                formats: '/formats',
                media: '/media',
            },
        },
        realTime: { 
            base: '/real-time', //Debe coincidir con el path del microservicio en Kong.yml
            endpoints: {
                users : '/users',
                teams: '/teams',
                players: '/players',
                coaches: '/coaches',
                seasons: '/seasons',
                competitions: '/competitions',
                matches: '/matches',
                events: '/events',
                matchesByDay: '/matches/by-day',
                matchesFilter: '/matches/filter',
                playersMatchStats: '/matches',  // Se completará la URL: /matches/{match_id}/player-stats
                playerSeasonStats: '/player-statistics',
                teamMatchStats: '/matches',    // Se completará la URL: /matches/{match_id}/team-stats
                matchStats: '/matches', // Se completará la URL: /matches/{match_id}/stats
                teamSeasonStats: '/team-statistics',
                matchEvents: '/matches',       // Se completará la URL: /matches/{match_id}/events
                teamClassification: '/team-statistics/classification'
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
environment.services.competencies.endpoints.countries = `${environment.services.competencies.base}/countries/`;
environment.services.competencies.endpoints.formats = `${environment.services.competencies.base}/formats/`;
environment.services.competencies.endpoints.media = `${environment.services.competencies.base}/media/`;

// ms3-real-time
environment.services.realTime.base = `${environment.apiUrl}${environment.services.realTime.base}`;
environment.services.realTime.endpoints.users = `${environment.services.realTime.base}${environment.services.realTime.endpoints.users}`;
environment.services.realTime.endpoints.teams = `${environment.services.realTime.base}${environment.services.realTime.endpoints.teams}`;
environment.services.realTime.endpoints.players = `${environment.services.realTime.base}${environment.services.realTime.endpoints.players}`;
environment.services.realTime.endpoints.coaches = `${environment.services.realTime.base}${environment.services.realTime.endpoints.coaches}`;
environment.services.realTime.endpoints.seasons = `${environment.services.realTime.base}${environment.services.realTime.endpoints.seasons}`;
environment.services.realTime.endpoints.competitions = `${environment.services.realTime.base}${environment.services.realTime.endpoints.competitions}`;
environment.services.realTime.endpoints.matches = `${environment.services.realTime.base}${environment.services.realTime.endpoints.matches}`;
environment.services.realTime.endpoints.events = `${environment.services.realTime.base}${environment.services.realTime.endpoints.events}`;
// irán al matches.services
environment.services.realTime.endpoints.matchesByDay = `${environment.services.realTime.base}${environment.services.realTime.endpoints.matchesByDay}`;
environment.services.realTime.endpoints.matchesFilter = `${environment.services.realTime.base}${environment.services.realTime.endpoints.matchesFilter}`;
// irán al player.services
environment.services.realTime.endpoints.playersMatchStats = `${environment.services.realTime.base}${environment.services.realTime.endpoints.playersMatchStats}`;
environment.services.realTime.endpoints.playerSeasonStats = `${environment.services.realTime.base}${environment.services.realTime.endpoints.playerSeasonStats}`;
// irán al team.services
environment.services.realTime.endpoints.teamMatchStats = `${environment.services.realTime.base}${environment.services.realTime.endpoints.teamMatchStats}`;
environment.services.realTime.endpoints.teamSeasonStats = `${environment.services.realTime.base}${environment.services.realTime.endpoints.teamSeasonStats}`;
// ESTADÍSTICAS AGRUPADAS DE EQUIPOS LOCAL Y VISITANTE EN EL PARTIDO
environment.services.realTime.endpoints.matchStats = `${environment.services.realTime.base}${environment.services.realTime.endpoints.matchStats}`;
// irá al matches.services
environment.services.realTime.endpoints.matchEvents = `${environment.services.realTime.base}${environment.services.realTime.endpoints.matchEvents}`;
// irá al team.services
environment.services.realTime.endpoints.teamClassification = `${environment.services.realTime.base}${environment.services.realTime.endpoints.teamClassification}`;