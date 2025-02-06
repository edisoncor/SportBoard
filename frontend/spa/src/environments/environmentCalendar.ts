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
