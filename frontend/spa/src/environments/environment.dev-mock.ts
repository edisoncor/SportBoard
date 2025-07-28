// Configuración alternativa para desarrollo - usar Kong cuando esté disponible
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3001/api',  // Mock backend para desarrollo
  kongUrl: 'http://localhost:8000',    // Kong cuando esté funcionando
  authService: 'http://localhost:8011', // Directo al microservicio (si está disponible)
};
