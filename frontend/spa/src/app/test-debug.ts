import { ApiUrlBuilder } from './core/config/api-endpoints';

console.log('=== URL TEST ===');
console.log('Categories URL:', ApiUrlBuilder.getCategoriesUrl());
console.log('Items URL:', ApiUrlBuilder.getItemsUrl());

// Test manual
const itemsUrl = ApiUrlBuilder.getItemsUrl();
console.log('Items URL result:', itemsUrl);

// Test de components manual
import { API_ENDPOINTS } from './core/config/api-endpoints';
console.log('Base URL:', API_ENDPOINTS.BASE_URL);
console.log('Items endpoint:', API_ENDPOINTS.CATALOG.ITEMS);
