// Test rápido de la función de conversión de URLs
const convertToKongUrl = (microserviceUrl: string): string => {
  if (microserviceUrl.includes('ms-catalog:8009/api/v1/catalog/items')) {
    return microserviceUrl.replace('http://ms-catalog:8009/api/v1/catalog/items', 'http://localhost:8000/catalog/items');
  }
  if (microserviceUrl.includes('ms-catalog:8009/api/v1/catalog/categories')) {
    return microserviceUrl.replace('http://ms-catalog:8009/api/v1/catalog/categories', 'http://localhost:8000/catalog/categories');
  }
  return microserviceUrl;
};

// Test
const testUrl = 'http://ms-catalog:8009/api/v1/catalog/items/?page=2&page_size=100';
const convertedUrl = convertToKongUrl(testUrl);
console.log('Original:', testUrl);
console.log('Convertida:', convertedUrl);

// Debería convertir a: http://localhost:8000/catalog/items/?page=2&page_size=100
