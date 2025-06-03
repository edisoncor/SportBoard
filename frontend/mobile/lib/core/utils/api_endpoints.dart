/// Utility class for API endpoint URLs used in the application.
class ApiEndpoints {
  /// Protocol used for API requests (e.g., 'http').
  static const String protocol = 'http';
  /// Address of the API server (e.g., 'localhost').
  static const String address = 'localhost';
  /// Port number for the API server (e.g., '8000').
  static const String port = '8000';
  /// Base path for the API endpoints (e.g., 'catalog').
  static const String basePath = 'catalog';

  /// Returns the base URL for API requests.
  static String get baseUrl => '$protocol://$address:$port/$basePath';
  /// Returns the endpoint URL for groups.
  static String get groups => '$baseUrl/groups';
  // Agregar otros endpoints aquí según sea necesario
}
