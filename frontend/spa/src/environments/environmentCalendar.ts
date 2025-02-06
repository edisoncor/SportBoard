export const environmentCalendar = {
    production: false,
    protocol: 'http',
    baseUrl: 'localhost',  // Aquí especificas el nombre de tu base URL
    port: 9000,  // Cambié el puerto a 9000 como mencionaste
    suffix: '', // '/api',
    apiUrl: '',
    services: {
        // Partidos
        calendar: {
            base: '/api/calendar',  // Aquí está la base del servicio de calendario
            endpoints: {
                hello: '/hola',  // Endpoint /hola
                abel: '/abel',   // Endpoint /abel
            },
        },

    },
};

// Construcción de las URLs completas para los servicios

// Establecemos la URL base para todos los servicios
environmentCalendar.apiUrl = `${environmentCalendar.protocol}://${environmentCalendar.baseUrl}:${environmentCalendar.port}${environmentCalendar.suffix}`;

// ms7-calendar (Calendario)
environmentCalendar.services.calendar.base = `${environmentCalendar.apiUrl}${environmentCalendar.services.calendar.base}`;
environmentCalendar.services.calendar.endpoints.hello = `${environmentCalendar.services.calendar.base}${environmentCalendar.services.calendar.endpoints.hello}`;
environmentCalendar.services.calendar.endpoints.abel = `${environmentCalendar.services.calendar.base}${environmentCalendar.services.calendar.endpoints.abel}`;

export const environmentCalendar1 = {
    production1: false,
    protocol1: 'http',
    baseUrl1: 'localhost',  // Aquí especificas el nombre de tu base URL
    port1: 9000,  // Cambié el puerto a 9000 como mencionaste
    suffix1: '', // '/api',
    apiUrl1: '',
    services: {
        // Partidos
        teams: {
            base: '/api/teams',
            endpoints: {
                getAll: '/',
                getById: '/{id}',
                create: '/',
                update: '/{id}',
                delete: '/{id}',
                equip: '/equipos'
            }
        },
    },
};
environmentCalendar1.apiUrl1 = `${environmentCalendar1.protocol1}://${environmentCalendar1.baseUrl1}:${environmentCalendar1.port1}${environmentCalendar1.suffix1}`;
environmentCalendar1.services.teams.base = `${environmentCalendar1.apiUrl1}${environmentCalendar1.services.teams.base}`;
environmentCalendar1.services.teams.endpoints.getAll = `${environmentCalendar1.services.teams.base}${environmentCalendar1.services.teams.endpoints.getAll}`;
environmentCalendar1.services.teams.endpoints.getById = `${environmentCalendar1.services.teams.base}${environmentCalendar1.services.teams.endpoints.getById}`;
environmentCalendar1.services.teams.endpoints.create = `${environmentCalendar1.services.teams.base}${environmentCalendar1.services.teams.endpoints.create}`;
environmentCalendar1.services.teams.endpoints.update = `${environmentCalendar1.services.teams.base}${environmentCalendar1.services.teams.endpoints.update}`;
environmentCalendar1.services.teams.endpoints.delete = `${environmentCalendar1.services.teams.base}${environmentCalendar1.services.teams.endpoints.delete}`;
environmentCalendar1.services.teams.endpoints.equip = `${environmentCalendar1.services.teams.base}${environmentCalendar1.services.teams.endpoints.equip}`;
