import { ApiUrlBuilder } from './core/config/api-endpoints';

// Test de las URLs generadas
console.log('Categories URL:', ApiUrlBuilder.getCategoriesUrl());
console.log('Items URL:', ApiUrlBuilder.getItemsUrl());
