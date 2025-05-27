class ApiEndpoints {
  static const String protocol = 'http';
  static const String address = 'localhost';
  static const String port = '8000';
  static const String basePath = 'catalog';

  static String get baseUrl => '$protocol://$address:$port/$basePath';
  static String get groups => '$baseUrl/groups';
  // Agregar otros endpoints aquí según sea necesario
}
