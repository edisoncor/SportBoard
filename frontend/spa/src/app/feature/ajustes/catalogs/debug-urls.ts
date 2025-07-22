import { ApiUrlBuilder, API_ENDPOINTS } from '../../../core/config/api-endpoints';

/**
 * Archivo de test para verificar las URLs generadas
 */

console.log('=== DEBUG URLs ===');
console.log('BASE_URL:', API_ENDPOINTS.BASE_URL);
console.log('CATEGORIES endpoint:', API_ENDPOINTS.CATALOG.CATEGORIES);
console.log('Generated Categories URL:', ApiUrlBuilder.getCategoriesUrl());
console.log('Generated Items URL:', ApiUrlBuilder.getItemsUrl());
console.log('Category by ID URL:', `${ApiUrlBuilder.getCategoriesUrl()}/123`);
console.log('==================')
